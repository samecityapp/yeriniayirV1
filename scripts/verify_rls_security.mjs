import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';

const PG17_CANDIDATE_BINS = [
  path.join(process.cwd(), 'work/supabase-recovery/Postgres.app/Contents/Versions/17/bin'),
  '/Users/erdems/Documents/Codex/yeriniayir-cloud-admin/work/supabase-recovery/Postgres.app/Contents/Versions/17/bin',
];

function findPg17Bin() {
  for (const dir of PG17_CANDIDATE_BINS) {
    if (fs.existsSync(path.join(dir, 'initdb')) && fs.existsSync(path.join(dir, 'pg_ctl')) && fs.existsSync(path.join(dir, 'psql'))) {
      return dir;
    }
  }
  return null;
}

function escapeSqlLiteral(val) {
  if (val === null || val === undefined) return 'NULL';
  return `'${String(val).replace(/'/g, "''")}'`;
}

function bindParams(sql, params = []) {
  if (!params || params.length === 0) return sql;
  return sql.replace(/\$(\d+)\b/g, (_, idx) => {
    const pos = Number(idx) - 1;
    if (pos < 0 || pos >= params.length) throw new Error(`Missing SQL param $${idx}`);
    return escapeSqlLiteral(params[pos]);
  });
}

async function createIsolatedDb() {
  const pgliteCandidates = [
    '/tmp/pglite-runner/node_modules/@electric-sql/pglite/dist/index.js',
    path.join(process.cwd(), 'node_modules/@electric-sql/pglite/dist/index.js'),
  ];
  for (const candidate of pgliteCandidates) {
    if (fs.existsSync(candidate)) {
      const { PGlite } = await import(candidate);
      const db = new PGlite();
      return { engineName: 'PGlite (PostgreSQL 16 WASM)', db };
    }
  }

  const pgBin = findPg17Bin();
  if (!pgBin) {
    throw new Error('Neither @electric-sql/pglite nor local Postgres 17 binaries found.');
  }

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ya-pg17-rls-'));
  const sockDir = path.join(tmpDir, 'sock');
  const dataDir = path.join(tmpDir, 'db');
  const logFile = path.join(tmpDir, 'server.log');
  fs.mkdirSync(sockDir, { mode: 0o700 });

  const env = {
    PATH: `${pgBin}:/usr/bin:/bin`,
    LC_ALL: 'C',
    LANG: 'C',
    PGHOST: sockDir,
    PGPORT: '55437',
    PGUSER: 'postgres',
    PGDATABASE: 'postgres',
  };

  execFileSync(path.join(pgBin, 'initdb'), ['-D', dataDir, '-A', 'trust', '-U', 'postgres', '--no-locale'], { env, stdio: 'pipe' });
  execFileSync(
    path.join(pgBin, 'pg_ctl'),
    ['-D', dataDir, '-l', logFile, '-o', `-k ${sockDir} -p 55437 -c listen_addresses='' -c fsync=off`, '-w', 'start'],
    { env, stdio: 'pipe' }
  );

  let sessionPrefix = '';

  function runPsql(sqlText, { jsonRows = false } = {}) {
    const trimmed = sqlText.trim().replace(/;\s*$/, '');
    let script = `${sessionPrefix ? `${sessionPrefix}\n` : ''}${trimmed};`;
    if (jsonRows) {
      script = `${sessionPrefix ? `${sessionPrefix}\n` : ''}WITH _q AS (${trimmed}) SELECT COALESCE(json_agg(_q), '[]'::json)::text FROM _q;`;
    }
    const res = spawnSync(
      path.join(pgBin, 'psql'),
      ['-X', '-w', '-A', '-t', '-q', '-v', 'ON_ERROR_STOP=1', '-f', '-'],
      { env, input: script, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 }
    );
    if (res.status !== 0) {
      throw new Error((res.stderr || res.stdout || 'psql failed').trim());
    }
    if (!jsonRows) {
      return { rows: [] };
    }
    const lines = res.stdout.trim().split('\n').filter(Boolean);
    const jsonLine = lines[lines.length - 1] || '[]';
    return { rows: JSON.parse(jsonLine) };
  }

  const db = {
    async exec(sql) {
      const normalized = sql.trim();
      if (/\bRESET ROLE\s*;?/i.test(normalized)) {
        sessionPrefix = '';
        return;
      }
      if (/^\s*SET ROLE\s+/i.test(normalized)) {
        sessionPrefix = `${sessionPrefix}\n${normalized}`;
        return;
      }
      runPsql(sql, { jsonRows: false });
    },
    async query(sql, params = []) {
      const bound = bindParams(sql, params);
      const isRowProducing =
        /^\s*(?:SELECT|WITH)\b/i.test(bound) || /\bRETURNING\b/i.test(bound);
      return runPsql(bound, { jsonRows: isRowProducing });
    },
    async close() {
      try {
        execFileSync(path.join(pgBin, 'pg_ctl'), ['-D', dataDir, '-m', 'immediate', 'stop'], { env, stdio: 'pipe' });
      } finally {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      }
    },
  };

  return { engineName: 'PostgreSQL 17.11 (Isolated Local UNIX Socket)', db };
}

async function runRlsVerification() {
  const { engineName, db } = await createIsolatedDb();

  console.log('================================================================');
  console.log(`YERİNİ AYIR — ${engineName} RLS GÜVENLİK DOĞRULAMASI`);
  console.log('Canlı Supabase veritabanına dokunulmadan izole yerel PostgreSQL');
  console.log('motorunda gerçek SQL migration testi yürütülüyor...');
  console.log('================================================================\n');

  try {
    await db.exec(`
      CREATE SCHEMA IF NOT EXISTS auth;
      DO $$ BEGIN CREATE ROLE anon NOLOGIN; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
      DO $$ BEGIN CREATE ROLE authenticated NOLOGIN; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
      DO $$ BEGIN CREATE ROLE service_role NOLOGIN BYPASSRLS; EXCEPTION WHEN duplicate_object THEN NULL; END $$;

      CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $fn$
        SELECT NULLIF(current_setting('request.jwt.claim.sub', true), '')::uuid;
      $fn$;

      CREATE OR REPLACE FUNCTION auth.jwt() RETURNS jsonb LANGUAGE sql STABLE AS $fn$
        SELECT COALESCE(NULLIF(current_setting('request.jwt.claims', true), '')::jsonb, '{}'::jsonb);
      $fn$;

      CREATE TABLE IF NOT EXISTS public.profiles (
        id uuid PRIMARY KEY,
        email text,
        role text DEFAULT 'user'
      );

      CREATE TABLE IF NOT EXISTS public.group_hotels (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        group_id uuid,
        hotel_id uuid
      );

      CREATE TABLE IF NOT EXISTS public.offers (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        slug text NOT NULL,
        hotel_name text NOT NULL,
        price text NOT NULL
      );
    `);

    const vulnerableRestaurantSql = fs.readFileSync(
      path.join(process.cwd(), 'supabase/migrations/20260207210000_create_restaurant_tables.sql'),
      'utf8'
    );
    const vulnerableGroupHotelsSql = fs.readFileSync(
      path.join(process.cwd(), 'supabase/migrations/20260207180500_fix_group_hotels_rls.sql'),
      'utf8'
    );
    const vulnerableOffersSql = fs.readFileSync(
      path.join(process.cwd(), 'supabase/migrations/20260208_fix_offers_rls.sql'),
      'utf8'
    );

    await db.exec(vulnerableRestaurantSql);
    await db.exec(vulnerableGroupHotelsSql);
    await db.exec(vulnerableOffersSql);

    await db.exec(`
      GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
      GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
      GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;
      GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA auth TO anon, authenticated, service_role;
    `);

    const seedCat = await db.query(`
      INSERT INTO public.restaurant_categories (title, display_order)
      VALUES ('{"tr": "En İyi Kahve"}'::jsonb, 1)
      RETURNING id;
    `);
    const categoryId = seedCat.rows[0].id;

    const seedRest = await db.query(
      `INSERT INTO public.restaurants (category_id, location, name, google_rating)
       VALUES ($1, 'Moda, Kadıköy', '{"tr": "Montag Coffee Roasters"}'::jsonb, 4.6)
       RETURNING id;`,
      [categoryId]
    );
    const legitimateRestaurantId = seedRest.rows[0].id;

    console.log('[AŞAMA 1] Yama Öncesi (20260207210000_create_restaurant_tables.sql) Testi:');
    await db.exec(`SET ROLE anon;`);
    let prePatchAnonInsertSucceeded = false;
    try {
      await db.query(
        `INSERT INTO public.restaurants (category_id, location, name) VALUES ($1, 'Moda', '{"tr": "Yetkisiz Anon Kayıt"}'::jsonb);`,
        [categoryId]
      );
      prePatchAnonInsertSucceeded = true;
    } catch {
      prePatchAnonInsertSucceeded = false;
    }
    await db.exec(`RESET ROLE;`);
    await db.query(`DELETE FROM public.restaurants WHERE name->>'tr' = 'Yetkisiz Anon Kayıt';`);
    console.log(
      `  -> Yama öncesi ANON INSERT durumu: ${
        prePatchAnonInsertSucceeded ? 'AÇIK VAR (Anonim yazma başarılı oldu!)' : 'Engellendi'
      }\n`
    );

    const lockdownSql = fs.readFileSync(
      path.join(process.cwd(), 'supabase/migrations/20261029193000_lockdown_rls_policies.sql'),
      'utf8'
    );
    await db.exec(lockdownSql);
    console.log('[AŞAMA 2] 20261029193000_lockdown_rls_policies.sql Uygulandı.\n');

    const results = [];

    await db.exec(`SET ROLE anon;`);
    const anonSelect = await db.query(`SELECT id, name FROM public.restaurants;`);
    results.push({
      test: 'ANON SELECT public.restaurants (Okuma)',
      expected: 'ALLOW (1 satır)',
      actual: `ALLOW (${anonSelect.rows.length} satır)`,
      passed: anonSelect.rows.length === 1,
    });

    let anonInsertError = null;
    try {
      await db.query(
        `INSERT INTO public.restaurants (category_id, location, name) VALUES ($1, 'Moda', '{"tr": "Saldırgan Kaydı"}'::jsonb);`,
        [categoryId]
      );
    } catch (err) {
      anonInsertError = err.message;
    }
    results.push({
      test: 'ANON INSERT public.restaurants (Yetkisiz Ekleme)',
      expected: 'BLOCK (RLS Hatası)',
      actual: anonInsertError ? `BLOCKED: ${anonInsertError}` : 'ALLOWED (HATA!)',
      passed: Boolean(anonInsertError && anonInsertError.includes('row-level security')),
    });

    const anonUpdate = await db.query(
      `UPDATE public.restaurants SET location = 'HACKED' WHERE id = $1 RETURNING id;`,
      [legitimateRestaurantId]
    );
    results.push({
      test: 'ANON UPDATE public.restaurants (Yetkisiz Güncelleme)',
      expected: 'BLOCK (0 satır etkilendi)',
      actual: `BLOCKED (${anonUpdate.rows.length} satır etkilendi)`,
      passed: anonUpdate.rows.length === 0,
    });

    const anonDelete = await db.query(
      `DELETE FROM public.restaurants WHERE id = $1 RETURNING id;`,
      [legitimateRestaurantId]
    );
    results.push({
      test: 'ANON DELETE public.restaurants (Yetkisiz Silme)',
      expected: 'BLOCK (0 satır silindi)',
      actual: `BLOCKED (${anonDelete.rows.length} satır silindi)`,
      passed: anonDelete.rows.length === 0,
    });

    let anonCatError = null;
    try {
      await db.query(`INSERT INTO public.restaurant_categories (title) VALUES ('{"tr": "Sahte"}'::jsonb);`);
    } catch (err) {
      anonCatError = err.message;
    }
    results.push({
      test: 'ANON INSERT public.restaurant_categories',
      expected: 'BLOCK (RLS Hatası)',
      actual: anonCatError ? `BLOCKED: ${anonCatError}` : 'ALLOWED (HATA!)',
      passed: Boolean(anonCatError && anonCatError.includes('row-level security')),
    });

    let anonNoteError = null;
    try {
      await db.query(
        `INSERT INTO public.restaurant_notes (restaurant_id, emoji, text) VALUES ($1, '💥', '{"tr": "Spam"}'::jsonb);`,
        [legitimateRestaurantId]
      );
    } catch (err) {
      anonNoteError = err.message;
    }
    results.push({
      test: 'ANON INSERT public.restaurant_notes',
      expected: 'BLOCK (RLS Hatası)',
      actual: anonNoteError ? `BLOCKED: ${anonNoteError}` : 'ALLOWED (HATA!)',
      passed: Boolean(anonNoteError && anonNoteError.includes('row-level security')),
    });

    let anonGroupError = null;
    try {
      await db.query(`INSERT INTO public.group_hotels (group_id, hotel_id) VALUES (gen_random_uuid(), gen_random_uuid());`);
    } catch (err) {
      anonGroupError = err.message;
    }
    results.push({
      test: 'ANON INSERT public.group_hotels',
      expected: 'BLOCK (RLS Hatası)',
      actual: anonGroupError ? `BLOCKED: ${anonGroupError}` : 'ALLOWED (HATA!)',
      passed: Boolean(anonGroupError && anonGroupError.includes('row-level security')),
    });

    let anonOfferError = null;
    try {
      await db.query(`INSERT INTO public.offers (slug, hotel_name, price) VALUES ('sahte', 'Sahte Otel', '1 TL');`);
    } catch (err) {
      anonOfferError = err.message;
    }
    results.push({
      test: 'ANON INSERT public.offers',
      expected: 'BLOCK (RLS Hatası)',
      actual: anonOfferError ? `BLOCKED: ${anonOfferError}` : 'ALLOWED (HATA!)',
      passed: Boolean(anonOfferError && anonOfferError.includes('row-level security')),
    });

    await db.exec(`RESET ROLE;`);

    const nonAdminUuid = '11111111-1111-1111-1111-111111111111';
    const adminUuid = '99999999-9999-9999-9999-999999999999';
    await db.query(
      `INSERT INTO public.profiles (id, email, role) VALUES ($1, 'user@test.com', 'user'), ($2, 'admin@yeriniayir.com', 'admin');`,
      [nonAdminUuid, adminUuid]
    );

    await db.exec(`
      SET ROLE authenticated;
      SELECT set_config('request.jwt.claim.sub', '${nonAdminUuid}', false);
      SELECT set_config('request.jwt.claims', '{"role":"authenticated","sub":"${nonAdminUuid}"}', false);
    `);
    let nonAdminError = null;
    try {
      await db.query(
        `INSERT INTO public.restaurants (category_id, location, name) VALUES ($1, 'Moda', '{"tr": "Normal Üye Kaydı"}'::jsonb);`,
        [categoryId]
      );
    } catch (err) {
      nonAdminError = err.message;
    }
    results.push({
      test: 'AUTHENTICATED (role=user) INSERT public.restaurants',
      expected: 'BLOCK (RLS Hatası)',
      actual: nonAdminError ? `BLOCKED: ${nonAdminError}` : 'ALLOWED (HATA!)',
      passed: Boolean(nonAdminError && nonAdminError.includes('row-level security')),
    });

    await db.exec(`RESET ROLE;`);
    await db.exec(`
      SET ROLE authenticated;
      SELECT set_config('request.jwt.claim.sub', '${adminUuid}', false);
      SELECT set_config('request.jwt.claims', '{"role":"authenticated","sub":"${adminUuid}"}', false);
    `);
    const adminInsert = await db.query(
      `INSERT INTO public.restaurants (category_id, location, name) VALUES ($1, 'Moda, Kadıköy', '{"tr": "Story Coffee Roasters"}'::jsonb) RETURNING id;`,
      [categoryId]
    );
    results.push({
      test: 'AUTHENTICATED (profiles.role=admin) INSERT public.restaurants',
      expected: 'ALLOW (1 satır eklendi)',
      actual: `ALLOW (${adminInsert.rows.length} satır eklendi)`,
      passed: adminInsert.rows.length === 1,
    });

    await db.exec(`RESET ROLE;`);

    await db.exec(`GRANT UPDATE ON public.profiles TO authenticated; ALTER TABLE public.profiles ADD COLUMN is_admin boolean DEFAULT false;`);
    for (const column of ['role', 'is_admin']) {
      await db.exec(`SET ROLE authenticated; SELECT set_config('request.jwt.claim.sub', '${nonAdminUuid}', false);`);
      let blocked = false;
      try {
        await db.query(`UPDATE public.profiles SET ${column} = ${column === 'role' ? "'admin'" : 'true'};`);
      } catch {
        blocked = true;
      }
      await db.exec(`RESET ROLE;`);
      results.push({ test: 'Authenticated cannot self-assign ' + column, expected: 'BLOCK', actual: blocked ? 'BLOCK' : 'ALLOW', passed: blocked });
    }
    await db.exec(`ALTER TABLE public.profiles DROP COLUMN role;`);
    await db.query(`SELECT public.is_admin_user();`);
    results.push({ test: 'Migration supports historical is_admin-only profiles schema', expected: 'No missing-column error', actual: 'PASS', passed: true });

    // =========================================================================
    // [AŞAMA 4] Cloud Admin MFA (aal1 vs aal2, üyelik iptali, offers REST) SQL Testi
    // =========================================================================
    const cloudAdminSql = fs.readFileSync(
      path.join(process.cwd(), 'supabase/proposed/20261101_gastronomy_cloud_admin.sql'),
      'utf8'
    );
    const cloudAdminUuid = '22222222-2222-4222-8222-222222222222';
    const revokedAdminUuid = '33333333-3333-4333-8333-333333333333';
    const outsiderUuid = '44444444-4444-4444-8444-444444444444';

    await db.exec(`
      CREATE TABLE IF NOT EXISTS auth.users (id uuid PRIMARY KEY);
      INSERT INTO auth.users (id) VALUES ('${cloudAdminUuid}'), ('${revokedAdminUuid}'), ('${outsiderUuid}') ON CONFLICT DO NOTHING;
    `);
    await db.exec(cloudAdminSql);

    await db.exec(`
      INSERT INTO ya_private.admin_members (user_id, active) VALUES
        ('${cloudAdminUuid}', true),
        ('${revokedAdminUuid}', false);
      INSERT INTO ya_private.workspaces (scope, canonical, archive, archive_sha256, valid_until)
      VALUES (
        'moda/kahve',
        '{"venues":[{"id":"montag"},{"id":"story"}]}'::jsonb,
        '{}'::jsonb,
        'sha256-test',
        now() + interval '7 days'
      );
      INSERT INTO public.ya_publications (scope, revision, document, valid_until)
      VALUES ('moda/kahve', 1, '{"venues":[{"id":"montag"},{"id":"story"}]}'::jsonb, now() + interval '7 days');
      INSERT INTO public.ya_publication_heads (scope, revision) VALUES ('moda/kahve', 1);
    `);

    await db.exec(`INSERT INTO public.offers (slug, hotel_name, price) VALUES ('gercek-teklif', 'Gerçek Otel', '15000');`);
    await db.exec(`
      SET ROLE authenticated;
      SELECT set_config('request.jwt.claim.sub', '${outsiderUuid}', false);
      SELECT set_config('request.jwt.claims', '{"role":"authenticated","aal":"aal2","sub":"${outsiderUuid}"}', false);
    `);
    let nonAdminOfferInsertErr = null;
    try {
      await db.query(`INSERT INTO public.offers (slug, hotel_name, price) VALUES ('yetkisiz-teklif', 'Kötü', '1');`);
    } catch (err) {
      nonAdminOfferInsertErr = err.message;
    }
    await db.exec(`RESET ROLE;`);
    results.push({
      test: 'AUTHENTICATED (üye değil, aal2) INSERT public.offers (Doğrudan REST Engeli)',
      expected: 'BLOCK (RLS Hatası)',
      actual: nonAdminOfferInsertErr ? `BLOCKED: ${nonAdminOfferInsertErr}` : 'ALLOWED (HATA!)',
      passed: Boolean(nonAdminOfferInsertErr && nonAdminOfferInsertErr.includes('row-level security')),
    });

    await db.exec(`SET ROLE anon;`);
    let anonRpcErr = null;
    try {
      await db.query(`SELECT public.ya_is_admin();`);
    } catch (err) {
      anonRpcErr = err.message;
    }
    await db.exec(`RESET ROLE;`);
    results.push({
      test: 'ANON EXECUTE public.ya_is_admin()',
      expected: 'BLOCK (permission denied)',
      actual: anonRpcErr ? `BLOCKED: ${anonRpcErr}` : 'ALLOWED (HATA!)',
      passed: Boolean(anonRpcErr && /permission denied/i.test(anonRpcErr)),
    });

    await db.exec(`
      SET ROLE authenticated;
      SELECT set_config('request.jwt.claim.sub', '${outsiderUuid}', false);
      SELECT set_config('request.jwt.claims', '{"role":"authenticated","aal":"aal2","sub":"${outsiderUuid}"}', false);
    `);
    const outsiderCheck = await db.query(`SELECT public.ya_is_admin() AS is_admin;`);
    let outsiderPublishErr = null;
    try {
      await db.query(`SELECT public.ya_publish_order('moda/kahve', 1, ARRAY['story','montag'], 'Yetkisiz deneme');`);
    } catch (err) {
      outsiderPublishErr = err.message;
    }
    await db.exec(`RESET ROLE;`);
    results.push({
      test: 'AUTHENTICATED (üye değil + aal2) ya_is_admin & ya_publish_order',
      expected: 'is_admin=false & BLOCK unauthorized',
      actual: `is_admin=${outsiderCheck.rows[0].is_admin} & ${outsiderPublishErr}`,
      passed: outsiderCheck.rows[0].is_admin === false && /unauthorized/i.test(outsiderPublishErr || ''),
    });

    await db.exec(`
      SET ROLE authenticated;
      SELECT set_config('request.jwt.claim.sub', '${cloudAdminUuid}', false);
      SELECT set_config('request.jwt.claims', '{"role":"authenticated","aal":"aal1","sub":"${cloudAdminUuid}"}', false);
    `);
    const aal1Check = await db.query(`SELECT public.ya_has_membership() AS member, public.ya_is_admin() AS is_admin;`);
    let aal1PublishErr = null;
    try {
      await db.query(`SELECT public.ya_publish_order('moda/kahve', 1, ARRAY['story','montag'], 'aal1 deneme');`);
    } catch (err) {
      aal1PublishErr = err.message;
    }
    await db.exec(`RESET ROLE;`);
    results.push({
      test: 'AUTHENTICATED (aktif admin + YALNIZ aal1 JWT) SQL ya_is_admin & ya_publish_order',
      expected: 'member=true, is_admin=false & BLOCK unauthorized',
      actual: `member=${aal1Check.rows[0].member}, is_admin=${aal1Check.rows[0].is_admin} & ${aal1PublishErr}`,
      passed: aal1Check.rows[0].member === true && aal1Check.rows[0].is_admin === false && /unauthorized/i.test(aal1PublishErr || ''),
    });

    await db.exec(`
      SET ROLE authenticated;
      SELECT set_config('request.jwt.claim.sub', '${revokedAdminUuid}', false);
      SELECT set_config('request.jwt.claims', '{"role":"authenticated","aal":"aal2","sub":"${revokedAdminUuid}"}', false);
    `);
    const revokedCheck = await db.query(`SELECT public.ya_is_admin() AS is_admin;`);
    let revokedWorkspaceErr = null;
    try {
      await db.query(`SELECT public.ya_admin_workspace('moda/kahve');`);
    } catch (err) {
      revokedWorkspaceErr = err.message;
    }
    await db.exec(`RESET ROLE;`);
    results.push({
      test: 'AUTHENTICATED (üyeliği iptal edilmiş active=false + aal2 JWT) SQL',
      expected: 'is_admin=false & BLOCK unauthorized',
      actual: `is_admin=${revokedCheck.rows[0].is_admin} & ${revokedWorkspaceErr}`,
      passed: revokedCheck.rows[0].is_admin === false && /unauthorized/i.test(revokedWorkspaceErr || ''),
    });

    await db.exec(`
      SET ROLE authenticated;
      SELECT set_config('request.jwt.claim.sub', '${cloudAdminUuid}', false);
      SELECT set_config('request.jwt.claims', '{"role":"authenticated","aal":"aal2","sub":"${cloudAdminUuid}"}', false);
    `);
    const validAdminCheck = await db.query(`SELECT public.ya_is_admin() AS is_admin;`);
    const publishRes = await db.query(`SELECT public.ya_publish_order('moda/kahve', 1, ARRAY['story','montag'], 'PostgreSQL aal2 doğrulaması') AS rev;`);
    await db.exec(`RESET ROLE;`);
    results.push({
      test: 'AUTHENTICATED (aktif admin + aal2 JWT) SQL ya_is_admin & ya_publish_order',
      expected: 'is_admin=true & rev=2',
      actual: `is_admin=${validAdminCheck.rows[0].is_admin} & rev=${publishRes.rows[0].rev}`,
      passed: validAdminCheck.rows[0].is_admin === true && String(publishRes.rows[0].rev) === '2',
    });

    await db.exec(`SET ROLE authenticated;`);
    let privateSchemaErr = null;
    try {
      await db.query(`SELECT * FROM ya_private.admin_members;`);
    } catch (err) {
      privateSchemaErr = err.message;
    }
    await db.exec(`RESET ROLE;`);
    results.push({
      test: 'AUTHENTICATED doğrudan SELECT ya_private.admin_members',
      expected: 'BLOCK (permission denied for schema)',
      actual: privateSchemaErr ? `BLOCKED: ${privateSchemaErr}` : 'ALLOWED (HATA!)',
      passed: Boolean(privateSchemaErr && /permission denied/i.test(privateSchemaErr)),
    });

    console.log('[AŞAMA 3] Test Sonuç Tablosu:');
    for (const r of results) {
      console.log(`  [${r.passed ? 'PASS ✅' : 'FAIL ❌'}] ${r.test}`);
      console.log(`           Beklenen: ${r.expected} | Gerçekleşen: ${r.actual}`);
    }

    const allPassed = results.every((r) => r.passed);
    console.log(`\nGENEL SONUÇ: ${results.filter((r) => r.passed).length}/${results.length} TEST BAŞARILI.`);
    if (!allPassed) {
      process.exitCode = 1;
    }
  } finally {
    await db.close();
  }
}

runRlsVerification();

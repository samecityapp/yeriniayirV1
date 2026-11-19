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
      script = `${sessionPrefix ? `${sessionPrefix}\n` : ''}WITH _q AS (${trimmed}) SELECT COALESCE(jsonb_agg(_q), '[]'::jsonb)::text FROM _q;`;
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
      test: '[TARİHSEL YAMA ÖNCESİ REPRO] AUTHENTICATED (profiles.role=admin, MFA/üyelik yok) INSERT public.restaurants',
      expected: 'ALLOW (eski is_admin_user zaafiyeti — Aşama 5 ile kapatılır)',
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

    // =========================================================================
    // AŞAMA 5: Görev 10B (F1) — Forward Migration (20261119180000) Doğrulaması
    // =========================================================================
    console.log('\n[AŞAMA 5] Görev 10B (F1) Cloud MFA + Üyelik Zorunlu RLS Migration Testleri:');

    // Eski açık izinli miras tabloları ve açık storage.objects politikalarını simüle et
    await db.exec(`
      CREATE SCHEMA IF NOT EXISTS storage;
      GRANT USAGE ON SCHEMA storage TO anon, authenticated, service_role;

      CREATE TABLE IF NOT EXISTS public.hotels (
        id serial PRIMARY KEY,
        name text NOT NULL
      );
      CREATE TABLE IF NOT EXISTS public.valid_hotel_ids (
        id uuid PRIMARY KEY
      );
      CREATE TABLE IF NOT EXISTS public.tags (
        id serial PRIMARY KEY,
        name text NOT NULL
      );
      CREATE TABLE IF NOT EXISTS public.analytics_events (
        id serial PRIMARY KEY,
        event_name text NOT NULL
      );
      CREATE TABLE IF NOT EXISTS public.hotel_clicks (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        hotel_id uuid NOT NULL,
        created_at timestamptz DEFAULT now() NOT NULL,
        user_ip text,
        user_agent text,
        referrer text
      );
      CREATE TABLE IF NOT EXISTS public.groups (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        title text NOT NULL,
        is_published boolean DEFAULT false,
        domains text[] DEFAULT '{}',
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now()
      );
      ALTER TABLE public.group_hotels ADD COLUMN IF NOT EXISTS order_index integer DEFAULT 0;
      ALTER TABLE public.group_hotels ADD CONSTRAINT group_hotels_hotel_fk FOREIGN KEY (hotel_id) REFERENCES public.valid_hotel_ids(id);
      ALTER TABLE public.group_hotels ADD CONSTRAINT group_hotels_group_hotel_uniq UNIQUE (group_id, hotel_id);
      CREATE TABLE IF NOT EXISTS public.audit_logs (
        id serial PRIMARY KEY,
        action text NOT NULL
      );
      CREATE TABLE IF NOT EXISTS storage.objects (
        id serial PRIMARY KEY,
        bucket_id text NOT NULL,
        name text NOT NULL
      );

      GRANT SELECT, INSERT, UPDATE, DELETE ON public.hotels, public.valid_hotel_ids, public.tags, public.analytics_events, public.hotel_clicks, public.groups, public.group_hotels, public.audit_logs TO authenticated;
      GRANT INSERT ON public.analytics_events, public.hotel_clicks TO anon;
      GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO service_role;
      GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
      GRANT SELECT, INSERT, UPDATE, DELETE ON storage.objects TO authenticated;
      GRANT SELECT ON storage.objects TO anon;
      GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA storage TO authenticated, service_role;

      ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.hotel_clicks ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
      ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

      -- Eski permissive politikalar + korunması gereken ya_permanent_* + ikinci bucket ('hotel-media') politikaları
      CREATE POLICY "Public can read all hotels" ON public.hotels FOR SELECT TO anon, authenticated USING (true);
      CREATE POLICY "Authenticated users can manage hotels" ON public.hotels FOR ALL TO authenticated USING (true) WITH CHECK (true);
      CREATE POLICY "Public can read all tags" ON public.tags FOR SELECT TO anon, authenticated USING (true);
      CREATE POLICY "Allow all for authenticated" ON public.tags FOR ALL TO authenticated USING (true) WITH CHECK (true);
      CREATE POLICY "Public analytics select" ON public.analytics_events FOR SELECT TO authenticated USING (true);
      CREATE POLICY "ya_permanent_analytics_anon_insert" ON public.analytics_events FOR INSERT TO anon, authenticated WITH CHECK (true);
      CREATE POLICY "Anyone can track hotel clicks" ON public.hotel_clicks FOR INSERT TO anon, authenticated WITH CHECK (true);
      CREATE POLICY "Authenticated users can view all clicks" ON public.hotel_clicks FOR SELECT TO authenticated USING (true);
      CREATE POLICY "Public read groups" ON public.groups FOR SELECT TO anon, authenticated USING (true);
      CREATE POLICY "Public manage groups" ON public.groups FOR ALL TO authenticated USING (true) WITH CHECK (true);
      CREATE POLICY "Public audit select" ON public.audit_logs FOR SELECT TO authenticated USING (true);
      CREATE POLICY "Public Access Restaurant Images" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'restaurant-images');
      CREATE POLICY "Authenticated upload restaurant-images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'restaurant-images');
      CREATE POLICY "Authenticated update restaurant-images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'restaurant-images') WITH CHECK (bucket_id = 'restaurant-images');
      CREATE POLICY "Authenticated delete restaurant-images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'restaurant-images');
      CREATE POLICY "Hotel media public select" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'hotel-media');
      CREATE POLICY "Hotel media auth insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'hotel-media');
      CREATE POLICY "Hotel media auth update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'hotel-media') WITH CHECK (bucket_id = 'hotel-media');
      CREATE POLICY "Hotel media auth delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'hotel-media');
    `);

    const enforceCloudMfaSql = fs.readFileSync(
      path.join(process.cwd(), 'supabase/migrations/20261119180000_enforce_cloud_mfa_admin_rls.sql'),
      'utf8'
    );
    await db.exec(enforceCloudMfaSql);

    // Yardımcı test çalıştırıcı
    async function runAsUser(roleName, subUuid, aal, queryFn) {
      await db.exec(`RESET ROLE;`);
      if (subUuid) {
        const claimsJson = JSON.stringify({ role: roleName, sub: subUuid, ...(aal ? { aal } : {}) });
        await db.exec(`
          SET ROLE ${roleName};
          SELECT set_config('request.jwt.claim.sub', '${subUuid}', false);
          SELECT set_config('request.jwt.claims', '${claimsJson.replace(/'/g, "''")}', false);
        `);
      } else {
        const claimsPayload =
          roleName === 'anon' ? '{"role":"anon"}' : JSON.stringify({ role: roleName });
        await db.exec(`
          SET ROLE ${roleName};
          SELECT set_config('request.jwt.claim.sub', '', false);
          SELECT set_config('request.jwt.claims', '${claimsPayload.replace(/'/g, "''")}', false);
        `);
      }
      try {
        return await queryFn();
      } finally {
        await db.exec(`RESET ROLE;`);
      }
    }

    async function expectRlsBlock(roleName, subUuid, aal, sql, params = []) {
      try {
        const res = await runAsUser(roleName, subUuid, aal, () => db.query(sql, params));
        return { blocked: false, reason: `ALLOWED (rows=${res.rows.length}, rowCount=${res.rowCount})` };
      } catch (err) {
        return { blocked: /row-level security|permission denied/i.test(err.message), reason: err.message };
      }
    }

    // 1. Eski profiles.role=admin (üye değil, aal2 bile olsa) ARTIK engellenmeli!
    const legacyAdminRestaurantBlock = await expectRlsBlock(
      'authenticated',
      adminUuid,
      'aal2',
      `INSERT INTO public.restaurants (category_id, location, name) VALUES ($1, 'Moda, Kadıköy', '{"tr": "Legacy Blocked"}'::jsonb) RETURNING id;`,
      [categoryId]
    );
    results.push({
      test: '[F1 SONRASI] Eski profiles.role=admin (üye değil) INSERT restaurants',
      expected: 'BLOCK (RLS)',
      actual: legacyAdminRestaurantBlock.blocked ? 'BLOCKED' : legacyAdminRestaurantBlock.reason,
      passed: legacyAdminRestaurantBlock.blocked,
    });

    const legacyAdminHotelsBlock = await expectRlsBlock(
      'authenticated',
      adminUuid,
      'aal2',
      `INSERT INTO public.hotels (name) VALUES ('Bypass Otel') RETURNING id;`
    );
    const legacyAdminTagsBlock = await expectRlsBlock(
      'authenticated',
      adminUuid,
      'aal2',
      `INSERT INTO public.tags (name) VALUES ('Bypass Tag') RETURNING id;`
    );
    await db.exec(`INSERT INTO public.analytics_events (event_name) VALUES ('page_view');`);
    const legacyAdminAnalyticsSelect = await runAsUser('authenticated', adminUuid, 'aal2', () =>
      db.query(`SELECT id FROM public.analytics_events;`)
    );
    results.push({
      test: '[F1 SONRASI] Eski admin INSERT hotels/tags & SELECT analytics_events',
      expected: 'BLOCK & 0 rows',
      actual: `hotels=${legacyAdminHotelsBlock.blocked}, tags=${legacyAdminTagsBlock.blocked}, analyticsRows=${legacyAdminAnalyticsSelect.rows.length}`,
      passed:
        legacyAdminHotelsBlock.blocked &&
        legacyAdminTagsBlock.blocked &&
        legacyAdminAnalyticsSelect.rows.length === 0,
    });

    // 2. Aktif Cloud Admin + aal1 (MFA yok) engellenmeli
    const aal1RestaurantsBlock = await expectRlsBlock(
      'authenticated',
      cloudAdminUuid,
      'aal1',
      `INSERT INTO public.restaurants (category_id, location, name) VALUES ($1, 'Moda, Kadıköy', '{"tr": "AAL1 Blocked"}'::jsonb) RETURNING id;`,
      [categoryId]
    );
    const aal1StorageBlock = await expectRlsBlock(
      'authenticated',
      cloudAdminUuid,
      'aal1',
      `INSERT INTO storage.objects (bucket_id, name) VALUES ('restaurant-images', 'a.jpg') RETURNING id;`
    );
    const aal1IsAdmin = await runAsUser('authenticated', cloudAdminUuid, 'aal1', () =>
      db.query(`SELECT public.is_admin_user() AS is_admin;`)
    );
    results.push({
      test: '[F1 SONRASI] Aktif Cloud Admin + aal1 (MFA yok) INSERT restaurants/storage & is_admin_user()',
      expected: 'BLOCK & is_admin=false',
      actual: `rest=${aal1RestaurantsBlock.blocked}, storage=${aal1StorageBlock.blocked}, is_admin=${aal1IsAdmin.rows[0].is_admin}`,
      passed:
        aal1RestaurantsBlock.blocked &&
        aal1StorageBlock.blocked &&
        aal1IsAdmin.rows[0].is_admin === false,
    });

    // 3. Pasif (revoked) Cloud Admin + aal2 engellenmeli
    const revokedHotelsBlock = await expectRlsBlock(
      'authenticated',
      revokedAdminUuid,
      'aal2',
      `INSERT INTO public.hotels (name) VALUES ('Revoked Otel') RETURNING id;`
    );
    results.push({
      test: '[F1 SONRASI] Pasif (revoked) üye + aal2 INSERT hotels',
      expected: 'BLOCK (RLS)',
      actual: revokedHotelsBlock.blocked ? 'BLOCKED' : revokedHotelsBlock.reason,
      passed: revokedHotelsBlock.blocked,
    });

    // 4. Anon: hotels yazamaz, analytics/audit SELECT alamaz ama ya_permanent_analytics_anon_insert ile analytics yazabilir (RETURNING olmadan)
    let anonAnalyticsInserted = false;
    try {
      await runAsUser('anon', null, null, () =>
        db.query(`INSERT INTO public.analytics_events (event_name) VALUES ('anon_pv');`)
      );
      anonAnalyticsInserted = true;
    } catch {
      anonAnalyticsInserted = false;
    }
    const anonAnalyticsSelectBlock = await expectRlsBlock('anon', null, null, `SELECT id FROM public.analytics_events;`);
    const anonAuditSelectBlock = await expectRlsBlock('anon', null, null, `SELECT id FROM public.audit_logs;`);
    results.push({
      test: '[F1 SONRASI] ANON: ya_permanent analytics INSERT açık & analytics/audit SELECT kapalı',
      expected: 'insert=true & analyticsSelect=BLOCK & auditSelect=BLOCK',
      actual: `insert=${anonAnalyticsInserted}, analyticsSelectBlocked=${anonAnalyticsSelectBlock.blocked}, auditBlocked=${anonAuditSelectBlock.blocked}`,
      passed: anonAnalyticsInserted && anonAnalyticsSelectBlock.blocked && anonAuditSelectBlock.blocked,
    });

    // 5. Aktif Cloud Admin + aal2 tüm tablolara ve storage.objects'e yazabilmeli & analytics okuyabilmeli
    const mfaWriteResults = await runAsUser('authenticated', cloudAdminUuid, 'aal2', async () => {
      const r = await db.query(
        `INSERT INTO public.restaurants (category_id, location, name) VALUES ($1, 'Moda, Kadıköy', '{"tr": "MFA Approved"}'::jsonb) RETURNING id;`,
        [categoryId]
      );
      const o = await db.query(
        `INSERT INTO public.offers (slug, hotel_name, price) VALUES ('mfa-teklif', 'MFA Otel', '19000') RETURNING id;`
      );
      const h = await db.query(
        `INSERT INTO public.hotels (name) VALUES ('MFA Hotel') RETURNING id;`
      );
      const t = await db.query(
        `INSERT INTO public.tags (name) VALUES ('MFA Tag') RETURNING id;`
      );
      const s = await db.query(
        `INSERT INTO storage.objects (bucket_id, name) VALUES ('restaurant-images', 'ok.jpg') RETURNING id;`
      );
      const a = await db.query(`SELECT count(*)::int AS cnt FROM public.analytics_events;`);
      const adm = await db.query(`SELECT public.is_admin_user() AS is_admin;`);
      return {
        ok:
          r.rows.length === 1 &&
          o.rows.length === 1 &&
          h.rows.length === 1 &&
          t.rows.length === 1 &&
          s.rows.length === 1 &&
          a.rows[0].cnt >= 2 &&
          adm.rows[0].is_admin === true,
        counts: { r: r.rows.length, o: o.rows.length, h: h.rows.length, t: t.rows.length, s: s.rows.length, a: a.rows[0].cnt, adm: adm.rows[0].is_admin },
      };
    });
    results.push({
      test: '[F1 SONRASI] Aktif Cloud Admin + aal2 yazma/analytics/storage tam yetki',
      expected: 'ALLOW tüm yetkili işlemler & is_admin=true',
      actual: JSON.stringify(mfaWriteResults.counts),
      passed: mfaWriteResults.ok,
    });

    // =========================================================================
    // AŞAMA 6: Görev 10C (B1, B2, B6) — Forward Migration 20261119210000 Doğrulaması
    // =========================================================================
    console.log('\n[AŞAMA 6] Görev 10C (B1 Storage İzolasyonu, B2 Analitik/Click Kilidi, B6 Atomik RPC) Testleri:');

    // 10C öncesi hotel-media politikalarının 20261119180000 tarafından silinmediğini doğrula (B1)
    const pre210000HotelMediaWrite = await runAsUser('authenticated', adminUuid, 'aal1', async () => {
      const ins = await db.query(
        `INSERT INTO storage.objects (bucket_id, name) VALUES ('hotel-media', 'pre-210000.jpg') RETURNING id;`
      );
      const upd = await db.query(
        `UPDATE storage.objects SET name = 'pre-210000-u.jpg' WHERE id = $1 RETURNING id;`,
        [ins.rows[0].id]
      );
      const del = await db.query(
        `DELETE FROM storage.objects WHERE id = $1 RETURNING id;`,
        [ins.rows[0].id]
      );
      return ins.rows.length === 1 && upd.rows.length === 1 && del.rows.length === 1;
    });
    results.push({
      test: '[B1 / 180000 SONRASI] İkinci Storage bucket (hotel-media) yazma yetkisi korundu',
      expected: 'ALLOW INSERT/UPDATE/DELETE on hotel-media',
      actual: `hotelMediaCrud=${pre210000HotelMediaWrite}`,
      passed: pre210000HotelMediaWrite,
    });

    const paket10cSql = fs.readFileSync(
      path.join(
        process.cwd(),
        'supabase/migrations/20261119210000_paket10c_storage_scope_analytics_lockdown_atomic_rpcs.sql'
      ),
      'utf8'
    );
    await db.exec(paket10cSql);

    // B1 (210000 sonrası): ikinci bucket policy isimleri ve CRUD izni korunurken restaurant-images kilitli kalmalı
    const hotelMediaPolicies = await db.query(
      `SELECT policyname FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname LIKE 'Hotel media auth%' ORDER BY policyname;`
    );
    const post210000HotelMediaWrite = await runAsUser('authenticated', adminUuid, 'aal1', async () => {
      const ins = await db.query(
        `INSERT INTO storage.objects (bucket_id, name) VALUES ('hotel-media', 'post-210000.jpg') RETURNING id;`
      );
      const upd = await db.query(
        `UPDATE storage.objects SET name = 'post-210000-u.jpg' WHERE id = $1 RETURNING id;`,
        [ins.rows[0].id]
      );
      const del = await db.query(
        `DELETE FROM storage.objects WHERE id = $1 RETURNING id;`,
        [ins.rows[0].id]
      );
      return ins.rows.length === 1 && upd.rows.length === 1 && del.rows.length === 1;
    });
    const nonAdminRestImgBlock = await expectRlsBlock(
      'authenticated',
      adminUuid,
      'aal2',
      `INSERT INTO storage.objects (bucket_id, name) VALUES ('restaurant-images', 'blocked.jpg') RETURNING id;`
    );
    const anonStorageBlock = await expectRlsBlock(
      'anon',
      null,
      null,
      `INSERT INTO storage.objects (bucket_id, name) VALUES ('restaurant-images', 'anon.jpg');`
    );
    const mfaRestImgWrite = await runAsUser('authenticated', cloudAdminUuid, 'aal2', () =>
      db.query(
        `INSERT INTO storage.objects (bucket_id, name) VALUES ('restaurant-images', 'mfa-ok.jpg') RETURNING id;`
      )
    );
    results.push({
      test: '[B1 / 210000 SONRASI] İkinci bucket (hotel-media) korunur, restaurant-images yalnız MFA Cloud Admin’e açık',
      expected: 'policies=3 & hotelMediaCrud=true & nonAdminRestBlock=true & mfaRestAllow=true',
      actual: `policies=${hotelMediaPolicies.rows.length}, hotelMedia=${post210000HotelMediaWrite}, nonAdminBlock=${nonAdminRestImgBlock.blocked}, anonBlock=${anonStorageBlock.blocked}, mfaAllow=${mfaRestImgWrite.rows.length === 1}`,
      passed:
        hotelMediaPolicies.rows.length === 3 &&
        post210000HotelMediaWrite &&
        nonAdminRestImgBlock.blocked &&
        anonStorageBlock.blocked &&
        mfaRestImgWrite.rows.length === 1,
    });

    // B2: analytics_events & hotel_clicks doğrudan anonim/istemci REST INSERT engellenmeli; yalnız service_role yazabilmeli
    const validHotelId1 = '11111111-1111-4111-8111-111111111111';
    const validHotelId2 = '22222222-2222-4222-8222-222222222222';
    const invalidHotelId = '99999999-9999-4999-8999-999999999999';
    await db.query(`INSERT INTO public.valid_hotel_ids (id) VALUES ($1), ($2) ON CONFLICT DO NOTHING;`, [
      validHotelId1,
      validHotelId2,
    ]);

    const anonAnalyticsInsBlock = await expectRlsBlock(
      'anon',
      null,
      null,
      `INSERT INTO public.analytics_events (event_name) VALUES ('anon_bypass');`
    );
    const authAnalyticsInsBlock = await expectRlsBlock(
      'authenticated',
      adminUuid,
      'aal2',
      `INSERT INTO public.analytics_events (event_name) VALUES ('auth_bypass');`
    );
    const adminDirectAnalyticsInsBlock = await expectRlsBlock(
      'authenticated',
      cloudAdminUuid,
      'aal2',
      `INSERT INTO public.analytics_events (event_name) VALUES ('direct_client_bypass');`
    );
    const anonClicksInsBlock = await expectRlsBlock(
      'anon',
      null,
      null,
      `INSERT INTO public.hotel_clicks (hotel_id, user_ip) VALUES ($1, 'hash1');`,
      [validHotelId1]
    );
    const authClicksInsBlock = await expectRlsBlock(
      'authenticated',
      adminUuid,
      'aal2',
      `INSERT INTO public.hotel_clicks (hotel_id, user_ip) VALUES ($1, 'hash2');`,
      [validHotelId1]
    );
    const anonClicksSelectBlock = await expectRlsBlock(
      'anon',
      null,
      null,
      `SELECT id FROM public.hotel_clicks;`
    );
    const serviceWrites = await runAsUser('service_role', null, null, async () => {
      const a = await db.query(
        `INSERT INTO public.analytics_events (event_name) VALUES ('srv_pv') RETURNING id;`
      );
      const c = await db.query(
        `INSERT INTO public.hotel_clicks (hotel_id, user_ip) VALUES ($1, 'srv_hash') RETURNING id;`,
        [validHotelId1]
      );
      return a.rows.length === 1 && c.rows.length === 1;
    });
    const mfaClicksSelect = await runAsUser('authenticated', cloudAdminUuid, 'aal2', () =>
      db.query(`SELECT count(*)::int AS cnt FROM public.hotel_clicks;`)
    );
    results.push({
      test: '[B2] analytics_events & hotel_clicks doğrudan anon/client INSERT engelli; service_role yazımı ve MFA SELECT açık',
      expected: 'tüm client INSERT=BLOCK & anonClicksSelect=BLOCK & serviceWrites=true & mfaClicks>=1',
      actual: `anonA=${anonAnalyticsInsBlock.blocked}, authA=${authAnalyticsInsBlock.blocked}, admDirA=${adminDirectAnalyticsInsBlock.blocked}, anonC=${anonClicksInsBlock.blocked}, authC=${authClicksInsBlock.blocked}, anonCSel=${anonClicksSelectBlock.blocked}, srv=${serviceWrites}, mfaCnt=${mfaClicksSelect.rows[0].cnt}`,
      passed:
        anonAnalyticsInsBlock.blocked &&
        authAnalyticsInsBlock.blocked &&
        adminDirectAnalyticsInsBlock.blocked &&
        anonClicksInsBlock.blocked &&
        authClicksInsBlock.blocked &&
        anonClicksSelectBlock.blocked &&
        serviceWrites &&
        mfaClicksSelect.rows[0].cnt >= 1,
    });

    async function expectRpcAuthBlock(roleName, subUuid, aal, sql, params = []) {
      try {
        const res = await runAsUser(roleName, subUuid, aal, () => db.query(sql, params));
        return { blocked: false, reason: `ALLOWED (rows=${res.rows.length})` };
      } catch (err) {
        return {
          blocked: /permission denied|unauthorized/i.test(err.message),
          reason: err.message,
        };
      }
    }

    // B6: Atomik RPC yetki kontrolü + kısmi hata rollback testleri
    const aal1RpcRestBlock = await expectRpcAuthBlock(
      'authenticated',
      cloudAdminUuid,
      'aal1',
      `SELECT public.ya_admin_save_restaurant(NULL, $1::jsonb, '[]'::jsonb);`,
      [
        JSON.stringify({
          category_id: categoryId,
          location: 'Moda',
          name: { tr: 'Yetkisiz' },
        }),
      ]
    );
    const anonRpcGroupBlock = await expectRpcAuthBlock(
      'anon',
      null,
      null,
      `SELECT public.ya_admin_save_group(NULL, 'Anon Grup', ARRAY['yeriniayir.com'], ARRAY[$1::uuid]);`,
      [validHotelId1]
    );

    // Restoran pozitif + atomik rollback testi
    const restCreateRes = await runAsUser('authenticated', cloudAdminUuid, 'aal2', () =>
      db.query(
        `SELECT public.ya_admin_save_restaurant(NULL, $1::jsonb, $2::jsonb) AS id;`,
        [
          JSON.stringify({
            category_id: categoryId,
            location: 'Moda, Kadıköy',
            name: { tr: 'Atomik Kahve' },
            google_rating: 4.7,
            display_order: 2,
          }),
          JSON.stringify([
            { emoji: '☕', text: { tr: 'Not 1' }, display_order: 0 },
            { emoji: '🥐', text: { tr: 'Not 2' }, display_order: 1 },
          ]),
        ]
      )
    );
    const atomicRestId = restCreateRes.rows[0].id;

    let restRollbackTriggered = false;
    try {
      await runAsUser('authenticated', cloudAdminUuid, 'aal2', () =>
        db.query(
          `SELECT public.ya_admin_save_restaurant($1::uuid, $2::jsonb, $3::jsonb) AS id;`,
          [
            atomicRestId,
            JSON.stringify({
              category_id: categoryId,
              location: 'BOZUK_LOKASYON_GERI_ALINMALI',
              name: { tr: 'Atomik Kahve Bozuk' },
              google_rating: 1.0,
              display_order: 99,
            }),
            JSON.stringify([
              { emoji: '☕', text: { tr: 'Yeni Geçici Not' }, display_order: 0 },
              { emoji: '❌', text: '', display_order: 1 }, // 2. not başarısız -> tüm UPDATE + DELETE + 1. INSERT rollback!
            ]),
          ]
        )
      );
    } catch {
      restRollbackTriggered = true;
    }

    const restAfterRollback = await db.query(
      `SELECT location, (name::text) AS name_txt FROM public.restaurants WHERE id = $1::uuid;`,
      [atomicRestId]
    );
    const restNotesAfterRollback = await db.query(
      `SELECT (text::text) AS txt FROM public.restaurant_notes WHERE restaurant_id = $1::uuid ORDER BY display_order;`,
      [atomicRestId]
    );

    // Grup pozitif + atomik rollback testi
    const grpCreateRes = await runAsUser('authenticated', cloudAdminUuid, 'aal2', () =>
      db.query(
        `SELECT public.ya_admin_save_group(NULL, 'İlk Grup Başlığı', ARRAY['yeriniayir.com'], ARRAY[$1::uuid, $2::uuid]) AS id;`,
        [validHotelId1, validHotelId2]
      )
    );
    const atomicGroupId = grpCreateRes.rows[0].id;

    let grpRollbackTriggered = false;
    try {
      await runAsUser('authenticated', cloudAdminUuid, 'aal2', () =>
        db.query(
          `SELECT public.ya_admin_save_group($1::uuid, 'BOZUK_GRUP_GERI_ALINMALI', ARRAY['worldandhotels.com'], ARRAY[$2::uuid, $3::uuid]) AS id;`,
          [atomicGroupId, validHotelId1, invalidHotelId] // 2. hotel FK hatası -> tüm UPDATE groups + DELETE group_hotels + 1. INSERT rollback!
        )
      );
    } catch {
      grpRollbackTriggered = true;
    }

    const grpAfterRollback = await db.query(
      `SELECT title FROM public.groups WHERE id = $1::uuid;`,
      [atomicGroupId]
    );
    const grpHotelsAfterRollback = await db.query(
      `SELECT hotel_id::text FROM public.group_hotels WHERE group_id = $1::uuid ORDER BY order_index;`,
      [atomicGroupId]
    );

    const b6Passed =
      aal1RpcRestBlock.blocked &&
      anonRpcGroupBlock.blocked &&
      restRollbackTriggered &&
      restAfterRollback.rows[0]?.location === 'Moda, Kadıköy' &&
      restNotesAfterRollback.rows.length === 2 &&
      restNotesAfterRollback.rows[0].txt.includes('Not 1') &&
      restNotesAfterRollback.rows[1].txt.includes('Not 2') &&
      grpRollbackTriggered &&
      grpAfterRollback.rows[0]?.title === 'İlk Grup Başlığı' &&
      grpHotelsAfterRollback.rows.map((r) => r.hotel_id).join(',') === `${validHotelId1},${validHotelId2}`;

    results.push({
      test: '[B6] ya_admin_save_restaurant & ya_admin_save_group atomik rollback ve MFA/admin kilidi',
      expected: 'yetkisiz RPC=BLOCK & kısmi hata=tam rollback (eski restoran+2 not & eski grup+2 otel korunur)',
      actual: `aal1Block=${aal1RpcRestBlock.blocked}, anonBlock=${anonRpcGroupBlock.blocked}, restRb=${restRollbackTriggered}, restLoc=${restAfterRollback.rows[0]?.location}, notes=${restNotesAfterRollback.rows.length}, grpRb=${grpRollbackTriggered}, grpTitle=${grpAfterRollback.rows[0]?.title}, grpHotels=${grpHotelsAfterRollback.rows.length}`,
      passed: b6Passed,
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

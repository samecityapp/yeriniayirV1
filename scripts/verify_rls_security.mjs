import fs from 'node:fs';
import path from 'node:path';

const { PGlite } = await import(
  fs.existsSync('/tmp/pglite-runner/node_modules/@electric-sql/pglite/dist/index.js')
    ? '/tmp/pglite-runner/node_modules/@electric-sql/pglite/dist/index.js'
    : '@electric-sql/pglite'
);

async function runRlsVerification() {
  const db = new PGlite();

  console.log('================================================================');
  console.log('YERİNİ AYIR — GELİŞTİRME ORTAMI (PG16) RLS GÜVENLİK DOĞRULAMASI');
  console.log('Canlı Supabase veritabanına dokunulmadan izole PostgreSQL 16');
  console.log('motorunda (PGlite) gerçek SQL migration testi yürütülüyor...');
  console.log('================================================================\n');

  // 1. Setup Supabase-compatible roles & auth schema mocks in local PG16
  await db.exec(`
    CREATE SCHEMA IF NOT EXISTS auth;
    DO $$ BEGIN
      CREATE ROLE anon NOLOGIN;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      CREATE ROLE authenticated NOLOGIN;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      CREATE ROLE service_role NOLOGIN BYPASSRLS;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

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

  // 2. Load the vulnerable historical migrations (restaurants, group_hotels, offers)
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

  // Grant table privileges to anon and authenticated (standard Supabase default grants; RLS is what restricts rows)
  await db.exec(`
    GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
    GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
    GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;
    GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA auth TO anon, authenticated, service_role;
  `);

  // Seed one initial legitimate restaurant category & restaurant as superuser
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

  // 3. Apply our new security lockdown migration!
  const lockdownSql = fs.readFileSync(
    path.join(process.cwd(), 'supabase/migrations/20261029193000_lockdown_rls_policies.sql'),
    'utf8'
  );
  await db.exec(lockdownSql);
  console.log('[AŞAMA 2] 20261029193000_lockdown_rls_policies.sql Uygulandı.\n');

  const results = [];

  // Test 1: ANON SELECT on restaurants (Should SUCCEED)
  await db.exec(`SET ROLE anon;`);
  const anonSelect = await db.query(`SELECT id, name FROM public.restaurants;`);
  results.push({
    test: 'ANON SELECT public.restaurants (Okuma)',
    expected: 'ALLOW (1 satır)',
    actual: `ALLOW (${anonSelect.rows.length} satır)`,
    passed: anonSelect.rows.length === 1,
  });

  // Test 2: ANON INSERT on restaurants (Should FAIL with RLS violation)
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

  // Test 3: ANON UPDATE on restaurants (Should affect 0 rows)
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

  // Test 4: ANON DELETE on restaurants (Should affect 0 rows)
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

  // Test 5: ANON INSERT on restaurant_categories (Should FAIL with RLS violation)
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

  // Test 6: ANON INSERT on restaurant_notes (Should FAIL with RLS violation)
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

  // Test 7: ANON INSERT on group_hotels (Should FAIL with RLS violation)
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

  // Test 8: ANON INSERT on offers (Should FAIL with RLS violation)
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

  // Test 9: Non-admin authenticated user INSERT on restaurants (Should FAIL)
  const nonAdminUuid = '11111111-1111-1111-1111-111111111111';
  const adminUuid = '99999999-9999-9999-9999-999999999999';
  await db.query(`INSERT INTO public.profiles (id, email, role) VALUES ($1, 'user@test.com', 'user'), ($2, 'admin@yeriniayir.com', 'admin');`, [
    nonAdminUuid,
    adminUuid,
  ]);

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

  // Test 10: Admin authenticated user INSERT on restaurants (Should SUCCEED)
  await db.exec(`
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

  console.log('[AŞAMA 3] Test Sonuç Tablosu:');
  for (const r of results) {
    console.log(`  [${r.passed ? 'PASS ✅' : 'FAIL ❌'}] ${r.test}`);
    console.log(`           Beklenen: ${r.expected} | Gerçekleşen: ${r.actual}`);
  }

  const allPassed = results.every((r) => r.passed);
  console.log(`\nGENEL SONUÇ: ${results.filter((r) => r.passed).length}/${results.length} TEST BAŞARILI.`);
  if (!allPassed) {
    process.exit(1);
  }
}

runRlsVerification();

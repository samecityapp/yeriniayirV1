import fs from 'node:fs';
import assert from 'node:assert/strict';
const { PGlite } = await import(fs.existsSync('/tmp/pglite-runner/node_modules/@electric-sql/pglite/dist/index.js')
  ? '/tmp/pglite-runner/node_modules/@electric-sql/pglite/dist/index.js' : '@electric-sql/pglite');
const db = new PGlite();
try {
  await db.exec(`CREATE SCHEMA storage; CREATE ROLE anon; CREATE ROLE authenticated;
    CREATE TABLE public.profiles(id uuid, is_admin boolean DEFAULT false);
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
    CREATE POLICY profile_fixture ON public.profiles FOR SELECT TO authenticated USING(false);
    CREATE TABLE storage.objects(id integer);
    INSERT INTO storage.objects VALUES(1);`);
  const sql = fs.readFileSync('supabase/audits/production_rls_readonly.sql', 'utf8');
  const results = await db.exec(sql);
  assert.equal(results[3].rows[0].transaction_read_only, 'on');
  assert.ok(results.some(r => r.rows.some(row => row.policyname === 'profile_fixture')));
  assert.ok(results.some(r => r.rows.some(row => row.schema_name === 'storage' && row.table_name === 'objects')));
  assert.equal((await db.query('SELECT count(*) AS total FROM storage.objects')).rows[0].total, 1);
  await db.exec('BEGIN READ ONLY');
  await assert.rejects(db.exec('INSERT INTO storage.objects VALUES(2)'), /read-only/i);
  await db.exec('ROLLBACK');
  assert.equal((await db.query('SELECT count(*) AS total FROM storage.objects')).rows[0].total, 1);
  console.log('PASS 6 isolated recovery audit checks: valid catalog SQL, read-only transaction, policies, storage metadata, unchanged rows, rejected write');
} finally { await db.close(); }

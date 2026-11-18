-- Metadata only: no application rows, policies or persistent settings are changed.
BEGIN TRANSACTION READ ONLY;
SET LOCAL statement_timeout = '15s';
SET LOCAL lock_timeout = '3s';
SELECT current_database() AS database_name, current_user AS inspection_role,
       current_setting('transaction_read_only') AS transaction_read_only,
       current_setting('server_version') AS server_version;
SELECT n.nspname AS schema_name,c.relname AS table_name,
       c.relrowsecurity AS rls_enabled,c.relforcerowsecurity AS force_rls,
       c.relkind AS relation_kind,c.reloptions
FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
WHERE n.nspname IN ('public','storage') AND c.relkind IN ('r','p','v')
ORDER BY n.nspname,c.relname;
SELECT schemaname,tablename,policyname,permissive,roles,cmd,qual,with_check
FROM pg_policies WHERE schemaname IN ('public','storage')
ORDER BY schemaname,tablename,policyname;
SELECT table_name,column_name,data_type FROM information_schema.columns
WHERE table_schema='public' AND table_name='profiles' AND column_name IN ('id','role','is_admin');
SELECT table_schema,table_name,grantee,privilege_type
FROM information_schema.role_table_grants
WHERE table_schema IN ('public','storage') AND grantee IN ('anon','authenticated','PUBLIC')
ORDER BY table_schema,table_name,grantee,privilege_type;
SELECT n.nspname AS schema_name, r.rolname AS owner_role,
       d.defaclobjtype AS object_type,d.defaclacl::text AS default_acl
FROM pg_default_acl d LEFT JOIN pg_namespace n ON n.oid=d.defaclnamespace
JOIN pg_roles r ON r.oid=d.defaclrole
WHERE n.nspname IN ('public','storage') OR d.defaclnamespace=0;
SELECT n.nspname AS schema_name,p.proname AS function_name,
       pg_get_function_identity_arguments(p.oid) AS identity_arguments,
       p.prosecdef AS security_definer,p.proconfig AS function_settings,p.proacl::text AS function_acl
FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
WHERE n.nspname IN ('public','storage') AND p.prosecdef
ORDER BY n.nspname,p.proname;
SELECT n.nspname AS schema_name,c.relname AS table_name,t.tgname AS trigger_name,
       pg_get_triggerdef(t.oid) AS trigger_definition
FROM pg_trigger t JOIN pg_class c ON c.oid=t.tgrelid
JOIN pg_namespace n ON n.oid=c.relnamespace
WHERE n.nspname='public' AND c.relname='profiles' AND NOT t.tgisinternal;
ROLLBACK;

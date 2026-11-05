-- Only activate after schema and verified input have passed staging tests.
BEGIN;
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
SELECT cron.schedule('yeriniayir-staging-publication','*/5 * * * *','SELECT ya_private.publication_tick();');
COMMIT;

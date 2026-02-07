-- Fix existing Greek locations in the database
-- Updates the English translation (en) to replace "Yunanistan" with "Greece"
-- based on the Turkish (tr) value.
-- Note: 'location' column is TEXT type containing JSON, so we must cast to JSONB.

UPDATE hotels
SET location = jsonb_set(
  location::jsonb,
  '{en}',
  to_jsonb(REPLACE(location::jsonb->>'tr', 'Yunanistan', 'Greece'))
)::text
WHERE location::jsonb->>'tr' LIKE '%Yunanistan%';

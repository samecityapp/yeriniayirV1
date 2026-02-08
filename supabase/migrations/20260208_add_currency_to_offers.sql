
-- Add currency column to offers table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'offers' AND column_name = 'currency') THEN
        ALTER TABLE offers ADD COLUMN currency text DEFAULT 'TL';
    END IF;
END $$;

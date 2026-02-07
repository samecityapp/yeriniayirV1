-- Add currency column to hotels table
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS currency text DEFAULT 'TL';

-- Update existing records to have 'TL' as currency (redundant with default but good for clarity)
UPDATE hotels SET currency = 'TL' WHERE currency IS NULL;

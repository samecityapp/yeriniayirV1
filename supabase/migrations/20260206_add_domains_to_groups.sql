-- Add domains column to groups table
ALTER TABLE groups 
ADD COLUMN IF NOT EXISTS domains text[] DEFAULT '{}';

-- Optional: Comment to explain
COMMENT ON COLUMN groups.domains IS 'Array of domains where this group should be visible (e.g. "yeriniayir.com", "worldandhotels.com")';

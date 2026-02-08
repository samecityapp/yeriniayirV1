-- Enable RLS on offers table
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow public read access" ON offers;
DROP POLICY IF EXISTS "Allow public insert access" ON offers;
DROP POLICY IF EXISTS "Allow public update access" ON offers;
DROP POLICY IF EXISTS "Allow public delete access" ON offers;

-- Create policies to allow full access (adjust for production if needed)
CREATE POLICY "Allow public read access" ON offers FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON offers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON offers FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON offers FOR DELETE USING (true);

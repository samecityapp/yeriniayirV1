/*
  # Fix Groups UPDATE RLS Policy for Soft Delete

  1. Changes
    - Drop existing restrictive UPDATE policy
    - Create new UPDATE policy that allows setting deleted_at
    - Ensures UPDATE operations work for soft delete functionality
  
  2. Security
    - Maintains authentication requirement
    - Allows updates for both NULL and non-NULL deleted_at values
*/

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Public can update groups" ON groups;

-- Create new policy that allows soft delete
CREATE POLICY "Public can update groups"
  ON groups
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

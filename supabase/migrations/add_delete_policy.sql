-- Add DELETE policy for authenticated admins
-- This allows admins to delete pending/failed payment applications

-- Drop the policy if it already exists (for safe re-runs)
DROP POLICY IF EXISTS "Allow authenticated admin delete applications" ON applications;

-- Create the DELETE policy
CREATE POLICY "Allow authenticated admin delete applications"
ON applications FOR DELETE
TO authenticated
USING (true);

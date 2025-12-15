/*
  # Allow public update access to AI settings

  1. Changes
    - Add policy for anonymous users to update ai_settings
    - Required because admin pages don't have authentication yet
  
  2. Security Note
    - This allows anyone to update AI settings
    - In production, admin pages MUST be protected with authentication
    - This is a temporary solution for development/testing
*/

CREATE POLICY "Anonymous users can update AI settings"
  ON ai_settings
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);
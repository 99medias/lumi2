/*
  # Allow public read access to AI settings

  1. Changes
    - Add policy for anonymous users to read ai_settings
    - Required because admin pages don't have authentication yet
  
  2. Security Note
    - This allows anyone to read AI settings (except the API key which is never exposed)
    - In production, admin pages should be protected with authentication
*/

CREATE POLICY "Anonymous users can view AI settings"
  ON ai_settings
  FOR SELECT
  TO anon
  USING (true);
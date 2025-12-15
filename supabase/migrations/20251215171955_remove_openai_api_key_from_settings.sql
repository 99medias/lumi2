/*
  # Remove OpenAI API Key from Settings

  1. Changes
    - Drop the `openai_api_key` column from `ai_settings` table
    - API key is now stored securely in Supabase secrets as OPENAI_API_KEY
  
  2. Security
    - API key no longer stored in database
    - Only accessible through Supabase Edge Function environment variables
*/

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ai_settings' AND column_name = 'openai_api_key'
  ) THEN
    ALTER TABLE ai_settings DROP COLUMN openai_api_key;
  END IF;
END $$;

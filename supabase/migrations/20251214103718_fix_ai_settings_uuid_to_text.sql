/*
  # Fix ai_settings ID column from UUID to TEXT

  1. Changes
    - Drop primary key constraint
    - Change id column from UUID to TEXT type
    - Re-add primary key constraint
    - Insert default settings row if not exists
  
  2. Security
    - No changes to RLS policies (already configured)
*/

-- Drop primary key constraint
ALTER TABLE ai_settings DROP CONSTRAINT IF EXISTS ai_settings_pkey;

-- Change column type from UUID to TEXT
ALTER TABLE ai_settings ALTER COLUMN id TYPE text USING id::text;

-- Re-add primary key constraint
ALTER TABLE ai_settings ADD PRIMARY KEY (id);

-- Ensure default row exists
INSERT INTO ai_settings (id) 
VALUES ('default') 
ON CONFLICT (id) DO NOTHING;

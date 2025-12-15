/*
  # Add Schedule Settings and Logs

  ## Changes
  - Add schedule configuration columns to ai_settings table
  - Create schedule_logs table to track automated runs
  
  ## New Columns in ai_settings
  - schedule_enabled: Enable/disable automated generation
  - schedule_check_frequency: How often to check sources (in minutes)
  - schedule_generate_frequency: How often to generate (hourly/daily/weekly)
  - schedule_time: Time of day to run generation
  - schedule_days: Which days to run (array of day names)
  - schedule_max_articles: Maximum articles to generate per run
  - schedule_min_relevance: Minimum relevance score to auto-generate
  - schedule_auto_publish: Whether to auto-publish without review
  - schedule_sources_priority: Which sources to use (high/high_medium/all)
  - notify_on_publish: Send email notification on publish
  - notify_on_error: Send email notification on error
  
  ## New Table: schedule_logs
  - Tracks each automated run with statistics
  - Records success/failure status
  - Stores error messages for debugging
*/

-- Add schedule settings columns to ai_settings
ALTER TABLE ai_settings 
  ADD COLUMN IF NOT EXISTS schedule_enabled boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS schedule_check_frequency text DEFAULT '30',
  ADD COLUMN IF NOT EXISTS schedule_generate_frequency text DEFAULT 'daily',
  ADD COLUMN IF NOT EXISTS schedule_time text DEFAULT '09:00',
  ADD COLUMN IF NOT EXISTS schedule_days text[] DEFAULT ARRAY['monday','tuesday','wednesday','thursday','friday'],
  ADD COLUMN IF NOT EXISTS schedule_max_articles int DEFAULT 3,
  ADD COLUMN IF NOT EXISTS schedule_min_relevance float DEFAULT 0.7,
  ADD COLUMN IF NOT EXISTS schedule_auto_publish boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS schedule_sources_priority text DEFAULT 'high',
  ADD COLUMN IF NOT EXISTS notify_on_publish boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS notify_on_error boolean DEFAULT true;

-- Create schedule logs table
CREATE TABLE IF NOT EXISTS schedule_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  status text NOT NULL,
  sources_checked int DEFAULT 0,
  items_detected int DEFAULT 0,
  articles_generated int DEFAULT 0,
  errors text[],
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on schedule_logs
ALTER TABLE schedule_logs ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read schedule logs
CREATE POLICY "Authenticated users can read schedule logs"
  ON schedule_logs
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow service role to insert schedule logs
CREATE POLICY "Service role can insert schedule logs"
  ON schedule_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
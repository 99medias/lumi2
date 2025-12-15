/*
  # Add Schedule Start and End Dates

  ## Changes
  - Add schedule_start_date column to ai_settings table
  - Add schedule_end_date column to ai_settings table
  
  ## New Columns
  - schedule_start_date (timestamptz, nullable): When automated generation should begin
  - schedule_end_date (timestamptz, nullable): Optional date when automated generation should stop
  
  ## Purpose
  These columns allow administrators to schedule when automated content generation
  should start and optionally when it should end, providing better control over
  the automation timeline.
*/

-- Add schedule date columns to ai_settings
ALTER TABLE ai_settings 
  ADD COLUMN IF NOT EXISTS schedule_start_date timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS schedule_end_date timestamptz DEFAULT NULL;

-- Add index for faster date-based queries
CREATE INDEX IF NOT EXISTS idx_ai_settings_schedule_dates 
  ON ai_settings(schedule_start_date, schedule_end_date);

-- Add index on schedule_logs for performance
CREATE INDEX IF NOT EXISTS idx_schedule_logs_created_at 
  ON schedule_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_schedule_logs_status 
  ON schedule_logs(status, created_at DESC);
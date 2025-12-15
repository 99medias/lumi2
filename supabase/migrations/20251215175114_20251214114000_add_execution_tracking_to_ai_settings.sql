/*
  # Add Execution Tracking to AI Settings

  ## New Columns in ai_settings
  - `last_executed_at` (timestamptz) - Tracks when schedule last successfully executed
  - `is_executing` (boolean) - Lock flag to prevent concurrent executions
  - `schedule_start_date` (timestamptz) - Optional delayed start date
  - `schedule_end_date` (timestamptz) - Optional end date for auto-termination

  ## Indexes
  - Index on last_executed_at for efficient time-based queries
  
  ## Purpose
  These columns support the automated cron-based execution system:
  - last_executed_at prevents duplicate runs within the same schedule window
  - is_executing acts as a mutex to prevent race conditions
  - start_date/end_date provide flexible scheduling boundaries
*/

-- Add execution tracking columns to ai_settings
ALTER TABLE ai_settings 
  ADD COLUMN IF NOT EXISTS last_executed_at timestamptz,
  ADD COLUMN IF NOT EXISTS is_executing boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS schedule_start_date timestamptz,
  ADD COLUMN IF NOT EXISTS schedule_end_date timestamptz;

-- Create index for efficient time-based queries
CREATE INDEX IF NOT EXISTS idx_ai_settings_last_executed 
  ON ai_settings(last_executed_at DESC);

-- Add comment for documentation
COMMENT ON COLUMN ai_settings.last_executed_at IS 'Timestamp of last successful scheduled execution';
COMMENT ON COLUMN ai_settings.is_executing IS 'Lock flag to prevent concurrent executions';
COMMENT ON COLUMN ai_settings.schedule_start_date IS 'Optional start date for delayed scheduling';
COMMENT ON COLUMN ai_settings.schedule_end_date IS 'Optional end date for auto-termination';
/*
  # Add Execution Tracking to Schedule Logs

  ## New Columns in schedule_logs
  - `triggered_by` (text) - Tracks how execution was triggered: 'cron', 'manual', 'save-auto'
  - `execution_time` (int) - Time taken to execute in seconds

  ## Purpose
  These columns provide better visibility into:
  - How the generation was triggered (automated vs manual)
  - Performance metrics for execution time
*/

-- Add tracking columns to schedule_logs
ALTER TABLE schedule_logs 
  ADD COLUMN IF NOT EXISTS triggered_by text DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS execution_time int;

-- Add index for filtering by trigger type
CREATE INDEX IF NOT EXISTS idx_schedule_logs_triggered_by 
  ON schedule_logs(triggered_by);

-- Add comments for documentation
COMMENT ON COLUMN schedule_logs.triggered_by IS 'How execution was triggered: cron, manual, or save-auto';
COMMENT ON COLUMN schedule_logs.execution_time IS 'Execution time in seconds';

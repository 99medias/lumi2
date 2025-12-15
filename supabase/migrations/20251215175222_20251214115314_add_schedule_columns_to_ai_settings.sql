/*
  # Add Schedule Columns to ai_settings

  1. New Columns
    - `schedule_enabled` (boolean) - Enable/disable automatic scheduling
    - `schedule_time` (text) - Time of day to run (e.g., "09:00")
    - `schedule_max_articles` (int) - Max articles per execution
    - `schedule_min_relevance` (float) - Minimum relevance threshold (0.0-1.0)
    - `schedule_auto_publish` (boolean) - Auto-publish generated articles
    - `schedule_days` (text[]) - Days of week to run
    - `last_executed_at` (timestamp) - Last execution timestamp

  2. Changes
    - Add columns if they don't exist to support simplified scheduling system
*/

ALTER TABLE ai_settings 
  ADD COLUMN IF NOT EXISTS schedule_enabled boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS schedule_time text DEFAULT '09:00',
  ADD COLUMN IF NOT EXISTS schedule_max_articles int DEFAULT 3,
  ADD COLUMN IF NOT EXISTS schedule_min_relevance float DEFAULT 0.7,
  ADD COLUMN IF NOT EXISTS schedule_auto_publish boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS schedule_days text[] DEFAULT ARRAY['monday','tuesday','wednesday','thursday','friday'],
  ADD COLUMN IF NOT EXISTS last_executed_at timestamptz;
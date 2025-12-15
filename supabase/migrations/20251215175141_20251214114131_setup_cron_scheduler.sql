/*
  # Set Up Cron Job for Automated Scheduling

  ## Purpose
  Creates a pg_cron job that runs every 5 minutes to check if scheduled
  article generation should execute.

  ## Implementation
  - Enables pg_cron extension
  - Enables pg_net extension for HTTP requests
  - Creates SQL function to call Edge Function via HTTP
  - Schedules cron job to run every 5 minutes

  ## Security
  - Uses service role key stored in vault for authentication
  - Only runs within Supabase infrastructure
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Grant permissions to postgres user for cron operations
GRANT USAGE ON SCHEMA cron TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cron TO postgres;

-- Create function to call check-scheduled-execution Edge Function
CREATE OR REPLACE FUNCTION check_and_run_scheduled_execution()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  response_status int;
  response_body text;
  supabase_url text;
  service_key text;
BEGIN
  SELECT decrypted_secret INTO service_key
  FROM vault.decrypted_secrets
  WHERE name = 'service_role_key'
  LIMIT 1;

  supabase_url := current_setting('app.settings.supabase_url', true);
  
  IF supabase_url IS NULL THEN
    supabase_url := 'http://localhost:54321';
  END IF;

  SELECT status, content::text
  INTO response_status, response_body
  FROM http((
    'POST',
    supabase_url || '/functions/v1/check-scheduled-execution',
    ARRAY[http_header('Authorization', 'Bearer ' || service_key)],
    'application/json',
    '{}'
  )::http_request);

  IF response_status >= 400 THEN
    RAISE WARNING 'Scheduled execution check failed with status %: %', response_status, response_body;
  END IF;

EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error checking scheduled execution: %', SQLERRM;
END;
$$;

-- Schedule the cron job to run every 5 minutes
-- Remove any existing job with the same name first
SELECT cron.unschedule('check-scheduled-execution') 
WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'check-scheduled-execution'
);

-- Create the new cron job
SELECT cron.schedule(
  'check-scheduled-execution',
  '*/5 * * * *',
  'SELECT check_and_run_scheduled_execution();'
);

-- Add comment for documentation
COMMENT ON FUNCTION check_and_run_scheduled_execution IS 
  'Called by pg_cron every 5 minutes to check if scheduled article generation should run';
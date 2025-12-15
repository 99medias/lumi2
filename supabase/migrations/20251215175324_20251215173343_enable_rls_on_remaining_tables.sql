/*
  # Enable Row Level Security on remaining tables
  
  1. Security Updates
    - Enable RLS on `content_sources` table
    - Enable RLS on `source_items` table  
    - Enable RLS on `ai_settings` table
    - Enable RLS on `ai_generation_logs` table
    
  2. Policies
    - Add public read access to content_sources (needed for frontend)
    - Add public read access to source_items (needed for content queue)
    - Keep ai_settings as read-only for public (already has policies)
    - Add public read access to ai_generation_logs for diagnostics
*/

-- Enable RLS on content_sources
ALTER TABLE content_sources ENABLE ROW LEVEL SECURITY;

-- Enable RLS on source_items  
ALTER TABLE source_items ENABLE ROW LEVEL SECURITY;

-- Enable RLS on ai_generation_logs
ALTER TABLE ai_generation_logs ENABLE ROW LEVEL SECURITY;

-- Public read access to content_sources
CREATE POLICY "Anyone can view content sources"
  ON content_sources FOR SELECT
  TO public
  USING (true);

-- Public read access to source_items
CREATE POLICY "Anyone can view source items"
  ON source_items FOR SELECT
  TO public
  USING (true);

-- Public read access to ai_generation_logs
CREATE POLICY "Anyone can view generation logs"
  ON ai_generation_logs FOR SELECT
  TO public
  USING (true);
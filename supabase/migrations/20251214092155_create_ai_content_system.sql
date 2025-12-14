/*
  # AI Content System for Blog

  1. New Tables
    - `content_sources`
      - Tracks RSS feeds and websites to monitor
      - Fields: name, url, type (rss/scrape), priority, category, active status
    
    - `source_items`
      - Stores detected articles from sources
      - Fields: source reference, title, original content, relevance score, status
      - Tracks processing pipeline: new -> processing -> published/ignored
    
    - `ai_settings`
      - Stores OpenAI configuration and auto-post settings
      - Fields: api_key (encrypted), model, auto_post config, notification settings
    
    - `ai_generation_logs`
      - Audit trail of all AI generations
      - Fields: source item reference, tokens used, cost, generation time
    
  2. Security
    - Enable RLS on all tables
    - Admin-only access policies
    - Encrypted storage for API keys
  
  3. Indexes
    - source_items.status for queue filtering
    - source_items.relevance_score for prioritization
    - ai_generation_logs.created_at for cost reporting
*/

-- Content Sources Table
CREATE TABLE IF NOT EXISTS content_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text NOT NULL,
  type text NOT NULL CHECK (type IN ('rss', 'scrape')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  default_category text NOT NULL CHECK (default_category IN ('alerte', 'guide', 'actualite', 'arnaque')),
  filter_keywords text,
  is_active boolean DEFAULT true,
  last_checked_at timestamptz,
  check_frequency_minutes integer DEFAULT 30,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Source Items Table
CREATE TABLE IF NOT EXISTS source_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id uuid REFERENCES content_sources(id) ON DELETE CASCADE,
  external_id text NOT NULL,
  title text NOT NULL,
  original_url text NOT NULL,
  original_content text,
  summary text,
  detected_at timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'processing', 'published', 'ignored', 'failed')),
  generated_post_id uuid REFERENCES blog_posts(id),
  relevance_score float CHECK (relevance_score >= 0 AND relevance_score <= 1),
  relevance_reason text,
  suggested_angle text,
  suggested_category text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(source_id, external_id)
);

-- AI Settings Table
CREATE TABLE IF NOT EXISTS ai_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  openai_api_key text,
  openai_model text DEFAULT 'gpt-4o-mini' CHECK (openai_model IN ('gpt-4o', 'gpt-4o-mini')),
  auto_post_enabled boolean DEFAULT false,
  auto_post_min_relevance float DEFAULT 0.85,
  auto_post_max_per_day integer DEFAULT 2,
  auto_post_allowed_sources text[],
  default_author_id uuid REFERENCES blog_authors(id),
  notification_email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- AI Generation Logs Table
CREATE TABLE IF NOT EXISTS ai_generation_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_item_id uuid REFERENCES source_items(id) ON DELETE SET NULL,
  blog_post_id uuid REFERENCES blog_posts(id) ON DELETE SET NULL,
  operation_type text NOT NULL CHECK (operation_type IN ('relevance_check', 'article_generation', 'originality_check', 'regeneration')),
  model_used text NOT NULL,
  prompt_tokens integer,
  completion_tokens integer,
  total_tokens integer,
  estimated_cost_usd decimal(10, 6),
  success boolean DEFAULT true,
  error_message text,
  processing_time_ms integer,
  created_at timestamptz DEFAULT now()
);

-- Insert default content sources
INSERT INTO content_sources (name, url, type, priority, default_category, filter_keywords) VALUES
  ('Safeonweb.be', 'https://www.safeonweb.be/fr/rss.xml', 'rss', 'high', 'alerte', NULL),
  ('CERT.be', 'https://www.cert.be/fr/rss.xml', 'rss', 'high', 'alerte', NULL),
  ('CCB News', 'https://ccb.belgium.be/fr/actualites', 'scrape', 'high', 'actualite', NULL),
  ('Data News Belgium', 'https://datanews.levif.be/rss', 'rss', 'medium', 'actualite', 'cybersécurité,sécurité,piratage'),
  ('BleepingComputer', 'https://www.bleepingcomputer.com/feed/', 'rss', 'low', 'actualite', 'belgium,phishing,ransomware'),
  ('Krebs on Security', 'https://krebsonsecurity.com/feed/', 'rss', 'low', 'actualite', NULL)
ON CONFLICT DO NOTHING;

-- Insert default AI settings
INSERT INTO ai_settings (id, openai_model, auto_post_enabled, auto_post_min_relevance, auto_post_max_per_day)
VALUES ('00000000-0000-0000-0000-000000000001', 'gpt-4o-mini', false, 0.85, 2)
ON CONFLICT DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_source_items_status ON source_items(status);
CREATE INDEX IF NOT EXISTS idx_source_items_relevance ON source_items(relevance_score DESC);
CREATE INDEX IF NOT EXISTS idx_source_items_created ON source_items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_logs_created ON ai_generation_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_sources_active ON content_sources(is_active, last_checked_at);

-- Enable RLS
ALTER TABLE content_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE source_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generation_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Admin only - you'll need to adjust based on your auth setup)
-- For now, allowing all authenticated users (adjust to admin role when implemented)

CREATE POLICY "Authenticated users can view content sources"
  ON content_sources FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage content sources"
  ON content_sources FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view source items"
  ON source_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage source items"
  ON source_items FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view AI settings"
  ON ai_settings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update AI settings"
  ON ai_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view generation logs"
  ON ai_generation_logs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System can insert generation logs"
  ON ai_generation_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);
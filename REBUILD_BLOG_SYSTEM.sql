-- ===================================================
-- REBUILD: Blog System for MaSécurité.be
-- ===================================================
-- Run this SQL in Supabase SQL Editor to reset and rebuild the blog system

-- Clean slate
DROP TABLE IF EXISTS schedule_logs CASCADE;
DROP TABLE IF EXISTS source_items CASCADE;
DROP TABLE IF EXISTS content_sources CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS blog_authors CASCADE;
DROP TABLE IF EXISTS ai_generation_logs CASCADE;

-- Keep ai_settings but reset it
DELETE FROM ai_settings WHERE id != 'default';

-- ===================================================
-- Authors Table
-- ===================================================
CREATE TABLE blog_authors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE,
  title text,
  bio text,
  photo_url text,
  created_at timestamp DEFAULT now()
);

-- ===================================================
-- Blog Posts Table
-- ===================================================
CREATE TABLE blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  meta_title text,
  meta_description text,
  excerpt text,
  content text,
  featured_image text,
  category text DEFAULT 'actualite',
  tags text[] DEFAULT '{}',
  author_id uuid REFERENCES blog_authors(id),
  status text DEFAULT 'draft',
  reading_time int DEFAULT 4,
  view_count int DEFAULT 0,
  published_at timestamp,
  created_at timestamp DEFAULT now()
);

-- ===================================================
-- RSS Sources Table
-- ===================================================
CREATE TABLE content_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text NOT NULL,
  type text DEFAULT 'rss',
  priority text DEFAULT 'medium',
  default_category text DEFAULT 'actualite',
  is_active boolean DEFAULT true,
  last_checked_at timestamp,
  created_at timestamp DEFAULT now()
);

-- ===================================================
-- Source Items Table
-- ===================================================
CREATE TABLE source_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id uuid REFERENCES content_sources(id),
  title text,
  original_url text,
  original_content text,
  summary text,
  status text DEFAULT 'new',
  relevance_score float DEFAULT 0.5,
  generated_post_id uuid REFERENCES blog_posts(id),
  detected_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- ===================================================
-- AI Generation Logs Table
-- ===================================================
CREATE TABLE ai_generation_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_item_id uuid REFERENCES source_items(id) ON DELETE SET NULL,
  blog_post_id uuid REFERENCES blog_posts(id) ON DELETE SET NULL,
  operation_type text NOT NULL,
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

-- ===================================================
-- Disable RLS for simplified access
-- ===================================================
ALTER TABLE blog_authors DISABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE content_sources DISABLE ROW LEVEL SECURITY;
ALTER TABLE source_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generation_logs DISABLE ROW LEVEL SECURITY;

-- ===================================================
-- Insert 3 Belgian Authors
-- ===================================================
INSERT INTO blog_authors (name, slug, title, bio, photo_url) VALUES
  ('Marc Dupont', 'marc-dupont', 'Expert Cybersécurité', 'Ancien analyste au CCB. 12 ans d''expérience.', 'https://ui-avatars.com/api/?name=Marc+Dupont&background=10B981&color=fff'),
  ('Sophie Janssens', 'sophie-janssens', 'Journaliste Tech', 'Spécialisée cybersécurité. Ancienne rédactrice Data News.', 'https://ui-avatars.com/api/?name=Sophie+Janssens&background=3B82F6&color=fff'),
  ('Thomas Vermeersch', 'thomas-vermeersch', 'Chercheur Sécurité', 'PhD KU Leuven. Collabore avec CERT.be.', 'https://ui-avatars.com/api/?name=Thomas+Vermeersch&background=8B5CF6&color=fff');

-- ===================================================
-- Insert 24 RSS Sources (Belgian + International)
-- ===================================================
INSERT INTO content_sources (name, url, type, priority, default_category, is_active) VALUES
  -- Belgian Official Sources (High Priority)
  ('Safeonweb.be', 'https://www.safeonweb.be/fr/rss.xml', 'rss', 'high', 'alerte', true),
  ('CERT.be', 'https://www.cert.be/fr/rss.xml', 'rss', 'high', 'alerte', true),
  ('CCB Belgium', 'https://ccb.belgium.be/fr/rss.xml', 'rss', 'high', 'actualite', true),
  ('SPF Économie', 'https://economie.fgov.be/fr/rss.xml', 'rss', 'high', 'arnaque', true),

  -- Belgian News Outlets (Medium Priority)
  ('RTBF Info', 'https://rss.rtbf.be/article/rss/highlight_rtbf_info.xml', 'rss', 'medium', 'actualite', true),
  ('Le Soir', 'https://www.lesoir.be/rss/591/feed.xml', 'rss', 'medium', 'actualite', true),
  ('La Libre', 'https://www.lalibre.be/rss/section/economie.xml', 'rss', 'medium', 'actualite', true),
  ('L''Echo', 'https://www.lecho.be/rss/tech.xml', 'rss', 'medium', 'actualite', true),
  ('Data News', 'https://datanews.levif.be/feed/', 'rss', 'medium', 'actualite', true),

  -- Belgian Consumer Protection (High Priority)
  ('Test-Achats', 'https://www.test-achats.be/rss', 'rss', 'high', 'guide', true),
  ('Febelfin', 'https://www.febelfin.be/fr/rss', 'rss', 'high', 'guide', true),
  ('Wikifin', 'https://www.wikifin.be/fr/rss.xml', 'rss', 'medium', 'guide', true),

  -- International Security News (Low Priority)
  ('BleepingComputer', 'https://www.bleepingcomputer.com/feed/', 'rss', 'low', 'actualite', true),
  ('Krebs on Security', 'https://krebsonsecurity.com/feed/', 'rss', 'low', 'actualite', true),
  ('The Hacker News', 'https://feeds.feedburner.com/TheHackersNews', 'rss', 'low', 'actualite', true),
  ('Ars Technica', 'https://feeds.arstechnica.com/arstechnica/security', 'rss', 'low', 'actualite', true),
  ('Threatpost', 'https://threatpost.com/feed/', 'rss', 'low', 'actualite', true),
  ('Dark Reading', 'https://www.darkreading.com/rss.xml', 'rss', 'low', 'actualite', true),
  ('SecurityWeek', 'https://feeds.feedburner.com/securityweek', 'rss', 'low', 'actualite', true),
  ('Naked Security', 'https://nakedsecurity.sophos.com/feed/', 'rss', 'low', 'guide', true),
  ('Graham Cluley', 'https://grahamcluley.com/feed/', 'rss', 'low', 'actualite', true),
  ('SANS ISC', 'https://isc.sans.edu/rssfeed.xml', 'rss', 'low', 'alerte', true),
  ('We Live Security', 'https://www.welivesecurity.com/feed/', 'rss', 'low', 'actualite', true),
  ('Malwarebytes Blog', 'https://blog.malwarebytes.com/feed/', 'rss', 'low', 'actualite', true);

-- ===================================================
-- Insert 6 Sample Articles (Ready to Display)
-- ===================================================
INSERT INTO blog_posts (title, slug, excerpt, content, category, tags, author_id, status, reading_time, view_count, published_at) VALUES
(
  'Nouvelle vague de phishing itsme en Belgique',
  'phishing-itsme-belgique-2024',
  'Des milliers de Belges reçoivent de faux SMS itsme. Voici comment vous protéger.',
  '<h2>Une campagne massive cible les utilisateurs belges</h2><p>Le CCB observe une recrudescence des tentatives de phishing ciblant itsme. Ces attaques prennent la forme de SMS frauduleux.</p><h2>Comment reconnaître un faux message</h2><ul><li>Sentiment d''urgence ("Votre compte sera bloqué")</li><li>Fautes d''orthographe</li><li>Lien suspect (pas itsme.be)</li><li>Demande de données bancaires</li></ul><h2>Ce que vous devez faire</h2><ul><li>Ne cliquez jamais sur les liens SMS</li><li>Vérifiez l''URL : uniquement itsme.be</li><li>Transférez à suspicious@safeonweb.be</li><li>Contactez votre banque si vous avez cliqué</li></ul>',
  'alerte',
  ARRAY['phishing', 'itsme', 'belgique'],
  (SELECT id FROM blog_authors WHERE slug = 'marc-dupont'),
  'published', 4, 2847, now() - interval '2 days'
),
(
  'Sécuriser votre banque en ligne : Guide complet',
  'securiser-banque-en-ligne-belgique',
  'Belfius, KBC, ING... Protégez vos comptes bancaires avec ces conseils.',
  '<h2>La sécurité bancaire en Belgique</h2><p>Les banques belges investissent dans la sécurité, mais les cybercriminels aussi.</p><h2>Activer l''authentification forte</h2><ul><li><strong>Belfius</strong> : App avec confirmation biométrique</li><li><strong>KBC</strong> : KBC Sign avec empreinte</li><li><strong>ING</strong> : Code de sécurité</li><li><strong>BNP Paribas Fortis</strong> : Reconnaissance faciale</li></ul><h2>Ce que vous devez faire</h2><ul><li>Activez les notifications pour chaque transaction</li><li>Vérifiez régulièrement vos relevés</li><li>Utilisez un mot de passe unique</li><li>Ne vous connectez jamais via Wi-Fi public</li></ul><p>En cas de fraude : Card Stop 078 170 170 (24h/24)</p>',
  'guide',
  ARRAY['banque', 'sécurité', 'belfius', 'kbc'],
  (SELECT id FROM blog_authors WHERE slug = 'sophie-janssens'),
  'published', 5, 1956, now() - interval '5 days'
),
(
  'Arnaque bpost : Ces faux colis qui vident votre compte',
  'arnaque-bpost-faux-colis',
  'Les faux SMS de livraison bpost explosent en Belgique.',
  '<h2>Une arnaque qui exploite votre attente de colis</h2><p>Avec l''explosion du e-commerce, les arnaques aux faux colis se multiplient.</p><h2>Comment fonctionne l''arnaque</h2><ul><li>SMS mentionnant un colis en attente</li><li>Demande de payer 1-2€ de frais</li><li>Site copie de bpost</li><li>Vol de données bancaires</li></ul><h2>Ce que vous devez faire</h2><ul><li>Ne cliquez pas sur les liens SMS</li><li>Vérifiez sur bpost.be directement</li><li>Transférez à suspicious@safeonweb.be</li><li>Contactez votre banque si vous avez cliqué</li></ul>',
  'arnaque',
  ARRAY['bpost', 'colis', 'phishing'],
  (SELECT id FROM blog_authors WHERE slug = 'marc-dupont'),
  'published', 4, 3124, now() - interval '3 days'
),
(
  'VPN en Belgique : Protégez votre connexion',
  'vpn-belgique-guide',
  'Pourquoi un VPN est devenu indispensable pour les internautes belges.',
  '<h2>Qu''est-ce qu''un VPN ?</h2><p>Un VPN crée un tunnel chiffré entre votre appareil et internet.</p><h2>Les risques sans VPN</h2><ul><li>Données interceptées sur Wi-Fi publics</li><li>Fournisseur internet voit votre activité</li><li>Sites web suivent votre localisation</li></ul><h2>Ce que vous devez faire</h2><ul><li>Évitez les VPN gratuits</li><li>Activez le VPN sur tous vos appareils</li><li>Utilisez-le sur les Wi-Fi publics</li><li>Vérifiez qu''il est actif avant la banque</li></ul>',
  'guide',
  ARRAY['vpn', 'wifi', 'sécurité'],
  (SELECT id FROM blog_authors WHERE slug = 'thomas-vermeersch'),
  'published', 5, 987, now() - interval '7 days'
),
(
  'Faux support Microsoft : L''arnaque qui cible les seniors',
  'arnaque-faux-support-microsoft',
  'Des escrocs se faisant passer pour Microsoft contactent des Belges.',
  '<h2>Une arnaque téléphonique en expansion</h2><p>Chaque semaine, des Belges reçoivent des appels de faux techniciens Microsoft.</p><h2>Comment fonctionne l''arnaque</h2><ul><li>Appel d''un "technicien Microsoft"</li><li>Prétend avoir détecté un virus</li><li>Demande d''installer AnyDesk/TeamViewer</li><li>Prend contrôle de votre PC</li><li>Vous fait payer 200-500€</li></ul><h2>Ce que vous devez faire</h2><ul><li><strong>Raccrochez immédiatement</strong></li><li>Ne donnez jamais accès à votre PC</li><li>Ne communiquez aucune info bancaire</li><li>Signalez à la Police Fédérale</li><li>Prévenez vos proches âgés</li></ul>',
  'arnaque',
  ARRAY['microsoft', 'arnaque', 'seniors'],
  (SELECT id FROM blog_authors WHERE slug = 'sophie-janssens'),
  'published', 5, 2341, now() - interval '10 days'
),
(
  'Mots de passe sécurisés : Guide pratique',
  'mots-de-passe-securises-guide',
  'Apprenez à créer des mots de passe vraiment sécurisés.',
  '<h2>Pourquoi vos mots de passe ne sont pas sûrs</h2><p>60% des Belges utilisent le même mot de passe partout.</p><h2>Les erreurs courantes</h2><ul><li>Infos personnelles (date naissance)</li><li>Mots de passe trop courts</li><li>Réutilisation partout</li><li>Post-it sur l''écran</li></ul><h2>La méthode de la phrase secrète</h2><p>"Mon chat Félix mange 3 croquettes!" → McFm3c!</p><h2>Ce que vous devez faire</h2><ul><li>Utilisez un gestionnaire (Bitwarden)</li><li>Activez l''authentification 2 facteurs</li><li>Mot de passe unique par compte</li><li>Vérifiez sur haveibeenpwned.com</li></ul>',
  'guide',
  ARRAY['mot-de-passe', 'sécurité', 'guide'],
  (SELECT id FROM blog_authors WHERE slug = 'thomas-vermeersch'),
  'published', 5, 1432, now() - interval '14 days'
);

-- ===================================================
-- Create Indexes for Performance
-- ===================================================
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_source_items_status ON source_items(status);
CREATE INDEX IF NOT EXISTS idx_source_items_relevance ON source_items(relevance_score DESC);
CREATE INDEX IF NOT EXISTS idx_content_sources_active ON content_sources(is_active);

-- ===================================================
-- Verification Queries
-- ===================================================
-- Check that everything was created successfully
SELECT 'Authors' as table_name, COUNT(*) as count FROM blog_authors
UNION ALL
SELECT 'Blog Posts', COUNT(*) FROM blog_posts
UNION ALL
SELECT 'Content Sources', COUNT(*) FROM content_sources
UNION ALL
SELECT 'Source Items', COUNT(*) FROM source_items;

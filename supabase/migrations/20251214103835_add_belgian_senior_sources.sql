/*
  # Add 10 Belgian Senior Sources

  1. New Sources
    - Safeonweb Alertes (high priority, scrape, alerte)
    - Test-Achats Arnaques (high priority, scrape, arnaque)
    - SPF Économie (high priority, scrape, arnaque)
    - FEBELFIN Sécurité (high priority, scrape, guide)
    - Police Prévention (medium priority, scrape, guide)
    - RTBF Tech (medium priority, rss, actualite)
    - Le Soir Économie (medium priority, rss, actualite)
    - Ombudsfin (medium priority, scrape, alerte)
    - Wikifin FSMA (medium priority, scrape, guide)
    - Senior Actu BE (low priority, scrape, actualite)
  
  2. Purpose
    - Focus on scams targeting elderly Belgian consumers
    - Official government sources and trusted institutions
    - Banking security and financial education
    - Simple security tips for non-technical seniors
*/

INSERT INTO content_sources (name, url, type, priority, default_category, is_active, created_at) VALUES
  ('Safeonweb Alertes', 'https://www.safeonweb.be/fr/actualites', 'scrape', 'high', 'alerte', true, now()),
  ('Test-Achats Arnaques', 'https://www.test-achats.be/argent/arnaques', 'scrape', 'high', 'arnaque', true, now()),
  ('SPF Économie', 'https://economie.fgov.be/fr/themes/protection-des-consommateurs', 'scrape', 'high', 'arnaque', true, now()),
  ('FEBELFIN Sécurité', 'https://www.febelfin.be/fr/consommateurs/securite', 'scrape', 'high', 'guide', true, now()),
  ('Police Prévention', 'https://www.police.be/fr/conseils-prevention/internet', 'scrape', 'medium', 'guide', true, now()),
  ('RTBF Tech', 'https://www.rtbf.be/article/rss', 'rss', 'medium', 'actualite', true, now()),
  ('Le Soir Économie', 'https://www.lesoir.be/rss/section/economie', 'rss', 'medium', 'actualite', true, now()),
  ('Ombudsfin', 'https://www.ombudsfin.be/fr/actualites', 'scrape', 'medium', 'alerte', true, now()),
  ('Wikifin FSMA', 'https://www.wikifin.be/fr/actualites', 'scrape', 'medium', 'guide', true, now()),
  ('Senior Actu BE', 'https://www.senioractu.be/', 'scrape', 'low', 'actualite', true, now());

/*
  # Fix source_items and blog_posts table constraints

  1. Changes to source_items
    - Make columns nullable that were causing insertion failures
    - Add sensible default values
    - Keep critical columns like title and url required

  2. Changes to blog_posts
    - Make optional metadata columns nullable
    - Add default values for common fields
    
  3. Notes
    - This fixes "NOT NULL constraint violation" errors
    - Allows more flexible data insertion
    - Maintains data integrity for essential fields
*/

-- Fix source_items table
ALTER TABLE source_items ALTER COLUMN original_content DROP NOT NULL;
ALTER TABLE source_items ALTER COLUMN summary DROP NOT NULL;

ALTER TABLE source_items ALTER COLUMN status SET DEFAULT 'new';
ALTER TABLE source_items ALTER COLUMN relevance_score SET DEFAULT 0.5;
ALTER TABLE source_items ALTER COLUMN detected_at SET DEFAULT now();
ALTER TABLE source_items ALTER COLUMN original_content SET DEFAULT '';
ALTER TABLE source_items ALTER COLUMN summary SET DEFAULT '';

-- Fix blog_posts table
ALTER TABLE blog_posts ALTER COLUMN meta_title DROP NOT NULL;
ALTER TABLE blog_posts ALTER COLUMN meta_description DROP NOT NULL;
ALTER TABLE blog_posts ALTER COLUMN excerpt DROP NOT NULL;
ALTER TABLE blog_posts ALTER COLUMN author_id DROP NOT NULL;
ALTER TABLE blog_posts ALTER COLUMN reading_time DROP NOT NULL;

ALTER TABLE blog_posts ALTER COLUMN view_count SET DEFAULT 0;
ALTER TABLE blog_posts ALTER COLUMN tags SET DEFAULT '{}';
ALTER TABLE blog_posts ALTER COLUMN category SET DEFAULT 'actualite';
ALTER TABLE blog_posts ALTER COLUMN reading_time SET DEFAULT 5;

/*
  # Create Blog System Tables

  1. New Tables
    - `blog_authors`
      - `id` (uuid, primary key)
      - `name` (text) - Author's full name
      - `slug` (text, unique) - URL-friendly identifier
      - `title` (text) - Professional title
      - `credentials` (text) - Certifications and qualifications
      - `bio` (text) - Full biography
      - `photo_url` (text) - Profile photo URL
      - `linkedin_url` (text) - LinkedIn profile
      - `years_experience` (int) - Years of experience
      - `former_positions` (text[]) - Array of previous positions
      - `created_at` (timestamptz)
    
    - `blog_posts`
      - `id` (uuid, primary key)
      - `slug` (text, unique) - URL-friendly identifier
      - `title` (text) - Article title
      - `meta_title` (text) - SEO title (max 60 chars)
      - `meta_description` (text) - SEO description (max 155 chars)
      - `excerpt` (text) - Short preview
      - `content` (text) - Full HTML/Markdown content
      - `featured_image` (text) - Image URL
      - `category` (text) - Article category
      - `tags` (text[]) - Array of tags
      - `author_id` (uuid, foreign key)
      - `status` (text) - Publication status
      - `published_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `reading_time` (int) - Minutes to read
      - `view_count` (int) - Page views
      - `is_featured` (boolean) - Featured article flag
      - `seo_keywords` (text[]) - Target keywords
      - `sources` (jsonb) - Reference sources
      - `created_at` (timestamptz)
    
    - `blog_comments`
      - `id` (uuid, primary key)
      - `post_id` (uuid, foreign key)
      - `author_name` (text) - Commenter name
      - `author_location` (text) - Location (e.g., "Liège")
      - `content` (text) - Comment text
      - `is_approved` (boolean) - Moderation status
      - `is_seeded` (boolean) - Pre-populated comment flag
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Public read access for published content
    - Admin-only write access (future auth integration)
*/

-- Create blog_authors table
CREATE TABLE IF NOT EXISTS blog_authors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  credentials text,
  bio text NOT NULL,
  photo_url text,
  linkedin_url text,
  years_experience int DEFAULT 0,
  former_positions text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  meta_title text NOT NULL,
  meta_description text NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  featured_image text,
  category text NOT NULL CHECK (category IN ('alerte', 'guide', 'actualite', 'arnaque')),
  tags text[] DEFAULT '{}',
  author_id uuid REFERENCES blog_authors(id) ON DELETE SET NULL,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
  published_at timestamptz,
  updated_at timestamptz DEFAULT now(),
  reading_time int DEFAULT 5,
  view_count int DEFAULT 0,
  is_featured boolean DEFAULT false,
  seo_keywords text[] DEFAULT '{}',
  sources jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

-- Create blog_comments table
CREATE TABLE IF NOT EXISTS blog_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES blog_posts(id) ON DELETE CASCADE NOT NULL,
  author_name text NOT NULL,
  author_location text,
  content text NOT NULL,
  is_approved boolean DEFAULT false,
  is_seeded boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_post ON blog_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_authors_slug ON blog_authors(slug);

-- Enable Row Level Security
ALTER TABLE blog_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blog_authors (public read)
CREATE POLICY "Anyone can view authors"
  ON blog_authors FOR SELECT
  USING (true);

-- RLS Policies for blog_posts (public read for published)
CREATE POLICY "Anyone can view published posts"
  ON blog_posts FOR SELECT
  USING (status = 'published' AND published_at <= now());

-- RLS Policies for blog_comments (public read for approved)
CREATE POLICY "Anyone can view approved comments"
  ON blog_comments FOR SELECT
  USING (is_approved = true);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_blog_post_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS blog_posts_updated_at ON blog_posts;
CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_post_updated_at();

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_post_views(post_slug text)
RETURNS void AS $$
BEGIN
  UPDATE blog_posts
  SET view_count = view_count + 1
  WHERE slug = post_slug AND status = 'published';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
/*
  # Add RLS Policies for Blog Tables

  1. Security Changes
    - Add public read access to blog_posts (published posts only)
    - Add public read access to blog_authors
    - Maintain security while allowing public blog viewing

  2. Notes
    - Only published posts with past publication dates are visible
    - Authors linked to published posts are visible
    - Write operations remain restricted to authenticated users
*/

-- Allow public read access to published blog posts
CREATE POLICY "Anyone can view published blog posts"
  ON blog_posts FOR SELECT
  TO public
  USING (status = 'published' AND published_at <= NOW());

-- Allow public read access to blog authors
CREATE POLICY "Anyone can view blog authors"
  ON blog_authors FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to manage blog posts
CREATE POLICY "Authenticated users can insert blog posts"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update blog posts"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete blog posts"
  ON blog_posts FOR DELETE
  TO authenticated
  USING (true);

-- Allow authenticated users to manage blog authors
CREATE POLICY "Authenticated users can insert blog authors"
  ON blog_authors FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update blog authors"
  ON blog_authors FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete blog authors"
  ON blog_authors FOR DELETE
  TO authenticated
  USING (true);

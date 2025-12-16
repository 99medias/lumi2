/*
  # Add updated_at column to blog_posts
  
  1. Changes
    - Add updated_at column to blog_posts table
    - Set default value to match created_at for existing posts
    - Add trigger to auto-update the timestamp on updates
    
  2. Notes
    - This column tracks when a post was last modified
    - Useful for showing "Updated on" dates to readers
*/

-- Add updated_at column
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Update existing posts to have updated_at = created_at
UPDATE blog_posts 
SET updated_at = created_at 
WHERE updated_at IS NULL;

-- Create function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for blog_posts
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

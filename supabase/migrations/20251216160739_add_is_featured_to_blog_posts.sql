/*
  # Add is_featured column to blog_posts
  
  1. Changes
    - Add is_featured boolean column to blog_posts table
    - Default to false for all posts
    - Allows marking one post as featured on the blog homepage
    
  2. Notes
    - Featured posts appear prominently at the top of the blog
    - Only one post should typically be featured at a time
*/

-- Add is_featured column
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;

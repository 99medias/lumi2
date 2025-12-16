/*
  # Enable Row Level Security on Blog Tables
  
  1. Changes
    - Enable RLS on blog_posts table
    - Enable RLS on blog_authors table
    
  2. Security
    - Existing policies will now be enforced
    - Public can view published posts
    - Authenticated users can manage all posts
*/

-- Enable RLS on blog_posts
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Enable RLS on blog_authors
ALTER TABLE blog_authors ENABLE ROW LEVEL SECURITY;

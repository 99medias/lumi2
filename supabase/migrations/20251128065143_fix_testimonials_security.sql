/*
  # Fix Testimonials Security Issues

  ## Security Improvements

  1. **Remove Unused Indexes**
     - Drop `idx_testimonials_featured` - not being used in queries
     - Drop `idx_testimonials_product` - not being used in queries
     - Drop `idx_testimonials_rating` - not being used in queries
     
     These indexes consume storage and slow down INSERT/UPDATE operations without providing query benefits.

  2. **Fix Function Search Path Mutability**
     - Update `update_testimonials_updated_at` function to use immutable search_path
     - Add `SECURITY DEFINER` and explicit schema qualification to prevent search_path attacks
     - This prevents potential privilege escalation vulnerabilities

  ## Technical Details
  
  The function now:
  - Uses `SECURITY DEFINER` with explicit schema references
  - Sets `search_path` to empty string to prevent manipulation
  - Follows PostgreSQL security best practices for trigger functions
*/

-- Drop unused indexes to improve performance and reduce storage
DROP INDEX IF EXISTS idx_testimonials_featured;
DROP INDEX IF EXISTS idx_testimonials_product;
DROP INDEX IF EXISTS idx_testimonials_rating;

-- Recreate the function with proper security settings
DROP FUNCTION IF EXISTS update_testimonials_updated_at() CASCADE;

CREATE OR REPLACE FUNCTION public.update_testimonials_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate the trigger since we dropped the function with CASCADE
DROP TRIGGER IF EXISTS testimonials_updated_at ON testimonials;

CREATE TRIGGER testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW
  EXECUTE FUNCTION public.update_testimonials_updated_at();

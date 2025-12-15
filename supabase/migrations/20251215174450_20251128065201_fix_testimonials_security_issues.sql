/*
  # Fix Testimonials Security Issues

  ## Security Fixes

  1. **Remove Unused Indexes**
     - Drop `idx_testimonials_featured` (not being used in queries)
     - Drop `idx_testimonials_product` (not being used in queries)
     - Drop `idx_testimonials_rating` (not being used in queries)
     
     These indexes were created preemptively but are not currently used by any queries.
     Unused indexes consume storage and slow down INSERT/UPDATE operations without
     providing any query performance benefits.

  2. **Fix Function Search Path Security**
     - Update `update_testimonials_updated_at()` function to have a secure search_path
     - Add `SECURITY DEFINER` and set explicit `search_path` to prevent search path
       injection attacks where malicious schemas could be added to affect function behavior
     
     This prevents security vulnerabilities where functions with mutable search_path
     could be exploited by attackers to execute malicious code.

  ## Notes
  
  - Indexes can be re-added later if query patterns show they are actually needed
  - The updated_at trigger function now has immutable search_path for security
  - All changes are idempotent (safe to run multiple times)
*/

-- Drop unused indexes
DROP INDEX IF EXISTS idx_testimonials_featured;
DROP INDEX IF EXISTS idx_testimonials_product;
DROP INDEX IF EXISTS idx_testimonials_rating;

-- Drop existing function to recreate with secure search_path
DROP FUNCTION IF EXISTS update_testimonials_updated_at() CASCADE;

-- Recreate function with secure, immutable search_path
CREATE OR REPLACE FUNCTION update_testimonials_updated_at()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = pg_catalog, public
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate trigger (it was dropped with CASCADE above)
DROP TRIGGER IF EXISTS testimonials_updated_at ON testimonials;

CREATE TRIGGER testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW
  EXECUTE FUNCTION update_testimonials_updated_at();
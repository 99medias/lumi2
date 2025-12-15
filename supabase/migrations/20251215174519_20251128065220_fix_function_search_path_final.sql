/*
  # Fix Function Search Path - Final Security Hardening

  ## Security Enhancement
  
  1. **Secure Function Search Path**
     - Set search_path to empty string (most secure option)
     - Use fully qualified function names (pg_catalog.now())
     - Prevents any search_path manipulation attacks
     
  ## Technical Details
  
  By setting `search_path = ''`, we ensure:
  - No schema is searched implicitly
  - All functions must be fully qualified
  - Eliminates privilege escalation via search_path hijacking
  - Follows PostgreSQL security best practices
*/

-- Drop and recreate with proper empty search_path
DROP FUNCTION IF EXISTS public.update_testimonials_updated_at() CASCADE;

CREATE OR REPLACE FUNCTION public.update_testimonials_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Use fully qualified function name for maximum security
  NEW.updated_at = pg_catalog.now();
  RETURN NEW;
END;
$$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS testimonials_updated_at ON public.testimonials;

CREATE TRIGGER testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW
  EXECUTE FUNCTION public.update_testimonials_updated_at();
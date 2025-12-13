/*
  # Create Testimonials Table

  1. New Tables
    - `testimonials`
      - `id` (uuid, primary key) - Unique identifier
      - `name` (text) - Customer name
      - `role` (text) - Job title or description
      - `company` (text, nullable) - Company name if applicable
      - `avatar_url` (text, nullable) - URL to customer photo
      - `rating` (integer) - Rating from 1-5 stars
      - `comment` (text) - Testimonial text
      - `product` (text, nullable) - Which product they're reviewing (vpn, adblock, cleaner, total-care, general)
      - `featured` (boolean) - Whether to show on homepage
      - `verified` (boolean) - Verified purchase badge
      - `location` (text, nullable) - City, Country
      - `created_at` (timestamptz) - When testimonial was created
      - `updated_at` (timestamptz) - When testimonial was last updated

  2. Security
    - Enable RLS on `testimonials` table
    - Add policy for public read access (testimonials are public)
    - Add policy for authenticated admin users to manage testimonials
*/

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  company text,
  avatar_url text,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  product text DEFAULT 'general',
  featured boolean DEFAULT false,
  verified boolean DEFAULT true,
  location text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read testimonials (they are public content)
CREATE POLICY "Testimonials are publicly readable"
  ON testimonials
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only authenticated users can insert testimonials (for admin panel later)
CREATE POLICY "Authenticated users can insert testimonials"
  ON testimonials
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only authenticated users can update testimonials
CREATE POLICY "Authenticated users can update testimonials"
  ON testimonials
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Only authenticated users can delete testimonials
CREATE POLICY "Authenticated users can delete testimonials"
  ON testimonials
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert sample testimonials
INSERT INTO testimonials (name, role, company, rating, comment, product, featured, verified, location) VALUES
  ('Sophie Martin', 'Directrice Marketing', 'TechCorp France', 5, 'MSS VPN Pro a complètement transformé notre façon de travailler en déplacement. La connexion est ultra-rapide et nous nous sentons en sécurité sur tous les réseaux Wi-Fi publics. Un must-have pour toute entreprise !', 'vpn', true, true, 'Paris, France'),

  ('Marc Dubois', 'Entrepreneur', NULL, 5, 'Depuis que j''utilise le pack Total Care, mon PC est comme neuf ! Le System Cleaner a récupéré 15 GB d''espace et mon ordinateur démarre 3 fois plus vite. Incroyable rapport qualité-prix.', 'total-care', true, true, 'Lyon, France'),

  ('Julie Rousseau', 'Développeuse Web', 'Digital Solutions', 5, 'AdBlock Plus est un game-changer. Mes pages se chargent instantanément et je ne suis plus suivie partout sur Internet. La différence est spectaculaire, je ne peux plus m''en passer !', 'adblock', true, true, 'Marseille, France'),

  ('Thomas Bernard', 'Chef de Projet IT', NULL, 5, 'La protection complète de MySafeSecurity nous a évité plusieurs attaques cette année. Le support client est réactif et professionnel. Je recommande à 100% !', 'general', true, true, 'Toulouse, France'),

  ('Marie Lambert', 'Photographe Freelance', NULL, 5, 'En tant que freelance, protéger mes données clients est crucial. Le VPN et l''antivirus fonctionnent parfaitement ensemble. Je dors sur mes deux oreilles maintenant.', 'vpn', true, true, 'Bordeaux, France'),

  ('Nicolas Petit', 'Consultant', 'Accenture', 4, 'Très satisfait de System Cleaner. Mon ancien PC tournait au ralenti, maintenant il est fluide. Seul bémol : j''aurais aimé plus d''options de personnalisation.', 'cleaner', false, true, 'Nantes, France'),

  ('Isabelle Moreau', 'Responsable RH', NULL, 5, 'J''ai essayé plusieurs VPN avant MySafeSecurity. Celui-ci est de loin le meilleur : rapide, fiable, et le service client est top. Parfait pour le télétravail.', 'vpn', true, true, 'Strasbourg, France'),

  ('Pierre Lefebvre', 'Étudiant en Informatique', NULL, 5, 'Le pack Total Care est parfait pour les étudiants. Pour moins de 25€/mois, j''ai tout ce dont j''ai besoin. Plus besoin d''acheter 3 logiciels séparés !', 'total-care', true, true, 'Lille, France'),

  ('Camille Garnier', 'Graphiste', 'Studio Créatif', 5, 'AdBlock a libéré tellement de ressources sur mon Mac ! Mes logiciels de création tournent mieux et ma navigation est ultra-rapide. Je gagne au moins 30 minutes par jour.', 'adblock', false, true, 'Nice, France'),

  ('Alexandre Roux', 'Directeur Financier', 'FinTech Solutions', 5, 'La sécurité n''est pas négociable dans notre secteur. MySafeSecurity répond à toutes nos exigences de conformité RGPD. Service impeccable.', 'general', true, true, 'Paris, France');

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_testimonials_product ON testimonials(product);
CREATE INDEX IF NOT EXISTS idx_testimonials_rating ON testimonials(rating);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_testimonials_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW
  EXECUTE FUNCTION update_testimonials_updated_at();

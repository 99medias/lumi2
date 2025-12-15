/*
  # Table des messages de contact

  1. Nouvelle Table
    - `contact_messages`
      - `id` (uuid, clé primaire)
      - `name` (text) - Nom du contact
      - `email` (text) - Email du contact
      - `phone` (text, optionnel) - Téléphone du contact
      - `subject` (text) - Sujet du message
      - `message` (text) - Contenu du message
      - `status` (text) - Statut (nouveau, lu, traité)
      - `created_at` (timestamptz) - Date de création
      - `updated_at` (timestamptz) - Date de mise à jour

  2. Sécurité
    - Activer RLS sur la table `contact_messages`
    - Politique pour permettre l'insertion publique (pour le formulaire de contact)
    - Politique pour permettre la lecture uniquement aux utilisateurs authentifiés (admin)

  3. Notes Importantes
    - Les messages peuvent être soumis par n'importe qui (pas besoin d'authentification)
    - Seuls les administrateurs authentifiés peuvent lire les messages
    - Utilisation de valeurs par défaut pour les timestamps et le statut
*/

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'nouveau',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permettre insertion publique pour contact"
  ON contact_messages
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Lecture réservée aux authentifiés"
  ON contact_messages
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Mise à jour réservée aux authentifiés"
  ON contact_messages
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
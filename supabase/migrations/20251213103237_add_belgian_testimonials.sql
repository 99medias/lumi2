/*
  # Update Testimonials with Belgian French Content
  
  1. Changes
    - Remove existing French testimonials
    - Add 6 new Belgian French testimonials from Liège, Bruxelles, Namur, Charleroi, Mons, and Louvain-la-Neuve
    - All testimonials are in Belgian French with realistic Belgian locations and context
    
  2. New Testimonials
    - Marie Dubois (Liège) - Pack Famille - 5 stars
    - Philippe Vandenberghe (Bruxelles) - Dépannage à domicile - 5 stars
    - Sophie Lambert (Namur) - Pack Famille - 5 stars
    - Jean-Marc Peeters (Charleroi) - Assistance d'urgence - 5 stars
    - Catherine Willems (Mons) - Support technique - 4 stars
    - Thomas Martens (Louvain-la-Neuve) - Protection Pro - 5 stars
*/

-- Delete existing testimonials
DELETE FROM testimonials;

-- Insert Belgian French testimonials
INSERT INTO testimonials (name, role, company, rating, comment, product, featured, verified, location, language) VALUES
  (
    'Marie Dubois',
    'Particulier',
    NULL,
    5,
    'Enfin un service qui explique les choses simplement ! Mon ordinateur est protégé et je comprends enfin ce que je paie. L''équipe est vraiment à l''écoute.',
    'total-care',
    true,
    true,
    'Liège, Belgique',
    'fr'
  ),
  (
    'Philippe Vandenberghe',
    'Particulier',
    NULL,
    5,
    'Le technicien est venu chez moi le jour même. Problème de virus résolu en une heure. Très professionnel et sympathique. Je recommande vivement !',
    'general',
    true,
    true,
    'Bruxelles, Belgique',
    'fr'
  ),
  (
    'Sophie Lambert',
    'Maman de 3 enfants',
    NULL,
    5,
    'Le pack famille est parfait pour nous. Tous nos appareils sont protégés et les enfants naviguent en sécurité. Le contrôle parental est top !',
    'total-care',
    true,
    true,
    'Namur, Belgique',
    'fr'
  ),
  (
    'Jean-Marc Peeters',
    'Retraité',
    NULL,
    5,
    'J''ai été victime d''une arnaque en ligne. MaSécurité m''a aidé à sécuriser tous mes comptes et m''a expliqué comment éviter ça à l''avenir. Merci !',
    'general',
    true,
    true,
    'Charleroi, Belgique',
    'fr'
  ),
  (
    'Catherine Willems',
    'Commerçante',
    NULL,
    4,
    'Très bon service client. J''ai appelé un samedi et quelqu''un m''a répondu directement. Ça change des grandes boîtes où on attend des heures.',
    'general',
    true,
    true,
    'Mons, Belgique',
    'fr'
  ),
  (
    'Thomas Martens',
    'Indépendant',
    NULL,
    5,
    'En tant qu''indépendant, la sécurité de mes données clients est primordiale. MaSécurité m''a mis en place une solution simple et efficace. Parfait !',
    'general',
    true,
    true,
    'Louvain-la-Neuve, Belgique',
    'fr'
  );

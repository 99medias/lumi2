# AI Content System - Guide d'Utilisation

## Vue d'ensemble

Système automatisé de génération de contenu qui surveille les sources de cybersécurité belges, évalue la pertinence, et génère des articles uniques pour votre blog.

## Architecture du Système

### 1. Base de Données

#### Tables Créées
- **content_sources** - Sources RSS et sites web à surveiller
- **source_items** - Articles détectés depuis les sources
- **ai_settings** - Configuration OpenAI et paramètres auto-post
- **ai_generation_logs** - Logs d'utilisation et coûts

### 2. Pages Admin

#### `/admin` - Tableau de Bord
- Vue d'ensemble des statistiques
- Nombre de sources actives
- Articles en attente et publiés
- Coûts mensuels et utilisation tokens
- Actions rapides

#### `/admin/settings` - Paramètres
- Configuration de la clé API OpenAI
- Choix du modèle (GPT-4o ou GPT-4o-mini)
- Test de connexion OpenAI
- Configuration auto-post
- Paramètres de notification

#### `/admin/sources` - Gestion des Sources
- Liste des sources RSS/scraping
- Ajouter/modifier/supprimer des sources
- Activer/désactiver des sources
- Vérification manuelle des sources
- Historique de vérification

#### `/admin/content-queue` - File d'Attente
- Articles détectés par statut (nouveau, en cours, publié, ignoré)
- Score de pertinence pour chaque article
- Angle suggéré pour l'audience belge
- Génération manuelle d'articles
- Aperçu du contenu source
- Gestion des articles (ignorer, supprimer)

### 3. Edge Functions

#### `test-openai-connection`
- Vérifie la validité de la clé API OpenAI
- Teste la connexion avec le modèle sélectionné
- **Endpoint**: `POST /functions/v1/test-openai-connection`
- **Payload**: `{ api_key: string, model: string }`

#### `check-sources`
- Vérifie les sources RSS toutes les 30 minutes (configurable)
- Parse les flux RSS et extrait les articles
- Évite les doublons avec external_id
- Met à jour last_checked_at pour chaque source
- **Endpoint**: `POST /functions/v1/check-sources`
- **Payload**: `{ source_id?: string }` (optionnel, vérifie toutes les sources si omis)

#### `generate-article`
- Calcule le score de pertinence avec OpenAI (si pas déjà fait)
- Génère un article unique en français belge
- Vérifie l'originalité du contenu
- Crée un brouillon dans blog_posts
- Log les tokens utilisés et coûts estimés
- **Endpoint**: `POST /functions/v1/generate-article`
- **Payload**: `{ source_item_id: string }`

#### `auto-post-scheduler`
- Vérifie si auto-post est activé
- Respecte la limite quotidienne
- Sélectionne les articles haute pertinence (>0.85)
- Génère et publie automatiquement
- Envoie des notifications (si configuré)
- **Endpoint**: `POST /functions/v1/auto-post-scheduler`
- **À configurer avec CRON**: Toutes les 5 minutes recommandé

## Guide de Démarrage

### Étape 1: Configuration OpenAI

1. Aller sur `/admin/settings`
2. Obtenir une clé API sur [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
3. Coller la clé dans le champ "Clé API OpenAI"
4. Choisir le modèle:
   - **GPT-4o-mini** : ~0.09€/article (recommandé pour démarrer)
   - **GPT-4o** : ~0.25€/article (meilleure qualité)
5. Cliquer sur "Tester la connexion"
6. Sauvegarder les paramètres

### Étape 2: Configurer les Sources

Les sources par défaut sont déjà configurées:
- Safeonweb.be (priorité haute)
- CERT.be (priorité haute)
- CCB News (priorité haute)
- Data News Belgium
- BleepingComputer
- Krebs on Security

Pour ajouter une source:
1. Aller sur `/admin/sources`
2. Cliquer "Ajouter une source"
3. Remplir les informations:
   - **Nom**: Nom de la source
   - **URL**: URL du flux RSS ou de la page
   - **Type**: RSS Feed ou Web Scraping
   - **Priorité**: Haute (auto-post), Moyenne, Basse
   - **Catégorie**: alerte, guide, actualité, arnaque
   - **Mots-clés**: Filtres optionnels (séparés par virgules)

### Étape 3: Vérifier les Sources

**Option 1 - Manuel:**
1. Aller sur `/admin/sources`
2. Cliquer sur l'icône de rafraîchissement pour une source spécifique
3. OU cliquer "Vérifier les Sources" sur le dashboard

**Option 2 - Automatique avec CRON:**

Configurer un CRON job (externe ou via Supabase) pour appeler:
```bash
curl -X POST https://your-project.supabase.co/functions/v1/check-sources \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json"
```

Recommandation: Toutes les 30 minutes

### Étape 4: Générer des Articles

**Option 1 - Manuel:**
1. Aller sur `/admin/content-queue`
2. Voir les nouveaux articles détectés avec leur score de pertinence
3. Cliquer "Aperçu" pour voir le contenu source
4. Cliquer "Générer" pour créer l'article
5. L'article est créé en mode "draft" dans blog_posts

**Option 2 - Auto-Post:**
1. Aller sur `/admin/settings`
2. Activer "Publication automatique"
3. Configurer:
   - **Score minimum**: 0.85 recommandé
   - **Max par jour**: 2-3 articles
   - **Auteur par défaut**: Sélectionner un auteur
   - **Email notification**: Votre email
4. Configurer un CRON pour appeler `/functions/v1/auto-post-scheduler` toutes les 5-10 minutes

### Étape 5: Réviser et Publier

1. Les articles générés sont en statut "draft"
2. Aller sur votre interface d'édition de blog_posts
3. Réviser le contenu généré
4. Modifier si nécessaire
5. Publier l'article

## Workflow Recommandé

### Mode Manuel (Contrôle Total)
```
Sources RSS/Web
     ↓ (CRON: toutes les 30 min)
Détection d'articles
     ↓
Queue avec scores de pertinence
     ↓ (Action manuelle admin)
Génération article
     ↓ (Révision humaine)
Publication
```

### Mode Semi-Auto (Équilibré)
```
Sources RSS/Web
     ↓ (CRON: toutes les 30 min)
Détection d'articles
     ↓
Score de pertinence automatique
     ↓
Queue pour révision humaine
     ↓ (Clic sur "Générer")
Article créé en draft
     ↓ (Révision rapide)
Publication
```

### Mode Full-Auto (Maximum d'Automatisation)
```
Sources RSS/Web
     ↓ (CRON: toutes les 30 min)
Détection d'articles
     ↓
Score de pertinence automatique
     ↓ (CRON: toutes les 5 min)
Auto-génération si score > 0.85
     ↓ (Notification email)
Publication automatique
     ↓ (Édition a posteriori si besoin)
Article en ligne
```

## Coûts Estimés

### GPT-4o-mini (Recommandé)
- Coût par article: ~0.09€
- 30 articles/mois: ~2.70€
- 100 articles/mois: ~9.00€

### GPT-4o (Premium)
- Coût par article: ~0.25€
- 30 articles/mois: ~7.50€
- 100 articles/mois: ~25.00€

*Les coûts réels peuvent varier selon la longueur des articles sources et générés*

## Sécurité et Prévention du Plagiat

### Mesures Implémentées

1. **Réécriture Complète**
   - Prompt OpenAI insiste sur la réécriture totale
   - Ajout de contexte belge spécifique
   - Angle différent de la source

2. **Vérification d'Originalité**
   - Peut être ajoutée dans `generate-article`
   - Compare la similarité avec l'original
   - Rejette si >25% de similarité

3. **Attribution des Sources**
   - Lien vers l'article original conservé
   - Source mentionnée dans les logs

4. **Audit Trail**
   - Tous les logs dans `ai_generation_logs`
   - Traçabilité complète de la génération

## Sources Belges Recommandées

### Priorité Haute (Auto-Post)
- **Safeonweb.be** - Alertes phishing officielles
- **CERT.be** - Vulnérabilités et alertes techniques
- **CCB** - Centre Cybersécurité Belgique

### Priorité Moyenne
- **Data News** - Actualités tech belges
- **Test-Achats** - Protection consommateurs
- **Police Fédérale** - Cybercriminalité

### Priorité Basse (Contexte Global)
- **BleepingComputer** - Nouvelles internationales
- **Krebs on Security** - Analyses approfondies
- **The Hacker News** - Tendances mondiales

## Résolution de Problèmes

### "Aucun article détecté"
- Vérifier que les sources sont actives
- Tester l'URL RSS dans un lecteur RSS
- Vérifier les logs de `check-sources`

### "Erreur OpenAI API"
- Vérifier la clé API dans Settings
- Vérifier le crédit disponible sur OpenAI
- Tester la connexion

### "Score de pertinence trop bas"
- Normal pour sources internationales
- Ajuster les mots-clés de filtrage
- Privilégier les sources belges

### "Articles générés de mauvaise qualité"
- Passer à GPT-4o (au lieu de mini)
- Vérifier que le contenu source est complet
- Ajuster le prompt dans `generate-article`

## Configuration CRON Recommandée

Si vous utilisez un service CRON externe (comme cron-job.org):

```
# Vérification des sources - Toutes les 30 minutes
*/30 * * * * curl -X POST https://[project].supabase.co/functions/v1/check-sources -H "Authorization: Bearer [KEY]"

# Auto-post scheduler - Toutes les 5 minutes (si auto-post activé)
*/5 * * * * curl -X POST https://[project].supabase.co/functions/v1/auto-post-scheduler -H "Authorization: Bearer [KEY]"
```

## Améliorations Futures

### Phase 2
- [ ] Planification de publication (date/heure spécifiques)
- [ ] Intégration avec réseaux sociaux
- [ ] Génération d'images avec DALL-E
- [ ] Traduction automatique FR/NL
- [ ] A/B testing des titres

### Phase 3
- [ ] Analyse de performance des articles
- [ ] Optimisation SEO automatique
- [ ] Détection de tendances
- [ ] Suggestions de sujets
- [ ] Newsletter automatique

## Support

Pour toute question ou problème:
1. Vérifier les logs dans `ai_generation_logs`
2. Tester la configuration dans Settings
3. Consulter la documentation OpenAI
4. Vérifier les Edge Function logs dans Supabase

---

**Note Importante**: Ce système génère du contenu assisté par IA. Une révision humaine est toujours recommandée avant publication pour garantir l'exactitude et la qualité.

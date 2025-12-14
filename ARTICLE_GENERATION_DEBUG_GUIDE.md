# Article Generation Debug Guide

> **Note:** If you're experiencing RSS fetching issues or database errors, see [ARTICLE_GENERATION_FIX.md](./ARTICLE_GENERATION_FIX.md) for comprehensive troubleshooting.

## What Was Fixed

The schedule page now has better debugging and a reset function to handle items that were already processed.

## New Features

### 1. Two Execution Buttons

**▶️ Exécuter** - Normal execution
- Fetches new RSS items
- Generates articles from items with status = 'new'
- Respects your relevance threshold

**🔄 Réinitialiser & Exécuter** - Reset and execute
- Resets failed/processing/ignored items back to 'new'
- Then runs the normal generation process
- Use this when you want to regenerate articles

### 2. Console Logging

Open your browser DevTools (F12) → Console tab to see:

```
✅ Fetching: https://api.rss2json.com/v1/api.json?rss_url=...
✅ RSS response: ok 10 items
✅ New item: Article title... Score: 0.65
✅ Looking for items with relevance >= 0.7 max: 3
✅ Found items: 2
```

This helps you understand:
- How many RSS items are being fetched
- What relevance scores they have
- Why items aren't being selected

### 3. Improved Relevance Scoring

**Belgian Keywords** (each adds +0.1):
- belgique, belge, bruxelles, wallonie
- belfius, kbc, ing, bpost, itsme, proximus

**Security Keywords** (each adds +0.05):
- phishing, arnaque, fraude, sécurité
- piratage, virus, malware, hacker, faille, attaque

Base score starts at 0.5, maximum is 0.95

### 4. Better Toast Notifications

You'll see step-by-step progress:
- 🚀 Génération en cours...
- Items réinitialisés (if using reset)
- 5 nouveaux éléments détectés
- Génération: Article title...
- ✅ Publié: Article title...
- 🎉 3 article(s) généré(s)!

## Testing the System

### Step 1: Check Current Items

Run this SQL in Supabase SQL Editor:

```sql
SELECT title, status, relevance_score
FROM source_items
ORDER BY created_at DESC
LIMIT 10;
```

### Step 2: Reset Items (If Needed)

If all items are 'published' or 'failed', run:

```sql
UPDATE source_items
SET status = 'new'
WHERE status IN ('failed', 'processing', 'published', 'ignored');
```

Or use the **🔄 Réinitialiser & Exécuter** button.

### Step 3: Adjust Settings

If you see "Aucun article à générer":

1. **Lower the relevance threshold** - Try 40-50% instead of 70%
2. **Check console logs** - See what scores items are getting
3. **Use reset button** - Click "Réinitialiser & Exécuter"

### Step 4: Run Generation

1. Open DevTools Console (F12)
2. Click **▶️ Exécuter** or **🔄 Réinitialiser & Exécuter**
3. Watch the console logs
4. Watch the toast notifications

## Common Issues

### "Aucun article à générer"

**Causes:**
- All items are already processed (status != 'new')
- Relevance scores below your threshold
- No RSS items being fetched

**Solutions:**
- Click **🔄 Réinitialiser & Exécuter**
- Lower the relevance slider to 40-50%
- Check console to see what scores items are getting
- Verify RSS sources are active in Source Manager

### "Configurez votre clé OpenAI"

**Solution:**
- Go to Settings page
- Add your OpenAI API key
- Make sure it starts with `sk-`

### Articles Generated but Not Visible

**Check:**
- Auto-publish setting (Settings page)
- If auto-publish is OFF, articles are created as drafts
- Go to Blog page to see published articles

### RSS Feeds Not Working

**Solutions:**
- RSS2JSON API has a limit (check console for errors)
- Verify RSS URLs in Source Manager
- Check last_checked_at timestamp on sources

## Monitoring

### Check Execution History

```sql
SELECT
  last_executed_at,
  schedule_enabled,
  schedule_max_articles,
  schedule_min_relevance
FROM ai_settings;
```

### Check Article Generation Stats

```sql
SELECT
  COUNT(*) as total_posts,
  COUNT(CASE WHEN status = 'published' THEN 1 END) as published,
  COUNT(CASE WHEN status = 'draft' THEN 1 END) as drafts,
  MAX(published_at) as last_published
FROM blog_posts;
```

### Check Source Item Status

```sql
SELECT
  status,
  COUNT(*) as count,
  AVG(relevance_score) as avg_score
FROM source_items
GROUP BY status
ORDER BY count DESC;
```

## Tips

1. **Start with low threshold** - Set relevance to 40-50% initially
2. **Generate a few articles first** - Test with max_articles = 2
3. **Check console logs** - They show exactly what's happening
4. **Use reset button liberally** - It's safe to regenerate
5. **Monitor OpenAI costs** - Each article costs ~$0.01-0.02 with gpt-4o-mini

## Need More Help?

Check the console logs (F12) - they show detailed information about:
- RSS fetching
- Relevance scoring
- Item selection
- OpenAI calls
- Database operations

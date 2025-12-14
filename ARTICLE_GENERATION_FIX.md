# Article Generation Fix - Complete Guide

## Issues Fixed

### 1. Database Constraint Violations
**Problem:** `source_items` and `blog_posts` tables had NOT NULL constraints causing insert failures.

**Solution:** Migration applied to make optional columns nullable and add default values.

### 2. RSS Fetching Failures
**Problem:** RSS2JSON API was unreliable with 500 errors.

**Solution:** Created robust RSS fetcher with multiple fallback proxies:
- AllOrigins proxy
- CORSProxy
- RSS2JSON API
- Direct XML parsing for RSS and Atom feeds

### 3. Ad Blocker Blocking Requests
**Problem:** Browser ad blockers causing `ERR_BLOCKED_BY_CLIENT` errors.

**Solution:** Multiple proxy fallbacks help, but you may need to disable ad blocker.

## How to Use

### Step 1: Disable Ad Blocker (Important!)

The `ERR_BLOCKED_BY_CLIENT` errors are from your ad blocker. You need to:

1. **Temporarily disable ad blocker** for your site, OR
2. **Whitelist your domain** in ad blocker settings, OR
3. **Whitelist these API domains:**
   - `api.allorigins.win`
   - `corsproxy.io`
   - `api.rss2json.com`
   - `api.openai.com`

### Step 2: Check Database

The migration has been applied automatically. Your tables now have:
- Nullable optional columns
- Default values for common fields
- Better error tolerance

### Step 3: Test RSS Fetching

1. Go to Admin → Schedule
2. Open DevTools (F12) → Console tab
3. Click **▶️ Exécuter** or **🔄 Réinitialiser & Exécuter**
4. Watch console logs:

```
✅ Processing source: SafeOnWeb RSS https://safeonweb.be/...
✅ Trying proxy: https://api.allorigins.win/raw?url=...
✅ Fetched 15 items from RSS
✅ Got 15 items from SafeOnWeb RSS
✅ New item: Phishing campagne visant... Score: 0.75
✅ 5 nouveaux éléments détectés
```

### Step 4: Generate Articles

The system now has smarter error messages:

**If no items to generate:**
- "Tous les articles sont déjà publiés. Cliquez Réinitialiser & Exécuter"
- "3 articles en échec. Cliquez Réinitialiser & Exécuter"
- "Essayez de baisser la pertinence minimum"

**During generation:**
- "Génération: Article title..."
- "✅ Publié: Article title..."
- "❌ Échec: Article title... - error message"

**Final summary:**
- "🎉 3/3 article(s) généré(s)!"
- "❌ Échec de génération pour 2 article(s)"

## New Features

### 1. Multiple RSS Feed Parsers

The new `rssFetcher.ts` utility handles:
- RSS 2.0 feeds
- Atom feeds
- CDATA sections
- Missing fields gracefully
- Multiple proxy fallbacks

### 2. Better Error Handling

Every step now has proper error handling:
- RSS fetch errors → logged, skipped, continued
- OpenAI API errors → captured with specific messages
- Database errors → reported with context
- JSON parse errors → fallback to raw content

### 3. Smarter Status Detection

When no articles can be generated, system checks:
- How many items in each status
- Provides specific guidance based on status
- Suggests exact action to take

### 4. Improved Logging

Console logs show:
- Which RSS proxy is being tried
- How many items fetched
- Relevance score for each item
- Why items are/aren't selected
- Status counts when no items found

## Troubleshooting

### "ERR_BLOCKED_BY_CLIENT" in Console

**Cause:** Ad blocker blocking API requests

**Solution:**
1. Disable ad blocker for your site
2. Or whitelist the API domains listed above
3. Check console - you'll see "Trying proxy:" logs switching between proxies

### "All proxies failed"

**Causes:**
- Ad blocker (most common)
- Network issues
- RSS feed URL is invalid
- RSS feed is down

**Solutions:**
1. Disable ad blocker first
2. Check RSS URL in Source Manager
3. Try URL in browser directly
4. Check if feed is accessible

### "Aucun article à générer"

The system now tells you exactly why:

**"Tous les articles sont déjà publiés"**
- Click **🔄 Réinitialiser & Exécuter**

**"3 articles en échec"**
- Click **🔄 Réinitialiser & Exécuter**
- Check console for error details

**"Essayez de baisser la pertinence"**
- Lower relevance slider to 40-50%
- Check console to see item scores

### OpenAI Errors

**"OpenAI API error: 401"**
- Invalid API key
- Check Settings page

**"OpenAI API error: 429"**
- Rate limit exceeded
- Wait a few minutes
- Or reduce max_articles

**"OpenAI API error: 500"**
- OpenAI service issue
- Try again later

### Database Errors

If you still get database errors after the migration:

```sql
-- Double-check constraints are removed
SELECT
  table_name,
  column_name,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name IN ('source_items', 'blog_posts')
  AND is_nullable = 'NO'
ORDER BY table_name, ordinal_position;
```

## Testing Checklist

- [ ] Ad blocker disabled or whitelisted
- [ ] Console shows "Trying proxy" messages
- [ ] Console shows "Fetched X items from RSS"
- [ ] Console shows relevance scores
- [ ] New items appear in database
- [ ] Items can be generated
- [ ] Articles appear on blog page
- [ ] No constraint violation errors

## Console Logs Reference

**Good Signs:**
```
✅ Processing source: SafeOnWeb RSS
✅ Trying proxy: https://api.allorigins.win...
✅ Fetched 10 items from RSS
✅ Got 10 items from SafeOnWeb RSS
✅ New item: Phishing... Score: 0.75
✅ 3 nouveaux éléments détectés
✅ Found items: 3
```

**Warning Signs:**
```
⚠️ Proxy failed: TypeError: Failed to fetch
⚠️ All proxies failed for: https://...
⚠️ No items fetched from: SafeOnWeb RSS
⚠️ Found items: 0
```

**Error Signs:**
```
❌ ERR_BLOCKED_BY_CLIENT
❌ RSS error for SafeOnWeb RSS
❌ Insert error: null value in column
❌ OpenAI error: Invalid API key
```

## SQL Queries for Debugging

### Check source items status
```sql
SELECT
  status,
  COUNT(*) as count,
  AVG(relevance_score) as avg_score
FROM source_items
GROUP BY status;
```

### Check recent items
```sql
SELECT
  title,
  status,
  relevance_score,
  detected_at
FROM source_items
ORDER BY detected_at DESC
LIMIT 20;
```

### Reset items for testing
```sql
UPDATE source_items
SET status = 'new'
WHERE status IN ('failed', 'processing', 'published', 'ignored');
```

### Check table constraints
```sql
SELECT
  column_name,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'source_items';
```

## Success Criteria

You'll know it's working when you see:

1. **In Console:**
   - Multiple proxy attempts
   - "Fetched X items from RSS"
   - "New item: ... Score: 0.XX"
   - "Found items: X"

2. **In UI:**
   - "X nouveaux éléments détectés"
   - "Génération: Article title..."
   - "✅ Publié: Article title..."
   - "🎉 X/X article(s) généré(s)!"

3. **In Database:**
   - New rows in `source_items` with status = 'new'
   - New rows in `blog_posts` with status = 'published'
   - `last_checked_at` updated on `content_sources`

## Still Having Issues?

If problems persist after:
- Disabling ad blocker
- Checking console logs
- Running SQL queries

Then check:
1. Network tab in DevTools for actual request/response
2. Supabase logs for server-side errors
3. OpenAI API status page
4. RSS feed validity (try in RSS reader)

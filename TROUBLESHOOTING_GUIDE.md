# Article Generation Troubleshooting Guide

## Quick Diagnostic Tool

A new **Diagnostics** page has been added to help identify issues with article generation.

### How to Access

1. Go to **Admin Dashboard** (`/admin`)
2. Click **🔍 Diagnostics** button
3. Click **▶️ Lancer les diagnostics**

The tool will test:
- ✅ Database connection
- ✅ AI Settings (OpenAI API key)
- ✅ Content sources configuration
- ✅ RSS feed fetching
- ✅ Source items in queue
- ✅ OpenAI API connection
- ✅ Article generation

## Common Issues & Solutions

### 1. RSS Fetching Fails (ERR_BLOCKED_BY_CLIENT)

**Symptoms:**
- No new items detected when running generation
- Console shows `ERR_BLOCKED_BY_CLIENT` errors
- Diagnostic shows RSS fetch errors

**Solution:**
Your ad blocker is blocking the RSS proxy requests. You must:

1. **Disable ad blocker** for your site domain
2. Or **whitelist these domains**:
   - `api.allorigins.win`
   - `corsproxy.io`
   - `api.rss2json.com`
   - `api.openai.com`

### 2. No Items to Generate

**Symptoms:**
- Message: "Aucun article à générer"
- Status shows: "All items published"

**Solution:**
1. Click **🔄 Réinitialiser & Exécuter** button in Schedule page
2. This resets failed/processing items to "new" status
3. Then generates articles from them

### 3. OpenAI API Key Issues

**Symptoms:**
- "Configurez votre clé OpenAI dans Paramètres"
- OpenAI diagnostic fails

**Solution:**
1. Go to **Admin → Settings**
2. Enter your OpenAI API key (from https://platform.openai.com/api-keys)
3. Click **Test la connexion** to verify
4. Save settings

### 4. Low Relevance Score

**Symptoms:**
- Items detected but not selected for generation
- Message: "Essayez de baisser la pertinence minimum"

**Solution:**
1. Go to **Admin → Schedule**
2. Lower the **Pertinence minimum** slider (try 50-60%)
3. Save and run again

### 5. Database Constraint Errors

**Symptoms:**
- Errors about NOT NULL constraints
- Insert failures

**Solution:**
Already fixed in migration `20251214132008_fix_source_items_constraints.sql`
Run this SQL in Supabase SQL Editor if still having issues:

```sql
ALTER TABLE source_items
  ALTER COLUMN status SET DEFAULT 'new',
  ALTER COLUMN relevance_score SET DEFAULT 0.5,
  ALTER COLUMN detected_at SET DEFAULT now(),
  ALTER COLUMN original_content SET DEFAULT '',
  ALTER COLUMN summary SET DEFAULT '';
```

## Step-by-Step Testing Process

### Test 1: Check Configuration
```
1. Go to /admin/diagnostics
2. Run diagnostics
3. Verify all steps pass
```

### Test 2: Manual RSS Check
```
1. Open Browser DevTools (F12)
2. Go to Console tab
3. Go to /admin/schedule
4. Click "Exécuter"
5. Watch console logs for:
   - "Processing source: [name]"
   - "Got X items from [name]"
   - "New item: [title]"
```

### Test 3: Force Generation
```
1. Go to /admin/schedule
2. Set "Pertinence minimum" to 50%
3. Set "Articles max" to 1
4. Click "Réinitialiser & Exécuter"
5. Watch for success/error toasts
```

## Current System Status

**Database Check:**
```sql
-- Check source items status
SELECT status, COUNT(*) as count
FROM source_items
GROUP BY status;

-- Check recent items
SELECT title, status, relevance_score, detected_at
FROM source_items
ORDER BY detected_at DESC
LIMIT 10;

-- Check AI settings
SELECT
  openai_api_key IS NOT NULL as has_api_key,
  openai_model,
  schedule_enabled,
  schedule_max_articles,
  schedule_min_relevance
FROM ai_settings
LIMIT 1;
```

**Expected Results:**
- ✅ OpenAI key configured: `has_api_key: true`
- ✅ 2+ items with status "new"
- ✅ Active RSS sources configured

## RSS Feed Testing

Test RSS feeds directly in browser console:

```javascript
// Test fetch to a known RSS feed
fetch('https://www.cert.be/fr/rss.xml')
  .then(r => r.text())
  .then(console.log)
  .catch(console.error);
```

If this fails with ERR_BLOCKED_BY_CLIENT → **Ad blocker issue**

## Manual Article Generation Test

To test OpenAI without the full system:

```javascript
// Run in browser console (replace YOUR_KEY)
fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_OPENAI_KEY'
  },
  body: JSON.stringify({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'Tu es un journaliste.' },
      { role: 'user', content: 'Écris un titre d\'article sur la cybersécurité' }
    ],
    max_tokens: 50
  })
})
.then(r => r.json())
.then(console.log);
```

## Monitoring Logs

### Browser Console Logs

Look for these patterns:

✅ **Success:**
```
Processing source: CERT.be
Got 25 items from CERT.be
New item: [title] Score: 0.85
✅ Publié: [title]...
```

❌ **Errors:**
```
ERR_BLOCKED_BY_CLIENT          → Ad blocker
CORS error                      → Network/proxy issue
OpenAI API error: 401          → Invalid API key
OpenAI API error: 429          → Rate limit/no credit
Database error: NOT NULL       → Schema issue
```

### Toast Messages

The system shows real-time feedback:
- 🚀 **Blue**: Starting process
- ✅ **Green**: Success
- ❌ **Red**: Error
- ℹ️ **Yellow**: Information

## Getting Help

If issues persist:

1. **Run full diagnostics** and share screenshot
2. **Check browser console** for errors
3. **Verify ad blocker is disabled**
4. **Confirm OpenAI key is valid** and has credits
5. **Check Supabase logs** in project dashboard

## Related Documentation

- [AI_CONTENT_SYSTEM_GUIDE.md](./AI_CONTENT_SYSTEM_GUIDE.md) - System overview
- [ARTICLE_GENERATION_DEBUG_GUIDE.md](./ARTICLE_GENERATION_DEBUG_GUIDE.md) - Detailed debugging
- [AD_BLOCKER_WARNING.md](./AD_BLOCKER_WARNING.md) - Ad blocker configuration

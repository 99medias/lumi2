# ⚠️ IMPORTANT: Ad Blocker Configuration

## The Problem

If you see `ERR_BLOCKED_BY_CLIENT` errors in the console, your ad blocker is preventing the article generation system from working.

## Quick Fix

### Option 1: Disable Ad Blocker (Easiest)

**For uBlock Origin:**
1. Click the uBlock icon in your browser
2. Click the power button to disable for this site
3. Reload the page

**For AdBlock Plus:**
1. Click the AdBlock icon
2. Select "Pause on this site"
3. Reload the page

**For other ad blockers:**
- Look for "Disable" or "Pause" option for current site

### Option 2: Whitelist API Domains (Recommended)

Add these domains to your ad blocker's whitelist:

```
api.allorigins.win
corsproxy.io
api.rss2json.com
api.openai.com
```

**For uBlock Origin:**
1. Click uBlock icon → Dashboard
2. Go to "My filters" tab
3. Add these lines:
   ```
   @@||api.allorigins.win^$domain=yourdomain.com
   @@||corsproxy.io^$domain=yourdomain.com
   @@||api.rss2json.com^$domain=yourdomain.com
   @@||api.openai.com^$domain=yourdomain.com
   ```
4. Click "Apply changes"

**For AdBlock Plus:**
1. Click AdBlock icon → Settings
2. Go to "Whitelist" tab
3. Add each domain individually

### Option 3: Use Different Browser (Temporary)

If you need to test quickly:
1. Open the site in an incognito/private window (ad blockers are usually disabled)
2. Or use a different browser without ad blocker installed

## How to Verify It's Working

After disabling/whitelisting:

1. **Open DevTools** (F12) → Console tab
2. **Go to Admin → Schedule**
3. **Click "▶️ Exécuter"**
4. **Look for these logs:**

   ✅ Good (working):
   ```
   Trying proxy: https://api.allorigins.win...
   Fetched 10 items from RSS
   ```

   ❌ Bad (blocked):
   ```
   net::ERR_BLOCKED_BY_CLIENT
   Proxy failed: TypeError: Failed to fetch
   ```

## Why This Happens

Ad blockers detect certain patterns in API requests:
- Keywords like "api", "fetch", "json"
- Common proxy domains
- Third-party API calls

Our RSS fetching system uses these APIs, which triggers the ad blocker.

## Impact on Article Generation

Without access to these APIs:
- ❌ RSS feeds cannot be fetched
- ❌ No new articles can be detected
- ❌ OpenAI API calls may be blocked
- ✅ Database operations still work
- ✅ Manual article creation still works

## Security Note

These APIs are safe and necessary:

- **api.allorigins.win** - CORS proxy for RSS feeds
- **corsproxy.io** - Alternative CORS proxy
- **api.rss2json.com** - RSS to JSON converter
- **api.openai.com** - OpenAI GPT API for content generation

All are legitimate services used for article generation.

## Still Not Working?

If you've disabled ad blocker and still have issues:

1. **Check browser extensions** - Some privacy extensions also block requests
2. **Check network tab** - Look for other blocked requests
3. **Try different network** - Some corporate networks block these domains
4. **Check firewall** - Firewall may be blocking API domains

## Alternative Solutions

If you cannot disable ad blocker:

### 1. Use Backend Proxy (Advanced)

Create a Supabase Edge Function to fetch RSS feeds server-side:
- Server-side requests bypass ad blocker
- More reliable but requires more setup
- See `supabase/functions/` directory

### 2. Import RSS Manually

1. Subscribe to RSS feeds in an RSS reader
2. Copy article URLs
3. Manually create blog posts in Admin

### 3. Use API Keys Only

1. Configure RSS feeds to check less frequently
2. Use OpenAI API through backend only
3. Manually trigger generation when needed

## Need Help?

Check console logs first:
- Press F12
- Go to Console tab
- Look for red errors
- Search for "ERR_BLOCKED_BY_CLIENT"

If you see this error, the ad blocker is the issue.

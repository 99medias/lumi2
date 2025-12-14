# Admin Panel Setup & Testing Guide

## Quick Start

### Step 1: Access Admin Panel
Navigate to `/admin` in your browser to access the admin dashboard.

### Step 2: Configure OpenAI API
1. Go to **Settings** (`/admin/settings`)
2. Get your API key from [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
3. Paste the key and click "Tester" to verify
4. Click "Sauvegarder les paramètres"

### Step 3: Verify Sources
1. Go to **Gérer les Sources** (`/admin/sources`)
2. You should see 6 pre-configured sources:
   - Safeonweb.be (high priority)
   - CERT.be (high priority)
   - CCB News (high priority)
   - Data News Belgium (medium)
   - BleepingComputer (low)
   - Krebs on Security (low)
3. Click the refresh icon to manually check a source

### Step 4: Generate First Article
1. Click "Vérifier les Sources" on the dashboard
2. Go to **File d'Attente** (`/admin/content-queue`)
3. View detected articles and their relevance scores
4. Click "Générer" on any article
5. Article will be created in blog_posts as draft

## Admin Routes

All admin pages are accessible at:
- `/admin` - Dashboard with stats
- `/admin/settings` - OpenAI configuration
- `/admin/sources` - Source management
- `/admin/content-queue` - Content review queue

## Troubleshooting

### "Settings page shows loading forever"
**Cause**: No default settings row in database
**Fix**: Navigate to `/admin/settings` - the page will auto-create settings on first load

### "No sources showing"
**Cause**: Migration didn't run or data wasn't seeded
**Check**:
```sql
SELECT * FROM content_sources;
```
If empty, the migration needs to be re-run.

### "Buttons don't navigate"
**Check**:
1. Verify routes are configured in `AppRouter.tsx`
2. Check browser console for errors
3. Ensure React Router is properly installed

### "OpenAI test fails"
**Possible causes**:
1. Invalid API key
2. No credits on OpenAI account
3. Network/CORS issues

**Check**:
- Verify key starts with `sk-`
- Check OpenAI dashboard for usage limits
- Check browser console for CORS errors

### "Source check doesn't find articles"
**Possible causes**:
1. RSS feed is down
2. Invalid RSS URL
3. Rate limiting

**Check**:
- Test RSS URL in a feed reader
- Check Edge Function logs in Supabase
- Verify the URL is correct

### "Generated articles have wrong data"
**Possible causes**:
1. Source content is incomplete
2. RSS parsing issue
3. OpenAI prompt needs adjustment

**Fix**: Edit the `generate-article` Edge Function to adjust the prompt

## Database Tables

### `content_sources`
Stores RSS feeds and websites to monitor
- `is_active`: Toggle to enable/disable
- `priority`: high/medium/low (affects auto-post)
- `last_checked_at`: Timestamp of last check

### `source_items`
Detected articles from sources
- `status`: new/processing/published/ignored/failed
- `relevance_score`: 0-1 score from AI
- `generated_post_id`: Link to created blog post

### `ai_settings`
Configuration for OpenAI and auto-post
- `openai_api_key`: Your OpenAI key
- `openai_model`: gpt-4o or gpt-4o-mini
- `auto_post_enabled`: Enable automatic publishing
- `auto_post_min_relevance`: Minimum score for auto-post

### `ai_generation_logs`
Audit trail of all AI operations
- `operation_type`: relevance_check, article_generation, etc.
- `total_tokens`: Token usage
- `estimated_cost_usd`: Cost in USD

## Testing the Complete Flow

### Manual Test (Recommended for First Time)

1. **Check Sources**
   ```
   Dashboard → Click "Vérifier les Sources"
   Wait 10-30 seconds
   ```

2. **Verify Detection**
   ```
   Go to Content Queue
   You should see articles with "NEW" status
   Check relevance scores (0-1)
   ```

3. **Generate Article**
   ```
   Click "Générer" on a high-relevance item
   Wait 10-30 seconds for generation
   Status changes to "PUBLISHED"
   ```

4. **View Generated Article**
   ```
   Dashboard → "Articles Récemment Générés"
   Click "Voir l'article" to view on blog
   ```

### Automated Test (CRON Setup)

**Option 1: External CRON (cron-job.org, etc.)**
```bash
# Check sources every 30 minutes
*/30 * * * * curl -X POST https://[project].supabase.co/functions/v1/check-sources \
  -H "Authorization: Bearer [ANON_KEY]" \
  -H "Content-Type: application/json"

# Auto-post every 5 minutes (if enabled)
*/5 * * * * curl -X POST https://[project].supabase.co/functions/v1/auto-post-scheduler \
  -H "Authorization: Bearer [ANON_KEY]" \
  -H "Content-Type: application/json"
```

**Option 2: Supabase Scheduled Functions**
Configure in Supabase Dashboard under Edge Functions → Scheduled Functions

## Cost Monitoring

View in Dashboard → "Utilisation API ce mois":
- Articles generated
- Total tokens used
- Estimated cost
- Average cost per article

**Typical costs**:
- GPT-4o-mini: ~$0.09 per article
- GPT-4o: ~$0.25 per article

## Security Notes

1. **API Key Storage**: Keys are stored in `ai_settings` table with RLS enabled
2. **Admin Access**: Currently allows all authenticated users - restrict to admin role in production
3. **Edge Functions**: Use service role key internally for database operations

## Auto-Post Configuration

Enable in Settings page:

**Recommended settings**:
- Min relevance score: 0.85 (85%)
- Max per day: 2-3 articles
- Only high-priority sources
- Enable email notifications

**Safety features**:
- Only publishes high-relevance articles
- Respects daily limit
- Sends notifications on publish
- Can edit articles after auto-publish

## Support Checklist

Before asking for help, verify:
- [ ] OpenAI API key is valid and has credits
- [ ] Sources are active in Source Manager
- [ ] Edge Functions are deployed (check Supabase dashboard)
- [ ] Database tables exist (check migrations)
- [ ] Browser console shows no errors
- [ ] Network tab shows successful API calls

## Common Queries for Debugging

```sql
-- Check if sources are seeded
SELECT name, is_active, last_checked_at FROM content_sources;

-- Check detected items
SELECT title, status, relevance_score FROM source_items ORDER BY detected_at DESC LIMIT 10;

-- Check AI usage
SELECT operation_type, model_used, total_tokens, estimated_cost_usd
FROM ai_generation_logs
ORDER BY created_at DESC LIMIT 10;

-- Check settings
SELECT openai_model, auto_post_enabled, auto_post_min_relevance FROM ai_settings;
```

## Next Steps

After successful setup:
1. Configure CRON jobs for automation
2. Fine-tune relevance scoring if needed
3. Add more Belgian sources
4. Enable auto-post mode
5. Monitor costs and adjust model if needed
6. Review and publish generated articles

-- Reset Items for Testing
-- Run this in the Supabase SQL Editor to reset items back to 'new' status

-- Reset all source items to 'new' status for testing
UPDATE source_items
SET status = 'new'
WHERE status IN ('failed', 'processing', 'published', 'ignored');

-- Check what items exist and their scores
SELECT
  title,
  status,
  relevance_score,
  created_at
FROM source_items
ORDER BY created_at DESC
LIMIT 20;

-- Check source statistics
SELECT
  cs.name as source_name,
  cs.type,
  cs.is_active,
  cs.last_checked_at,
  COUNT(si.id) as total_items,
  COUNT(CASE WHEN si.status = 'new' THEN 1 END) as new_items,
  COUNT(CASE WHEN si.status = 'published' THEN 1 END) as published_items,
  AVG(si.relevance_score) as avg_relevance
FROM content_sources cs
LEFT JOIN source_items si ON cs.id = si.source_id
GROUP BY cs.id, cs.name, cs.type, cs.is_active, cs.last_checked_at
ORDER BY cs.name;

# Simplified Blog Generation System - Setup Instructions

## ✅ What Has Been Implemented

The simplified blog generation system is now ready to use! Here's what was created:

### 1. Database Reset Script
- **File**: `REBUILD_BLOG_SYSTEM.sql`
- Contains SQL to drop and recreate all blog tables
- Includes 3 Belgian authors with avatars
- Includes 24 RSS sources (Belgian official sources + international security news)
- Includes 6 ready-to-publish sample articles
- Disables RLS for simplified access

### 2. New Admin Page
- **File**: `src/pages/admin/Generate.tsx`
- **Route**: `/admin/generate`
- Simple 2-button interface for checking sources and generating articles
- Real-time stats dashboard showing published posts, active sources, and pending items
- Configuration controls for max articles and minimum relevance threshold
- Pending items list with color-coded relevance scores

### 3. Integration
- Added route in `AppRouter.tsx`
- Added prominent "🚀 Générer des Articles" button in admin dashboard
- Uses existing Toast component for user feedback
- Integrated with existing Supabase configuration

## 🚀 How to Use

### Step 1: Reset Your Database

1. Open your Supabase SQL Editor at: https://supabase.com/dashboard/project/YOUR_PROJECT/sql
2. Copy the entire contents of `REBUILD_BLOG_SYSTEM.sql`
3. Paste it into the SQL Editor
4. Click "Run" to execute

This will:
- Clean up existing blog tables
- Create fresh tables with proper structure
- Insert 3 authors (Marc Dupont, Sophie Janssens, Thomas Vermeersch)
- Insert 24 RSS sources from Belgian and international security sites
- Insert 6 sample articles that are immediately visible on your blog

### Step 2: Set Up OpenAI API Key

Add your OpenAI API key to your `.env` file:

```env
VITE_OPENAI_API_KEY=sk-your-openai-api-key-here
```

The system will use this key to generate articles via OpenAI's API.

### Step 3: Access the Generation Page

1. Navigate to `/admin` in your application
2. Click the "🚀 Générer des Articles" button
3. You'll see the generation interface with:
   - Stats showing your 6 published articles, 24 active sources, and pending items
   - Settings to control max articles and relevance threshold
   - Two action buttons

### Step 4: Generate Your First Articles

**Method 1: Check Sources First**
1. Click "🔍 1. Vérifier les sources" to fetch new items from RSS feeds
2. Wait for the check to complete (you'll see a toast notification)
3. Review the pending items list that appears
4. Click "🤖 2. Générer les articles" to create articles from high-relevance items

**Method 2: Direct Generation**
- If you already have pending items from a previous check, you can directly click "🤖 2. Générer les articles"

## 📊 How It Works

### Source Checking Process
1. Fetches RSS feeds from all 24 active sources
2. Parses XML to extract article titles, links, and descriptions
3. Calculates Belgian relevance score based on keywords:
   - +10% per Belgian keyword (belgique, belge, bruxelles, belfius, kbc, ing, bpost, itsme, etc.)
   - +5% per security keyword (phishing, arnaque, fraude, sécurité, piratage, virus, etc.)
4. Stores new items in `source_items` table with deduplication

### Article Generation Process
1. Selects top items based on your relevance threshold and max articles limit
2. Sends structured prompt to OpenAI requesting Belgian-focused cybersecurity content
3. Parses JSON response with title, excerpt, content, category, and tags
4. Creates unique slug with timestamp
5. Assigns random author from available authors
6. Publishes article with random view count (50-550) for social proof
7. Links generated post back to source item for tracking

### Belgian Relevance Scoring
The system prioritizes content relevant to Belgian users:
- **High Priority**: Safeonweb.be, CERT.be, CCB, SPF Économie, Test-Achats, Febelfin (official sources)
- **Medium Priority**: RTBF, Le Soir, La Libre, L'Echo, Data News (Belgian news outlets)
- **Low Priority**: International security blogs for broader coverage

Articles mentioning Belgian institutions, banks, or services get higher relevance scores.

## 🎯 Configuration Options

### Max Articles to Generate
- Range: 1-10
- Default: 3
- Controls how many articles to generate per run

### Minimum Relevance
- Range: 20%-80%
- Default: 40%
- Lower = more articles but less Belgian-focused
- Higher = fewer articles but highly relevant to Belgian audience

## 📝 Generated Article Format

Each article includes:
- Title optimized for Belgian audience
- Excerpt (summary)
- HTML content (500-700 words)
- Category (alerte, guide, arnaque, actualite)
- Tags for organization
- Author attribution
- View count for social proof
- Published timestamp

Articles automatically mention Belgian resources like Safeonweb.be, CCB, and local banks when appropriate.

## 🔗 Navigation

From the generation page, you can quickly access:
- **📡 Sources**: Manage your 24 RSS sources
- **📋 File d'attente**: View all pending items in detail
- **📰 Voir le blog**: See your published articles

## 🎨 Sample Articles Included

Your blog now has 6 ready-to-read articles:
1. "Nouvelle vague de phishing itsme en Belgique" (Alert)
2. "Sécuriser votre banque en ligne : Guide complet" (Guide)
3. "Arnaque bpost : Ces faux colis qui vident votre compte" (Scam Alert)
4. "VPN en Belgique : Protégez votre connexion" (Guide)
5. "Faux support Microsoft : L'arnaque qui cible les seniors" (Scam Alert)
6. "Mots de passe sécurisés : Guide pratique" (Guide)

These demonstrate the content style and are immediately visible on your blog at `/blog`.

## 🛠️ Technical Details

### Files Created/Modified
- ✅ `REBUILD_BLOG_SYSTEM.sql` - Database reset script
- ✅ `src/pages/admin/Generate.tsx` - Generation page component
- ✅ `src/AppRouter.tsx` - Added route for /admin/generate
- ✅ `src/pages/admin/Dashboard.tsx` - Added generation button

### Dependencies
- Uses existing Supabase client
- Uses existing Toast component
- Uses OpenAI API (requires VITE_OPENAI_API_KEY)
- Uses AllOrigins proxy for RSS fetching (bypasses CORS)

### Database Tables
- `blog_authors` - Author profiles
- `blog_posts` - Published articles
- `content_sources` - RSS feed sources
- `source_items` - Detected articles from sources
- `ai_generation_logs` - Tracking (for future use)

## 🎉 Next Steps

1. Run the SQL script to reset your database
2. Add your OpenAI API key to `.env`
3. Visit `/admin/generate` and start creating content
4. Check your blog at `/blog` to see the articles
5. Adjust relevance threshold and max articles to find your sweet spot

Your blog is now ready to generate high-quality, Belgian-focused cybersecurity content automatically!

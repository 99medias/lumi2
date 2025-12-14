import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  const startTime = Date.now();

  try {
    const body = await req.json().catch(() => ({}));
    const triggeredBy = body.triggered_by || 'manual';

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get settings
    const { data: settings, error: settingsError } = await supabase
      .from('ai_settings')
      .select('*')
      .eq('id', 'default')
      .single();

    if (settingsError || !settings) {
      return new Response(
        JSON.stringify({ success: false, error: 'Paramètres non trouvés' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!settings.openai_api_key) {
      return new Response(
        JSON.stringify({ success: false, error: 'Clé OpenAI non configurée' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // STEP 1: Check all active sources and fetch new items
    const { data: sources } = await supabase
      .from('content_sources')
      .select('*')
      .eq('is_active', true);

    let newItemsDetected = 0;

    if (sources && sources.length > 0) {
      for (const source of sources) {
        if (source.type === 'rss') {
          try {
            const rssResponse = await fetch(source.url);
            const rssText = await rssResponse.text();

            const items = [];
            const itemMatches = rssText.matchAll(/<item>([\s\S]*?)<\/item>/g);

            for (const match of itemMatches) {
              const itemXml = match[1];
              const title = itemXml.match(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/)?.[1] || '';
              const link = itemXml.match(/<link>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/link>/)?.[1] || '';
              const description = itemXml.match(/<description>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/description>/s)?.[1] || '';

              if (title && link) {
                items.push({
                  title: title.replace(/<[^>]*>/g, '').trim(),
                  link: link.trim(),
                  description: description.replace(/<[^>]*>/g, '').substring(0, 1000).trim()
                });
              }
            }

            for (const item of items.slice(0, 10)) {
              const { data: existing } = await supabase
                .from('source_items')
                .select('id')
                .eq('original_url', item.link)
                .maybeSingle();

              if (!existing) {
                const content = (item.title + ' ' + item.description).toLowerCase();
                let score = 0.5;

                const belgianKeywords = ['belgique', 'belge', 'bruxelles', 'wallonie', 'flandre', 'belfius', 'kbc', 'ing', 'proximus', 'bpost', 'itsme', 'safeonweb'];
                const securityKeywords = ['phishing', 'arnaque', 'fraude', 'sécurité', 'piratage', 'virus', 'malware', 'escroquerie', 'hacker', 'cyberattaque', 'faille', 'vulnérabilité'];

                belgianKeywords.forEach(kw => {
                  if (content.includes(kw)) score += 0.1;
                });
                securityKeywords.forEach(kw => {
                  if (content.includes(kw)) score += 0.05;
                });

                score = Math.min(score, 0.95);

                await supabase.from('source_items').insert({
                  source_id: source.id,
                  title: item.title,
                  original_url: item.link,
                  original_content: item.description,
                  summary: item.description.substring(0, 500),
                  status: 'new',
                  relevance_score: score,
                  detected_at: new Date().toISOString()
                });

                newItemsDetected++;
              }
            }

            await supabase
              .from('content_sources')
              .update({ last_checked_at: new Date().toISOString() })
              .eq('id', source.id);

          } catch (err) {
            console.error(`Error fetching ${source.name}:`, err);
          }
        }
      }
    }

    // STEP 2: Get items to generate
    const minRelevance = settings.schedule_min_relevance || 0.7;
    const maxArticles = settings.schedule_max_articles || 3;

    const { data: items, error: itemsError } = await supabase
      .from('source_items')
      .select('*, content_sources(name, priority)')
      .eq('status', 'new')
      .gte('relevance_score', minRelevance)
      .order('relevance_score', { ascending: false })
      .limit(maxArticles);

    if (itemsError) {
      return new Response(
        JSON.stringify({ success: false, error: itemsError.message }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!items || items.length === 0) {
      const executionTime = Math.round((Date.now() - startTime) / 1000);

      await supabase.from('schedule_logs').insert({
        status: 'success',
        sources_checked: sources?.length || 0,
        items_detected: newItemsDetected,
        articles_generated: 0,
        triggered_by: triggeredBy,
        execution_time: executionTime
      });

      return new Response(
        JSON.stringify({
          success: true,
          sourcesChecked: sources?.length || 0,
          newItemsDetected,
          articlesGenerated: 0,
          message: newItemsDetected > 0
            ? `${newItemsDetected} nouveaux éléments détectés mais pertinence < ${minRelevance * 100}%`
            : 'Aucun nouvel article trouvé dans les sources'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // STEP 3: Generate articles
    let generated = 0;
    const errors: string[] = [];
    const results = [];

    for (const item of items) {
      try {
        const generateUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/generate-article`;
        const genResponse = await fetch(generateUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            source_item_id: item.id
          })
        });

        const result = await genResponse.json();

        if (!genResponse.ok || result.error) {
          errors.push(`${item.title}: ${result.error || 'Erreur de génération'}`);
          continue;
        }

        generated++;
        results.push({
          title: item.title,
          post_id: result.post_id,
          slug: result.slug
        });

      } catch (err: any) {
        errors.push(`${item.title}: ${err.message}`);
      }
    }

    const executionTime = Math.round((Date.now() - startTime) / 1000);

    await supabase.from('schedule_logs').insert({
      status: errors.length === 0 ? 'success' : 'partial',
      sources_checked: sources?.length || 0,
      items_detected: newItemsDetected,
      articles_generated: generated,
      errors: errors.length > 0 ? errors : null,
      triggered_by: triggeredBy,
      execution_time: executionTime
    });

    return new Response(
      JSON.stringify({
        success: true,
        sourcesChecked: sources?.length || 0,
        newItemsDetected,
        articlesGenerated: generated,
        totalItems: items.length,
        results,
        errors: errors.length > 0 ? errors : undefined
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('Scheduled generation error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
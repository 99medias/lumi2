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

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: settings } = await supabase
      .from('ai_settings')
      .select('*')
      .single();

    if (!settings?.auto_post_enabled) {
      return new Response(
        JSON.stringify({ message: 'Auto-post is disabled' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data: todayPosts, error: countError } = await supabase
      .from('source_items')
      .select('id')
      .eq('status', 'published')
      .gte('updated_at', today.toISOString());

    if (countError) throw countError;

    const publishedToday = todayPosts?.length || 0;

    if (publishedToday >= settings.auto_post_max_per_day) {
      return new Response(
        JSON.stringify({ 
          message: 'Daily limit reached', 
          published_today: publishedToday,
          limit: settings.auto_post_max_per_day
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { data: candidates } = await supabase
      .from('source_items')
      .select('*, content_sources(name, priority)')
      .eq('status', 'new')
      .gte('relevance_score', settings.auto_post_min_relevance)
      .in('content_sources.priority', ['high'])
      .order('relevance_score', { ascending: false })
      .limit(settings.auto_post_max_per_day - publishedToday);

    if (!candidates || candidates.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No candidates found for auto-posting' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const results = [];

    for (const item of candidates) {
      try {
        const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/generate-article`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ source_item_id: item.id })
        });

        const result = await response.json();

        if (response.ok) {
          if (settings.notification_email) {
            console.log(`Would send notification to ${settings.notification_email} about new post: ${result.slug}`);
          }
          
          results.push({ 
            item_id: item.id, 
            post_slug: result.slug,
            status: 'published',
            relevance: item.relevance_score
          });
        } else {
          results.push({ 
            item_id: item.id, 
            status: 'failed',
            error: result.error
          });
        }
      } catch (error) {
        results.push({ 
          item_id: item.id, 
          status: 'failed',
          error: error.message
        });
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Auto-post scheduler completed',
        processed: results.length,
        results
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
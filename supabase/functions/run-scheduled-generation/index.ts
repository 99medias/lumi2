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

    // Get pending source items with high relevance
    const { data: items, error: itemsError } = await supabase
      .from('source_items')
      .select('*, content_sources(name, priority)')
      .eq('status', 'new')
      .gte('relevance_score', settings.schedule_min_relevance || 0.7)
      .order('relevance_score', { ascending: false })
      .limit(settings.schedule_max_articles || 3);

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
      return new Response(
        JSON.stringify({ 
          success: true, 
          articlesGenerated: 0,
          message: 'Aucun article à générer' 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    let generated = 0;
    const errors: string[] = [];
    const results = [];

    // Process each item
    for (const item of items) {
      try {
        // Call the generate-article function
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

    // Log the run
    await supabase.from('schedule_logs').insert({
      status: errors.length === 0 ? 'success' : 'partial',
      sources_checked: items.length,
      articles_generated: generated,
      errors: errors.length > 0 ? errors : null
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
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
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface RSSItem {
  title: string;
  link: string;
  description?: string;
  pubDate?: string;
  guid?: string;
}

async function parseRSS(xml: string): Promise<RSSItem[]> {
  const items: RSSItem[] = [];
  
  const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/g;
  let match;
  
  while ((match = itemRegex.exec(xml)) !== null) {
    const itemContent = match[1];
    
    const titleMatch = /<title><!\[CDATA\[([^\]]+)\]\]><\/title>|<title>([^<]+)<\/title>/.exec(itemContent);
    const linkMatch = /<link>([^<]+)<\/link>/.exec(itemContent);
    const descMatch = /<description><!\[CDATA\[([^\]]+)\]\]><\/description>|<description>([^<]+)<\/description>/.exec(itemContent);
    const guidMatch = /<guid[^>]*>([^<]+)<\/guid>/.exec(itemContent);
    const pubDateMatch = /<pubDate>([^<]+)<\/pubDate>/.exec(itemContent);
    
    if (titleMatch && linkMatch) {
      items.push({
        title: (titleMatch[1] || titleMatch[2] || '').trim(),
        link: linkMatch[1].trim(),
        description: (descMatch?.[1] || descMatch?.[2] || '').trim(),
        guid: guidMatch?.[1]?.trim(),
        pubDate: pubDateMatch?.[1]?.trim(),
      });
    }
  }
  
  return items;
}

function generateExternalId(url: string, title: string): string {
  const encoder = new TextEncoder();
  const data = encoder.encode(url + title);
  return Array.from(data).map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 32);
}

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

    const { source_id } = await req.json().catch(() => ({ source_id: null }));

    let sourcesQuery = supabase
      .from('content_sources')
      .select('*')
      .eq('is_active', true);

    if (source_id) {
      sourcesQuery = sourcesQuery.eq('id', source_id);
    }

    const { data: sources, error: sourcesError } = await sourcesQuery;

    if (sourcesError) throw sourcesError;
    if (!sources || sources.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No active sources found' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const results = [];

    for (const source of sources) {
      try {
        if (source.type === 'rss') {
          const response = await fetch(source.url, {
            headers: {
              'User-Agent': 'MaSecurite.be Content Bot/1.0'
            }
          });

          if (!response.ok) continue;

          const xml = await response.text();
          const items = await parseRSS(xml);

          for (const item of items.slice(0, 10)) {
            const externalId = generateExternalId(item.link, item.title);

            const { error: insertError } = await supabase
              .from('source_items')
              .insert({
                source_id: source.id,
                external_id: externalId,
                title: item.title,
                original_url: item.link,
                original_content: item.description || null,
                summary: item.description || null,
                status: 'new'
              })
              .select()
              .single();

            if (!insertError) {
              results.push({ source: source.name, item: item.title, status: 'added' });
            }
          }
        }

        await supabase
          .from('content_sources')
          .update({ last_checked_at: new Date().toISOString() })
          .eq('id', source.id);

      } catch (error) {
        console.error(`Error processing source ${source.name}:`, error);
        results.push({ source: source.name, status: 'error', error: error.message });
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Sources checked successfully',
        processed: sources.length,
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
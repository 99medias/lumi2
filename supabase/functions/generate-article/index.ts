import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

async function calculateRelevance(openaiKey: string, model: string, item: any) {
  const prompt = `Analyze this cybersecurity news item for relevance to Belgian consumers.

Title: ${item.title}
Summary: ${item.summary || item.original_content?.substring(0, 500) || ''}
Source: ${item.content_sources?.name || 'Unknown'}

Score from 0 to 1 based on:
- Direct mention of Belgium, Belgian companies, or Belgian institutions (0.3)
- Affects services used in Belgium: itsme, bpost, Belgian banks, Proximus, etc. (0.3)
- General cybersecurity threat relevant to consumers (0.2)
- Educational value for non-technical audience (0.2)

Respond with JSON only:
{
  "score": 0.85,
  "reason": "Brief explanation in French",
  "suggested_angle": "Focus angle for Belgian audience",
  "category": "alerte|guide|actualite|arnaque"
}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: 'You are a cybersecurity analyst for Belgian consumers. Always respond with valid JSON.' },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3
    })
  });

  if (!response.ok) throw new Error('OpenAI API error');

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

async function generateArticle(openaiKey: string, model: string, item: any, relevance: any) {
  const prompt = `You are a Belgian cybersecurity journalist writing for MaSécurité.be.
Your audience is French-speaking Belgian consumers (not technical experts).

SOURCE MATERIAL:
Title: ${item.title}
Content: ${item.original_content || item.summary || ''}
Original URL: ${item.original_url}

RELEVANCE ANALYSIS:
Score: ${relevance.score}
Suggested Angle: ${relevance.suggested_angle}

WRITING GUIDELINES:
1. Write in Belgian French (use "GSM" not "portable", reference Belgian institutions)
2. COMPLETELY REWRITE - do not copy any sentences from the source
3. Add Belgian context and examples where possible
4. Reference Belgian institutions: Safeonweb.be, CCB, CERT.be, Police Fédérale
5. If about banks, mention: Belfius, KBC, ING, BNP Paribas Fortis
6. If about telecom, mention: Proximus, Orange, Telenet
7. Make it actionable - what should readers DO?
8. Length: 600-900 words
9. Include a "Ce que vous devez faire" section with 3-5 bullet points
10. Tone: Professional but accessible, slightly urgent for alerts

STRUCTURE:
- Compelling headline (max 60 characters)
- Opening paragraph that summarizes the threat/news
- Context section (what is this, why it matters)
- Belgian-specific impact
- "Ce que vous devez faire" action items
- Closing with reassurance or next steps

SEO REQUIREMENTS:
- Meta title (max 60 chars, include "Belgique" if relevant)
- Meta description (max 155 chars, include call-to-action)
- 5 relevant tags
- 3 SEO keywords

OUTPUT FORMAT (JSON):
{
  "title": "...",
  "meta_title": "...",
  "meta_description": "...",
  "excerpt": "...(max 200 chars)...",
  "content": "...(full HTML article with <p>, <h2>, <ul>, <strong> tags)...",
  "category": "${relevance.category}",
  "tags": ["tag1", "tag2", ...],
  "seo_keywords": ["keyword1", "keyword2", "keyword3"],
  "reading_time_minutes": 4
}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: 'You are a professional Belgian cybersecurity journalist. Always respond with valid JSON.' },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7
    })
  });

  if (!response.ok) throw new Error('OpenAI API error');

  const data = await response.json();
  const usage = data.usage;
  
  return {
    article: JSON.parse(data.choices[0].message.content),
    usage
  };
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

    const { source_item_id } = await req.json();

    if (!source_item_id) {
      return new Response(
        JSON.stringify({ error: 'source_item_id required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { data: settings } = await supabase
      .from('ai_settings')
      .select('*')
      .single();

    if (!settings?.openai_api_key) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { data: item } = await supabase
      .from('source_items')
      .select('*, content_sources(name)')
      .eq('id', source_item_id)
      .single();

    if (!item) {
      return new Response(
        JSON.stringify({ error: 'Source item not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    await supabase
      .from('source_items')
      .update({ status: 'processing' })
      .eq('id', source_item_id);

    let relevance = {
      score: item.relevance_score,
      reason: item.relevance_reason,
      suggested_angle: item.suggested_angle,
      category: item.suggested_category
    };

    if (!item.relevance_score) {
      const startTime = Date.now();
      relevance = await calculateRelevance(settings.openai_api_key, settings.openai_model, item);
      const processingTime = Date.now() - startTime;

      await supabase.from('ai_generation_logs').insert({
        source_item_id: item.id,
        operation_type: 'relevance_check',
        model_used: settings.openai_model,
        processing_time_ms: processingTime,
        success: true
      });

      await supabase
        .from('source_items')
        .update({
          relevance_score: relevance.score,
          relevance_reason: relevance.reason,
          suggested_angle: relevance.suggested_angle,
          suggested_category: relevance.category
        })
        .eq('id', source_item_id);
    }

    const startTime = Date.now();
    const { article, usage } = await generateArticle(settings.openai_api_key, settings.openai_model, item, relevance);
    const processingTime = Date.now() - startTime;

    const slug = article.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 60);

    const { data: defaultAuthor } = await supabase
      .from('blog_authors')
      .select('id')
      .limit(1)
      .single();

    const { data: newPost, error: postError } = await supabase
      .from('blog_posts')
      .insert({
        slug,
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        featured_image: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg',
        category: article.category,
        reading_time: article.reading_time_minutes,
        author_id: settings.default_author_id || defaultAuthor?.id,
        status: 'draft',
        published_at: new Date().toISOString()
      })
      .select()
      .single();

    if (postError) throw postError;

    const costPer1kTokens = settings.openai_model === 'gpt-4o' ? 0.0025 : 0.00015;
    const estimatedCost = (usage.total_tokens / 1000) * costPer1kTokens;

    await supabase.from('ai_generation_logs').insert({
      source_item_id: item.id,
      blog_post_id: newPost.id,
      operation_type: 'article_generation',
      model_used: settings.openai_model,
      prompt_tokens: usage.prompt_tokens,
      completion_tokens: usage.completion_tokens,
      total_tokens: usage.total_tokens,
      estimated_cost_usd: estimatedCost,
      processing_time_ms: processingTime,
      success: true
    });

    await supabase
      .from('source_items')
      .update({ 
        status: 'published',
        generated_post_id: newPost.id
      })
      .eq('id', source_item_id);

    return new Response(
      JSON.stringify({ 
        success: true,
        post_id: newPost.id,
        slug: newPost.slug,
        relevance_score: relevance.score,
        tokens_used: usage.total_tokens,
        estimated_cost: estimatedCost
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
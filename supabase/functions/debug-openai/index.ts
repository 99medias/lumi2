import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

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
    const apiKey = Deno.env.get('OPENAI_API_KEY');

    // Detailed diagnostics
    const diagnostics = {
      timestamp: new Date().toISOString(),
      keyExists: !!apiKey,
      keyLength: apiKey ? apiKey.length : 0,
      keyPrefix: apiKey ? apiKey.substring(0, 7) : 'NOT_FOUND',
      keySuffix: apiKey ? apiKey.substring(apiKey.length - 4) : 'NOT_FOUND',
      allEnvKeys: Object.keys(Deno.env.toObject()).filter(k => !k.includes('SUPABASE')),
    };

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          success: false,
          message: '❌ OPENAI_API_KEY not found in environment',
          diagnostics,
          help: 'Add the secret in Supabase Dashboard → Settings → Edge Functions → Secrets'
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Try to call OpenAI API
    console.log('Testing OpenAI API with key:', apiKey.substring(0, 10) + '...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'user', content: 'Say "API key is working!"' }
        ],
        max_tokens: 20
      })
    });

    const responseText = await response.text();

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          success: false,
          message: `❌ OpenAI API Error: ${response.status} ${response.statusText}`,
          diagnostics,
          responseBody: responseText,
          help: 'The key exists but OpenAI rejected it. Check if the key is valid and has credits.'
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const data = JSON.parse(responseText);

    return new Response(
      JSON.stringify({
        success: true,
        message: '✅ OpenAI API key is working perfectly!',
        diagnostics,
        response: data.choices[0].message.content,
        model: data.model,
        usage: data.usage
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: `❌ Error: ${error.message}`,
        stack: error.stack
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
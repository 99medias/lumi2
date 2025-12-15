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
    const { model } = await req.json();

    const apiKey = Deno.env.get('OPENAI_API_KEY');

    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, message: 'Clé API non configurée dans Supabase secrets' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: 'Say "Connection successful"' }
        ],
        max_tokens: 10
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Erreur OpenAI (${response.status}): ${response.statusText}`;

      try {
        const errorData = JSON.parse(errorText);
        if (errorData.error?.message) {
          errorMessage = errorData.error.message;
        }
      } catch (e) {
        errorMessage += ` - ${errorText}`;
      }

      return new Response(
        JSON.stringify({
          success: false,
          message: errorMessage
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const data = await response.json();

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `✅ Connexion réussie avec ${model || 'gpt-4o-mini'}!`,
        model: model || 'gpt-4o-mini'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: `Erreur: ${error.message}` 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
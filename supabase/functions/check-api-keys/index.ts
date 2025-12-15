import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
    const keys = {
      OPENAI_API_KEY: {
        configured: !!Deno.env.get('OPENAI_API_KEY'),
        usedBy: ['generate-article', 'test-openai-connection'],
        description: 'OpenAI API for article generation',
        getFrom: 'https://platform.openai.com/api-keys'
      },
      LEAKCHECK_API_KEY: {
        configured: !!Deno.env.get('LEAKCHECK_API_KEY'),
        usedBy: ['leakcheck'],
        description: 'LeakCheck.io API for breach checking',
        getFrom: 'https://leakcheck.io/'
      },
      HIBP_API_KEY: {
        configured: !!Deno.env.get('HIBP_API_KEY'),
        usedBy: ['breach-checker-hibp', 'check-email-breach'],
        description: 'Have I Been Pwned API for breach checking',
        getFrom: 'https://haveibeenpwned.com/API/Key'
      },
      RESEND_API_KEY: {
        configured: !!Deno.env.get('RESEND_API_KEY'),
        usedBy: ['send-contact-notification'],
        description: 'Resend API for email notifications',
        getFrom: 'https://resend.com/api-keys'
      },
      SUPABASE_URL: {
        configured: !!Deno.env.get('SUPABASE_URL'),
        usedBy: ['all functions'],
        description: 'Supabase URL (auto-configured)',
        getFrom: 'Auto-configured by Supabase'
      },
      SUPABASE_SERVICE_ROLE_KEY: {
        configured: !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
        usedBy: ['all functions'],
        description: 'Supabase service role key (auto-configured)',
        getFrom: 'Auto-configured by Supabase'
      },
    };

    const allConfigured = Object.entries(keys)
      .filter(([name]) => !name.startsWith('SUPABASE_'))
      .every(([, value]) => value.configured);

    const missingKeys = Object.entries(keys)
      .filter(([, value]) => !value.configured)
      .map(([name]) => name);

    return new Response(
      JSON.stringify({
        success: true,
        allConfigured,
        missingKeys,
        keys,
        message: allConfigured
          ? '✅ All required API keys are configured!'
          : `⚠️ Missing keys: ${missingKeys.join(', ')}`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
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
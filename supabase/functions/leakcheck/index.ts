import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const body = await req.json();
    const query = body.query || body.email;
    const type = body.type || "email";

    if (!query || typeof query !== "string") {
      return new Response(
        JSON.stringify({ success: false, error: "Query is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const apiKey = Deno.env.get("LEAKCHECK_API_KEY");

    if (!apiKey) {
      console.error("LEAKCHECK_API_KEY not configured");
      return new Response(
        JSON.stringify({
          success: false,
          error: "API key not configured",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("LeakCheck search:", { query, type });

    const response = await fetch(
      `https://leakcheck.io/api/v2/query/${encodeURIComponent(query)}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "X-API-Key": apiKey,
        },
      }
    );

    const responseText = await response.text();
    console.log("LeakCheck response:", response.status);

    if (!response.ok) {
      console.error("LeakCheck error:", responseText);
      return new Response(
        JSON.stringify({
          success: false,
          error: "LeakCheck API error",
          status: response.status,
        }),
        {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = JSON.parse(responseText);

    const entries = (data.result || []).map((item: any) => ({
      source: item.source?.name || "Unknown",
      breachDate: item.source?.breach_date || null,
      email: item.email || null,
      password: item.password || null,
      username: item.username || null,
      firstName: item.first_name || null,
      lastName: item.last_name || null,
      name: item.name || null,
      phone: item.phone || null,
      address: item.address || null,
      dob: item.dob || null,
      fields: item.fields || [],
    }));

    const allFields = [...new Set(entries.flatMap((e: any) => e.fields || []))];
    const passwordCount = entries.filter((e: any) => e.password).length;

    return new Response(
      JSON.stringify({
        success: data.success,
        found: data.found || 0,
        quota: data.quota || 0,
        entries,
        fields: allFields,
        passwordCount,
        hasPasswords: passwordCount > 0,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("LeakCheck function error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
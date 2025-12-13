import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface BreachData {
  Name: string;
  Title: string;
  Domain: string;
  BreachDate: string;
  AddedDate: string;
  ModifiedDate: string;
  PwnCount: number;
  Description: string;
  LogoPath: string;
  DataClasses: string[];
  IsVerified: boolean;
  IsFabricated: boolean;
  IsSensitive: boolean;
  IsRetired: boolean;
  IsSpamList: boolean;
  IsMalware: boolean;
  IsSubscriptionFree: boolean;
  IsStealerLog: boolean;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const encodedEmail = encodeURIComponent(email.trim().toLowerCase());
    const url = `https://haveibeenpwned.com/api/v3/breachedaccount/${encodedEmail}?truncateResponse=false`;

    console.log("Checking email:", email);
    console.log("URL:", url);

    const hibpApiKey = Deno.env.get("HIBP_API_KEY") || "";

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "hibp-api-key": hibpApiKey,
        "user-agent": "MaSecu-Expert-Security-Scanner",
      },
    });

    console.log("HIBP Response status:", response.status);

    if (response.status === 404) {
      return new Response(
        JSON.stringify({ breaches: [], found: false }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (response.status === 401) {
      const errorText = await response.text();
      console.log("401 Error:", errorText);
      return new Response(
        JSON.stringify({ error: "API key invalid", details: errorText }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (response.status === 403) {
      const errorText = await response.text();
      console.log("403 Error:", errorText);
      return new Response(
        JSON.stringify({ error: "Access forbidden", details: errorText }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (response.status === 429) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.log("Error response:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: `Failed to check email (${response.status})`, details: errorText }),
        {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const breaches: BreachData[] = await response.json();
    console.log("Found breaches:", breaches.length);

    return new Response(
      JSON.stringify({
        breaches,
        found: true,
        totalBreaches: breaches.length,
        totalExposedRecords: breaches.reduce((sum, b) => sum + b.PwnCount, 0),
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Exception:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: String(error) }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
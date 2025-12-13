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
    const { passwordHash } = await req.json();

    if (!passwordHash || typeof passwordHash !== "string") {
      return new Response(
        JSON.stringify({ error: "Password hash is required" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Use k-anonymity: only send first 5 characters of SHA1 hash
    const prefix = passwordHash.slice(0, 5).toUpperCase();
    const suffix = passwordHash.slice(5).toUpperCase();

    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      method: "GET",
      headers: {
        "user-agent": "MySafeSecurity-BreachChecker",
      },
    });

    if (!response.ok) {
      throw new Error(`PWNED API error: ${response.status}`);
    }

    const text = await response.text();
    const lines = text.split("\n");

    let found = false;
    let count = 0;

    for (const line of lines) {
      const [hash, pwCount] = line.trim().split(":");
      if (hash === suffix) {
        found = true;
        count = parseInt(pwCount || "0", 10);
        break;
      }
    }

    return new Response(
      JSON.stringify({
        pwned: found,
        count: count,
        message: found
          ? `Ce mot de passe a été vu ${count.toLocaleString("fr-FR")} fois dans des fuites de données`
          : "Ce mot de passe n'apparaît dans aucune fuite connue",
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});

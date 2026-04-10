import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const LIPWA_API_KEY = Deno.env.get("LIPWA_API_KEY");
    if (!LIPWA_API_KEY) {
      throw new Error("LIPWA_API_KEY is not configured");
    }

    const url = new URL(req.url);
    const ref = url.searchParams.get("ref");

    if (!ref) {
      return new Response(
        JSON.stringify({ error: "ref query parameter is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const response = await fetch(`https://pay.lipwa.app/api/status?ref=${ref}`, {
      headers: {
        Authorization: `Bearer ${LIPWA_API_KEY}`,
      },
    });

    const data = await response.json();

    return new Response(
      JSON.stringify(data),
      { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Status check error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

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
    const body = await req.json();
    console.log("Lipwa callback received:", JSON.stringify(body));

    // Log the payment status for debugging
    const { status, transaction_id, checkout_id, amount, phone_number, mpesa_code, api_ref } = body;

    if (status === "payment.success") {
      console.log(`Payment SUCCESS: ${mpesa_code}, Amount: ${amount}, Plan: ${api_ref?.plan}, User: ${api_ref?.email}`);
      // In production, you'd update the user's account type in the database here
    } else if (status === "payment.failed") {
      console.log(`Payment FAILED: Checkout ${checkout_id}, Amount: ${amount}`);
    } else {
      console.log(`Payment status: ${status}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Callback error:", error);
    return new Response(
      JSON.stringify({ error: "Callback processing failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LIPWA_URL = "https://pay.lipwa.app/api/payments";
const CHANNEL_ID = "CH_2896367E";

const jsonResponse = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const getProviderMessage = (data: unknown, rawText: string) => {
  if (typeof data === "string" && data.trim()) return data.trim();
  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    const message = record.message || record.error || record.detail;
    if (typeof message === "string" && message.trim()) return message.trim();
  }
  return rawText.trim() || "Payment request failed";
};

const getCheckoutReference = (data: Record<string, unknown>) => {
  const candidates = [
    data.CheckoutRequestID,
    data.checkout_request_id,
    data.checkout_id,
    data.transaction_id,
    data.reference,
    data.ref,
    data.id,
  ];

  const match = candidates.find(
    (value) =>
      (typeof value === "string" && value.trim().length > 0) ||
      (typeof value === "number" && Number.isFinite(value))
  );

  return match ? String(match) : null;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const LIPWA_API_KEY = Deno.env.get("LIPWA_API_KEY");
    if (!LIPWA_API_KEY) {
      return jsonResponse({ success: false, error: "Payment service is not configured" });
    }

    const { phone_number, amount, plan, user_email, user_name } = await req.json();

    if (!phone_number || !amount || !plan) {
      return jsonResponse({
        success: false,
        error: "phone_number, amount, and plan are required",
      });
    }

    if (amount < 10) {
      return jsonResponse({ success: false, error: "Minimum amount is 10 KES" });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const callbackUrl = `${SUPABASE_URL}/functions/v1/lipwa-callback`;

    const response = await fetch(LIPWA_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LIPWA_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone_number,
        amount,
        channel_id: CHANNEL_ID,
        callback_url: callbackUrl,
        api_ref: {
          plan,
          email: user_email || "",
          name: user_name || "",
        },
      }),
    });

    const rawText = await response.text();
    console.log("Lipwa raw response:", rawText, "Status:", response.status);

    let parsed: unknown = rawText;
    try {
      parsed = rawText ? JSON.parse(rawText) : null;
    } catch {
      parsed = rawText;
    }

    if (!response.ok) {
      return jsonResponse({
        success: false,
        error: getProviderMessage(parsed, rawText),
        raw: parsed,
      });
    }

    if (typeof parsed === "string") {
      return jsonResponse({
        success: false,
        error: `Payment rejected: ${parsed}`,
        raw: parsed,
      });
    }

    if (!parsed || typeof parsed !== "object") {
      return jsonResponse({
        success: false,
        error: "Unexpected payment provider response",
        raw: rawText,
      });
    }

    const data = parsed as Record<string, unknown>;
    const checkoutRequestId = getCheckoutReference(data);
    console.log("Resolved checkout reference:", checkoutRequestId);

    if (!checkoutRequestId) {
      return jsonResponse({
        success: false,
        error: "No checkout reference received from payment provider",
        raw: data,
      });
    }

    return jsonResponse({
      success: true,
      checkout_request_id: checkoutRequestId,
      message:
        (typeof data.CustomerMessage === "string" && data.CustomerMessage) ||
        (typeof data.message === "string" && data.message) ||
        "STK push sent",
    });
  } catch (error: unknown) {
    console.error("Error in lipwa-pay:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return jsonResponse({ success: false, error: message });
  }
});

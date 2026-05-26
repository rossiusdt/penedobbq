import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const ALLOWPAY_API_KEY = Deno.env.get("ALLOWPAY_API_KEY") ?? "allow_apikey_956nof1obs";
const ALLOWPAY_BASE = "https://allow-gi0i.onrender.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();

    const payload = {
      api_key: ALLOWPAY_API_KEY,
      amount: body.amount,
      description: body.description ?? "Ingresso",
      customer: {
        name: body.customer?.name,
        email: body.customer?.email,
        cellphone: body.customer?.cellphone,
        taxId: body.customer?.taxId,
      },
    };

    const res = await fetch(`${ALLOWPAY_BASE}/api/v2/allowpay-seller/create-pix`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    let data: unknown;
    const text = await res.text();
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    console.log("AllowPay create-pix response", res.status, JSON.stringify(data).slice(0, 2000));

    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

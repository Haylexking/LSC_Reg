import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
    const PAYSTACK_SECRET_HASH = process.env.PAYSTACK_SECRET_HASH; // optional hash from Paystack dashboard

    if (!PAYSTACK_SECRET_KEY) {
      return NextResponse.json(
        { error: "Missing PAYSTACK_SECRET_KEY" },
        { status: 500 }
      );
    }

    const body = await req.text(); // we use text for signature verification
    const signature = req.headers.get("x-paystack-signature");

    if (PAYSTACK_SECRET_HASH && signature) {
      const hash = crypto
        .createHmac("sha512", PAYSTACK_SECRET_HASH)
        .update(body)
        .digest("hex");
      if (hash !== signature) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    const event = JSON.parse(body);

    // Prepare Supabase admin client (service role) for RLS-safe updates
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: "Server misconfigured: missing SUPABASE URL or SERVICE ROLE key" },
        { status: 500 }
      );
    }

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // We only care about successful transactions
    if (event?.event === "charge.success") {
      const registrationId = event?.data?.metadata?.registrationId;

      if (registrationId) {
        await (admin as any)
          .from("bootcamp_registrations")
          .update({ payment_status: "completed" })
          .eq("id", registrationId);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: any) {
    console.error("Webhook error:", err);
    return NextResponse.json(
      { error: err?.message || "Webhook processing failed" },
      { status: 500 }
    );
  }
}

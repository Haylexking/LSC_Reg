import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabase } from "../../../../lib/supabase"; // adjust if your path differs

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

    // We only care about successful transactions
    if (event?.event === "charge.success") {
      const registrationId = event?.data?.metadata?.registrationId;

      if (registrationId) {
        await (supabase as any)
          .from("bootcamp_registrations")
          .update({ payment_status: "paid" })
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

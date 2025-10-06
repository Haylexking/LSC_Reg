import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, email, fullName, registrationId } = body;

    if (!amount || !email) {
      return NextResponse.json({ error: 'Missing amount or email' }, { status: 400 });
    }

    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
    if (!PAYSTACK_SECRET_KEY) {
      return NextResponse.json({ error: 'Server misconfigured: missing PAYSTACK_SECRET_KEY' }, { status: 500 });
    }

    const initRes = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount,
        metadata: { fullName, registrationId },
      }),
    });

    const data = await initRes.json();
    if (!initRes.ok) {
      return NextResponse.json({ error: data?.message || 'Paystack initialization failed', data }, { status: initRes.status });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}

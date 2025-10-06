import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, fullName, registrationId, memberType } = body;

    if (!email || !memberType || !registrationId) {
      return NextResponse.json(
        { error: 'Missing email, memberType, or registrationId' },
        { status: 400 }
      );
    }

    // 💰 Amount logic (in kobo)
    const amount =
      memberType === 'member'
        ? 5000 * 100
        : memberType === 'visitor'
        ? 10000 * 100
        : null;

    if (!amount) {
      return NextResponse.json(
        { error: 'Invalid memberType value' },
        { status: 400 }
      );
    }

    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
    if (!PAYSTACK_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Server misconfigured: missing PAYSTACK_SECRET_KEY' },
        { status: 500 }
      );
    }

    // ✅ Use only the live domain
    const callbackUrl = `https://lsc-tsa-bootcamp-reg.vercel.app/payment-success?registration_id=${registrationId}`;

    // 🚀 Initialize Paystack transaction
    const initRes = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount,
        metadata: { fullName, registrationId, memberType },
        callback_url: callbackUrl,
      }),
    });

    const data = await initRes.json();

    if (!initRes.ok) {
      console.error('Paystack init failed:', data);
      return NextResponse.json(
        { error: data?.message || 'Paystack initialization failed', data },
        { status: initRes.status }
      );
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error('Server error:', err);
    return NextResponse.json(
      { error: err?.message || String(err) },
      { status: 500 }
    );
  }
}
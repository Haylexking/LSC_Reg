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

    // Use the exact same values as the database - 'Member' and 'Visitor'
    const amount =
      memberType === 'Member'
        ? 5000 * 100 // 5,000 Naira for Members
        : memberType === 'Visitor'
        ? 10000 * 100 // 10,000 Naira for Visitors
        : null;

    if (!amount) {
      return NextResponse.json(
        { error: 'Invalid memberType value. Must be "Member" or "Visitor"' },
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

    const base = process.env.APP_BASE_URL || req.headers.get('origin') || 'http://localhost:3000';
    const callbackUrl = `${base}/payment-success?registration_id=${registrationId}`;

    const initRes = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount,
        metadata: { 
          fullName, 
          registrationId, 
          memberType // Store as 'Member' or 'Visitor' - same as database
        },
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
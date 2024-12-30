import { stripe } from '@/lib/stripe/config';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json();
    
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status !== 'paid') {
      throw new Error('Payment not completed');
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
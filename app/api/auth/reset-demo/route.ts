import { resetDemoUser } from '@/lib/auth/demo-user';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    await resetDemoUser();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message }, 
      { status: 500 }
    );
  }
}
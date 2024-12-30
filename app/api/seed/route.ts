import { seedDemoData } from '@/lib/seed/demo-data';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const demoCredentials = await seedDemoData();
    return NextResponse.json({
      success: true,
      data: demoCredentials,
      message: 'Demo data seeded successfully'
    });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Failed to seed demo data'
      },
      { status: 500 }
    );
  }
}
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { createOrganization } from '@/lib/services/organization';

export async function POST(req: Request) {
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const data = await req.json();
    const organization = await createOrganization({
      name: data.name,
      industry: data.industry,
      size: data.size,
    });

    return NextResponse.json({ organization });
  } catch (error: any) {
    console.error('Organization creation error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
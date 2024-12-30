import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: Request) {
  const user = await getUserFromRequest(req);

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(req.url);
  const resource = url.pathname.split('/').pop(); // Extract resource from URL
  const model = prisma[resource as string];

  if (!model) {
    return NextResponse.json({ message: 'Invalid resource' }, { status: 400 });
  }

  try {
    const records = await model.findMany({
      where: { userId: user.id },
    });
    return NextResponse.json(records, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const user = await getUserFromRequest(req);

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(req.url);
  const resource = url.pathname.split('/').pop(); // Extract resource from URL
  const model = prisma[resource as string];

  if (!model) {
    return NextResponse.json({ message: 'Invalid resource' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const createdRecord = await model.create({
      data: { ...body, userId: user.id },
    });
    return NextResponse.json(createdRecord, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const user = await getUserFromRequest(req);

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(req.url);
  const resource = url.pathname.split('/').pop(); // Extract resource from URL
  const model = prisma[resource as string];

  if (!model) {
    return NextResponse.json({ message: 'Invalid resource' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { id, ...data } = body;
    const updatedRecord = await model.update({
      where: { id, userId: user.id },
      data,
    });
    return NextResponse.json(updatedRecord, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const user = await getUserFromRequest(req);

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(req.url);
  const resource = url.pathname.split('/').pop(); // Extract resource from URL
  const model = prisma[resource as string];

  if (!model) {
    return NextResponse.json({ message: 'Invalid resource' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { id: deleteId } = body;
    await model.delete({
      where: { id: deleteId, userId: user.id },
    });
    return NextResponse.json(null, { status: 204 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

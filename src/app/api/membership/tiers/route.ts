import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/membership/tiers - Get all membership tiers
export async function GET() {
  try {
    const tiers = await prisma.membershipTier.findMany({
      orderBy: { price: 'asc' }
    });

    return NextResponse.json({
      success: true,
      data: tiers
    });
  } catch (error) {
    console.error('Error fetching membership tiers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch membership tiers' },
      { status: 500 }
    );
  }
}

// POST /api/membership/tiers - Create new membership tier
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, price, description, benefits, isPopular } = body;

    if (!name || !price || !description || !benefits) {
      return NextResponse.json(
        { success: false, error: 'Name, price, description, and benefits are required' },
        { status: 400 }
      );
    }

    const tier = await prisma.membershipTier.create({
      data: {
        name,
        price: parseFloat(price),
        description,
        benefits,
        isPopular: isPopular || false
      }
    });

    return NextResponse.json({
      success: true,
      data: tier
    });
  } catch (error) {
    console.error('Error creating membership tier:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create membership tier' },
      { status: 500 }
    );
  }
}
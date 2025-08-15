import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/membership/purchase - Purchase membership
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tierId, email } = body;

    if (!tierId) {
      return NextResponse.json(
        { success: false, error: 'Tier ID is required' },
        { status: 400 }
      );
    }

    // Check if tier exists
    const tier = await prisma.membershipTier.findUnique({
      where: { id: tierId }
    });

    if (!tier) {
      return NextResponse.json(
        { success: false, error: 'Membership tier not found' },
        { status: 404 }
      );
    }

    // Calculate expiry date based on tier duration
    const purchaseDate = new Date();
    const expiryDate = new Date(purchaseDate);
    expiryDate.setMonth(expiryDate.getMonth() + tier.duration);

    // Create member record (simulating successful payment)
    const member = await prisma.member.create({
      data: {
        email: email || 'integration-test@example.com',
        tierId: tier.id,
        tierName: tier.name,
        status: 'ACTIVE',
        paymentStatus: 'COMPLETED',
        purchaseDate,
        expiryDate,
        benefits: tier.benefits
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Membership purchase completed successfully',
      data: {
        member,
        tierId,
        tierName: tier.name,
        price: tier.price,
        paymentUrl: '/payment/checkout'
      }
    });
  } catch (error) {
    console.error('Error processing membership purchase:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process membership purchase' },
      { status: 500 }
    );
  }
}
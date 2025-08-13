import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// DELETE /api/membership/tiers/[id] - Delete membership tier
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if tier exists
    const existingTier = await prisma.membershipTier.findUnique({
      where: { id }
    });

    if (!existingTier) {
      return NextResponse.json(
        { success: false, error: 'Membership tier not found' },
        { status: 404 }
      );
    }

    // Delete the tier
    await prisma.membershipTier.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Membership tier deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting membership tier:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete membership tier' },
      { status: 500 }
    );
  }
}

// GET /api/membership/tiers/[id] - Get single membership tier
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const tier = await prisma.membershipTier.findUnique({
      where: { id }
    });

    if (!tier) {
      return NextResponse.json(
        { success: false, error: 'Membership tier not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: tier
    });
  } catch (error) {
    console.error('Error fetching membership tier:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch membership tier' },
      { status: 500 }
    );
  }
}

// PATCH /api/membership/tiers/[id] - Update membership tier
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, price, description, benefits, isPopular } = body;

    // Check if tier exists
    const existingTier = await prisma.membershipTier.findUnique({
      where: { id }
    });

    if (!existingTier) {
      return NextResponse.json(
        { success: false, error: 'Membership tier not found' },
        { status: 404 }
      );
    }

    // Update the tier
    const updatedTier = await prisma.membershipTier.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(price && { price: parseFloat(price) }),
        ...(description && { description }),
        ...(benefits && { benefits }),
        ...(isPopular !== undefined && { isPopular })
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedTier
    });
  } catch (error) {
    console.error('Error updating membership tier:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update membership tier' },
      { status: 500 }
    );
  }
}
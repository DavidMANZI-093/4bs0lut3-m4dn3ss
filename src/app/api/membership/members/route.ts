import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/membership/members - Get all members
export async function GET() {
  try {
    const members = await prisma.member.findMany({
      include: {
        tier: {
          select: {
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Transform the data to match the expected format
    const transformedMembers = members.map(member => ({
      id: member.id,
      email: member.email,
      tierName: member.tierName,
      status: member.status,
      paymentStatus: member.paymentStatus,
      benefits: member.benefits,
      purchaseDate: member.purchaseDate.toISOString(),
      expiryDate: member.expiryDate.toISOString(),
      createdAt: member.createdAt.toISOString(),
      updatedAt: member.updatedAt.toISOString()
    }));

    return NextResponse.json({
      success: true,
      data: transformedMembers
    });
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch members' },
      { status: 500 }
    );
  }
}
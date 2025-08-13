import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/messages - Get all chat messages
export async function GET() {
  try {
    const messages = await prisma.message.findMany({
      orderBy: {
        createdAt: 'asc'
      },
      take: 100 // Limit to last 100 messages
    });

    return NextResponse.json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// POST /api/messages - Create new message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sender, content } = body;

    if (!sender || !content) {
      return NextResponse.json(
        { success: false, error: 'Sender and content are required' },
        { status: 400 }
      );
    }

    const message = await prisma.message.create({
      data: {
        sender,
        content
      }
    });

    return NextResponse.json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create message' },
      { status: 500 }
    );
  }
}

// DELETE /api/messages - Clear all messages (admin only)
export async function DELETE() {
  try {
    await prisma.message.deleteMany({});

    return NextResponse.json({
      success: true,
      message: 'All messages cleared successfully'
    });
  } catch (error) {
    console.error('Error clearing messages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear messages' },
      { status: 500 }
    );
  }
}
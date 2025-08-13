import { NextResponse } from 'next/server';

// GET /api/chat/users - Get active chat users
export async function GET() {
  try {
    // In a real application, this would fetch from a database or Redis
    // For now, we'll return mock data
    const users = [
      {
        username: 'FanBoy123',
        joinedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        messageCount: 15,
        isMuted: false,
        isBanned: false
      },
      {
        username: 'BasketballLover',
        joinedAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
        messageCount: 8,
        isMuted: false,
        isBanned: false
      },
      {
        username: 'TeamSpirit',
        joinedAt: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
        messageCount: 3,
        isMuted: true,
        isBanned: false
      }
    ];

    return NextResponse.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error fetching chat users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch chat users' },
      { status: 500 }
    );
  }
}
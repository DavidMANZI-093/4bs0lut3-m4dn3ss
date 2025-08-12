import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('session-token')?.value;

    if (!token) {
      return NextResponse.json(
        { 
          error: 'NO_SESSION',
          message: 'No active session found' 
        },
        { status: 401 }
      );
    }

    // Validate and refresh session
    const session = await AuthService.validateSession(token);

    if (!session) {
      // Session is invalid or expired, clear the cookie
      const response = NextResponse.json(
        { 
          error: 'SESSION_EXPIRED',
          message: 'Session has expired' 
        },
        { status: 401 }
      );

      response.cookies.set('session-token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
      });

      return response;
    }

    return NextResponse.json({
      success: true,
      user: {
        id: session.id,
        email: session.email,
        role: session.role,
        expiresAt: session.expiresAt,
        lastActivity: session.lastActivity,
      }
    });

  } catch (error) {
    console.error('Session validation error:', error);

    return NextResponse.json(
      { 
        error: 'INTERNAL_ERROR',
        message: 'An internal error occurred' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('session-token')?.value;

    if (!token) {
      return NextResponse.json(
        { 
          error: 'NO_SESSION',
          message: 'No active session found' 
        },
        { status: 401 }
      );
    }

    // Refresh session (extend expiry time)
    const session = await AuthService.refreshSession(token);

    if (!session) {
      const response = NextResponse.json(
        { 
          error: 'SESSION_EXPIRED',
          message: 'Session has expired' 
        },
        { status: 401 }
      );

      response.cookies.set('session-token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
      });

      return response;
    }

    return NextResponse.json({
      success: true,
      user: {
        id: session.id,
        email: session.email,
        role: session.role,
        expiresAt: session.expiresAt,
        lastActivity: session.lastActivity,
      },
      message: 'Session refreshed successfully'
    });

  } catch (error) {
    console.error('Session refresh error:', error);

    return NextResponse.json(
      { 
        error: 'INTERNAL_ERROR',
        message: 'An internal error occurred' 
      },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { AuthService, UserSession } from '@/lib/auth';

export interface AuthenticatedRequest extends NextRequest {
  user?: UserSession;
}

export interface AuthMiddlewareOptions {
  requiredRole?: 'ADMIN' | 'DEVELOPER';
  requiredPermissions?: string[];
}

/**
 * Authentication middleware for protecting API routes
 */
export function withAuth(
  handler: (request: AuthenticatedRequest) => Promise<NextResponse>,
  options: AuthMiddlewareOptions = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      const token = request.cookies.get('session-token')?.value;

      if (!token) {
        return NextResponse.json(
          { 
            error: 'AUTHENTICATION_REQUIRED',
            message: 'Authentication required to access this resource' 
          },
          { status: 401 }
        );
      }

      // Validate session
      const session = await AuthService.validateSession(token);

      if (!session) {
        const response = NextResponse.json(
          { 
            error: 'SESSION_EXPIRED',
            message: 'Session has expired, please login again' 
          },
          { status: 401 }
        );

        // Clear expired session cookie
        response.cookies.set('session-token', '', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 0,
          path: '/',
        });

        return response;
      }

      // Check role requirements
      if (options.requiredRole && session.role !== options.requiredRole) {
        return NextResponse.json(
          { 
            error: 'INSUFFICIENT_PERMISSIONS',
            message: `This resource requires ${options.requiredRole} role` 
          },
          { status: 403 }
        );
      }

      // Add user session to request
      const authenticatedRequest = request as AuthenticatedRequest;
      authenticatedRequest.user = session;

      // Call the protected handler
      return await handler(authenticatedRequest);

    } catch (error) {
      console.error('Authentication middleware error:', error);

      return NextResponse.json(
        { 
          error: 'INTERNAL_ERROR',
          message: 'An internal error occurred during authentication' 
        },
        { status: 500 }
      );
    }
  };
}

/**
 * Utility function to check if a request is authenticated
 */
export async function getAuthenticatedUser(request: NextRequest): Promise<UserSession | null> {
  try {
    const token = request.cookies.get('session-token')?.value;
    
    if (!token) {
      return null;
    }

    return await AuthService.validateSession(token);
  } catch (error) {
    console.error('Error getting authenticated user:', error);
    return null;
  }
}

/**
 * Utility function to require authentication in API routes
 */
export async function requireAuth(
  request: NextRequest,
  options: AuthMiddlewareOptions = {}
): Promise<{ user: UserSession } | NextResponse> {
  const token = request.cookies.get('session-token')?.value;

  if (!token) {
    return NextResponse.json(
      { 
        error: 'AUTHENTICATION_REQUIRED',
        message: 'Authentication required to access this resource' 
      },
      { status: 401 }
    );
  }

  const session = await AuthService.validateSession(token);

  if (!session) {
    const response = NextResponse.json(
      { 
        error: 'SESSION_EXPIRED',
        message: 'Session has expired, please login again' 
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

  // Check role requirements
  if (options.requiredRole && session.role !== options.requiredRole) {
    return NextResponse.json(
      { 
        error: 'INSUFFICIENT_PERMISSIONS',
        message: `This resource requires ${options.requiredRole} role` 
      },
      { status: 403 }
    );
  }

  return { user: session };
}
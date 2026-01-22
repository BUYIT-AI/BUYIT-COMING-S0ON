import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, JWTPayload } from './auth';

/**
 * Extract and verify user from request
 */
export function getUserFromRequest(request: NextRequest): JWTPayload | null {
  const token = request.cookies.get('token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    return null;
  }

  return verifyToken(token);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(request: NextRequest): boolean {
  const user = getUserFromRequest(request);
  return user !== null;
}

/**
 * Create an unauthorized response
 */
export function unauthorized(message: string = 'Unauthorized') {
  return NextResponse.json(
    {
      success: false,
      message,
      error: 'UNAUTHORIZED',
    },
    { status: 401 }
  );
}

/**
 * Create a forbidden response
 */
export function forbidden(message: string = 'Forbidden') {
  return NextResponse.json(
    {
      success: false,
      message,
      error: 'FORBIDDEN',
    },
    { status: 403 }
  );
}

/**
 * Create a bad request response
 */
export function badRequest(message: string = 'Bad Request', error?: string) {
  return NextResponse.json(
    {
      success: false,
      message,
      error: error || 'BAD_REQUEST',
    },
    { status: 400 }
  );
}

/**
 * Create a not found response
 */
export function notFound(message: string = 'Not Found') {
  return NextResponse.json(
    {
      success: false,
      message,
      error: 'NOT_FOUND',
    },
    { status: 404 }
  );
}

/**
 * Create a success response
 */
export function success(data: any, message: string = 'Success', status: number = 200) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status }
  );
}

/**
 * Create an error response
 */
export function error(message: string = 'Internal Server Error', errorCode?: string) {
  return NextResponse.json(
    {
      success: false,
      message,
      error: errorCode || 'INTERNAL_ERROR',
    },
    { status: 500 }
  );
}

/**
 * Verify authentication and return user or error response
 */
export function requireAuth(request: NextRequest): JWTPayload | NextResponse {
  const user = getUserFromRequest(request);
  
  if (!user) {
    return unauthorized('Authentication token is missing or invalid');
  }

  return user;
}

/**
 * Create logout response (clears token cookie)
 */
export function logout() {
  const response = NextResponse.json(
    {
      success: true,
      message: 'Logged out successfully',
    },
    { status: 200 }
  );

  response.cookies.delete('token');
  return response;
}

/**
 * Protected route handler wrapper
 */
export async function withAuth(
  request: NextRequest,
  handler: (req: NextRequest, user: JWTPayload) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    const user = getUserFromRequest(request);

    if (!user) {
      return unauthorized('Authentication token is missing or invalid');
    }

    return await handler(request, user);
  } catch (error: any) {
    console.error('Auth middleware error:', error);
    return error instanceof Error
      ? badRequest(error.message)
      : error('An unexpected error occurred');
  }
}

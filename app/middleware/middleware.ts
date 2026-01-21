// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const jwt_secret = process.env.jwt_secret || "Your secret key";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return false
  }

  try {
    // This now works because we are forcing Node.js runtime
    const decoded = jwt.verify(token, jwt_secret);
    return NextResponse.next();
  } catch (error) {
    return console.error(error)
  }
}

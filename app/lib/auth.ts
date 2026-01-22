import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";

export interface JWTPayload {
  userId: string;
  first_name: string;
  last_name: string;
  email: string;
  iat: number;
}

export interface AuthResponse {
  valid: boolean;
  token?: string;
  user?: JWTPayload;
  error?: string;
}

/**
 * Hash a password using SHA-256
 */
export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

/**
 * Verify a password against its hash
 */
export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

/**
 * Generate a JWT token
 */
export function generateToken(
  userId: string,
  firstName: string,
  lastName: string,
  email: string,
): string {
  const secret = process.env.JWT_SECRET || "your-secret-key";
  return jwt.sign(
    {
      userId,
      first_name: firstName,
      last_name: lastName,
      email,
      iat: Math.floor(Date.now() / 1000),
    },
    secret,
    {
      expiresIn: "1h",
    }
  );
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const secret = process.env.JWT_SECRET || "your-secret-key";
    const decoded = jwt.verify(token, secret) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(authHeader: string): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.slice(7);
}

/**
 * Extract token from cookies
 */
export function extractTokenFromCookie(cookieValue: string | undefined): string | null {
  return cookieValue || null;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function isStrongPassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push("Password must contain at least one special character (!@#$%^&*)");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Create token cookie options
 */
export function getTokenCookieOptions(maxAge: number = 60 * 60) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge, // in seconds (default 1 hour)
  };
}

/**
 * Decode token without verification (useful for debugging)
 */
export function decodeToken(token: string): any {
  try {
    return jwt.decode(token);
  } catch (error) {
    console.error("Token decode failed:", error);
    return null;
  }
}

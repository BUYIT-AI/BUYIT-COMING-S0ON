import { cookies } from "next/headers";
import { verifyToken, JWTPayload } from "@/app/lib/auth";

export interface AuthUser {
  userId: string;
  first_name: string;
  email: string;
  iat: number;
}

/**
 * Get authenticated user from token cookie
 * Extracts userId, first_name, and email from token
 */
export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      console.warn("No authentication token found in cookies");
      return null;
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      console.warn("Token verification failed - token may be invalid or expired");
      return null;
    }

    return {
      userId: decoded.userId,
      first_name: decoded.first_name,
      email: decoded.email,
      iat: decoded.iat,
    } as AuthUser;
  } catch (error) {
    console.error("Error extracting authenticated user:", error);
    return null;
  }
}

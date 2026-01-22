import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/app/lib/auth";
import { logger } from "@/app/lib/logger";

interface VerifyResponse {
  success: boolean;
  message: string;
  user?: {
    userId: string;
    email: string;
    first_name: string;
  };
}

export async function GET(
  req: NextRequest
): Promise<NextResponse<VerifyResponse>> {
  try {
    // Get token from cookies
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "No token found",
        },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired token",
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Token is valid",
        user: {
          userId: decoded.userId,
          email: decoded.email,
          first_name: decoded.first_name,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error("Token verification error", error);
    return NextResponse.json(
      {
        success: false,
        message: "Token verification failed",
      },
      { status: 401 }
    );
  }
}

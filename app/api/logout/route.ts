import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/app/lib/logger";

interface LogoutResponse {
  success: boolean;
  message: string;
}

export async function POST(
  req: NextRequest
): Promise<NextResponse<LogoutResponse>> {
  try {
    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: "Logged out successfully",
      },
      { status: 200 }
    );

    // Clear the token cookie by setting it to empty with past expiration
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 0, // Expire immediately
    });

    logger.info("User logged out successfully");
    return response;
  } catch (error) {
    logger.error("Logout error", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to logout",
      },
      { status: 500 }
    );
  }
}

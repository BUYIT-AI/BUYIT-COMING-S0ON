import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";

interface LoginRequestBody {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  error?: string;
}

// Hash password function
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// Verify password function
function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

// Generate JWT token
function generateToken(
  userId: string,
  email: string,
  firstName: string
): string {
  const secret = process.env.JWT_SECRET || "your-secret-key";
  return jwt.sign(
    {
      userId,
      first_name: firstName,
      email,
      iat: Math.floor(Date.now() / 1000),
    },
    secret,
    {
      expiresIn: "1h",
    }
  );
}

export async function POST(
  req: NextRequest
): Promise<NextResponse<LoginResponse>> {
  try {
    const body: LoginRequestBody = await req.json();

    // Validate input
    if (!body.email || !body.password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required",
          error: "MISSING_FIELDS",
        },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email format",
          error: "INVALID_EMAIL",
          status: 400,
        },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.presUser.findUnique({
      where: {
        email: body.email.toLowerCase(),
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
          error: "USER_NOT_FOUND",
        },
        { status: 401 }
      );
    }

    // Verify password
    if (!verifyPassword(body.password, user.password)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
          error: "INVALID_PASSWORD",
        },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken(user.id, user.email, user.first_name);

    // Update last login time
    await prisma.presUser.update({
      where: { id: user.id },
      data: { updatedAt: new Date() },
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
        },
      },
      { status: 200 }
    );

    // Set HttpOnly cookie for token (1 hour expiration)
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60, // 1 hour in seconds
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        success: false,
        stautus: 500,
        message: "Internal server error",
        error: "INTERNAL_SERVER_ERROR",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

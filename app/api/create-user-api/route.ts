import prisma from "@/app/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { hashPassword, generateToken, isValidEmail, isStrongPassword } from "@/app/lib/auth";
import { logger } from "@/app/lib/logger";

interface SignupRequestBody {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

interface SignupResponse {
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

export async function POST(req: NextRequest): Promise<NextResponse<SignupResponse>> {
  try {
    const body: SignupRequestBody = await req.json();
    const { first_name, last_name, email, password } = body;

    // Validate required fields
    if (!first_name || !last_name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
          error: "MISSING_FIELDS",
        },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email format",
          error: "INVALID_EMAIL",
        },
        { status: 400 }
      );
    }

    // Validate password confirmation


    // Validate password strength
    const passwordValidation = isStrongPassword(password);
    if (!passwordValidation.valid) {
      // Return detailed validation errors
      const errorMessages = passwordValidation.errors.join(". ");
      return NextResponse.json(
        {
          success: false,
          message: errorMessages || "Password does not meet security requirements",
          error: "WEAK_PASSWORD",
          details: passwordValidation.errors,
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.presUser.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User with this email already exists. Please login instead.",
          error: "USER_EXISTS",
        },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = hashPassword(password);

    // Create new user
    const newUser = await prisma.presUser.create({
      data: {
        first_name,
        last_name,
        email: email.toLowerCase(),
        password: hashedPassword,
      },
    });

    // Generate JWT token
    const token = generateToken(newUser.id, newUser.first_name, newUser.email);

    // Return response with token in cookie
    const response = NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
        },
      },
      { status: 201 }
    );

    // Set HttpOnly cookie for token
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60, // 1 hour in seconds
    });

    return response;
  } catch (error) {
    logger.error("Signup error", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred during signup",
        error: error instanceof Error ? error.message : "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

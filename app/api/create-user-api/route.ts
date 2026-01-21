import prisma from "@/app/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const jwt_secret = process.env.jwt_secret || "Your secret key";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { first_name, last_name, email } = body;

    // 1. Check if user exists
    const existingUser = await prisma.presUser.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Yo sorry about that, welcome back" },
        { status: 400 }
      );
    }

    // 2. Create User
    const createUser = await prisma.presUser.create({
      data: { first_name, last_name, email },
    });

    // 3. Create Token (Minimal data for security)
    // We omit 'expiresIn' so it doesn't expire.
    const token = jwt.sign(
      {
        id: createUser.id,
        first_name: createUser.first_name,
        last_nsmr: createUser.last_name,
        email: createUser.email,
      }, // Just the ID is safer
      jwt_secret,
      { expiresIn: "3h" }
    );

    const response = NextResponse.json(
      {
        message: "User created with success",
        data: createUser,
      },
      { status: 201 }
    );

    // 4. Set Cookie with a long Max-Age
    response.cookies.set("token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 3, // 5 hours in seconds
    });

    return response;
  } catch (error) {
    // Logging the error is helpful for debugging
    console.error("Signup Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

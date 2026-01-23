import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { hashPassword } from "@/app/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    const secretKey = process.env.SEED_SECRET_KEY;

    // Verify secret key
    if (authHeader !== `Bearer ${secretKey}`) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if admin already exists
    const adminExists = await prisma.presUser.findUnique({
      where: { email: "seanimayi@gmail.com" },
    });

    if (adminExists) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin user already exists",
          data: adminExists,
        },
        { status: 400 }
      );
    }

    // Create admin user
    const hashedPassword = hashPassword("Codex@22224");
    const admin = await prisma.presUser.create({
      data: {
        first_name: "Sean",
        last_name: "Imayi",
        email: "seanimayi@gmail.com",
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Admin user created successfully",
        data: { id: admin.id, email: admin.email, first_name: admin.first_name },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { success: false, message: "Error seeding admin user", error: String(error) },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

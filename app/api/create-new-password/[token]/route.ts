import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ token: string }> }
) {
  const body = await req.json();
  const { create_password, confirm_password } = body;
  const { token } = await context.params;

  try {
    const user = await prisma.presUser.findFirst({
      where: { passwordReset: token },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User your link has expired or is invalid.",
          error: "INVALID_TOKEN",
        },
        { status: 400 }
      );
    }

    if (create_password !== confirm_password) {
      return NextResponse.json(
        {
          success: false,
          message: "Passwords do not match.",
          error: "PASSWORD_MISMATCH",
        },
        { status: 400 }
      );
    }

    await prisma.presUser.update({
      where: { id: user.id },
      data: { passwordReset: null, password: create_password },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Password updated successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while processing your request.",
        error: "SERVER_ERROR",
      },
      { status: 500 }
    );
  }
}

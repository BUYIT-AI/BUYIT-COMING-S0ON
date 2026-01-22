import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { SendMessage } from "../lib/message-mail/message_mail";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email } = body;
  const token = Math.random().toString(36).substring(2);
  try {
    const existingUser = await prisma.presUser.findUnique({
      where: { email: email },
    });

    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Sorry user does not exist",
          error: "EMAIL_NOT_FOUND",
        },
        { status: 404 }
      );
    }

    const seedToken = await prisma.presUser.update({
      data: {
        passwordReset: token,
      },
      where: {
        email: email,
      },
    });

    await SendMessage(
      email,
      "Password Reset",
      `Here is the link to reset your password https://buyitmuchmore26.vecel.app/${seedToken.passwordReset}/create-password.`
    );

    return NextResponse.json(
      {
        success: true,
        message: "Password reset link has been sent to your email.",
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

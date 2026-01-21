import prisma from "@/app/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { SendMessage } from "../lib/message-mail/message_mail";

export async function POST(req: NextRequest) {
  try {
    const { full_name, email, message } = await req.json();

    if (!full_name || !email || !message) {
      return NextResponse.json(
        { message: "Missing required fields", status: 400 },
        { status: 400 }
      );
    }

    // Create message for user
    const newMessage = await prisma.contact.create({
      data: {
        name: full_name,
        email: email,
        message: {
          create: {
            message: message,
          },
        },
      },
    });

     await SendMessage(
      newMessage.email as any,
      "Thanks for reaching out to Buyit! We’ve received your message ✅",
      `Hi ${newMessage.name},

Thank you for contacting Buyit! We’ve received your message and our team will get back to you as soon as possible.

In the meantime, feel free to explore Buyit and get personalized business advice instantly: https://buyitapp.com

We appreciate you reaching out!

Best regards,
The Buyit Team`
    );

   
    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully, check your email",
        data: newMessage,
        status: 200
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "An error occured", error: error.message, status: 500 },
      { status: 500 }
    );
  }
}

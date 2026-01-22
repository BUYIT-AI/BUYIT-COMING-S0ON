import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, product, interest } = body;

  try {
    if (!name || !email || !product || !interest) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
          status: 400,
        },
        { status: 400 }
      );
    }

    const buyer = await prisma.buyer.findUnique({
      where: {
        email,
      },
    });

    if (buyer) {
      return NextResponse.json(
        {
          success: false,
          message: "User has already been booked, cancel booking then create a new one.",
          status: 409,
          id: buyer.id,
        },
        { status: 409 }
      );
    }

    const createBuyer = await prisma.buyer.create({
      data: {
        name,
        email,
        product,
        interest,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Booking created successfully",
        data: createBuyer,
        status: 201,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred",
        status: 500,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

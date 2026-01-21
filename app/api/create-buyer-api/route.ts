import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, product, interest } = body;

  try {
    if (!name || !email || !product || !interest) {
      return NextResponse.json(
        {
          message: "Missing required fields",
          status: 401,
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
          message:
            "User has already been booked, cancel booking then create a new one.",
          status: 400,
          id: buyer.id,
        },
        { status: 400 }
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

    return NextResponse.json({
      success: true,
      message: "Booking created successfully",
      data: createBuyer.name,
      status: 201,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "An error occured", status: 500, error: error.message },
      { status: 500 }
    );
  }
}

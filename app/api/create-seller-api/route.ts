import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    first_name,
    last_name,
    brand_name,
    email,
    product,
    social_media,
    country,
    interest,
  } = body;
  if (
    !first_name ||
    !last_name ||
    !brand_name ||
    !email ||
    !product ||
    !social_media ||
    !country ||
    !interest
  ) {
    return NextResponse.json(
      {
        success: false,
        message: "Missing required fields",
        status: 400,
      },
      { status: 400 }
    );
  }
  try {
    const seller = await prisma.seller.findUnique({
      where: {
        email,
      },
    });

    if (seller) {
      return NextResponse.json(
        {
          success: false,
          message: "User has already been booked, cancel booking then create a new one.",
          status: 409,
          id: seller.id,
        },
        { status: 409 }
      );
    }

    const createSeller = await prisma.seller.create({
      data: {
        first_name,
        last_name,
        brand_Name: brand_name,
        email,
        product,
        social_media,
        country,
        interest,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Seller created successfully",
        data: createSeller,
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

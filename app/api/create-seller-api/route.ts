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
        message: "Missing required fields",
        status: 401,
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
          message:
            "User has already been booked, cancel booking then create a new one.",
          status: 400,
          id: seller.id,
        },
        { status: 400 }
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

    return NextResponse.json({
      success: true,
      message: "Seller created successfully",
      data: createSeller.brand_Name,
      status: 201,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "An error occured", status: 500, error: error.message },
      { status: 500 }
    );
  }
}

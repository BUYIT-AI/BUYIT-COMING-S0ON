import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: {params: Promise<{ id: string }>}
) {
  const { id } = await context.params;  
  const type = request.nextUrl.searchParams.get("type");

  try {
    if (type == "SELLER") {
      const bookedUser = await prisma.seller.findUnique({
        where: {
          id,
        },
      });

      if (!bookedUser) {
        return NextResponse.json(
          { message: "No booked user found with this ID bro" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          message: "Nice fetching bro, booked user found!",
          data: bookedUser,
        },
        { status: 200 }
      );
    }

    if (type == "CONTACT") {
      const contactUser = await prisma.contact.findUnique({
        where: {
          id,
        },

        include: {
          message: {
            select: {
              message: true,
            },
          },
        },
      });

      if (!contactUser) {
        return NextResponse.json(
          { message: "No contact message found with this ID bro" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          message: "Nice fetching bro, contact message found!",
          data: contactUser,
        },
        { status: 200 }
      );
    }

    if (type == "BUYER") {
      const buyerUser = await prisma.buyer.findUnique({
        where: {
          id,
        },
      });

      if (!buyerUser) {
        return NextResponse.json(
          { message: "No contact message found with this ID bro" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          message: "Nice fetching bro, contact message found!",
          data: buyerUser,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        message: "Na bro, type must be either SELLER, BUYER or CONTACT",
      },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Na Bro something is wrong here not you area bro",
        error: error,
      },
      { status: 500 }
    );
  }
}

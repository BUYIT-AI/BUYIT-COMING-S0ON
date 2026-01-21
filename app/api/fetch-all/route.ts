import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const contact = await prisma.contact.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        message: true,
      },
    });
    const seller = await prisma.seller.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    const buyer = await prisma.buyer.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        message: "Fetched successfully",
        data: {
          contact: contact,
          buyer: buyer,
          seller: seller,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

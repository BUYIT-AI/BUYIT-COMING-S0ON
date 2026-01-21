import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await prisma.message.findMany();

    return NextResponse.json(
      {
        message: "Fetched successfully",
        data: data,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

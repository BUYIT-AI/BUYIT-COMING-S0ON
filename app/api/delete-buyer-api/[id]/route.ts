import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{id: string}> }
) {
  try {
    const { id } = await context.params;
    const deleteUser = await prisma.buyer.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Booking cancelled successfully",
        data: deleteUser,
        status: 200,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error deleting booking",
        status: 500,
        error: error,
      },
      { status: 500 }
    );
  }
}

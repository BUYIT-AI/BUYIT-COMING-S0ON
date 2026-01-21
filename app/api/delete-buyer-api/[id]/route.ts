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
        message: `Okay, thanks you can rebook now`,
        data: deleteUser.name,
        status: 200
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error Deleting User",
        error: error,
      },
      { status: 500 }
    );
  }
}

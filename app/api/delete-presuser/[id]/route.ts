import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { logger } from "@/app/lib/logger";

export async function DELETE(
  req: NextRequest,
   context : { params: Promise<{ id: string }> }
) {
  try {
    const { id } = (await context.params)

    if (!id) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.presUser.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Delete the user
    await prisma.presUser.delete({
      where: { id },
    });

    logger.info(`User deleted: ${id}`);

    return NextResponse.json(
      {
        success: true,
        message: "User deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error("Delete presuser error", error);
    return NextResponse.json(
      { success: false, message: "Error deleting user" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

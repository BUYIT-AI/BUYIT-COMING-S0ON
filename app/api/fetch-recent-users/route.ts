import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { logger } from "@/app/lib/logger";


export async function GET(
  req: NextRequest
) {
  try {
    // Get the most recent users (last 10 created)
    const recentUsers = await prisma.presUser.findMany({
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10, // Get last 10 recent users
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          count: recentUsers.length,
          users: recentUsers,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error("Fetch recent users error", error);
    return NextResponse.json(
      {
        success: false,
        data: {
          count: 0,
          users: [],
        },
        message: "Failed to fetch recent users",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

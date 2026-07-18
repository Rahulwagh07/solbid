import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(_req: Request) {
  try {
    const gameData = await prisma.game.findMany({
      where: {
        gameEnded: false,
      },
    });

    if (!gameData) {
      return NextResponse.json({ message: "Game not found" }, { status: 404 });
    }

    return NextResponse.json({ gameData }, { status: 200 });
  } catch (error) {
    console.error("Error fetching game data:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

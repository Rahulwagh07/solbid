import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(_req: Request) {
  try {
    const game = await prisma.gameId.findUnique({
      where: {
        id: 1,
      },
    });

    if (!game) {
      return NextResponse.json(
        { message: "Game ID not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ currGameId: game.currGameId }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

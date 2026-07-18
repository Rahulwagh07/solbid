import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  try {
    if (!id) {
      return NextResponse.json({ message: "Id not found" }, { status: 404 });
    }

    const game = await prisma.game.findUnique({
      where: { gameId: id },
      include: {
        players: {
          select: {
            id: true,
            pda: true,
          },
        },
      },
    });

    if (!game) {
      return NextResponse.json({ message: "Game not found" }, { status: 404 });
    }

    const playerData = game.players.map((player) => ({
      playerPda: player.pda,
      playerId: player.id,
    }));

    return NextResponse.json({
      message: "Player PDAs successfully",
      players: playerData,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

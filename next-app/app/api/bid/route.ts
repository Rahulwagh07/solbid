import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { bidSchema } from '@/schema/game-schema';
import { PlayerRole } from '@prisma/client';
import { convertLamportsToUsdc } from '@/lib/helper';

export async function POST(req: Request) {
  try {
    const userId = req.headers.get('userId');
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const result = bidSchema.omit({ playerData: true }).safeParse(body);

    if (!result.success) {
      return NextResponse.json({
        message: 'Validation failed',
        errors: result.error.errors
      }, { status: 400 });
    }

    const { gameId, bidPda, amount, playerPda, creatorPublicKey, bidCount } = result.data;

    const game = await prisma.game.findUnique({
      where: { gameId:  gameId.toString() },
    });

    if (!game) {
      return NextResponse.json({ message: 'Game not found' }, { status: 404 });
    }

    const updatedGame = await prisma.game.update({
      where: {
        gameId: gameId.toString(),
      },
      data: {
        highestBid: amount,  
        lastBidTime: new Date(),
        totalBids: {
          increment: 1,
        },
        lastBidderId: bidPda,
        prizePool: {
          increment: amount,
        },
      },
    });

    const player = await prisma.player.create({
      data: {
        playerPubkey: creatorPublicKey,
        pda: playerPda,
        totalBidAmount: amount,
        bidCount: bidCount,
        gameId: game.id,
        userId: parseInt(userId),
      },
    });

    await prisma.bid.create({
      data: {
        pda: bidPda,
        amount: amount,
        timestamp: new Date(),
        playerId: player.id,
      },
    });

    const gameData = await prisma.game.findUnique({
      where:{
        id: updatedGame.id,
      },
      include: {
        players: {
          where:{
            id: player.id
          },
          include: {
            bid: true,   
            user:{
              omit: {
                email: true,
                password: true,
                provider: true,
              },
            }
          },
        },
      },
      omit: {
        platformFeePercent: true,
      }
    })

    return NextResponse.json({ message: 'Game updated successfully', gameData }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  try {
    if (!id) {
      return NextResponse.json({ message: "Id not found" }, { status: 404 });
    }

    const game = await prisma.game.findUnique({
      where: { gameId: id },
      include: {
        players: {
          include: {
            bid: {
              select: { pda: true },
            },
          },
        },
      },
    });

    if (!game) {
      return NextResponse.json({ message: 'Game not found' }, { status: 404 });
    }

    const playerPdas = game.players.map(player => player.pda);
    const bidsPdas = game.players.map(player => player.bid ? player.bid.pda : null).filter(Boolean);
    const playersPubkeys = game.players.map(player => player.playerPubkey);

    return NextResponse.json({
      message: "PDAs and public keys fetched successfully",
      playersPda: playerPdas,   
      bidsPda: bidsPdas,        
      playersPubkey: playersPubkeys  
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const userId = req.headers.get('userId');
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const result = bidSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          message: 'Validation failed',
          errors: result.error.errors,
        },
        { status: 400 }
      );
    }
 
    const { gameId, amount, playerPda, creatorPublicKey, bidCount, playerData, bidPda } = result.data;
  
    const game = await prisma.game.findUnique({
      where: { gameId: gameId.toString() },
    });

    if (!game) {
      return NextResponse.json({ message: 'Game not found' }, { status: 404 });
    }

    await prisma.game.update({
      where: {
        gameId: gameId.toString(),
      },
      data: {
        gameEnded: true,
        lastBidTime: new Date(),
      },
    });
 
    for (const player of playerData) {
      const { playerId, total_bid_amount, royalty_earned, bid_count, safe } = player;
      await prisma.player.update({
        where: { id: playerId },
        data: {
          totalBidAmount: convertLamportsToUsdc(total_bid_amount),  
          royaltyEarned: royalty_earned,
          bidCount: bid_count,
          safe: safe,
        }
      });
    }

    const player = await prisma.player.create({
      data: {
        playerPubkey: creatorPublicKey,
        pda: playerPda,
        totalBidAmount: amount,
        bidCount: bidCount,
        gameId: game.id,
        role: PlayerRole.FINISHER,
        userId: parseInt(userId),
      },
    });

    await prisma.bid.create({
      data: {
        pda: bidPda,
        amount: amount,
        timestamp: new Date(),
        playerId: player.id,
      },
    });

    return NextResponse.json({ message: 'Game and players updated successfully'}, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
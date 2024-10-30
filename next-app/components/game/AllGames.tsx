'use client'

import { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from 'date-fns'
import { useSocket } from '@/context/socket-context'
import CreateGame from './CreateGame'
import jwt from 'jsonwebtoken'
import { GameData } from '@/types/game'
import { DollarSign } from 'lucide-react'
import { LoadingSkeleton } from '../skelton/loading-skelton'

interface Game {
  id: number
  gameId: string
  initialBidAmount: number
  highestBid: number
  lastBidTime: string
  totalBids: number
  prizePool: number
  gameEnded: boolean
}

export default function AllGames() {
  const [games, setGames] = useState<Game[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { socket, sendMessage, user, setUser } = useSocket()

  const addOrUpdateGame = useCallback((newGame: Game) => {
    setGames(prevGames => {
      const existingGameIndex = prevGames.findIndex(game => game.gameId === newGame.gameId);
      if (existingGameIndex !== -1) {
        const updatedGames = [...prevGames];
        updatedGames[existingGameIndex] = { ...updatedGames[existingGameIndex], ...newGame };
        return updatedGames.sort((a, b) => new Date(b.lastBidTime).getTime() - new Date(a.lastBidTime).getTime());
      } else {
        return [newGame, ...prevGames].sort((a, b) => new Date(b.lastBidTime).getTime() - new Date(a.lastBidTime).getTime());
      }
    });
  }, []);

  useEffect(() => {
    if (user) {
      fetchGames()
      if (!user.token) {
        const token = user.token || jwt.sign(
          {
            userId: user?.id,
          },
          process.env.NEXT_PUBLIC_SECRET || "",
          {
            expiresIn: "48h",
          }
        );
        setUser({ ...user, token });
      }
    }

    const handleWebSocketMessage = (event: MessageEvent) => {
      try {
        const { type, data } = JSON.parse(event.data);
        if (type === 'new-game' || type === 'game-update') {
          addOrUpdateGame(data);
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    };

    if (socket) {
      socket.addEventListener('message', handleWebSocketMessage);
    }

    return () => {
      if (socket) {
        socket.removeEventListener('message', handleWebSocketMessage);
      }
    }
  }, [socket, addOrUpdateGame, user, setUser])

  const fetchGames = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get('/api/game')
      setGames(response.data.games.sort((a: Game, b: Game) => new Date(b.lastBidTime).getTime() - new Date(a.lastBidTime).getTime()))
    } catch (error) {
      console.error('Error fetching games:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateGame = (gameData: GameData) => {
    sendMessage('create-game', gameData);
  }

  const handleOnClick = (gameStatus: boolean, gameId: number) => {
    if (gameStatus) {
      router.push(`/game/${gameId}`)
    } else {
      router.push(`/live/${gameId}`)
    }
  }

  return (
    <>
      {isLoading ? (
        <LoadingSkeleton/>
      ) : (
        <div className="w-full mx-auto py-8 mt-8 px-2">
        <div className='flex justify-between mx-auto mb-6'>
        <h1 className="text-xl sm:text-3xl font-bold">Active Games</h1>
        <CreateGame onCreateGame={handleCreateGame} />
      </div> 
        <Table>
          <TableHeader>
            <TableRow className='border-b text-slate-300 border-slate-700'>
              <TableHead className='text-slate-300'>Initial Bid</TableHead>
              <TableHead className='text-slate-300'>Highest Bid</TableHead>
              <TableHead className='text-slate-300'>Total Prize</TableHead>
              <TableHead className='text-slate-300'>Total Bids</TableHead>
              <TableHead className='text-slate-300'>Last Bid</TableHead>
              <TableHead className='text-slate-300'>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody >
            {games.map((game) => (
              <TableRow key={game.id} onClick={() => handleOnClick(game.gameEnded, game.id)}
                className='cursor-pointer text-sm bg-gray-700/20 border-b border-slate-700 hover:bg-slate-700 h-12 sm:h-16'>
                <TableCell ><span className='flex items-center'><DollarSign size={16}/> {game.initialBidAmount}</span></TableCell>
                <TableCell> <span className='flex items-center'><DollarSign size={16}/> {game.highestBid}</span>  </TableCell>
                <TableCell  > <span className='flex items-center text-green-500'><DollarSign size={16}/> {game.prizePool}</span></TableCell>
                <TableCell>{game.totalBids}</TableCell>
                <TableCell className='text-sm'>{formatDistanceToNow(new Date(game.lastBidTime), { addSuffix: true })}</TableCell>
                <TableCell>
                  <Badge variant={game.gameEnded ? "secondary" : "default"}>
                    {game.gameEnded ? "Ended" : "Active"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
      )}
    </>
  )
}
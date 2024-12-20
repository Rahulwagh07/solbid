'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader} from "@/components/ui/card"
import { DollarSign, CheckCheck, Crown, Gem} from "lucide-react"
import Sidebar from '@/components/dashboard/Sidebar'
import LiveGames from '@/components/dashboard/LiveGames'
import Transactions from '@/components/dashboard/Transactions'
import PastGames from '@/components/dashboard/PastGames'
import Settings from '@/components/dashboard/Settings'
import MediumScreenSidebar from '@/components/dashboard/MediumScreenSidebar'
import CustomLoader from '@/components/common/Loader'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { DashboardData } from '@/types/dashboard'

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [activeView, setActiveView] = useState('home')
  const [loading, setLoading] = useState(true)
  const session = useSession()
  const router = useRouter()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/dashboard')
      const data = response.data
      setData(data)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading && session.status === "loading") {
    return <CustomLoader styles={"min-h-screen"}/>
  }
  if(!loading && session.status === "unauthenticated"){
    router.push("/")
    return 
  }
  return (
    <main className='bg-slate-800 pt-2'>
      <div className="flex h-screen mt-16 sm:px-10 text-gray-100">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        <main className="flex-1 overflow-y-auto">
          <div className="px-4 py-8 sm:p-8">
            {activeView === 'home' && (
              <>
                <h2 className="text-lg sm:text-3xl font-bold mb-6">Hello, {session?.data?.user.name}</h2>
                <div className="grid gap-6 grid-cols-1">
                  <CardItem title="Total Bids Placed by you" value={data?.metrics?.totalBids?? 0} icon={<CheckCheck className="h-6 w-6 text-blue-500" />} />
                  <CardItem title="Total Amount" value={`$${data?.metrics?.totalAmount?? 0}`} icon={<DollarSign className="h-6 w-6 text-green-500" />} />
                  <CardItem title="Your Highest Bid" value={`$${data?.metrics?.highestBid?? 0}`} icon={<Crown className="h-6 w-6 text-yellow-500" />} />
                  <CardItem title="Total Royalties Earned" value={`$${data?.metrics?.totalRoyalties?? 0}`} icon={<Gem className="h-6 w-6 text-purple-500" />} />
                </div>
              </>
            )}
            {activeView === 'liveGames' && <LiveGames games={data?.liveGames || []} />}
            {activeView === 'transactions' && <Transactions transactions={data?.recentTransactions || []} />}
            {activeView === 'pastGames' && <PastGames games={data?.pastGames || []} />}
            {activeView === 'settings' && <Settings />}
          </div>
        </main>
        <MediumScreenSidebar activeView={activeView} setActiveView={setActiveView} />
      </div>
    </main>
  )
}

function CardItem({ title, value, icon }: { title: string, value: number | string, icon: React.ReactNode }) {
  return (
    <Card className="border-slate-700/90 bg-slate-700/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <p className="font-normal">{title}</p>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-lg sm:text-2xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  )
}
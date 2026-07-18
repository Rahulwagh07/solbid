"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import LiveGames from "@/components/dashboard/LiveGames";
import Transactions from "@/components/dashboard/Transactions";
import PastGames from "@/components/dashboard/PastGames";
import Settings from "@/components/dashboard/Settings";
import MediumScreenSidebar from "@/components/dashboard/MediumScreenSidebar";
import CustomLoader from "@/components/common/Loader";
import { useRouter } from "next/navigation";
import axios from "axios";
import { DashboardData } from "@/types/dashboard";
import { motion } from "motion/react";

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [activeView, setActiveView] = useState("home");
  const [loading, setLoading] = useState(true);
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get("/api/dashboard");
      setData(response.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && session.status === "loading")
    return <CustomLoader styles={"min-h-screen"} />;
  if (!loading && session.status === "unauthenticated") {
    router.push("/");
    return;
  }

  const metrics = [
    {
      title: "Total Bids Placed",
      value: data?.metrics?.totalBids ?? 0,
    },
    {
      title: "Total Amount",
      value: `$${data?.metrics?.totalAmount ?? 0}`,
    },
    {
      title: "Your Highest Bid",
      value: `$${data?.metrics?.highestBid ?? 0}`,
    },
    {
      title: "Royalties Earned",
      value: `$${data?.metrics?.totalRoyalties ?? 0}`,
    },
  ];

  return (
    <main className="min-h-screen bg-background pt-14 pb-28">
      <div className="relative z-10 flex h-[calc(100vh-3.5rem)]">
        <main className="flex-1 overflow-y-auto">
          <div className="px-4 py-8 sm:p-8 max-w-7xl mx-auto w-full">
            {activeView === "home" && (
              <>
                <motion.div
                  className="mb-8"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-text">
                    Hello, {session?.data?.user.name} 👋
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    Here&apos;s your activity overview
                  </p>
                </motion.div>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
                  {metrics.map((metric, index) => (
                    <motion.div
                      key={metric.title}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.08 }}
                    >
                      <MetricCard title={metric.title} value={metric.value} />
                    </motion.div>
                  ))}
                </div>
              </>
            )}
            {activeView === "liveGames" && (
              <LiveGames games={data?.liveGames || []} />
            )}
            {activeView === "transactions" && (
              <Transactions transactions={data?.recentTransactions || []} />
            )}
            {activeView === "pastGames" && (
              <PastGames games={data?.pastGames || []} />
            )}
            {activeView === "settings" && <Settings />}
          </div>
        </main>
        <MediumScreenSidebar
          activeView={activeView}
          setActiveView={setActiveView}
        />
      </div>
    </main>
  );
}

function MetricCard({
  title,
  value,
}: {
  title: string;
  value: number | string;
}) {
  return (
    <div className="bg-surface border border-border shadow-sm rounded-xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-muted">{title}</p>
      </div>
      <div className="font-display text-2xl font-bold text-text">{value}</div>
    </div>
  );
}

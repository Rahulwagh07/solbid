import AllGames from "@/components/game/AllGames";
import { getServerSession } from "next-auth";
import React from "react";
import { Redirect } from "@/components/Redirect";
import { authOptions } from "@/lib/auth-options";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return <Redirect to={"/"} />;
  }
  return (
    <main className="min-h-screen bg-background pt-16">
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <AllGames />
      </div>
    </main>
  );
}

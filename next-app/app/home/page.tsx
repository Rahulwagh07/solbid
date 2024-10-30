import AllGames from '@/components/game/AllGames'
import { getServerSession } from 'next-auth';
import React from 'react'
import { Redirect } from '@/components/Redirect';
import { authOptions } from '@/lib/auth-options';

export default async function Home() {
  const session = await getServerSession(authOptions);
   
  if (!session?.user) {
    return <Redirect to={'/'} />;
  }
  return (
    <main className='bg-slate-800 lg:p-12'>
      <div className="flex min-h-screen  mx-auto gap-12 w-full xl:w-10/12 px-4 py-8">
        <AllGames/>
      </div>
    </main>
  )
}
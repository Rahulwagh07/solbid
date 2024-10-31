import { Home, History, Users, Trophy, Settings } from "lucide-react"
import SidebarItem from "./SidebarItem"

interface SidebarProps {
  activeView: string
  setActiveView: (view: string) => void
}

export default function Sidebar({ activeView, setActiveView }: SidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col w-64 bg-slate-800/50 border-r border-slate-700">
      <nav className="flex-1 p-4 space-y-2">
        <SidebarItem icon={<Home size={20} />} label="Home" active={activeView === 'home'} onClick={() => setActiveView('home')} />
        <SidebarItem icon={<History size={20} />} label="Transactions" active={activeView === 'transactions'} onClick={() => setActiveView('transactions')} />
        <SidebarItem icon={<Users size={20} />} label="Live Games" active={activeView === 'liveGames'} onClick={() => setActiveView('liveGames')} />
        <SidebarItem icon={<Trophy size={20} />} label="Past Games" active={activeView === 'pastGames'} onClick={() => setActiveView('pastGames')} />
        <SidebarItem icon={<Settings size={20} />} label="Settings" active={activeView === 'settings'} onClick={() => setActiveView('settings')} />
      </nav>
    </aside>
  )
}
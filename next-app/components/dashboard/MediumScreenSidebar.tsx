import { Home, History, Users, Trophy, Settings } from "lucide-react"

interface MobileSidebarProps {
  activeView: string
  setActiveView: (view: string) => void
}

export default function MediumScreenSidebar({ activeView, setActiveView }: MobileSidebarProps) {

  const gradientStyle = {
    background: `linear-gradient(to top, rgba(15, 23, 42, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)`,
  };

  return (
    <nav 
    style={gradientStyle}
    className={`lg:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700`}>
      <div className="flex justify-around">
        <button className="p-4 text-slate-400" onClick={() => setActiveView('home')}><Home size={24} /></button>
        <button className="p-4 text-slate-400" onClick={() => setActiveView('transactions')}><History size={24} /></button>
        <button className="p-4 text-slate-400" onClick={() => setActiveView('liveGames')}><Users size={24} /></button>
        <button className="p-4 text-slate-400" onClick={() => setActiveView('pastGames')}><Trophy size={24} /></button>
        <button className="p-4 text-slate-400" onClick={() => setActiveView('settings')}><Settings size={24} /></button>
      </div>
    </nav>
  )
}
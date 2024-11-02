import { Home, History, Users, ArrowRightLeft, Settings } from "lucide-react";
import SidebarItem from "./SidebarItem";

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export default function Sidebar({ activeView, setActiveView }: SidebarProps) {
  const items = [
    { view: "home", label: "Home", Icon: <Home size={20} /> },
    {
      view: "transactions",
      label: "Transactions",
      Icon: <ArrowRightLeft size={20} />,
    },
    { view: "liveGames", label: "Live Games", Icon: <Users size={20} /> },
    { view: "pastGames", label: "Past Games", Icon: <History size={20} /> },
    { view: "settings", label: "Settings", Icon: <Settings size={20} /> },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-slate-800/50 border-r border-slate-700">
      <nav className="flex-1 p-4 space-y-2 text-white">
        {items.map(({ view, label, Icon }) => (
          <SidebarItem
            key={view}
            icon={Icon}
            label={label}
            active={activeView === view}
            onClick={() => setActiveView(view)}
          />
        ))}
      </nav>
    </aside>
  );
}

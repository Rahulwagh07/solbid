import { Home, History, Users, ArrowLeftRight, Settings } from "lucide-react";

interface MobileSidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export default function MediumScreenSidebar({
  activeView,
  setActiveView,
}: MobileSidebarProps) {
  const icons = [
    { view: "home", Icon: Home },
    { view: "transactions", Icon: ArrowLeftRight },
    { view: "liveGames", Icon: Users },
    { view: "pastGames", Icon: History },
    { view: "settings", Icon: Settings },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 sm:gap-6 px-6 py-3 bg-white/70 backdrop-blur-3xl border border-border/50 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.12)]">
        {icons.map(({ view, Icon }) => (
          <button
            key={view}
            className={`group relative flex flex-col items-center justify-center p-3 transition-all duration-300 rounded-full ${
              activeView === view
                ? "text-black bg-black/5"
                : "text-muted hover:text-text hover:bg-black/5"
            }`}
            onClick={() => setActiveView(view)}
          >
            <Icon
              size={24}
              className={`transition-transform duration-300 ${
                activeView === view ? "scale-110" : "group-hover:scale-110"
              }`}
            />
          </button>
        ))}
      </div>
    </nav>
  );
}

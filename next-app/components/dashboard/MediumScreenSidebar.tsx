import { Home, History, Users, ArrowLeftRight, Settings } from "lucide-react";

interface MobileSidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export default function MediumScreenSidebar({
  activeView,
  setActiveView,
}: MobileSidebarProps) {
  const gradientStyle = {
    background: `linear-gradient(to top, rgba(15, 23, 42, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)`,
  };

  const icons = [
    { view: "home", Icon: Home },
    { view: "transactions", Icon: ArrowLeftRight },
    { view: "liveGames", Icon: Users },
    { view: "pastGames", Icon: History },
    { view: "settings", Icon: Settings },
  ];

  return (
    <nav
      style={gradientStyle}
      className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700"
    >
      <div className="flex justify-around text-white">
        {icons.map(({ view, Icon }) => (
          <button
            key={view}
            className="p-4"
            onClick={() => setActiveView(view)}
          >
            <Icon
              size={24}
              className={`transition-transform duration-200 ${
                activeView === view ? "text-blue-500 scale-110" : "text-white"
              }`}
            />
          </button>
        ))}
      </div>
    </nav>
  );
}

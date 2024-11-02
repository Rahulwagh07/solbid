interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

export default function SidebarItem({
  icon,
  label,
  active,
  onClick,
}: SidebarItemProps) {
  return (
    <button
      className={`flex items-center space-x-2 w-full p-2 rounded-lg transition-colors duration-200 ${
        active ? "bg-slate-700" : "hover:bg-slate-700 hover:text-white"
      }  `}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
    >
      <span
        className={`transition-colors duration-200 ${
          active && "text-blue-500"
        }`}
      >
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
}

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
      className={`flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg text-sm transition-colors duration-200 ${
        active
          ? "bg-accent/10 text-accent font-medium"
          : "text-muted hover:bg-surface-2 hover:text-text"
      }`}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
    >
      <span
        className={`transition-colors duration-200 ${
          active ? "text-accent" : "text-muted"
        }`}
      >
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
}

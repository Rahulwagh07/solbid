interface SidebarItemProps {
  icon: React.ReactNode
  label: string
  active: boolean
  onClick: () => void
}

export default function SidebarItem({ icon, label, active, onClick }: SidebarItemProps) {
  return (
    <button
      className={`flex items-center space-x-2 w-full p-2 rounded-lg transition-colors ${
        active ? 'bg-slate-700 text-white' : 'text-gray-400 hover:bg-slate-700 hover:text-white'
      }`}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}
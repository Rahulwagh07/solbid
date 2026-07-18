import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface GenericCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  to: string;
  linkText: string;
}

export default function DataNotFoundCard({
  icon: Icon,
  title,
  description,
  to,
  linkText,
}: GenericCardProps) {
  return (
    <div className="w-full mx-auto surface p-8 flex flex-col items-center justify-center text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 mb-4">
        <Icon className="w-6 h-6 text-accent" />
      </div>
      <h3 className="font-display text-lg font-bold text-text mb-2">{title}</h3>
      <div className="flex gap-2 items-center">
        <p className="text-sm text-muted">{description}</p>
        {linkText && to && (
          <Link
            href={to}
            className="text-sm font-medium text-accent hover:text-accent-hover transition-colors underline-offset-4 hover:underline"
          >
            {linkText}
          </Link>
        )}
      </div>
    </div>
  );
}

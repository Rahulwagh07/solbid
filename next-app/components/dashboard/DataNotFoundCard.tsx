import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
    <Card className="w-full mx-auto bg-slate-700/50 border-[0.5px] border-slate-600">
      <CardContent className="flex flex-col items-start justify-center p-6 text-center">
        <Icon className="w-12 h-12 mb-4 text-blue-500" />
        <h3 className="text-lg   font-semibold mb-2">{title}</h3>
        <div className="flex gap-2 items-center">
          <p className="text-sm text-gray-200">{description}</p>
          <Link
            href={to}
            className=" underline font-[525] text-blue-400 hover:text-blue-300 "
          >
            {linkText}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

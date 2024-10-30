import { Skeleton } from "@/components/ui/skeleton";
import { NavbarSkeleton } from "./appbar-skeleton";

export function LoadingSkeleton() {
  return (
    <div className="w-full bg-slate-800">
      <NavbarSkeleton/>
      <div className="xl:w-11/12 items-center min-h-screen py-40 mx-auto">
      <div className="space-y-6 ">
      {[...Array(4)].map((_, index) => (
        <Skeleton key={index} className="h-12 w-full bg-slate-700" />
      ))}
    </div>
      </div>
     </div>
  );
}

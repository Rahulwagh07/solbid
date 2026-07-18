import { Skeleton } from "@/components/ui/skeleton";
import { NavbarSkeleton } from "./appbar-skeleton";

export function LoadingSkeleton() {
  return (
    <div className="w-full bg-background min-h-screen">
      <NavbarSkeleton />
      <div className="xl:w-11/12 items-center min-h-screen py-40 mx-auto">
        <div className="space-y-6 px-4">
          {[...Array(4)].map((_, index) => (
            <Skeleton
              key={index}
              className="h-12 w-full bg-surface-2 rounded-lg"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

import { SkeletonLoader } from "./skeleton-loader";

export function NavbarSkeleton() {
  return (
    <div className="flex h-16 items-center border-b border-border bg-background px-4">
      <div className="flex-1">
        <SkeletonLoader className="w-40 h-8" />
      </div>
      <div className="hidden md:flex gap-4">
        <SkeletonLoader className="w-20 h-10" />
        <SkeletonLoader className="w-24 h-10" />
      </div>
      <SkeletonLoader className="w-8 h-8 md:hidden mr-4" />
      <SkeletonLoader className="h-8 w-8 rounded-full" />
    </div>
  );
}

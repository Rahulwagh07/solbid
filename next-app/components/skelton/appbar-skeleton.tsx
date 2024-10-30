import { SkeletonLoader } from "./skeleton-loader"

export function NavbarSkeleton() {
  return (
    <header className="fixed top-0 left-0 right-0   z-50 bg-slate-800/90 backdrop-blur-md">
      <nav className="w-full xl:w-9/12 mx-auto py-3 flex justify-between items-center pl-4 md:px-4 lg:px-8 xl:px-0">
        <SkeletonLoader className="w-40 h-8" />
        <div className="hidden md:flex space-x-6">
          <SkeletonLoader className="w-20 h-10" />
          <SkeletonLoader className="w-24 h-10" />
        </div>
        <SkeletonLoader className="w-8 h-8 md:hidden mr-4" />
      </nav>
    </header>
  )
}
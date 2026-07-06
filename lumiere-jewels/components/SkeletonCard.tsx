export default function SkeletonCard() {
  return (
    <div className="block">
      <div className="bg-[#fff8fa] rounded-[20px] overflow-hidden border border-[#f0c4d0]/20 shadow-[0_4px_20px_rgba(212,132,154,0.04)]">
        {/* Image skeleton */}
        <div className="aspect-square animate-shimmer" />
        {/* Info skeleton */}
        <div className="p-3.5 space-y-2">
          <div className="h-2 w-12 animate-shimmer rounded-full" />
          <div className="h-3.5 w-3/4 animate-shimmer rounded-full" />
          <div className="flex items-center justify-between mt-2.5">
            <div className="h-3 w-16 animate-shimmer rounded-full" />
            <div className="h-7 w-7 animate-shimmer rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

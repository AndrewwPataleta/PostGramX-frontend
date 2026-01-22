import { Skeleton } from "@/components/ui/skeleton";

interface MarketplaceCardSkeletonProps {
  className?: string;
}

export function MarketplaceCardSkeleton({
  className,
}: MarketplaceCardSkeletonProps) {
  return (
    <div className={className}>
      <div className="flex items-start gap-3 mb-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex-1 min-w-0 space-y-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="text-right flex-shrink-0 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16 ml-auto" />
        </div>
      </div>

      <div className="flex items-center justify-between mb-3 pb-3 border-b border-border/30">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-3 w-16" />
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <Skeleton className="h-14 rounded-lg" />
        <Skeleton className="h-14 rounded-lg" />
        <Skeleton className="h-14 rounded-lg" />
      </div>

      <Skeleton className="h-6 w-full mb-3" />
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  );
}

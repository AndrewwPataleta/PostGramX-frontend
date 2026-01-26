import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  items?: number;
  className?: string;
  itemClassName?: string;
}

const LoadingSkeleton = ({
  items = 3,
  className,
  itemClassName,
}: LoadingSkeletonProps) => {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: items }).map((_, index) => (
        <div
          key={`loading-skeleton-${index}`}
          className={cn("rounded-2xl border border-border/50 bg-card/80 p-4", itemClassName)}
        >
          <Skeleton className="h-24 rounded-xl" />
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;

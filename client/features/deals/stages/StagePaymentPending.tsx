import InfoCard from "@/components/deals/InfoCard";
import { cn } from "@/lib/utils";

interface StagePaymentPendingProps {
  isCurrent: boolean;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export default function StagePaymentPending({
  isCurrent,
  onRefresh,
  isRefreshing,
}: StagePaymentPendingProps) {
  return (
    <InfoCard title="Payment pending">
      <p className="text-xs text-muted-foreground">
        Payment is being confirmed on-chain. We will update this screen automatically.
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className={cn(
            "rounded-lg border border-border/60 px-4 py-2 text-xs font-semibold text-foreground",
            isRefreshing ? "cursor-not-allowed opacity-60" : "hover:border-primary/40"
          )}
        >
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>
      {!isCurrent ? (
        <p className="text-xs text-muted-foreground">Payment confirmation completed.</p>
      ) : null}
    </InfoCard>
  );
}

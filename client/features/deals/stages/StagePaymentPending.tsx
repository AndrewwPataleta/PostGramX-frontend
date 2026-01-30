import InfoCard from "@/components/deals/InfoCard";
import { cn } from "@/lib/utils";

import type { DealListItem } from "@/types/deals";

interface StagePaymentPendingProps {
  deal: DealListItem;
  readonly: boolean;
  onAction?: {
    onRefresh?: () => void;
  };
  isRefreshing?: boolean;
}

export default function StagePaymentPending({ onAction, isRefreshing }: StagePaymentPendingProps) {
  return (
    <InfoCard title="Payment pending">
      <p className="text-xs text-muted-foreground">
        Payment is being confirmed on-chain. We will update this screen automatically.
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onAction?.onRefresh}
          disabled={isRefreshing || !onAction?.onRefresh}
          className={cn(
            "rounded-lg border border-border/60 px-4 py-2 text-xs font-semibold text-foreground",
            isRefreshing || !onAction?.onRefresh
              ? "cursor-not-allowed opacity-60"
              : "hover:border-primary/40"
          )}
        >
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>
    </InfoCard>
  );
}

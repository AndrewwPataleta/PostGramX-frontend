import InfoCard from "@/components/deals/InfoCard";
import type { DealListItem } from "@/types/deals";
import { escrowStatusToLabel } from "@/features/deals/dealStageMachine";

interface StageDoneProps {
  deal: DealListItem;
  readonly: boolean;
  onAction?: Record<string, never>;
}

const formatDateTime = (value?: string) => {
  if (!value) {
    return "-";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function StageDone({ deal }: StageDoneProps) {
  return (
    <InfoCard title="Deal complete">
      <p className="text-xs text-muted-foreground">
        Status: <span className="font-semibold text-foreground">{escrowStatusToLabel(deal.escrowStatus)}</span>
      </p>
      <p className="text-xs text-muted-foreground">
        Last update: <span className="font-semibold text-foreground">{formatDateTime(deal.lastActivityAt)}</span>
      </p>
      <p className="text-xs text-muted-foreground">
        Created: <span className="font-semibold text-foreground">{formatDateTime(deal.createdAt)}</span>
      </p>
    </InfoCard>
  );
}

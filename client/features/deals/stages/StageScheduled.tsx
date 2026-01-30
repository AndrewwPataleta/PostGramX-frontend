import InfoCard from "@/components/deals/InfoCard";
import type { DealListItem } from "@/types/deals";

interface StageScheduledProps {
  deal: DealListItem;
  readonly: boolean;
  onAction?: Record<string, never>;
}

const formatDateTime = (value?: string) => {
  if (!value) {
    return "Not scheduled yet";
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

export default function StageScheduled({ deal }: StageScheduledProps) {
  return (
    <InfoCard title="Scheduled">
      <p className="text-xs text-muted-foreground">
        Scheduled time: <span className="font-semibold text-foreground">{formatDateTime(deal.scheduledAt)}</span>
      </p>
      {!deal.scheduledAt ? (
        <p className="text-xs text-muted-foreground">
          No schedule selected yet. Switch back to the schedule step to pick a time.
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">Waiting for the post to go live.</p>
      )}
    </InfoCard>
  );
}

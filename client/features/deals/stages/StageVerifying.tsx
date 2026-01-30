import InfoCard from "@/components/deals/InfoCard";
import type { DealListItem } from "@/types/deals";
import { openTelegramLink } from "@/lib/telegramLinks";
import { cn } from "@/lib/utils";

interface StageVerifyingProps {
  deal: DealListItem;
  readonly: boolean;
  onAction?: Record<string, never>;
}

export default function StageVerifying({ deal }: StageVerifyingProps) {
  const handleOpenPost = () => {
    if (deal.postUrl) {
      openTelegramLink(deal.postUrl);
    }
  };

  return (
    <InfoCard title="Verifying post">
      <p className="text-xs text-muted-foreground">
        The post has been published. We are verifying it remains visible for the required duration.
      </p>
      {deal.postUrl ? (
        <button
          type="button"
          onClick={handleOpenPost}
          className={cn(
            "rounded-lg border border-border/60 px-4 py-2 text-xs font-semibold text-foreground",
            "hover:border-primary/40"
          )}
        >
          Open post
        </button>
      ) : (
        <p className="text-xs text-muted-foreground">Post link will appear once available.</p>
      )}
    </InfoCard>
  );
}

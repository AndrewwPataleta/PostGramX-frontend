import InfoCard from "@/components/deals/InfoCard";
import type { DealListItem } from "@/types/deals";
import { openTelegramLink } from "@/lib/telegramLinks";
import { cn } from "@/lib/utils";

interface StageSendPostProps {
  deal: DealListItem;
  isCurrent: boolean;
}

const BOT_USERNAME = "postgramx_bot";

export default function StageSendPost({ deal, isCurrent }: StageSendPostProps) {
  const botLink = `https://t.me/${BOT_USERNAME}?start=deal_${deal.id}`;

  return (
    <InfoCard title="Send post">
      <p className="text-xs text-muted-foreground">
        Send your creative to the PostgramX bot so the publisher can review it. Include any
        required links or assets.
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => openTelegramLink(botLink)}
          className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          Open bot
        </button>
        <button
          type="button"
          disabled={!isCurrent}
          className={cn(
            "rounded-lg border border-border/60 px-4 py-2 text-xs font-semibold text-foreground",
            !isCurrent && "cursor-not-allowed opacity-60"
          )}
        >
          I sent the post
        </button>
      </div>
      {!isCurrent ? (
        <p className="text-xs text-muted-foreground">This step is already completed.</p>
      ) : null}
    </InfoCard>
  );
}

import InfoCard from "@/components/deals/InfoCard";
import type { DealListItem } from "@/types/deals";
import { openTelegramLink } from "@/lib/telegramLinks";
import { cn } from "@/lib/utils";

interface StageAdminApprovalProps {
  deal: DealListItem;
  isCurrent: boolean;
}

const BOT_USERNAME = "postgramx_bot";

export default function StageAdminApproval({ deal, isCurrent }: StageAdminApprovalProps) {
  const botLink = `https://t.me/${BOT_USERNAME}?start=deal_${deal.id}`;
  const canApprove = deal.userRoleInDeal === "publisher" || deal.userRoleInDeal === "publisher_manager";

  return (
    <InfoCard title="Admin approval">
      <p className="text-xs text-muted-foreground">
        Waiting for channel admin approval before payment can proceed.
      </p>
      {canApprove ? (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={!isCurrent}
            className={cn(
              "rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground",
              !isCurrent && "cursor-not-allowed opacity-60"
            )}
          >
            Approve
          </button>
          <button
            type="button"
            disabled={!isCurrent}
            className={cn(
              "rounded-lg border border-border/60 px-4 py-2 text-xs font-semibold text-foreground",
              !isCurrent && "cursor-not-allowed opacity-60"
            )}
          >
            Reject
          </button>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          Only channel admins can approve this stage.
        </p>
      )}
      <button
        type="button"
        onClick={() => openTelegramLink(botLink)}
        className="mt-2 rounded-lg border border-border/60 px-4 py-2 text-xs font-semibold text-foreground transition hover:border-primary/40"
      >
        Check in bot
      </button>
    </InfoCard>
  );
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import InfoCard from "@/components/deals/InfoCard";
import type { DealListItem } from "@/types/deals";
import { openTelegramLink } from "@/lib/telegramLinks";
import { post } from "@/api/core/apiClient";
import { getErrorMessage } from "@/lib/api/errors";
import { cn } from "@/lib/utils";

interface StageSendPostProps {
  deal: DealListItem;
  readonly: boolean;
  onAction?: {
    onOpenBot?: () => void;
    onConfirmSent?: () => Promise<void> | void;
  };
}

const BOT_USERNAME = "postgramx_bot";

export default function StageSendPost({ deal, readonly, onAction }: StageSendPostProps) {
  const queryClient = useQueryClient();
  const botLink = `https://t.me/${BOT_USERNAME}?start=deal_${deal.id}`;
  const hasCreative = Boolean(deal.creativeText);

  const mutation = useMutation({
    mutationFn: async () => {
      if (import.meta.env.VITE_API_MOCK === "true") {
        console.info("Mock creative submit", { dealId: deal.id });
        return null;
      }
      return post<unknown, { dealId: string }>("/deals/creative/submit", { dealId: deal.id });
    },
    onSuccess: () => {
      toast.success("Post submitted");
      queryClient.invalidateQueries({ queryKey: ["deal", deal.id] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Unable to submit post"));
    },
  });

  if (readonly) {
    return (
      <InfoCard title="Send post">
        <p className="text-xs text-muted-foreground">Waiting for advertiser to complete this step.</p>
        {hasCreative ? (
          <div className="rounded-lg border border-border/60 bg-background/50 p-3 text-xs text-foreground">
            Creative submitted.
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">No creative submitted yet.</p>
        )}
      </InfoCard>
    );
  }

  const handleOpenBot = () => {
    if (onAction?.onOpenBot) {
      onAction.onOpenBot();
      return;
    }
    openTelegramLink(botLink);
  };

  const handleConfirmSent = () => {
    if (onAction?.onConfirmSent) {
      onAction.onConfirmSent();
      return;
    }
    mutation.mutate();
  };

  return (
    <InfoCard title="Send post">
      <p className="text-xs text-muted-foreground">
        Send your creative to the PostgramX bot so the publisher can review it. Include any
        required links or assets.
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleOpenBot}
          className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          Open bot
        </button>
        <button
          type="button"
          onClick={handleConfirmSent}
          disabled={mutation.isPending}
          className={cn(
            "rounded-lg border border-border/60 px-4 py-2 text-xs font-semibold text-foreground",
            mutation.isPending && "cursor-not-allowed opacity-60"
          )}
        >
          I sent the post
        </button>
      </div>
      {hasCreative ? (
        <p className="text-xs text-muted-foreground">Creative submitted. Waiting for review.</p>
      ) : null}
    </InfoCard>
  );
}

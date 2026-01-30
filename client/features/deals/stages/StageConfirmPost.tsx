import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import InfoCard from "@/components/deals/InfoCard";
import type { DealListItem } from "@/types/deals";
import { post } from "@/api/core/apiClient";
import { getErrorMessage } from "@/lib/api/errors";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n/LanguageProvider";

interface StageConfirmPostProps {
  deal: DealListItem;
  readonly: boolean;
  onAction?: {
    onConfirm?: () => Promise<void> | void;
    onRequestChanges?: () => Promise<void> | void;
  };
}

export default function StageConfirmPost({
  deal,
  readonly,
  onAction,
}: StageConfirmPostProps) {
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  const creativeText = deal.creativeText;

  const confirmMutation = useMutation({
    mutationFn: async () => {
      if (import.meta.env.VITE_API_MOCK === "true") {
        console.info("Mock creative confirm", { dealId: deal.id });
        return null;
      }
      return post<unknown, { dealId: string }>("/deals/creative/confirm", { dealId: deal.id });
    },
    onSuccess: () => {
      toast.success(t("deals.stage.confirmPost.confirmedToast"));
      queryClient.invalidateQueries({ queryKey: ["deal", deal.id] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, t("deals.stage.confirmPost.confirmError")));
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async () => {
      if (import.meta.env.VITE_API_MOCK === "true") {
        console.info("Mock creative reject", { dealId: deal.id });
        return null;
      }
      return post<unknown, { dealId: string }>("/deals/creative/reject", { dealId: deal.id });
    },
    onSuccess: () => {
      toast.success(t("deals.stage.confirmPost.requestedToast"));
      queryClient.invalidateQueries({ queryKey: ["deal", deal.id] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, t("deals.stage.confirmPost.requestError")));
    },
  });

  if (readonly) {
    return (
      <InfoCard title={t("deals.stage.confirmPost.title")}>
        <p className="text-xs text-muted-foreground">
          {t("deals.stage.confirmPost.readonly")}
        </p>
        {creativeText ? (
          <div className="rounded-lg border border-border/60 bg-background/50 p-3 text-xs text-foreground">
            {creativeText}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border/60 bg-background/40 p-3 text-xs text-muted-foreground">
            {t("deals.stage.confirmPost.waitingCreative")}
          </div>
        )}
      </InfoCard>
    );
  }

  const handleConfirm = () => {
    if (onAction?.onConfirm) {
      onAction.onConfirm();
      return;
    }
    confirmMutation.mutate();
  };

  const handleRequestChanges = () => {
    if (onAction?.onRequestChanges) {
      onAction.onRequestChanges();
      return;
    }
    rejectMutation.mutate();
  };

  return (
    <InfoCard title={t("deals.stage.confirmPost.title")}>
      {creativeText ? (
        <div className="rounded-lg border border-border/60 bg-background/50 p-3 text-xs text-foreground">
          {creativeText}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border/60 bg-background/40 p-3 text-xs text-muted-foreground">
          {t("deals.stage.confirmPost.waitingCreative")}
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!creativeText || confirmMutation.isPending}
          className={cn(
            "rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition",
            !creativeText || confirmMutation.isPending
              ? "cursor-not-allowed opacity-60"
              : "hover:bg-primary/90"
          )}
        >
          {t("common.confirm")}
        </button>
        <button
          type="button"
          onClick={handleRequestChanges}
          disabled={!creativeText || rejectMutation.isPending}
          className={cn(
            "rounded-lg border border-border/60 px-4 py-2 text-xs font-semibold text-foreground",
            !creativeText || rejectMutation.isPending
              ? "cursor-not-allowed opacity-60"
              : "hover:border-primary/40"
          )}
        >
          {t("common.requestChanges")}
        </button>
      </div>
    </InfoCard>
  );
}

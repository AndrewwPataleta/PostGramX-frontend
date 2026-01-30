import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import InfoCard from "@/components/deals/InfoCard";
import type { DealListItem } from "@/types/deals";
import { post } from "@/api/core/apiClient";
import { getErrorMessage } from "@/lib/api/errors";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n/LanguageProvider";

interface StageAdminApprovalProps {
  deal: DealListItem;
  readonly: boolean;
  onAction?: {
    onApprove?: () => Promise<void> | void;
    onRequestChanges?: () => Promise<void> | void;
    onReject?: () => Promise<void> | void;
  };
}

export default function StageAdminApproval({
  deal,
  readonly,
  onAction,
}: StageAdminApprovalProps) {
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  const approveMutation = useMutation({
    mutationFn: async () => {
      if (import.meta.env.VITE_API_MOCK === "true") {
        console.info("Mock admin approve", { dealId: deal.id });
        return null;
      }
      return post<unknown, { dealId: string }>("/deals/creative/approve", {
        data: { dealId: deal.id },
      });
    },
    onSuccess: () => {
      toast.success(t("deals.stage.adminApproval.approvedToast"));
      queryClient.invalidateQueries({ queryKey: ["deal", deal.id] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, t("deals.stage.adminApproval.approveError")));
    },
  });

  const requestChangesMutation = useMutation({
    mutationFn: async () => {
      if (import.meta.env.VITE_API_MOCK === "true") {
        console.info("Mock request changes", { dealId: deal.id });
        return null;
      }
      return post<unknown, { dealId: string }>("/deals/creative/edits", {
        data: { dealId: deal.id },
      });
    },
    onSuccess: () => {
      toast.success(t("deals.stage.adminApproval.requestedToast"));
      queryClient.invalidateQueries({ queryKey: ["deal", deal.id] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, t("deals.stage.adminApproval.requestError")));
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async () => {
      if (import.meta.env.VITE_API_MOCK === "true") {
        console.info("Mock admin reject", { dealId: deal.id });
        return null;
      }
      return post<unknown, { dealId: string }>("/deals/creative/reject", {
        data: { dealId: deal.id },
      });
    },
    onSuccess: () => {
      toast.success(t("deals.stage.adminApproval.rejectedToast"));
      queryClient.invalidateQueries({ queryKey: ["deal", deal.id] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, t("deals.stage.adminApproval.rejectError")));
    },
  });

  if (readonly) {
    return (
      <InfoCard title={t("deals.stage.adminApproval.title")}>
        <p className="text-xs text-muted-foreground">
          {t("deals.stage.adminApproval.readonly")}
        </p>
      </InfoCard>
    );
  }

  const handleApprove = () => {
    if (onAction?.onApprove) {
      onAction.onApprove();
      return;
    }
    approveMutation.mutate();
  };

  const handleRequestChanges = () => {
    if (onAction?.onRequestChanges) {
      onAction.onRequestChanges();
      return;
    }
    requestChangesMutation.mutate();
  };

  const handleReject = () => {
    if (onAction?.onReject) {
      onAction.onReject();
      return;
    }
    rejectMutation.mutate();
  };

  return (
    <InfoCard title={t("deals.stage.adminApproval.title")}>
      <p className="text-xs text-muted-foreground">
        {t("deals.stage.adminApproval.description")}
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleApprove}
          disabled={approveMutation.isPending}
          className={cn(
            "rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground",
            approveMutation.isPending && "cursor-not-allowed opacity-60"
          )}
        >
          {t("common.approve")}
        </button>
        <button
          type="button"
          onClick={handleRequestChanges}
          disabled={requestChangesMutation.isPending}
          className={cn(
            "rounded-lg border border-border/60 px-4 py-2 text-xs font-semibold text-foreground",
            requestChangesMutation.isPending && "cursor-not-allowed opacity-60"
          )}
        >
          {t("common.requestChanges")}
        </button>
        <button
          type="button"
          onClick={handleReject}
          disabled={rejectMutation.isPending}
          className={cn(
            "rounded-lg border border-border/60 px-4 py-2 text-xs font-semibold text-foreground",
            rejectMutation.isPending && "cursor-not-allowed opacity-60"
          )}
        >
          {t("common.reject")}
        </button>
      </div>
    </InfoCard>
  );
}

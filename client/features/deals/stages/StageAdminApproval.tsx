import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import InfoCard from "@/components/deals/InfoCard";
import type { DealListItem } from "@/types/deals";
import { post } from "@/api/core/apiClient";
import { getErrorMessage } from "@/lib/api/errors";
import { cn } from "@/lib/utils";

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

  const approveMutation = useMutation({
    mutationFn: async () => {
      if (import.meta.env.VITE_API_MOCK === "true") {
        console.info("Mock admin approve", { dealId: deal.id });
        return null;
      }
      return post<unknown, { dealId: string }>("/deals/creative/approve", { dealId: deal.id });
    },
    onSuccess: () => {
      toast.success("Approved");
      queryClient.invalidateQueries({ queryKey: ["deal", deal.id] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Unable to approve"));
    },
  });

  const requestChangesMutation = useMutation({
    mutationFn: async () => {
      if (import.meta.env.VITE_API_MOCK === "true") {
        console.info("Mock request changes", { dealId: deal.id });
        return null;
      }
      return post<unknown, { dealId: string }>("/deals/creative/edits", { dealId: deal.id });
    },
    onSuccess: () => {
      toast.success("Requested changes");
      queryClient.invalidateQueries({ queryKey: ["deal", deal.id] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Unable to request changes"));
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async () => {
      if (import.meta.env.VITE_API_MOCK === "true") {
        console.info("Mock admin reject", { dealId: deal.id });
        return null;
      }
      return post<unknown, { dealId: string }>("/deals/creative/reject", { dealId: deal.id });
    },
    onSuccess: () => {
      toast.success("Rejected");
      queryClient.invalidateQueries({ queryKey: ["deal", deal.id] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Unable to reject"));
    },
  });

  if (readonly) {
    return (
      <InfoCard title="Admin review">
        <p className="text-xs text-muted-foreground">Waiting for admin review.</p>
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
    <InfoCard title="Admin review">
      <p className="text-xs text-muted-foreground">
        Review the submitted creative and decide whether to approve, request changes, or reject.
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
          Approve
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
          Request changes
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
          Reject
        </button>
      </div>
    </InfoCard>
  );
}

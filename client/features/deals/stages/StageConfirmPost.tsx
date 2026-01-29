import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import InfoCard from "@/components/deals/InfoCard";
import type { DealListItem } from "@/types/deals";
import { post } from "@/api/core/apiClient";
import { getErrorMessage } from "@/lib/api/errors";
import { cn } from "@/lib/utils";

interface StageConfirmPostProps {
  deal: DealListItem;
  isCurrent: boolean;
}

export default function StageConfirmPost({ deal, isCurrent }: StageConfirmPostProps) {
  const queryClient = useQueryClient();
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
      toast.success("Creative confirmed");
      queryClient.invalidateQueries({ queryKey: ["deal", deal.id] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Unable to confirm creative"));
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
      toast.success("Requested changes");
      queryClient.invalidateQueries({ queryKey: ["deal", deal.id] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Unable to request changes"));
    },
  });

  return (
    <InfoCard title="Confirm post">
      {creativeText ? (
        <div className="rounded-lg border border-border/60 bg-background/50 p-3 text-xs text-foreground">
          {creativeText}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border/60 bg-background/40 p-3 text-xs text-muted-foreground">
          Waiting for creative submission.
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => confirmMutation.mutate()}
          disabled={!isCurrent || !creativeText || confirmMutation.isPending}
          className={cn(
            "rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition",
            !isCurrent || !creativeText || confirmMutation.isPending
              ? "cursor-not-allowed opacity-60"
              : "hover:bg-primary/90"
          )}
        >
          Confirm
        </button>
        <button
          type="button"
          onClick={() => rejectMutation.mutate()}
          disabled={!isCurrent || !creativeText || rejectMutation.isPending}
          className={cn(
            "rounded-lg border border-border/60 px-4 py-2 text-xs font-semibold text-foreground",
            !isCurrent || !creativeText || rejectMutation.isPending
              ? "cursor-not-allowed opacity-60"
              : "hover:border-primary/40"
          )}
        >
          Request changes
        </button>
      </div>
      {!isCurrent ? (
        <p className="text-xs text-muted-foreground">This step has been completed.</p>
      ) : null}
    </InfoCard>
  );
}

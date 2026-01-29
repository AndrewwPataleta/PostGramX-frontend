import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { DealListItem } from "@/types/deals";
import { post } from "@/api/core/apiClient";
import { getErrorMessage } from "@/lib/api/errors";
import InfoCard from "@/components/deals/InfoCard";
import { cn } from "@/lib/utils";

interface StageScheduleTimeProps {
  deal: DealListItem;
  isCurrent: boolean;
}

const formatDateTimeLocal = (value?: string) => {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  const pad = (num: number) => num.toString().padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export default function StageScheduleTime({ deal, isCurrent }: StageScheduleTimeProps) {
  const queryClient = useQueryClient();
  const [scheduledAt, setScheduledAt] = useState<string>(formatDateTimeLocal(deal.scheduledAt));

  useEffect(() => {
    setScheduledAt(formatDateTimeLocal(deal.scheduledAt));
  }, [deal.scheduledAt]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!scheduledAt) {
        throw new Error("Select a date and time before saving.");
      }
      if (import.meta.env.VITE_API_MOCK === "true") {
        console.info("Mock schedule set", { dealId: deal.id, scheduledAt });
        return null;
      }
      return post<unknown, { dealId: string; scheduledAt: string }>("/deals/schedule", {
        dealId: deal.id,
        scheduledAt,
      });
    },
    onSuccess: () => {
      toast.success("Schedule updated");
      queryClient.invalidateQueries({ queryKey: ["deal", deal.id] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Unable to save schedule"));
    },
  });

  return (
    <InfoCard title="Schedule time">
      <p className="text-xs text-muted-foreground">
        Choose when this post should go live. The time is saved to the deal schedule.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          type="datetime-local"
          value={scheduledAt}
          onChange={(event) => setScheduledAt(event.target.value)}
          disabled={!isCurrent}
          className={cn(
            "w-full rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-xs text-foreground",
            !isCurrent && "cursor-not-allowed opacity-60"
          )}
        />
        <button
          type="button"
          onClick={() => mutation.mutate()}
          disabled={!isCurrent || mutation.isPending}
          className={cn(
            "rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition",
            !isCurrent || mutation.isPending ? "cursor-not-allowed opacity-60" : "hover:bg-primary/90"
          )}
        >
          Save &amp; continue
        </button>
      </div>
      {!isCurrent ? (
        <p className="text-xs text-muted-foreground">This step is complete.</p>
      ) : null}
    </InfoCard>
  );
}

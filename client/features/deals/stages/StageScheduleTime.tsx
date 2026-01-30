import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { DealListItem } from "@/types/deals";
import { post } from "@/api/core/apiClient";
import { getErrorMessage } from "@/lib/api/errors";
import InfoCard from "@/components/deals/InfoCard";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/i18n/formatters";
import { useLanguage } from "@/i18n/LanguageProvider";

interface StageScheduleTimeProps {
  deal: DealListItem;
  readonly: boolean;
  onAction?: {
    onConfirmSchedule?: (scheduledAt: string) => Promise<void> | void;
  };
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

export default function StageScheduleTime({ deal, readonly, onAction }: StageScheduleTimeProps) {
  const queryClient = useQueryClient();
  const { t, language } = useLanguage();
  const [scheduledAt, setScheduledAt] = useState<string>(formatDateTimeLocal(deal.scheduledAt));

  useEffect(() => {
    setScheduledAt(formatDateTimeLocal(deal.scheduledAt));
  }, [deal.scheduledAt]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!scheduledAt) {
        throw new Error(t("deals.stage.scheduleTime.selectDateError"));
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
      toast.success(t("deals.stage.scheduleTime.updatedToast"));
      queryClient.invalidateQueries({ queryKey: ["deal", deal.id] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, t("deals.stage.scheduleTime.saveError")));
    },
  });

  if (readonly) {
    return (
      <InfoCard title={t("deals.stage.scheduleTime.title")}>
        <p className="text-xs text-muted-foreground">
          {t("deals.stage.scheduleTime.readonly")}
        </p>
        <p className="text-xs text-muted-foreground">
          {t("deals.scheduledAt")}:{" "}
          <span className="font-semibold text-foreground">
            {deal.scheduledAt
              ? formatDateTime(deal.scheduledAt, language)
              : t("deals.stage.scheduleTime.notScheduled")}
          </span>
        </p>
      </InfoCard>
    );
  }

  const handleConfirm = () => {
    if (!scheduledAt) {
      toast.error(t("deals.stage.scheduleTime.selectDateError"));
      return;
    }
    if (onAction?.onConfirmSchedule) {
      onAction.onConfirmSchedule(scheduledAt);
      return;
    }
    mutation.mutate();
  };

  return (
    <InfoCard title={t("deals.stage.scheduleTime.title")}>
      <p className="text-xs text-muted-foreground">
        {t("deals.stage.scheduleTime.description")}
      </p>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          type="datetime-local"
          value={scheduledAt}
          onChange={(event) => setScheduledAt(event.target.value)}
          className="w-full rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-xs text-foreground"
        />
        <button
          type="button"
          onClick={handleConfirm}
          disabled={mutation.isPending}
          className={cn(
            "rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition",
            mutation.isPending ? "cursor-not-allowed opacity-60" : "hover:bg-primary/90"
          )}
        >
          {t("deals.stage.scheduleTime.confirm")}
        </button>
      </div>
    </InfoCard>
  );
}

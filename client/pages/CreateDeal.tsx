import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getTelegramWebApp } from "@/lib/telegram";
import { useCreateDealMutation } from "@/hooks/use-deals";
import ErrorState from "@/components/feedback/ErrorState";
import { PageContainer } from "@/components/layout/PageContainer";
import { toUtcIsoString } from "@/utils/date";

interface CreateDealLocationState {
  listingId?: string;
}

export default function CreateDeal() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as CreateDealLocationState | null;
  const listingId = state?.listingId;

  const [brief, setBrief] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const createDealMutation = useCreateDealMutation();
  const isSubmitting = createDealMutation.isPending;

  const canSubmit = Boolean(listingId) && !isSubmitting;

  const scheduledIso = useMemo(() => {
    if (!scheduledAt) {
      return undefined;
    }
    try {
      return toUtcIsoString(scheduledAt);
    } catch {
      return undefined;
    }
  }, [scheduledAt]);

  useEffect(() => {
    const webApp = getTelegramWebApp();
    if (!webApp?.MainButton?.showProgress || !webApp.MainButton.hideProgress) {
      return;
    }

    if (isSubmitting) {
      webApp.MainButton.showProgress(true);
    } else {
      webApp.MainButton.hideProgress();
    }
  }, [isSubmitting]);

  const handleSubmit = async () => {
    if (!listingId) {
      return;
    }

    try {
      if (scheduledIso && !scheduledIso.endsWith("Z")) {
        console.error("Scheduled date must be UTC ISO:", scheduledIso);
        throw new Error("Invalid datetime format");
      }
      await createDealMutation.mutateAsync({
        listingId,
        brief: brief.trim() || undefined,
        scheduledAt: scheduledIso,
      });
    } catch {
      return;
    }
  };

  if (!listingId) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <PageContainer className="py-6">
          <ErrorState
            message="Listing not selected"
            description="Please return to the marketplace and select a listing to continue."
            onRetry={() => navigate("/marketplace")}
          />
        </PageContainer>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <PageContainer className="py-6 space-y-4">
        <div className="rounded-2xl border border-border/60 bg-card/80 p-4">
          <p className="text-xs text-muted-foreground">Listing</p>
          <p className="mt-1 text-sm font-semibold text-foreground">{listingId}</p>
          <p className="text-xs text-muted-foreground">Ready to create a deal</p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/80 p-4 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground">Brief (optional)</label>
            <textarea
              value={brief}
              onChange={(event) => setBrief(event.target.value)}
              placeholder="Describe your product, key message, and desired tone."
              className="min-h-[120px] w-full rounded-xl border border-border/60 bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground">
              Schedule datetime (optional)
            </label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(event) => setScheduledAt(event.target.value)}
              className="w-full rounded-xl border border-border/60 bg-background px-3 py-2 text-sm text-foreground"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {isSubmitting ? "Creating deal..." : "Create deal"}
        </button>
      </PageContainer>
    </div>
  );
}

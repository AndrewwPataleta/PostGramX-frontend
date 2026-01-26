import { useState } from "react";
import { ArrowLeft, Calendar as CalendarIcon } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMarketplaceChannel } from "@/features/marketplace/hooks";
import { useCreateDeal } from "@/features/deals/hooks";
import LoadingSkeleton from "@/components/feedback/LoadingSkeleton";
import ErrorState from "@/components/feedback/ErrorState";
import { getErrorMessage } from "@/lib/api/errors";

export default function CreateDeal() {
  const { channelId } = useParams<{ channelId: string }>();
  const navigate = useNavigate();
  const [briefText, setBriefText] = useState("");
  const [preferredDate, setPreferredDate] = useState<Date | undefined>();
  const [preferredTime, setPreferredTime] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const { data: channel, isLoading, error, refetch } = useMarketplaceChannel(channelId);
  const createDealMutation = useCreateDeal();
  const isSubmitting = createDealMutation.isPending;

  const handleSubmit = async () => {
    if (!channelId || !briefText.trim()) {
      toast.error("Please add a campaign brief.");
      return;
    }

    try {
      const scheduleIso = (() => {
        if (!preferredDate || !preferredTime) {
          return null;
        }
        const [hours, minutes] = preferredTime.split(":").map(Number);
        if (Number.isNaN(hours) || Number.isNaN(minutes)) {
          return null;
        }
        const scheduledAt = new Date(preferredDate);
        scheduledAt.setHours(hours, minutes, 0, 0);
        return scheduledAt.toISOString();
      })();

      const result = await createDealMutation.mutateAsync({
        channelId,
        briefText: briefText.trim(),
        requestedScheduleAt: scheduleIso,
        ctaUrl: ctaUrl.trim() || null,
      });
      navigate(`/deals/${result.id}`, { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err, "Unable to create deal"));
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="sticky top-0 z-10 border-b border-border/50 bg-card/80 backdrop-blur-glass">
        <div className="flex items-center gap-3 px-4 py-4">
          <Link to={channelId ? `/marketplace/channels/${channelId}` : "/marketplace"}>
            <ArrowLeft size={24} className="text-foreground" />
          </Link>
          <div>
            <h1 className="font-semibold text-foreground">Create Deal</h1>
            <p className="text-xs text-muted-foreground">Submit campaign brief</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {isLoading ? (
          <LoadingSkeleton items={1} />
        ) : error || !channel ? (
          <ErrorState
            message={getErrorMessage(error, "Channel not found")}
            description="Please try again later."
            onRetry={() => refetch()}
          />
        ) : (
          <>
            <div className="rounded-2xl border border-border/60 bg-card/80 p-4">
              <p className="text-xs text-muted-foreground">Channel</p>
              <p className="mt-1 text-sm font-semibold text-foreground">{channel.title}</p>
              <p className="text-xs text-muted-foreground">@{channel.username}</p>
              <div className="mt-3 flex items-center justify-between rounded-xl bg-secondary/40 p-3">
                <span className="text-xs text-muted-foreground">Price</span>
                <span className="text-sm font-semibold text-foreground">{channel.priceTon} TON</span>
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card/80 p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">Campaign brief *</label>
                <textarea
                  value={briefText}
                  onChange={(event) => setBriefText(event.target.value)}
                  placeholder="Describe your product, key message, and desired tone."
                  className="min-h-[120px] w-full rounded-xl border border-border/60 bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">Preferred posting time</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full justify-between rounded-xl border-border/60 bg-background px-3 py-2 text-sm font-normal",
                        !preferredDate && "text-muted-foreground",
                      )}
                    >
                      {preferredDate ? format(preferredDate, "PPP") : "Select a date"}
                      <CalendarIcon className="h-4 w-4 opacity-60" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={preferredDate}
                      onSelect={setPreferredDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <input
                  type="time"
                  value={preferredTime}
                  onChange={(event) => setPreferredTime(event.target.value)}
                  className="w-full rounded-xl border border-border/60 bg-background px-3 py-2 text-sm text-foreground"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">CTA link (optional)</label>
                <input
                  type="url"
                  value={ctaUrl}
                  onChange={(event) => setCtaUrl(event.target.value)}
                  placeholder="https://yourapp.com"
                  className="w-full rounded-xl border border-border/60 bg-background px-3 py-2 text-sm text-foreground"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              {isSubmitting ? "Sending request..." : "Send Request"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

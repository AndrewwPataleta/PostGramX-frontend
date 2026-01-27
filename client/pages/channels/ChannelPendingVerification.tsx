import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import {
  getVerifyErrorMessage,
  getVerifyResponseErrorMessage,
  useVerifyChannel,
} from "@/features/channels/hooks/useVerifyChannel";
import type { ChannelListItem } from "@/types/channels";

const formatMetric = (value?: number | null) => {
  if (value == null) {
    return "–";
  }

  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }

  return value.toString();
};

const ChannelPendingVerification = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [inlineError, setInlineError] = useState<string | null>(null);
  const { mutateAsync, isPending } = useVerifyChannel();

  const channel = useMemo(() => {
    const state = location.state as { channel?: ChannelListItem } | null;
    return state?.channel ?? null;
  }, [location.state]);

  const handleRetry = async () => {
    if (!id) {
      return;
    }

    setInlineError(null);
    try {
      const response = await mutateAsync(id);
      if (response.status === "VERIFIED") {
        const nextChannel = channel ? { ...channel, status: "VERIFIED" } : undefined;
        navigate(`/channel-manage/${id}/overview`, {
          replace: true,
          state: nextChannel ? { channel: nextChannel } : undefined,
        });
        return;
      }

      const message = getVerifyResponseErrorMessage(
        response,
        "Verification failed. Please check your bot permissions and retry.",
      );
      setInlineError(message);
    } catch (error) {
      const message = getVerifyErrorMessage(
        error,
        "Unable to verify the channel right now.",
      );
      setInlineError(message);
      toast.error(message);
    }
  };

  if (!id) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-6">
        <p className="text-sm text-muted-foreground">Channel not found.</p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-primary"
        >
          <ChevronLeft size={14} />
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground"
      >
        <ChevronLeft size={14} />
        Back
      </button>

      <div className="rounded-2xl border border-border/60 bg-card/80 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase text-muted-foreground">Pending Verification</p>
            <h1 className="mt-1 text-lg font-semibold text-foreground">
              {channel?.title || "Channel verification"}
            </h1>
            {channel?.username ? (
              <p className="text-sm text-muted-foreground">@{channel.username}</p>
            ) : null}
          </div>
          <span className="rounded-full border border-yellow-500/40 bg-yellow-500/15 px-3 py-1 text-[11px] font-semibold text-yellow-200">
            Pending
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-muted/30 p-3">
            <p className="text-xs text-muted-foreground">Members</p>
            <p className="mt-1 text-base font-semibold text-foreground">
              {formatMetric(channel?.memberCount)}
            </p>
          </div>
          <div className="rounded-xl bg-muted/30 p-3">
            <p className="text-xs text-muted-foreground">Avg. Views</p>
            <p className="mt-1 text-base font-semibold text-foreground">
              {formatMetric(channel?.avgViews)}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card/70 p-5 text-sm text-muted-foreground">
        <p className="text-sm font-semibold text-foreground">Finish verification</p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-xs">
          <li>Add the PostGram bot as an admin in your channel.</li>
          <li>Enable the “Post messages” permission for the bot.</li>
          <li>Return here and retry verification.</li>
        </ul>
      </div>

      {inlineError ? (
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-xs text-destructive">
          {inlineError}
        </div>
      ) : null}

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={handleRetry}
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
          Retry verification
        </button>
        <button
          type="button"
          onClick={() => navigate("/channels")}
          className="inline-flex items-center justify-center rounded-full border border-border/60 bg-card/80 px-4 py-3 text-sm font-semibold text-foreground"
        >
          Back to channels
        </button>
      </div>
    </div>
  );
};

export default ChannelPendingVerification;

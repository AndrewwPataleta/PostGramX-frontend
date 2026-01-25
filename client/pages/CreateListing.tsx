import { useMemo, useState } from "react";
import { ArrowLeft, Info } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ListingSummaryCard } from "@/components/listings/ListingSummaryCard";
import { managedChannelData } from "@/features/channels/managedChannels";
import { createListing, isMockListingsEnabled } from "@/features/listings/mockStore";

const availabilityOptions = [
  { label: "1 day", days: 1 },
  { label: "3 days", days: 3 },
  { label: "7 days", days: 7 },
  { label: "14 days", days: 14 },
  { label: "Custom range", days: null },
];

export default function CreateListing() {
  const { id } = useParams<{ id: string }>();
  const channel = id ? managedChannelData[id] : null;
  const navigate = useNavigate();
  const [priceTon, setPriceTon] = useState("25");
  const [availabilityChoice, setAvailabilityChoice] = useState(7);
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [allowEdits, setAllowEdits] = useState(true);
  const [allowLinkTracking, setAllowLinkTracking] = useState(true);
  const [rulesText, setRulesText] = useState("");

  const mockModeEnabled = import.meta.env.DEV && isMockListingsEnabled;

  const availabilityLabel = useMemo(() => {
    if (availabilityChoice) {
      return `Available next ${availabilityChoice} day${availabilityChoice === 1 ? "" : "s"}`;
    }
    if (customFrom && customTo) {
      const from = new Date(customFrom);
      const to = new Date(customTo);
      const diffMs = to.getTime() - from.getTime();
      const diffDays = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
      return `Available ${diffDays} days`;
    }
    return "Availability pending";
  }, [availabilityChoice, customFrom, customTo]);

  if (!channel) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-6">
        <p className="text-muted-foreground">Channel not found</p>
      </div>
    );
  }

  const handlePublish = () => {
    const today = new Date();
    const availabilityFrom = availabilityChoice
      ? today
      : customFrom
        ? new Date(customFrom)
        : today;
    const availabilityTo = availabilityChoice
      ? new Date(today.getTime() + availabilityChoice * 24 * 60 * 60 * 1000)
      : customTo
        ? new Date(customTo)
        : today;

    createListing({
      channelId: channel.id,
      format: "POST",
      priceTon: Number(priceTon || 0),
      availabilityFrom: availabilityFrom.toISOString(),
      availabilityTo: availabilityTo.toISOString(),
      allowEdits,
      requiresApproval: true,
      rulesText,
      isActive: true,
      allowLinkTracking,
      allowPinnedPlacement: false,
    });

    navigate(`/channel-manage/${channel.id}/listings/success`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="sticky top-0 bg-card/80 backdrop-blur-glass border-b border-border/50 z-10">
        <div className="flex items-center gap-3 px-4 py-4">
          <Link to={`/channel-manage/${channel.id}`}>
            <ArrowLeft size={24} className="text-foreground" />
          </Link>
          <div>
            <h1 className="font-semibold text-foreground">Create Ad Listing</h1>
            <p className="text-xs text-muted-foreground">
              Set price and availability for advertisers
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {mockModeEnabled ? (
          <div className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary w-fit">
            Mock mode enabled
          </div>
        ) : null}

        <section className="space-y-3">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Ad format</h2>
            <p className="text-xs text-muted-foreground">Only post format is supported in MVP.</p>
          </div>
          <select
            className="w-full rounded-xl border border-border/60 bg-card px-3 py-3 text-sm text-foreground"
          >
            <option value="POST">Post</option>
            <option value="FORWARD" disabled>
              Forward / Repost (coming soon)
            </option>
            <option value="STORY" disabled>
              Story (coming soon)
            </option>
          </select>
        </section>

        <section className="space-y-3">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Price per post</h2>
            <p className="text-xs text-muted-foreground">Price shown publicly in Marketplace.</p>
          </div>
          <input
            type="number"
            value={priceTon}
            onChange={(event) => setPriceTon(event.target.value)}
            placeholder="Example: 25 TON"
            className="w-full rounded-xl border border-border/60 bg-card px-3 py-3 text-sm text-foreground"
          />
          <div className="flex flex-wrap gap-2">
            {[10, 25, 50].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setPriceTon(String(value))}
                className="rounded-full border border-border/60 bg-secondary/60 px-3 py-1 text-xs text-foreground"
              >
                +{value} TON
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Availability</h2>
            <p className="text-xs text-muted-foreground">
              Advertisers will only be able to schedule posts inside this range.
            </p>
          </div>
          <select
            value={availabilityChoice}
            onChange={(event) => setAvailabilityChoice(Number(event.target.value))}
            className="w-full rounded-xl border border-border/60 bg-card px-3 py-3 text-sm text-foreground"
          >
            {availabilityOptions.map((option) => (
              <option
                key={option.label}
                value={option.days ?? 0}
              >
                Available for next: {option.label}
              </option>
            ))}
          </select>
          {availabilityChoice === 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">From date</label>
                <input
                  type="date"
                  value={customFrom}
                  onChange={(event) => setCustomFrom(event.target.value)}
                  className="w-full rounded-xl border border-border/60 bg-card px-3 py-3 text-sm text-foreground"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">To date</label>
                <input
                  type="date"
                  value={customTo}
                  onChange={(event) => setCustomTo(event.target.value)}
                  className="w-full rounded-xl border border-border/60 bg-card px-3 py-3 text-sm text-foreground"
                />
              </div>
            </div>
          ) : null}
        </section>

        <section className="space-y-3">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Posting conditions</h2>
            <p className="text-xs text-muted-foreground">
              Control what advertisers can change in the post.
            </p>
          </div>
          <div className="space-y-2">
            <label className="flex items-center justify-between rounded-xl border border-border/60 bg-card px-3 py-3 text-sm">
              <span className="text-foreground">Allow minor post edits by advertiser</span>
              <input
                type="checkbox"
                checked={allowEdits}
                onChange={(event) => setAllowEdits(event.target.checked)}
                className="h-4 w-4"
              />
            </label>
            <label className="flex items-center justify-between rounded-xl border border-border/60 bg-card px-3 py-3 text-sm">
              <span className="text-foreground">Allow link tracking (UTM / referral links)</span>
              <input
                type="checkbox"
                checked={allowLinkTracking}
                onChange={(event) => setAllowLinkTracking(event.target.checked)}
                className="h-4 w-4"
              />
            </label>
            <label className="flex items-center justify-between rounded-xl border border-border/40 bg-card/60 px-3 py-3 text-sm opacity-80">
              <span className="text-foreground">
                Require pre-approval before publishing
                <span className="ml-2 text-[10px] uppercase tracking-wide text-primary">Locked</span>
              </span>
              <input type="checkbox" checked disabled className="h-4 w-4" />
            </label>
            <label className="flex items-center justify-between rounded-xl border border-border/40 bg-card/60 px-3 py-3 text-sm opacity-60">
              <span className="text-foreground">
                Allow pinned post placement
                <span className="ml-2 text-[10px] uppercase tracking-wide text-muted-foreground">
                  Coming soon
                </span>
              </span>
              <input type="checkbox" disabled className="h-4 w-4" />
            </label>
          </div>
        </section>

        <section className="space-y-3">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Additional requirements (optional)
            </h2>
            <p className="text-xs text-muted-foreground">
              Add any restrictions or notes for advertisers.
            </p>
          </div>
          <textarea
            value={rulesText}
            onChange={(event) => setRulesText(event.target.value)}
            placeholder="Example: No gambling links, English language only, max 2 emojis."
            className="min-h-[120px] w-full rounded-xl border border-border/60 bg-card px-3 py-3 text-sm text-foreground"
          />
        </section>

        <section className="space-y-3">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Listing preview</h2>
            <p className="text-xs text-muted-foreground">Live preview of your Marketplace card.</p>
          </div>
          <ListingSummaryCard
            channel={channel}
            priceTon={Number(priceTon || 0)}
            availabilityLabel={availabilityLabel}
          />
        </section>

        <div className="space-y-3">
          <button
            type="button"
            onClick={handlePublish}
            className="w-full button-primary py-3 text-base font-semibold"
          >
            Publish Listing
          </button>
          <div className="flex items-start gap-2 rounded-xl border border-border/60 bg-card px-3 py-3 text-xs text-muted-foreground">
            <Info size={16} className="text-primary" />
            <span>
              Funds are locked in escrow before posting. Payment is released only after
              delivery verification.
            </span>
          </div>
        </div>
      </div>

      <div className="h-20" />
    </div>
  );
}

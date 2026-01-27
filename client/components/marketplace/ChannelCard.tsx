import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { MarketplaceChannel } from "@/features/marketplace/types/marketplace";

interface ChannelCardProps {
  channel: MarketplaceChannel;
}

const formatDuration = (hours: number) => {
  if (hours >= 168 && hours % 24 === 0) {
    return `${hours / 24}d`;
  }
  return `${hours}h`;
};

export default function ChannelCard({ channel }: ChannelCardProps) {
  const [tagsExpanded, setTagsExpanded] = useState(false);
  const availabilityLabel = channel.listing
    ? (() => {
        const from = new Date(channel.listing.availabilityFrom);
        const to = new Date(channel.listing.availabilityTo);
        const diffMs = to.getTime() - from.getTime();
        const diffDays = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
        return `Available next ${diffDays} day${diffDays === 1 ? "" : "s"}`;
      })()
    : null;
  const listingTags = channel.listing?.tags ?? [];
  const maxCollapsedTags = 3;
  const shouldShowTagToggle = listingTags.length > maxCollapsedTags;
  const visibleTags = tagsExpanded ? listingTags : listingTags.slice(0, maxCollapsedTags);
  const pinnedDurationLabel = channel.listing?.pinDurationHours
    ? formatDuration(channel.listing.pinDurationHours)
    : null;
  const visibilityDurationLabel = channel.listing
    ? formatDuration(channel.listing.visibilityDurationHours ?? 24)
    : null;

  return (
    <Link
      to={`/marketplace/channels/${channel.id}`}
      className="block rounded-2xl border border-border/50 bg-card/80 p-4 transition-colors hover:border-primary/40"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/60 text-xl">
          {channel.avatarUrl}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">{channel.title}</h3>
            {channel.verified ? (
              <span className="inline-flex items-center justify-center rounded-full bg-primary/20 p-1">
                <Check size={12} className="text-primary" />
              </span>
            ) : null}
          </div>
          <p className="text-xs text-muted-foreground">@{channel.username}</p>
          <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
            <span>{(channel.subscribers / 1000).toFixed(0)}K subs</span>
            <span>·</span>
            <span>{(channel.averageViews / 1000).toFixed(0)}K avg views</span>
            <span>·</span>
            <span>{channel.language}</span>
          </div>
          {listingTags.length > 0 ? (
            <div className="mt-2 flex items-start gap-2 text-[11px] text-foreground">
              <div
                className={`flex flex-1 gap-2 ${
                  tagsExpanded ? "flex-wrap" : "flex-nowrap overflow-hidden"
                }`}
              >
                {visibleTags.map((tag) => (
                  <span
                    key={tag}
                    className="flex-none whitespace-nowrap rounded-full bg-secondary/60 px-2.5 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {shouldShowTagToggle ? (
                <button
                  type="button"
                  aria-label={tagsExpanded ? "Collapse tags" : "Expand tags"}
                  aria-expanded={tagsExpanded}
                  className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition hover:text-foreground"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setTagsExpanded((prev) => !prev);
                  }}
                >
                  {tagsExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
              ) : null}
            </div>
          ) : null}
          {visibilityDurationLabel ? (
            <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-foreground">
              {pinnedDurationLabel ? (
                <span className="rounded-full bg-secondary/60 px-2 py-1">
                  Pinned: {pinnedDurationLabel}
                </span>
              ) : null}
              <span className="rounded-full bg-secondary/60 px-2 py-1">
                Visible: {visibilityDurationLabel}
              </span>
            </div>
          ) : null}
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">From</p>
          <p className="text-sm font-semibold text-primary">{channel.priceTon} TON</p>
          {availabilityLabel ? (
            <span className="mt-2 inline-flex rounded-full bg-primary/10 px-2 py-1 text-[10px] text-primary">
              {availabilityLabel}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

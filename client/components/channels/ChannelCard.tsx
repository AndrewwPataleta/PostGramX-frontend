import { useMemo, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { formatTonString, nanoToTonString } from "@/lib/ton";
import { cn } from "@/lib/utils";
import type { ListingListItem } from "@/types/listings";

export type ChannelCardModel = {
  id: string;
  name: string;
  username?: string | null;
  about?: string | null;
  avatarUrl?: string | null;
  subscribers?: number | null;
  placementsCount?: number | null;
  minPriceNano?: string | null;
  currency?: "TON";
  tags?: string[];
  listingsPreview?: ListingListItem[] | null;
  isMine?: boolean;
};

type ChannelCardProps = {
  channel: ChannelCardModel;
  onClick?: () => void;
  actions?: ReactNode;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  expandedContent?: ReactNode;
};

const MAX_TAGS = 3;

const formatTon = (value?: string | null) => {
  if (!value) {
    return null;
  }
  try {
    return formatTonString(nanoToTonString(value));
  } catch {
    return value;
  }
};

const buildTags = (tags: string[]) => {
  const cleaned = tags.map((tag) => tag.trim()).filter(Boolean);
  const unique = Array.from(new Set(cleaned));
  return {
    visible: unique.slice(0, MAX_TAGS),
    hiddenCount: Math.max(unique.length - MAX_TAGS, 0),
  };
};

const formatDuration = (hours: number) => {
  if (hours >= 168 && hours % 24 === 0) {
    return `${hours / 24}d`;
  }
  return `${hours}h`;
};

const ListingPreview = ({ listings }: { listings: ListingListItem[] }) => {
  if (listings.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/60 bg-background/50 px-4 py-4 text-center text-xs text-muted-foreground">
        No placements available yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {listings.map((listing) => {
        const tags = buildTags(listing.tags ?? []);
        const rules = [
          listing.allowEdits ? "Edits allowed" : null,
          listing.allowLinkTracking ? "Tracking allowed" : null,
        ].filter(Boolean);
        const listingPrice = formatTon(listing.priceNano) ?? listing.priceNano;
        const pinLabel = listing.pinDurationHours
          ? `Pinned ${formatDuration(listing.pinDurationHours)}`
          : "Not pinned";
        const visibilityLabel = `Visible ${formatDuration(listing.visibilityDurationHours)}`;
        const requirements = listing.contentRulesText?.trim();

        return (
          <div key={listing.id} className="rounded-xl border border-border/60 bg-card/80 p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-foreground">
                {listingPrice} TON
              </div>
              <span className="rounded-full border border-border/60 bg-muted/40 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                {listing.format}
              </span>
            </div>
            <div className="mt-2 text-[11px] text-muted-foreground">
              {pinLabel} • {visibilityLabel}
            </div>
            {rules.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                {rules.map((rule) => (
                  <span
                    key={rule}
                    className="rounded-full border border-border/60 bg-muted/30 px-2 py-0.5"
                  >
                    {rule}
                  </span>
                ))}
              </div>
            ) : null}
            {tags.visible.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                {tags.visible.map((tag) => (
                  <span
                    key={`${listing.id}-${tag}`}
                    className="rounded-full border border-border/60 bg-card px-2 py-0.5 text-foreground"
                  >
                    {tag}
                  </span>
                ))}
                {tags.hiddenCount > 0 ? (
                  <span className="rounded-full border border-border/60 bg-card px-2 py-0.5">
                    +{tags.hiddenCount}
                  </span>
                ) : null}
              </div>
            ) : null}
            {requirements ? (
              <p className="mt-2 line-clamp-2 text-[11px] text-muted-foreground">
                {requirements}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export default function ChannelCard({
  channel,
  onClick,
  actions,
  isExpanded,
  onToggleExpand,
  expandedContent,
}: ChannelCardProps) {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const resolvedExpanded = isExpanded ?? internalExpanded;
  const canExpand = Boolean(onToggleExpand || expandedContent || channel.listingsPreview);
  const formattedPrice = useMemo(
    () => formatTon(channel.minPriceNano),
    [channel.minPriceNano]
  );
  const tags = buildTags(channel.tags ?? []);
  const username = channel.username ? `@${channel.username.replace(/^@/, "")}` : null;
  const avatarFallback = channel.name?.[0]?.toUpperCase() ?? "?";
  const avatarSrc = !avatarError && channel.avatarUrl ? channel.avatarUrl : null;
  const placementsLabel =
    channel.placementsCount != null ? channel.placementsCount.toString() : "—";
  const subscribersLabel =
    typeof channel.subscribers === "number"
      ? channel.subscribers.toLocaleString()
      : "—";

  const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (onToggleExpand) {
      onToggleExpand();
    } else {
      setInternalExpanded((prev) => !prev);
    }
  };

  return (
    <div
      className={cn(
        "w-full rounded-2xl border border-border/50 bg-card/80 p-4 text-left shadow-sm transition",
        onClick && "cursor-pointer hover:border-border/80 hover:bg-card"
      )}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(event) => {
        if (!onClick) {
          return;
        }
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
    >
      <div className="flex items-start gap-3">
        {avatarSrc ? (
          <img
            src={avatarSrc}
            alt={channel.name}
            className="h-12 w-12 rounded-full object-cover"
            onError={() => setAvatarError(true)}
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 via-secondary/50 to-secondary text-lg text-foreground">
            {avatarFallback}
          </div>
        )}
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">{channel.name}</h3>
              {username ? <span className="text-xs text-muted-foreground">{username}</span> : null}
            </div>
            <div className="flex items-center gap-2">
              {actions}
              {canExpand ? (
                <button
                  type="button"
                  onClick={handleToggle}
                  aria-expanded={resolvedExpanded}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 bg-secondary/40 text-muted-foreground transition hover:text-foreground"
                >
                  <ChevronDown
                    size={16}
                    className={cn(
                      "transition-transform duration-200",
                      resolvedExpanded && "rotate-180"
                    )}
                  />
                </button>
              ) : null}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>{placementsLabel} placements</span>
            <span>·</span>
            <span>{subscribersLabel} subscribers</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>
              From{" "}
              <span className="font-semibold text-primary">
                {formattedPrice ?? "—"} TON
              </span>
            </span>
          </div>
          {tags.visible.length > 0 ? (
            <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
              {tags.visible.map((tag) => (
                <span
                  key={`${channel.id}-${tag}`}
                  className="rounded-full border border-border/60 bg-card px-2.5 py-1 text-foreground"
                >
                  {tag}
                </span>
              ))}
              {tags.hiddenCount > 0 ? (
                <span className="rounded-full border border-border/60 bg-card px-2.5 py-1 text-muted-foreground">
                  +{tags.hiddenCount}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      {canExpand ? (
        <div
          className={cn(
            "overflow-hidden transition-all duration-300",
            resolvedExpanded ? "mt-4 max-h-[1200px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="rounded-2xl border border-border/60 bg-background/60 p-3">
            {expandedContent ? (
              expandedContent
            ) : (
              <ListingPreview listings={channel.listingsPreview ?? []} />
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

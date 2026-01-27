import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import type { ChannelItem } from "@/types/channels";
import { formatTonString, nanoToTonString } from "@/lib/ton";

interface ChannelCardProps {
  channel: ChannelItem;
}

const PRE_APPROVAL_TAG = "Must be pre-approved";
const MAX_VISIBLE_TAGS = 3;
const MAX_TAG_LENGTH = 24;

export default function ChannelCard({ channel }: ChannelCardProps) {
  const activeListings = (channel.listings ?? []).filter((listing) => listing.isActive !== false);
  const placementsCount = activeListings.length;
  const minPriceNano = activeListings.reduce<bigint | null>((currentMin, listing) => {
    const price = BigInt(listing.priceNano);
    if (currentMin === null) {
      return price;
    }
    return price < currentMin ? price : currentMin;
  }, null);
  const minPriceTon = minPriceNano ? formatTonString(nanoToTonString(minPriceNano)) : null;
  const hasPinnedOptions = activeListings.some((listing) => listing.pinDurationHours !== null);
  const formattedSubscribers =
    typeof channel.subscribers === "number"
      ? `${Math.round(channel.subscribers / 1000)}K subs`
      : null;
  const tagSet = new Set<string>();
  let hasPreApprovalTag = false;

  activeListings.forEach((listing) => {
    listing.tags.forEach((tag) => {
      const trimmed = tag.trim();
      if (!trimmed || trimmed.length > MAX_TAG_LENGTH) {
        return;
      }
      if (trimmed.toLowerCase() === PRE_APPROVAL_TAG.toLowerCase()) {
        hasPreApprovalTag = true;
        return;
      }
      tagSet.add(trimmed);
    });
  });

  const aggregatedTags = [
    ...(hasPreApprovalTag ? [PRE_APPROVAL_TAG] : []),
    ...Array.from(tagSet),
  ];
  const visibleTags = aggregatedTags.slice(0, MAX_VISIBLE_TAGS);
  const hiddenTagsCount = Math.max(aggregatedTags.length - MAX_VISIBLE_TAGS, 0);
  const fallbackAvatar = channel.name?.[0]?.toUpperCase() ?? channel.username?.[0]?.toUpperCase();

  return (
    <Link
      to={`/marketplace/channels/${channel.id}`}
      state={{ channel }}
      className="block rounded-2xl border border-border/50 bg-card/80 p-4 transition-colors hover:border-primary/40"
    >
      <div className="flex items-start gap-3">
        {channel.avatarUrl ? (
          <img
            src={channel.avatarUrl}
            alt={channel.name}
            className="h-12 w-12 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/60 text-xl">
            {fallbackAvatar ?? "?"}
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">{channel.name}</h3>
            {channel.verified ? (
              <span className="inline-flex items-center justify-center rounded-full bg-primary/20 p-1">
                <Check size={12} className="text-primary" />
              </span>
            ) : null}
          </div>
          <p className="text-xs text-muted-foreground">@{channel.username}</p>
          <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
            {formattedSubscribers ? <span>{formattedSubscribers}</span> : null}
            {formattedSubscribers ? <span>·</span> : null}
            <span>{placementsCount} placements</span>
            {hasPinnedOptions ? (
              <>
                <span>·</span>
                <span>Pinned options available</span>
              </>
            ) : null}
          </div>
          {aggregatedTags.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-foreground">
              {visibleTags.map((tag) => (
                <span
                  key={tag}
                  className={`flex-none whitespace-nowrap rounded-full px-2.5 py-1 ${
                    tag === PRE_APPROVAL_TAG ? "bg-primary/20 text-primary" : "bg-secondary/60"
                  }`}
                >
                  {tag}
                </span>
              ))}
              {hiddenTagsCount > 0 ? (
                <span className="flex-none whitespace-nowrap rounded-full bg-secondary/60 px-2.5 py-1 text-muted-foreground">
                  +{hiddenTagsCount}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">From</p>
          <p className="text-sm font-semibold text-primary">
            {minPriceTon ?? "--"} TON
          </p>
        </div>
      </div>
    </Link>
  );
}

import { useMemo, type ReactNode } from "react";
import { Link } from "react-router-dom";
import ChannelCard, { type ChannelCardModel } from "@/components/channels/ChannelCard";
import type { ChannelListItem } from "@/types/channels";

interface MyChannelsChannelCardProps {
  channel: ChannelListItem;
  placementsCount?: number | null;
  minPriceNano?: string | null;
  tags?: string[];
  onClick?: () => void;
  onToggleExpand?: () => void;
  isExpanded?: boolean;
  expandedContent?: ReactNode;
  onUnlink?: () => void;
  createListingTo: string;
  createListingState?: Record<string, unknown>;
}

export default function MyChannelsChannelCard({
  channel,
  placementsCount,
  minPriceNano,
  tags,
  onClick,
  onToggleExpand,
  isExpanded,
  expandedContent,
  onUnlink,
  createListingTo,
  createListingState,
}: MyChannelsChannelCardProps) {
  const cardModel = useMemo<ChannelCardModel>(
    () => ({
      id: channel.id,
      name: channel.title || "Untitled channel",
      username: channel.username,
      avatarUrl: channel.avatarUrl ?? null,
      subscribers: channel.memberCount ?? null,
      placementsCount: placementsCount ?? channel.placementsCount ?? null,
      minPriceNano: minPriceNano ?? null,
      tags: tags ?? [],
      isMine: true,
    }),
    [channel, placementsCount, minPriceNano, tags]
  );

  return (
    <ChannelCard
      channel={cardModel}
      onClick={onClick}
      isExpanded={isExpanded}
      onToggleExpand={onToggleExpand}
      expandedContent={expandedContent}
      actions={
        <div className="flex items-center gap-2">
          {onUnlink ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onUnlink();
              }}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 bg-background/70 text-muted-foreground transition hover:text-foreground"
              aria-label="Unlink channel"
            >
              ×
            </button>
          ) : null}
          <Link
            to={createListingTo}
            state={createListingState}
            onClick={(event) => event.stopPropagation()}
            className="rounded-lg bg-primary px-3 py-1.5 text-[11px] font-semibold text-primary-foreground"
          >
            Create listing
          </Link>
        </div>
      }
    />
  );
}

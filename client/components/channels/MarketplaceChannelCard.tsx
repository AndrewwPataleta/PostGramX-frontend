import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTelegramWebApp } from "@/lib/telegram";
import ChannelCard, { type ChannelCardModel } from "@/components/channels/ChannelCard";
import ChannelListingsPreview from "@/features/channels/components/ChannelListingsPreview";
import type { MarketplaceChannelItem } from "@/api/types/marketplace";

interface MarketplaceChannelCardProps {
  channel: MarketplaceChannelItem;
}

export default function MarketplaceChannelCard({ channel }: MarketplaceChannelCardProps) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const trimmedUsername = channel.username?.replace(/^@/, "");
  const telegramLink = trimmedUsername ? `https://t.me/${trimmedUsername}` : null;

  const cardModel = useMemo<ChannelCardModel>(
    () => ({
      id: channel.id,
      name: channel.name,
      username: channel.username,
      about: channel.about,
      avatarUrl: channel.avatarUrl,
      subscribers: channel.subscribers ?? null,
      placementsCount: channel.placementsCount ?? null,
      minPriceNano: channel.minPriceNano ?? null,
      currency: channel.currency,
      tags: channel.tags ?? [],
      listingsPreview: channel.listingsPreview ?? null,
    }),
    [channel]
  );

  const handleNavigate = () => {
    navigate(`/channels/${channel.id}`, {
      state: {
        channel: cardModel,
        listingsPreview: cardModel.listingsPreview ?? null,
        placementsCount: cardModel.placementsCount ?? null,
        minPriceNano: cardModel.minPriceNano ?? null,
        tags: cardModel.tags ?? [],
        subscribers: cardModel.subscribers ?? null,
        avatarUrl: cardModel.avatarUrl ?? null,
        rootBackTo: "/marketplace",
      },
    });
  };

  return (
    <ChannelCard
      channel={cardModel}
      onClick={handleNavigate}
      isExpanded={isExpanded}
      onToggleExpand={() => setIsExpanded((prev) => !prev)}
      expandedContent={<ChannelListingsPreview channelId={channel.id} isExpanded={isExpanded} />}
      actions={
        telegramLink ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              const webApp = getTelegramWebApp();
              if (webApp?.openTelegramLink) {
                webApp.openTelegramLink(telegramLink);
                return;
              }
              window.open(telegramLink, "_blank", "noopener,noreferrer");
            }}
            className="rounded-lg border border-border/60 bg-secondary/40 px-3 py-1 text-[11px] font-semibold text-primary transition hover:text-primary/90"
          >
            Open channel
          </button>
        ) : null
      }
    />
  );
}

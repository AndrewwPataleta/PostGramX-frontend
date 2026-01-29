import { Link } from "react-router-dom";
import type { ChannelCard } from "@/types/marketplace";

interface MarketplaceCardProps {
  channel: ChannelCard;
}

export function MarketplaceCard({ channel }: MarketplaceCardProps) {
  const username = channel.username ? `@${channel.username}` : null;
  const subscribers =
    typeof channel.subscribers === "number"
      ? channel.subscribers.toLocaleString()
      : null;

  return (
    <Link
      to={`/marketplace/channels/${channel.id}`}
      className="block glass p-4 hover:bg-card/60 transition-colors"
    >
      {/* Channel Header */}
      <div className="flex items-start gap-3 mb-3">
        {channel.avatarUrl ? (
          <img
            src={channel.avatarUrl}
            alt={channel.name}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-secondary/60 flex items-center justify-center text-lg flex-shrink-0">
            {channel.name.slice(0, 1)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-foreground truncate">
              {channel.name}
            </h3>
          </div>
          {username ? (
            <p className="text-xs text-muted-foreground">{username}</p>
          ) : null}
        </div>
        <div className="text-right flex-shrink-0">
          <p className="font-semibold text-primary text-sm">
            From {channel.priceFromTon ?? "--"} TON
          </p>
          <p className="text-xs text-muted-foreground">per post</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-3 text-xs text-muted-foreground">
        {subscribers ? <span>{subscribers} subscribers</span> : null}
        {subscribers ? <span>·</span> : null}
        <span>{channel.placementsCount ?? 0} placements</span>
      </div>

      {channel.description ? (
        <p className="text-xs text-muted-foreground truncate mb-3">
          {channel.description}
        </p>
      ) : null}

      {/* View Button */}
      <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 rounded-lg transition-colors text-sm">
        View Details
      </button>
    </Link>
  );
}

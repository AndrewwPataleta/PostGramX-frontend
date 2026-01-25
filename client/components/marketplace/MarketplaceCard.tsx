import { Check, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { Tooltip } from "@/components/Tooltip";
import type { ChannelCard } from "@/types/marketplace";

interface MarketplaceCardProps {
  channel: ChannelCard;
}

export function MarketplaceCard({ channel }: MarketplaceCardProps) {
  return (
    <Link
      to={`/marketplace/channels/${channel.id}`}
      className="block glass p-4 hover:bg-card/60 transition-colors"
    >
      {/* Channel Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-secondary/60 flex items-center justify-center text-lg flex-shrink-0">
          {channel.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-foreground truncate">
              {channel.name}
            </h3>
            {channel.verified && (
              <div className="inline-flex items-center justify-center bg-primary/15 rounded-full p-0.5 flex-shrink-0 ring-1 ring-primary/30">
                <Check size={14} className="text-primary" />
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{channel.username}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="font-semibold text-primary text-sm">
            From {channel.pricePerPost} TON
          </p>
          <p className="text-xs text-muted-foreground">per post</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-secondary/30 rounded-lg px-2 py-1.5">
          <p className="text-xs text-muted-foreground">Subscribers</p>
          <p className="text-sm font-semibold text-foreground">
            {(channel.subscribers / 1000).toFixed(0)}K
          </p>
        </div>
        <div className="bg-secondary/30 rounded-lg px-2 py-1.5">
          <div className="flex items-center gap-1 mb-1">
            <p className="text-xs text-muted-foreground">Avg Views</p>
            <Tooltip text="Computed from verified post view counts. Last 10 posts.">
              <Info size={12} className="text-muted-foreground" />
            </Tooltip>
          </div>
          <p className="text-sm font-semibold text-foreground">
            {(channel.averageViews / 1000).toFixed(0)}K
          </p>
        </div>
        <div className="bg-secondary/30 rounded-lg px-2 py-1.5">
          <p className="text-xs text-muted-foreground">Engagement</p>
          <p className="text-sm font-semibold text-accent">
            {channel.engagement}%
          </p>
        </div>
      </div>

      {/* View Button */}
      <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 rounded-lg transition-colors text-sm">
        View Details
      </button>
    </Link>
  );
}

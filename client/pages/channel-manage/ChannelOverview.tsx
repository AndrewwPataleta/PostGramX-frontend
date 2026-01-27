import { Link, useOutletContext } from "react-router-dom";
import { BarChart3 } from "lucide-react";
import { Sparkline } from "@/components/Sparkline";
import { ListingCard } from "@/components/listings/ListingCard";
import type { ChannelManageContext } from "@/pages/channel-manage/ChannelManageLayout";

const ChannelOverview = () => {
  const {
    channel,
    activeListings,
    inactiveListings,
    previewListings,
  } = useOutletContext<ChannelManageContext>();

  const hasListings = activeListings.length > 0 || inactiveListings.length > 0;

  return (
    <>
      <div className="glass p-4 space-y-3">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <BarChart3 size={18} className="text-primary" />
          Channel Statistics
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-secondary/30 rounded-lg px-3 py-2">
            <p className="text-xs text-muted-foreground">Subscribers</p>
            <p className="text-lg font-semibold text-foreground">
              {(channel.subscribers / 1000).toFixed(0)}K
            </p>
          </div>
          <div className="bg-secondary/30 rounded-lg px-3 py-2">
            <p className="text-xs text-muted-foreground">Avg Views</p>
            <p className="text-lg font-semibold text-foreground">
              {(channel.averageViews / 1000).toFixed(0)}K
            </p>
          </div>
          <div className="bg-secondary/30 rounded-lg px-3 py-2">
            <p className="text-xs text-muted-foreground">Engagement</p>
            <p className="text-lg font-semibold text-accent">
              {channel.engagement}%
            </p>
          </div>
          <div className="bg-secondary/30 rounded-lg px-3 py-2">
            <p className="text-xs text-muted-foreground">Posts/Week</p>
            <p className="text-lg font-semibold text-foreground">
              {channel.postsPerWeek}
            </p>
          </div>
        </div>
      </div>

      <div className="glass p-4 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold text-foreground">Listings</h3>
            <p className="text-xs text-muted-foreground">Your active ad offers</p>
          </div>
        </div>

        {hasListings ? (
          <>
            <p className="text-xs text-muted-foreground">
              Active: {activeListings.length} • Disabled: {inactiveListings.length}
            </p>
            <div className="space-y-3">
              {previewListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} variant="compact" />
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-border/60 bg-card/60 p-4 text-center">
            <p className="text-sm font-semibold text-foreground">No listings yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Create your first listing to start receiving offers.
            </p>
            <Link
              to={`/channel-manage/${channel.id}/listings/create`}
              className="mt-3 inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
            >
              Create listing
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default ChannelOverview;

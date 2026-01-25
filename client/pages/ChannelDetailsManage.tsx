import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Settings, BarChart3, Edit, Power } from "lucide-react";
import { Sparkline } from "@/components/Sparkline";
import { managedChannelData } from "@/features/channels/managedChannels";
import type { Listing } from "@/features/listings/types";
import {
  disableListing,
  getListingsByChannel,
  isMockListingsEnabled,
  subscribeToMockListings,
} from "@/features/listings/mockStore";

export default function ChannelDetailsManage() {
  const { id } = useParams<{ id: string }>();
  const channel = id ? managedChannelData[id] : null;
  const [activeTab, setActiveTab] = useState("overview");
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    if (!id) {
      return;
    }
    const loadListings = () => {
      setListings(getListingsByChannel(id));
    };
    loadListings();
    return subscribeToMockListings(loadListings);
  }, [id]);

  const mockModeEnabled = import.meta.env.DEV && isMockListingsEnabled;

  const activeListings = useMemo(
    () => listings.filter((listing) => listing.isActive),
    [listings],
  );
  const inactiveListings = useMemo(
    () => listings.filter((listing) => !listing.isActive),
    [listings],
  );

  const formatAvailability = (listing: Listing) => {
    const from = new Date(listing.availabilityFrom);
    const to = new Date(listing.availabilityTo);
    const diffMs = to.getTime() - from.getTime();
    const diffDays = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    return `Available next ${diffDays} day${diffDays === 1 ? "" : "s"}`;
  };

  if (!channel) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-6">
        <p className="text-muted-foreground">Channel not found</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header with back button */}
      <div className="sticky top-0 bg-card/80 backdrop-blur-glass border-b border-border/50 z-10">
        <div className="flex items-center gap-3 px-4 py-4">
          <Link to="/channels">
            <ArrowLeft size={24} className="text-foreground" />
          </Link>
          <div>
            <h1 className="font-semibold text-foreground">{channel.name}</h1>
            <p className="text-xs text-muted-foreground">Channel management</p>
          </div>
        </div>
      </div>

      {/* Channel Header */}
      <div className="px-4 py-6 bg-gradient-to-b from-card/50 to-transparent">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center text-4xl flex-shrink-0">
            {channel.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-foreground">{channel.name}</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{channel.username}</p>
            <p className="text-xs text-muted-foreground">
              Last verified {channel.lastVerified} ago
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border/50 sticky top-14 z-9 bg-card/80 backdrop-blur-glass px-4">
        <div className="flex gap-6">
          {[
            { id: "overview", label: "Overview" },
            { id: "listings", label: "Listings" },
            { id: "settings", label: "Settings" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "text-primary border-b-primary"
                  : "text-muted-foreground border-b-transparent hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 py-6 space-y-4">
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <>
            {/* Stats Card */}
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

            {/* Performance Chart */}
            <div className="glass p-4 space-y-3">
              <h3 className="font-semibold text-foreground">
                Last 10 Posts Performance
              </h3>
              <div className="h-32 text-primary/60">
                <Sparkline data={channel.viewsTrend} height={100} />
              </div>
              <p className="text-xs text-muted-foreground">
                Views trend from your last 10 posts
              </p>
            </div>

            {/* Revenue Card */}
            <div className="glass p-4 border-2 border-primary/30 space-y-3">
              <h3 className="font-semibold text-foreground">Revenue</h3>
              <div className="bg-primary/10 rounded-lg px-3 py-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Total Earned</p>
                <p className="text-3xl font-bold text-primary">
                  {channel.earnings} TON
                </p>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Active deals:</span>
                <span className="font-semibold text-foreground">
                  {channel.activeDeals}
                </span>
              </div>
            </div>
          </>
        )}

        {/* LISTINGS TAB */}
        {activeTab === "listings" && (
          <>
            {mockModeEnabled ? (
              <div className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary w-fit">
                Mock mode enabled
              </div>
            ) : null}

            {activeListings.length > 0 || inactiveListings.length > 0 ? (
              <div className="space-y-3">
                {activeListings.map((listing) => (
                  <div key={listing.id} className="glass p-4 space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-foreground">Active Offer</h3>
                      <span className="bg-primary/20 text-primary px-2 py-1 rounded text-xs font-medium">
                        Active
                      </span>
                    </div>
                    <div className="bg-secondary/30 rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Price per post</span>
                        <span className="font-semibold text-foreground">
                          {listing.priceTon} TON
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Availability</span>
                        <span className="text-sm font-medium text-primary">
                          {formatAvailability(listing)}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to={`/channel-manage/${channel.id}/listings/${listing.id}/edit`}
                        className="flex-1 flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 text-foreground font-medium py-2 rounded-lg border border-border transition-colors text-sm"
                      >
                        <Edit size={16} />
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => disableListing(listing.id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-destructive/20 hover:bg-destructive/30 text-destructive font-medium py-2 rounded-lg transition-colors text-sm"
                      >
                        <Power size={16} />
                        Disable
                      </button>
                    </div>
                  </div>
                ))}

                {inactiveListings.map((listing) => (
                  <div key={listing.id} className="glass p-4 space-y-3 border border-border/60">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-foreground">Disabled Offer</h3>
                      <span className="bg-muted/30 text-muted-foreground px-2 py-1 rounded text-xs font-medium">
                        Disabled
                      </span>
                    </div>
                    <div className="bg-secondary/30 rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Price per post</span>
                        <span className="font-semibold text-foreground">
                          {listing.priceTon} TON
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Availability</span>
                        <span className="text-sm font-medium text-muted-foreground">
                          {formatAvailability(listing)}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to={`/channel-manage/${channel.id}/listings/${listing.id}/edit`}
                        className="flex-1 flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 text-foreground font-medium py-2 rounded-lg border border-border transition-colors text-sm"
                      >
                        <Edit size={16} />
                        Edit
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-12 h-12 rounded-full bg-secondary/30 flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">📋</span>
                </div>
                <p className="text-foreground font-semibold mb-2">No active listings</p>
                <p className="text-muted-foreground text-sm mb-6">
                  Create your first listing to start receiving offers
                </p>
              </div>
            )}

            <Link
              to={`/channel-manage/${channel.id}/listings/new`}
              className="w-full button-primary py-3 text-base font-semibold text-center"
            >
              Create Listing
            </Link>
          </>
        )}

        {/* SETTINGS TAB */}
        {activeTab === "settings" && (
          <div className="space-y-2">
            <button className="w-full glass p-4 rounded-lg flex items-center justify-between hover:bg-card/60 transition-colors text-left">
              <span className="text-foreground font-medium">Re-check admin rights</span>
              <span className="text-muted-foreground">→</span>
            </button>

            <button className="w-full glass p-4 rounded-lg flex items-center justify-between hover:bg-card/60 transition-colors text-left">
              <span className="text-foreground font-medium">Manage channel managers</span>
              <span className="text-muted-foreground">→</span>
            </button>

            <button className="w-full glass p-4 rounded-lg flex items-center justify-between hover:bg-card/60 transition-colors text-left">
              <span className="text-foreground font-medium">Notification preferences</span>
              <span className="text-muted-foreground">→</span>
            </button>

            <button className="w-full glass p-4 rounded-lg flex items-center justify-between hover:bg-destructive/20 transition-colors text-left mt-4">
              <span className="text-destructive font-medium">Remove channel</span>
              <span className="text-destructive">→</span>
            </button>
          </div>
        )}
      </div>

      {/* Bottom spacing */}
      <div className="h-20" />
    </div>
  );
}

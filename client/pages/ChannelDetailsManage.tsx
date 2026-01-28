import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Edit, Power, Plus } from "lucide-react";
import { ListingCard } from "@/components/listings/ListingCard";
import { managedChannelData } from "@/features/channels/managedChannels";
import type { Listing } from "@/features/listings/types";
import {
  disableListing,
  enableListing,
  getListingsByChannel,
  isMockListingsEnabled,
  subscribeToMockListings,
} from "@/features/listings/mockStore";

export default function ChannelDetailsManage() {
  const { id } = useParams<{ id: string }>();
  const channel = id ? managedChannelData[id] : null;
  const [activeTab, setActiveTab] = useState("overview");
  const [listingFilter, setListingFilter] = useState<"active" | "disabled">("active");
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

  const previewListings = activeListings.slice(0, 3);
  const hasListings = activeListings.length > 0 || inactiveListings.length > 0;

  if (!channel) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-6">
        <p className="text-muted-foreground">Channel not found</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Channel Header */}
      <div className="px-4 py-6 bg-gradient-to-b from-card/50 to-transparent">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center text-4xl flex-shrink-0">
            {channel.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-foreground">{channel.name}</h2>
              {channel.verified ? (
                <span className="inline-flex items-center rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
                  Verified
                </span>
              ) : null}
            </div>
            <p className="text-sm text-muted-foreground mb-2">{channel.username}</p>
            <p className="text-xs text-muted-foreground">
              {channel.subscribers.toLocaleString()} subscribers
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border/50 bg-card/80 backdrop-blur-glass px-4">
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
            {channel.description ? (
              <div className="glass p-4 text-sm text-muted-foreground">
                {channel.description}
              </div>
            ) : null}

            <div className="glass p-4 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-foreground">Listings</h3>
                  <p className="text-xs text-muted-foreground">Your active ad offers</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("listings")}
                    className="rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary"
                  >
                    Manage
                  </button>
                  <Link
                    to={`/channel-manage/${channel.id}/listings/create`}
                    className="text-xs font-semibold text-primary"
                  >
                    Create listing
                  </Link>
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
        )}

        {/* LISTINGS TAB */}
        {activeTab === "listings" && (
          <>
            {mockModeEnabled ? (
              <div className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary w-fit">
                Mock mode enabled
              </div>
            ) : null}

            {hasListings ? (
              <div className="space-y-4">
                <div className="flex gap-2 rounded-full bg-secondary/40 p-1">
                  {([
                    { id: "active", label: "Active" },
                    { id: "disabled", label: "Disabled" },
                  ] as const).map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setListingFilter(filter.id)}
                      className={`flex-1 rounded-full px-3 py-2 text-xs font-semibold transition-colors ${
                        listingFilter === filter.id
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  {(listingFilter === "active" ? activeListings : inactiveListings).map(
                    (listing) => (
                      <ListingCard
                        key={listing.id}
                        listing={listing}
                        variant="full"
                        actionSlot={
                          <>
                            <Link
                              to={`/channel-manage/${channel.id}/listings/${listing.id}/edit`}
                              className="flex-1 flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 text-foreground font-medium py-2 rounded-lg border border-border transition-colors text-sm"
                            >
                              <Edit size={16} />
                              Edit
                            </Link>
                            {listing.isActive ? (
                              <button
                                type="button"
                                onClick={() => disableListing(listing.id)}
                                className="flex-1 flex items-center justify-center gap-2 bg-destructive/20 hover:bg-destructive/30 text-destructive font-medium py-2 rounded-lg transition-colors text-sm"
                              >
                                <Power size={16} />
                                Disable
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => enableListing(listing.id)}
                                className="flex-1 flex items-center justify-center gap-2 bg-primary/15 hover:bg-primary/20 text-primary font-medium py-2 rounded-lg transition-colors text-sm"
                              >
                                <Plus size={16} />
                                Enable
                              </button>
                            )}
                          </>
                        }
                      />
                    ),
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-12 h-12 rounded-full bg-secondary/30 flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">📋</span>
                </div>
                <p className="text-foreground font-semibold mb-2">No listings yet</p>
                <p className="text-muted-foreground text-sm mb-6">
                  Create your first listing to start receiving offers
                </p>
              </div>
            )}

            <Link
              to={`/channel-manage/${channel.id}/listings/create`}
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

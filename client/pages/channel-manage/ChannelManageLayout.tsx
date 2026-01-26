import { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useParams } from "react-router-dom";
import { managedChannelData, type ManagedChannel } from "@/features/channels/managedChannels";
import type { Listing } from "@/features/listings/types";
import {
  getListingsByChannel,
  isMockListingsEnabled,
  subscribeToMockListings,
} from "@/features/listings/mockStore";

export type ChannelManageContext = {
  channel: ManagedChannel;
  listings: Listing[];
  activeListings: Listing[];
  inactiveListings: Listing[];
  previewListings: Listing[];
  listingFilter: "active" | "disabled";
  setListingFilter: (filter: "active" | "disabled") => void;
  mockModeEnabled: boolean;
};

const ChannelManageLayout = () => {
  const { id } = useParams<{ id: string }>();
  const channel = id ? managedChannelData[id] : null;
  const [listings, setListings] = useState<Listing[]>([]);
  const [listingFilter, setListingFilter] = useState<"active" | "disabled">("active");

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

  const activeListings = useMemo(
    () => listings.filter((listing) => listing.isActive),
    [listings],
  );
  const inactiveListings = useMemo(
    () => listings.filter((listing) => !listing.isActive),
    [listings],
  );
  const previewListings = useMemo(() => activeListings.slice(0, 3), [activeListings]);
  const mockModeEnabled = import.meta.env.DEV && isMockListingsEnabled;

  if (!channel) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-6">
        <p className="text-muted-foreground">Channel not found</p>
      </div>
    );
  }

  const basePath = `/channel-manage/${channel.id}`;

  const outletContext = {
    channel,
    listings,
    activeListings,
    inactiveListings,
    previewListings,
    listingFilter,
    setListingFilter,
    mockModeEnabled,
  } satisfies ChannelManageContext;

  return (
    <div className="w-full max-w-2xl mx-auto">
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

      <div className="border-b border-border/50 bg-card/80 backdrop-blur-glass px-4">
        <div className="flex gap-6">
          {[
            { id: "overview", label: "Overview" },
            { id: "listings", label: "Listings" },
            { id: "settings", label: "Settings" },
          ].map((tab) => (
            <NavLink
              key={tab.id}
              to={`${basePath}/${tab.id}`}
              className={({ isActive }) =>
                `py-3 font-medium text-sm border-b-2 transition-colors ${
                  isActive
                    ? "text-primary border-b-primary"
                    : "text-muted-foreground border-b-transparent hover:text-foreground"
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        <Outlet context={outletContext} />
      </div>

      <div className="h-20" />
    </div>
  );
};

export default ChannelManageLayout;

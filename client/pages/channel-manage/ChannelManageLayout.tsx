import { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import {
  getVerifyErrorMessage,
  getVerifyResponseErrorMessage,
  useVerifyChannel,
} from "@/features/channels/hooks/useVerifyChannel";
import { managedChannelData, type ManagedChannel } from "@/features/channels/managedChannels";
import type { Listing } from "@/features/listings/types";
import {
  getListingsByChannel,
  isMockListingsEnabled,
  subscribeToMockListings,
} from "@/features/listings/mockStore";
import type { ChannelListItem } from "@/types/channels";

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

const mapChannelFromListItem = (channel: ChannelListItem): ManagedChannel => ({
  id: channel.id,
  name: channel.title || "Untitled channel",
  username: channel.username.startsWith("@") ? channel.username : `@${channel.username}`,
  avatar: "📣",
  status: channel.status,
  verified: channel.status === "VERIFIED",
  subscribers: channel.memberCount ?? 0,
  averageViews: channel.avgViews ?? 0,
  engagement: 0,
  postsPerWeek: 0,
  earnings: 0,
  activeDeals: 0,
  lastVerified: channel.verifiedAt ? "recently" : "–",
  viewsTrend: [],
});

const ChannelManageLayout = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useVerifyChannel();
  const [inlineError, setInlineError] = useState<string | null>(null);
  const fallbackListItem = useMemo(() => {
    const state = location.state as { channel?: ChannelListItem } | null;
    return state?.channel ?? null;
  }, [location.state]);
  const fallbackChannel = useMemo(
    () => (fallbackListItem ? mapChannelFromListItem(fallbackListItem) : null),
    [fallbackListItem],
  );
  const channel = fallbackChannel ?? (id ? managedChannelData[id] : null);
  const isPendingVerification = channel?.status === "PENDING_VERIFY";
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

  const handleRetryVerification = async () => {
    if (!id) {
      return;
    }

    setInlineError(null);
    try {
      const response = await mutateAsync(id);
      if (response.status === "VERIFIED") {
        const nextChannel = fallbackListItem
          ? { ...fallbackListItem, status: "VERIFIED" }
          : undefined;
        navigate(`/channel-manage/${id}/overview`, {
          replace: true,
          state: nextChannel ? { channel: nextChannel } : undefined,
        });
        return;
      }

      const message = getVerifyResponseErrorMessage(
        response,
        "Verification failed. Please check your bot permissions and retry.",
      );
      setInlineError(message);
    } catch (error) {
      const message = getVerifyErrorMessage(
        error,
        "Unable to verify the channel right now.",
      );
      setInlineError(message);
      toast.error(message);
    }
  };

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
        {isPendingVerification ? (
          <div className="rounded-2xl border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-xs text-yellow-100">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold text-yellow-100">Channel not verified yet.</p>
                <p className="text-yellow-100/80">
                  Add the bot as admin and enable “Post messages”, then retry verification.
                </p>
              </div>
              <button
                type="button"
                onClick={handleRetryVerification}
                disabled={isPending}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-yellow-500/80 px-4 py-2 text-xs font-semibold text-yellow-950 transition disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isPending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <RefreshCw size={14} />
                )}
                Retry verification
              </button>
            </div>
            {inlineError ? (
              <p className="mt-2 text-[11px] text-yellow-100/80">{inlineError}</p>
            ) : null}
          </div>
        ) : null}
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
              state={fallbackListItem ? { channel: fallbackListItem } : undefined}
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

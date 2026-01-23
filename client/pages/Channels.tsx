import { useEffect, useState } from "react";
import { Plus, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Sparkline } from "@/components/Sparkline";
import { Skeleton } from "@/components/ui/skeleton";

interface MyChannel {
  id: string;
  name: string;
  username: string;
  avatar: string;
  verified: boolean;
  verificationStatus: "verified" | "pending" | "failed";
  subscribers: number;
  averageViews: number;
  engagement: number;
  activeListings: number;
  earnings: number;
  lastUpdated: string;
  viewsTrend: number[];
}

// Mock data - user's verified channels
const myChannels: MyChannel[] = [
  {
    id: "1",
    name: "My Crypto Channel",
    username: "@mycryptocha",
    avatar: "📰",
    verified: true,
    verificationStatus: "verified",
    subscribers: 45000,
    averageViews: 18000,
    engagement: 40,
    activeListings: 1,
    earnings: 230,
    lastUpdated: "2h",
    viewsTrend: [17000, 17800, 18200, 18500, 18100, 18900, 18500, 18200, 18800, 18000],
  },
  {
    id: "2",
    name: "Tech News Daily",
    username: "@technewsdaily",
    avatar: "💻",
    verified: true,
    verificationStatus: "verified",
    subscribers: 32000,
    averageViews: 12000,
    engagement: 38,
    activeListings: 0,
    earnings: 145,
    lastUpdated: "4h",
    viewsTrend: [11500, 12000, 11800, 12300, 12100, 12500, 12200, 12000, 12400, 12000],
  },
  {
    id: "3",
    name: "Web3 Hub",
    username: "@web3hub",
    avatar: "🔗",
    verified: false,
    verificationStatus: "pending",
    subscribers: 18000,
    averageViews: 6500,
    engagement: 36,
    activeListings: 0,
    earnings: 0,
    lastUpdated: "6h",
    viewsTrend: [6000, 6300, 6500, 6200, 6400, 6600, 6300, 6500, 6400, 6500],
  },
];

export default function Channels() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsLoading(false);
    }, 1600);

    return () => window.clearTimeout(timer);
  }, []);

  const verifiedChannels = myChannels.filter(
    (ch) => ch.verificationStatus === "verified"
  );
  const pendingChannels = myChannels.filter(
    (ch) => ch.verificationStatus === "pending"
  );

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/90 backdrop-blur-glass border-b border-border/50">
        <div className="px-4 py-3">
          <h1 className="text-base font-semibold text-foreground">My Channels</h1>
        </div>
      </div>

      {/* Channels List */}
      <div className="px-4 pb-32 pt-4 space-y-3">
        {isLoading ? (
          <div className="space-y-6">
            <div>
              <Skeleton className="h-3 w-32 rounded-full ml-2" />
              <div className="mt-3 space-y-3">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div key={`verified-skeleton-${index}`} className="glass p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <Skeleton className="w-12 h-12 rounded-full" />
                      <div className="flex-1 min-w-0 space-y-2">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <Skeleton className="h-5 w-12 rounded-full" />
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <Skeleton className="h-14 rounded-lg" />
                      <Skeleton className="h-14 rounded-lg" />
                      <Skeleton className="h-14 rounded-lg" />
                    </div>
                    <div className="flex items-center justify-between mb-3 pb-3 border-b border-border/30">
                      <Skeleton className="h-3 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Skeleton className="h-9 rounded-lg" />
                      <Skeleton className="h-9 rounded-lg" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Skeleton className="h-3 w-40 rounded-full ml-2" />
              <div className="mt-3 space-y-3">
                {Array.from({ length: 1 }).map((_, index) => (
                  <div key={`pending-skeleton-${index}`} className="glass p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <Skeleton className="w-12 h-12 rounded-full" />
                      <div className="flex-1 min-w-0 space-y-2">
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-40 rounded-full mb-3" />
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <Skeleton className="h-14 rounded-lg" />
                      <Skeleton className="h-14 rounded-lg" />
                      <Skeleton className="h-14 rounded-lg" />
                    </div>
                    <Skeleton className="h-9 rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Verified Channels Section */}
            {verifiedChannels.length > 0 && (
              <>
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 py-3">
                  Verified Channels
                </h2>
                <div className="space-y-3">
                  {verifiedChannels.map((channel) => (
                    <Link
                      key={channel.id}
                      to={`/channel-manage/${channel.id}`}
                      className="block glass p-4 hover:bg-card/60 transition-colors"
                    >
                      {/* Header Row */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-secondary/60 flex items-center justify-center text-xl flex-shrink-0">
                          {channel.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-foreground truncate">
                              {channel.name}
                            </h3>
                            <div className="inline-flex items-center justify-center bg-primary/15 rounded-full p-0.5 flex-shrink-0 ring-1 ring-primary/30">
                              <Check size={14} className="text-primary" />
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {channel.username}
                          </p>
                        </div>
                      </div>

                      {/* Status Pill */}
                      <div className="mb-3">
                        <span className="inline-flex items-center gap-1 bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-medium">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                          Verified
                        </span>
                      </div>

                      {/* Stats Row */}
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <div className="bg-secondary/30 rounded-lg px-2 py-1.5">
                          <p className="text-xs text-muted-foreground">Subscribers</p>
                          <p className="text-sm font-semibold text-foreground">
                            {(channel.subscribers / 1000).toFixed(0)}K
                          </p>
                        </div>
                        <div className="bg-secondary/30 rounded-lg px-2 py-1.5">
                          <p className="text-xs text-muted-foreground">Avg Views</p>
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

                      {/* Listings & Earnings */}
                      <div className="flex items-center justify-between text-xs mb-3 pb-3 border-b border-border/30">
                        <div className="text-muted-foreground">
                          {channel.activeListings > 0 ? (
                            <span className="text-primary font-medium">
                              {channel.activeListings} active listing
                              {channel.activeListings > 1 ? "s" : ""}
                            </span>
                          ) : (
                            <span>No active listings</span>
                          )}
                        </div>
                        <div className="font-semibold text-foreground">
                          Earnings: <span className="text-primary">{channel.earnings} TON</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 rounded-lg transition-colors text-sm">
                          Manage
                        </button>
                        <button className="flex-1 bg-secondary hover:bg-secondary/80 text-foreground font-medium py-2 rounded-lg border border-border transition-colors text-sm">
                          Public Profile
                        </button>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}

            {/* Pending Verification Section */}
            {pendingChannels.length > 0 && (
              <>
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 py-3 mt-6">
                  Pending Verification
                </h2>
                <div className="space-y-3">
                  {pendingChannels.map((channel) => (
                    <div
                      key={channel.id}
                      className="block glass p-4 opacity-75"
                    >
                      {/* Header Row */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-secondary/60 flex items-center justify-center text-xl flex-shrink-0">
                          {channel.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-foreground truncate">
                              {channel.name}
                            </h3>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {channel.username}
                          </p>
                        </div>
                      </div>

                      {/* Status Pill */}
                      <div className="mb-3">
                        <span className="inline-flex items-center gap-1 bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-full text-xs font-medium">
                          <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                          Pending Verification
                        </span>
                      </div>

                      {/* Stats Row */}
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <div className="bg-secondary/30 rounded-lg px-2 py-1.5">
                          <p className="text-xs text-muted-foreground">Subscribers</p>
                          <p className="text-sm font-semibold text-foreground">
                            {(channel.subscribers / 1000).toFixed(0)}K
                          </p>
                        </div>
                        <div className="bg-secondary/30 rounded-lg px-2 py-1.5">
                          <p className="text-xs text-muted-foreground">Avg Views</p>
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

                      {/* CTA for pending */}
                      <div className="flex gap-2">
                        <button className="flex-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-500 font-medium py-2 rounded-lg transition-colors text-sm">
                          Complete Verification
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {!isLoading && myChannels.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📡</span>
            </div>
            <p className="text-foreground font-semibold mb-2">No channels yet</p>
            <p className="text-muted-foreground text-sm mb-6">
              Add your first Telegram channel to start monetizing
            </p>
            <Link
              to="/add-channel"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Plus size={20} />
              Add Channel
            </Link>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      {!isLoading && myChannels.length > 0 && (
        <Link
          to="/add-channel"
          className="fixed bottom-24 right-4 w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center shadow-lg transition-colors"
          title="Add Channel"
        >
          <Plus size={24} />
        </Link>
      )}
    </div>
  );
}

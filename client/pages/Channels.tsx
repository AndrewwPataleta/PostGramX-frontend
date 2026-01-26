import { useMemo, useState } from "react";
import { Plus, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyChannels } from "@/features/channels/hooks";
import ErrorState from "@/components/feedback/ErrorState";
import { getErrorMessage } from "@/lib/api/errors";

export default function Channels() {
  const [activeTab, setActiveTab] = useState<"verified" | "pending">(
    "verified"
  );
  const {
    data: myChannels = [],
    isLoading,
    error,
    refetch,
  } = useMyChannels();

  const verifiedChannels = useMemo(
    () => myChannels.filter((ch) => ch.verificationStatus === "verified"),
    [myChannels]
  );
  const pendingChannels = useMemo(
    () => myChannels.filter((ch) => ch.verificationStatus === "pending"),
    [myChannels]
  );
  const activeChannels =
    activeTab === "verified" ? verifiedChannels : pendingChannels;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="px-4 pt-4">
        <h1 className="text-base font-semibold text-foreground">My Channels</h1>

        <div className="mt-3 border-t border-border/50">
          <div className="flex gap-6 bg-background/90 backdrop-blur-glass">
            {[
              { id: "verified", label: `Verified (${verifiedChannels.length})` },
              { id: "pending", label: `Pending (${pendingChannels.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "verified" | "pending")}
                className={`py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "text-primary border-b-primary"
                    : "text-muted-foreground border-b-transparent"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Channels List */}
      <div className="px-4 pb-6 pt-4 space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {(activeTab === "verified" ? Array.from({ length: 2 }) : Array.from({ length: 1 })).map(
              (_, index) => (
                <div
                  key={`channel-skeleton-${activeTab}-${index}`}
                  className="glass p-4"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="flex-1 min-w-0 space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    {activeTab === "verified" && (
                      <Skeleton className="h-5 w-12 rounded-full" />
                    )}
                  </div>
                  {activeTab === "pending" && (
                    <Skeleton className="h-6 w-40 rounded-full mb-3" />
                  )}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <Skeleton className="h-14 rounded-lg" />
                    <Skeleton className="h-14 rounded-lg" />
                    <Skeleton className="h-14 rounded-lg" />
                  </div>
                  {activeTab === "verified" ? (
                    <>
                      <div className="flex items-center justify-between mb-3 pb-3 border-b border-border/30">
                        <Skeleton className="h-3 w-32" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Skeleton className="h-9 rounded-lg" />
                        <Skeleton className="h-9 rounded-lg" />
                      </div>
                    </>
                  ) : (
                    <Skeleton className="h-9 rounded-lg" />
                  )}
                </div>
              )
            )}
          </div>
        ) : error ? (
          <ErrorState
            message={getErrorMessage(error, "Unable to load channels")}
            description="Please try again in a moment."
            onRetry={() => refetch()}
          />
        ) : (
          <>
            {myChannels.length === 0 && (
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

            {myChannels.length > 0 && activeTab === "verified" && (
              <>
                {activeChannels.length > 0 ? (
                  <div className="space-y-3">
                    {activeChannels.map((channel) => (
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
                            Earnings:{" "}
                            <span className="text-primary">{channel.earnings} TON</span>
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
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-sm">
                      No verified channels yet.
                    </p>
                  </div>
                )}
              </>
            )}

            {myChannels.length > 0 && activeTab === "pending" && (
              <>
                {activeChannels.length > 0 ? (
                  <div className="space-y-3">
                    {activeChannels.map((channel) => (
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
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-sm">
                      No pending channels right now.
                    </p>
                  </div>
                )}
              </>
            )}
          </>
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

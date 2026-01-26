import { useState } from "react";
import DealCard from "@/components/deals/DealCard";
import { Link, useNavigate } from "react-router-dom";
import { formatRelativeTime } from "@/features/deals/time";
import { getDealPresentation } from "@/features/deals/status";
import { useDeals } from "@/features/deals/hooks";
import LoadingSkeleton from "@/components/feedback/LoadingSkeleton";
import ErrorState from "@/components/feedback/ErrorState";
import { getErrorMessage } from "@/lib/api/errors";

export default function Deals() {
  const [activeTab, setActiveTab] = useState("active");
  const navigate = useNavigate();
  const {
    data: deals = [],
    isLoading,
    error,
    refetch,
  } = useDeals(activeTab as "active" | "pending" | "completed");

  const currentDeals = deals;
  const showEmptyState = !isLoading && currentDeals.length === 0 && !error;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="px-4 pt-4">
        <h1 className="text-base font-semibold text-foreground">Deals</h1>
        <div className="mt-3 border-t border-border/50">
          <div className="flex gap-6 bg-background/90 backdrop-blur-glass">
            {(["active", "pending", "completed"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === tab
                    ? "text-primary border-b-primary"
                    : "text-muted-foreground border-b-transparent"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {isLoading ? (
          <LoadingSkeleton items={3} />
        ) : error ? (
          <ErrorState
            message={getErrorMessage(error, "Unable to load deals")}
            description="Please check your connection and try again."
            onRetry={() => refetch()}
          />
        ) : showEmptyState ? (
          <div className="rounded-2xl border border-border/60 bg-card/80 p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-3xl">
              🪄
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">No deals yet</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Start a new collaboration to see deals listed here.
            </p>
            <Link
              to="/marketplace"
              className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              Browse Marketplace
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {currentDeals.map((deal) => {
              const presentation = getDealPresentation(deal);
              return (
                <DealCard
                  key={deal.id}
                  name={deal.channel.title}
                  username={deal.channel.username}
                  verified={deal.channel.isVerified}
                  avatarUrl={deal.channel.avatarUrl}
                  statusLabel={presentation.label}
                  statusTone={presentation.tone}
                  price={`${deal.priceTon} TON`}
                  updatedLabel={formatRelativeTime(deal.updatedAt)}
                  ctaLabel={presentation.listAction}
                  onSelect={() => navigate(`/deals/${deal.id}`)}
                  onAction={() => navigate(`/deals/${deal.id}`)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

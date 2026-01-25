import { useEffect, useMemo, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import DealCard from "@/components/deals/DealCard";
import { Link, useNavigate } from "react-router-dom";
import { getDeals } from "@/features/deals/api";
import type { Deal } from "@/features/deals/types";
import { getDealCategory, getDealStatusPresentation, getUpdatedLabel } from "@/features/deals/utils";

export default function Deals() {
  const [activeTab, setActiveTab] = useState("active");
  const [isLoading, setIsLoading] = useState(true);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    getDeals()
      .then((data) => {
        if (!isMounted) {
          return;
        }
        setDeals(data);
        setError(null);
      })
      .catch((err) => {
        if (!isMounted) {
          return;
        }
        setError(err instanceof Error ? err.message : "Unable to load deals");
      })
      .finally(() => {
        if (!isMounted) {
          return;
        }
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) {
      return;
    }

    const updateHeaderHeight = () => {
      setHeaderHeight(header.offsetHeight);
    };

    updateHeaderHeight();

    const observer = new ResizeObserver(() => updateHeaderHeight());
    observer.observe(header);
    window.addEventListener("resize", updateHeaderHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeaderHeight);
    };
  }, []);

  const dealsByTab = useMemo(() => {
    return deals.reduce(
      (acc, deal) => {
        const tab = getDealCategory(deal);
        acc[tab].push(deal);
        return acc;
      },
      { active: [] as Deal[], pending: [] as Deal[], completed: [] as Deal[] },
    );
  }, [deals]);

  const currentDeals = dealsByTab[activeTab as keyof typeof dealsByTab] ?? [];
  const showEmptyState = !isLoading && deals.length === 0;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        ref={headerRef}
        className="fixed left-0 right-0 z-30 bg-background/90 backdrop-blur-glass border-b border-border/50"
        style={{
          top: "calc(var(--tg-content-safe-area-inset-top) + var(--wallet-banner-height, 0px))",
        }}
      >
        <div className="mx-auto w-full max-w-2xl">
          {/* Header */}
          <div className="px-4 py-3">
            <h1 className="text-base font-semibold text-foreground">Deals</h1>
          </div>

          {/* Tabs */}
          <div className="border-t border-border/50">
            <div className="px-4 flex gap-6 bg-background/80 backdrop-blur-glass">
              {["active", "pending", "completed"].map((tab) => (
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
      </div>

      {/* Main content */}
      <div style={{ paddingTop: headerHeight }} className="px-4 py-6 space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={`deal-skeleton-${index}`} className="glass p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <Skeleton className="h-12 rounded-lg" />
                  <Skeleton className="h-12 rounded-lg" />
                </div>
                <Skeleton className="h-10 rounded-lg" />
              </div>
            ))}
          </div>
        ) : showEmptyState ? (
          <div className="glass p-8 rounded-lg text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🪄</span>
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">No deals yet</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Start a new collaboration to see deals listed here.
            </p>
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              Browse Marketplace
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {error ? (
              <div className="glass p-4 text-sm text-destructive">{error}</div>
            ) : null}
            {currentDeals.map((deal) => {
              const presentation = getDealStatusPresentation(deal);
              return (
                <DealCard
                  key={deal.id}
                  id={deal.id}
                  name={deal.channel.title}
                  username={`@${deal.channel.username}`}
                  verified={deal.channel.isVerified}
                  avatarUrl={deal.channel.avatarUrl}
                  status={presentation.label}
                  statusKey={presentation.statusKey}
                  icon={presentation.icon}
                  price={deal.price}
                  meta={getUpdatedLabel(deal.updatedAt)}
                  secondary={presentation.secondary}
                  action={presentation.action}
                  onSelect={() => navigate(`/deals/${deal.id}`)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

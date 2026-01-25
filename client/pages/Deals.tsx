import { useEffect, useMemo, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import DealCard from "@/components/deals/DealCard";
import { Link, useNavigate } from "react-router-dom";
import { getDeals } from "@/features/deals/api";
import type { Deal } from "@/features/deals/types";
import { formatRelativeTime } from "@/features/deals/time";
import { getDealCategory, getDealPresentation } from "@/features/deals/status";

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
        className="fixed left-0 right-0 z-30 border-b border-border/50 bg-background/90 backdrop-blur-glass"
        style={{
          top: "calc(var(--tg-content-safe-area-inset-top) + var(--wallet-banner-height, 0px))",
        }}
      >
        <div className="mx-auto w-full max-w-2xl">
          <div className="px-4 py-3">
            <h1 className="text-base font-semibold text-foreground">Deals</h1>
          </div>
          <div className="border-t border-border/50">
            <div className="px-4 flex gap-6 bg-background/90 backdrop-blur-glass">
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
      </div>

      <div style={{ paddingTop: headerHeight }} className="px-4 py-6 space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={`deal-skeleton-${index}`} className="rounded-2xl border border-border/50 bg-card/80 p-4">
                <Skeleton className="h-24 rounded-xl" />
              </div>
            ))}
          </div>
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
            {error ? <div className="rounded-2xl border border-border/60 bg-card/80 p-4 text-sm text-destructive">{error}</div> : null}
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

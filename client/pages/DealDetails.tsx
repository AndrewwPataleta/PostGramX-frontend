import { useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useParams } from "react-router-dom";
import DetailHeader from "@/components/deals/DetailHeader";
import InfoCard from "@/components/deals/InfoCard";
import Timeline from "@/components/deals/Timeline";
import { fetchDealsList } from "@/api/features/dealsApi";
import { formatScheduleDate } from "@/features/deals/time";
import { toast } from "sonner";
import LoadingSkeleton from "@/components/feedback/LoadingSkeleton";
import ErrorState from "@/components/feedback/ErrorState";
import { PageContainer } from "@/components/layout/PageContainer";
import { getErrorMessage } from "@/lib/api/errors";
import type { DealListItem } from "@/types/deals";
import { formatTonString, nanoToTonString } from "@/lib/ton";

const formatDateTime = (value?: string) => {
  if (!value) {
    return "-";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function DealDetails() {
  const { dealId } = useParams<{ dealId: string }>();
  const location = useLocation();
  const queryClient = useQueryClient();
  const stateDeal = (location.state as { deal?: DealListItem } | null)?.deal;
  const cachedDeal = dealId
    ? queryClient.getQueryData<DealListItem>(["dealById", dealId])
    : undefined;
  const preferredDeal = stateDeal?.id === dealId ? stateDeal : cachedDeal;

  const shouldFetch = Boolean(dealId) && !preferredDeal;
  const {
    data: fallbackDeals,
    isLoading: isFetchingFallback,
    error,
    refetch,
  } = useQuery({
    queryKey: ["deals", "list", "detail-fallback", dealId],
    queryFn: () =>
      fetchDealsList({
        role: "all",
        pendingLimit: 20,
        activeLimit: 20,
        completedLimit: 20,
      }),
    enabled: shouldFetch,
    staleTime: 20_000,
  });

  useEffect(() => {
    if (error) {
      toast.error(getErrorMessage(error, "Unable to load deals"));
    }
  }, [error]);

  const fallbackDeal = useMemo(() => {
    if (!fallbackDeals || !dealId) {
      return null;
    }
    const allDeals = [
      ...fallbackDeals.pending.items,
      ...fallbackDeals.active.items,
      ...fallbackDeals.completed.items,
    ];
    return allDeals.find((deal) => deal.id === dealId) ?? null;
  }, [dealId, fallbackDeals]);

  const deal = preferredDeal ?? fallbackDeal ?? null;
  const isLoading = shouldFetch && isFetchingFallback;
  const statusLabel = deal?.status ? deal.status.replace(/_/g, " ") : "";
  const escrowLabel = deal?.escrowStatus ? deal.escrowStatus.replace(/_/g, " ") : "";
  const tone = (() => {
    if (!deal) {
      return "neutral";
    }
    switch (deal.status) {
      case "COMPLETED":
        return "success";
      case "CANCELED":
        return "danger";
      case "ACTIVE":
        return "primary";
      case "PENDING":
      default:
        return "warning";
    }
  })();
  const timelineItems = useMemo(() => {
    if (!deal) {
      return [];
    }
    const steps =
      deal.status === "CANCELED" ? ["Pending", "Active", "Canceled"] : ["Pending", "Active", "Completed"];
    const currentIndex =
      deal.status === "PENDING" ? 0 : deal.status === "ACTIVE" ? 1 : 2;
    return steps.map((label, index) => ({
      label,
      state: index < currentIndex ? "completed" : index === currentIndex ? "current" : "upcoming",
    }));
  }, [deal]);
  const formattedPrice = deal
    ? `${formatTonString(nanoToTonString(deal.listing.priceNano))} TON`
    : "--";
  const roleLabel = deal
    ? deal.userRoleInDeal === "advertiser"
      ? "You are advertiser"
      : deal.userRoleInDeal === "publisher"
      ? "You are publisher"
      : "You manage this channel"
    : "";
  const initiatorLabel = deal
    ? deal.initiatorSide === "ADVERTISER"
      ? "Advertiser initiated"
      : "Publisher initiated"
    : "";

  return (
    <div className="w-full max-w-2xl mx-auto">
      <PageContainer className="py-6 space-y-4">
        {isLoading ? (
          <LoadingSkeleton items={3} />
        ) : error || !deal ? (
          <ErrorState
            message={getErrorMessage(error, "Deal not found")}
            description="We couldn't load this deal right now."
            onRetry={() => refetch()}
          />
        ) : (
          <>
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-start">
              <DetailHeader
                status={statusLabel || "Deal"}
                tone={tone}
                title={deal.channel.name}
                username={deal.channel.username}
                price={formattedPrice}
                dealId={deal.id}
                avatarUrl={deal.channel.avatarUrl ?? undefined}
                statusDescription={escrowLabel ? `Escrow: ${escrowLabel}` : "Escrow status pending"}
              />

              <Timeline items={timelineItems} />
            </div>

            <InfoCard title="Status">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-foreground">
                <span className="rounded-full bg-foreground/5 px-3 py-1">{statusLabel}</span>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">
                  {escrowLabel}
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Created {formatDateTime(deal.createdAt)} · Last activity{" "}
                {formatDateTime(deal.lastActivityAt)}
              </p>
            </InfoCard>

            <InfoCard title="Listing">
              <div className="grid gap-2 text-sm text-foreground sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Price</p>
                  <p className="font-semibold">{formattedPrice}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Format</p>
                  <p className="font-semibold">{deal.listing.format}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Placement</p>
                  <p className="font-semibold">Pinned {deal.listing.placementHours}h</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Visibility</p>
                  <p className="font-semibold">Visible {deal.listing.lifetimeHours}h</p>
                </div>
              </div>
              {deal.listing.tags.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {deal.listing.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-secondary/60 px-3 py-1 text-xs font-medium text-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </InfoCard>

            <InfoCard title="Schedule">
              <p className="text-sm text-foreground">{formatScheduleDate(deal.scheduledAt)}</p>
              <p className="text-xs text-muted-foreground">
                Last activity {formatDateTime(deal.lastActivityAt)}
              </p>
            </InfoCard>
          </>
        )}
      </PageContainer>
    </div>
  );
}

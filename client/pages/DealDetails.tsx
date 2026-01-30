import { useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useParams } from "react-router-dom";
import DealHeaderCard from "@/components/deals/DealHeaderCard";
import StageTimeline from "@/components/deals/StageTimeline";
import { fetchDealDetails, fetchDealsList } from "@/api/features/dealsApi";
import { toast } from "sonner";
import LoadingSkeleton from "@/components/feedback/LoadingSkeleton";
import ErrorState from "@/components/feedback/ErrorState";
import { PageContainer } from "@/components/layout/PageContainer";
import { getErrorMessage } from "@/lib/api/errors";
import type { DealListItem } from "@/types/deals";
import { allStages, getCurrentStage } from "@/features/deals/dealStageMachine";
import type { EscrowStatus } from "@/types/deals";
import StageScheduleTime from "@/features/deals/stages/StageScheduleTime";
import StageSendPost from "@/features/deals/stages/StageSendPost";
import StageConfirmPost from "@/features/deals/stages/StageConfirmPost";
import StageAdminApproval from "@/features/deals/stages/StageAdminApproval";
import StagePaymentWindow from "@/features/deals/stages/StagePaymentWindow";
import StagePayment from "@/features/deals/stages/StagePayment";
import StagePaymentPending from "@/features/deals/stages/StagePaymentPending";
import StageScheduled from "@/features/deals/stages/StageScheduled";
import StageVerifying from "@/features/deals/stages/StageVerifying";
import StageDone from "@/features/deals/stages/StageDone";

export default function DealDetails() {
  const { dealId } = useParams<{ dealId: string }>();
  const location = useLocation();
  const queryClient = useQueryClient();
  const stateDeal = (location.state as { deal?: DealListItem } | null)?.deal;
  const cachedDeal = dealId ? queryClient.getQueryData<DealListItem>(["deal", dealId]) : undefined;
  const preferredDeal = stateDeal?.id === dealId ? stateDeal : cachedDeal;

  const {
    data: deal,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["deal", dealId],
    queryFn: async () => {
      if (!dealId) {
        throw new Error("Missing deal id");
      }
      return fetchDealDetails(dealId);
    },
    enabled: Boolean(dealId),
    initialData: preferredDeal,
    refetchInterval: (data) => {
      if (!data) {
        return false;
      }
      if (data.escrowStatus === "CREATIVE_AWAITING_ADMIN_REVIEW") {
        return 10000;
      }
      if (data.escrowStatus === "AWAITING_PAYMENT") {
        return 12000;
      }
      return ["FUNDS_PENDING", "POSTED_VERIFYING"].includes(data.escrowStatus) ? 5000 : false;
    },
  });

  const fallbackListQuery = useQuery({
    queryKey: ["deals", "list", "detail-fallback", dealId],
    queryFn: () =>
      fetchDealsList({
        role: "all",
        pendingLimit: 20,
        activeLimit: 20,
        completedLimit: 20,
      }),
    enabled: Boolean(dealId) && !deal,
    staleTime: 20_000,
  });

  const fallbackDeal = useMemo(() => {
    if (!fallbackListQuery.data || !dealId) {
      return null;
    }
    const allDeals = [
      ...fallbackListQuery.data.pending.items,
      ...fallbackListQuery.data.active.items,
      ...fallbackListQuery.data.completed.items,
    ];
    return allDeals.find((entry) => entry.id === dealId) ?? null;
  }, [dealId, fallbackListQuery.data]);

  const resolvedDeal = deal ?? fallbackDeal;

  useEffect(() => {
    if (error || fallbackListQuery.error) {
      toast.error(getErrorMessage(error ?? fallbackListQuery.error, "Unable to load deal"));
    }
  }, [error, fallbackListQuery.error]);

  const currentStage = resolvedDeal ? getCurrentStage(resolvedDeal.escrowStatus) : "SCHEDULE";
  const availableStages = resolvedDeal ? allStages : [];

  const stagePanel = useMemo(() => {
    if (!resolvedDeal) {
      return null;
    }
    const isAdvertiser = resolvedDeal.userRoleInDeal === "advertiser";
    const isPublisher =
      resolvedDeal.userRoleInDeal === "publisher" || resolvedDeal.userRoleInDeal === "publisher_manager";
    const readonlyForPublisher = !isAdvertiser;

    const stageComponents: Record<EscrowStatus, JSX.Element> = {
      SCHEDULING_PENDING: <StageScheduleTime deal={resolvedDeal} readonly={!isAdvertiser} />,
      CREATIVE_AWAITING_SUBMIT: <StageSendPost deal={resolvedDeal} readonly={!isAdvertiser} />,
      CREATIVE_AWAITING_ADMIN_REVIEW: (
        <StageAdminApproval deal={resolvedDeal} readonly={!isPublisher} />
      ),
      CREATIVE_AWAITING_CONFIRM: (
        <StageConfirmPost deal={resolvedDeal} readonly={!isAdvertiser} />
      ),
    //  CREATIVE_AWAITING_CONFIRM: <StageAdminApproval deal={resolvedDeal} readonly={!isPublisher} />,

      PAYMENT_AWAITING: (
        <StagePayment
          deal={resolvedDeal}
          readonly={readonlyForPublisher}
          onAction={readonlyForPublisher ? undefined : { onRefresh: () => refetch() }}
          isRefreshing={isFetching}
        />
      ),
      FUNDS_PENDING: (
        <StagePaymentPending
          deal={resolvedDeal}
          readonly={readonlyForPublisher}
          onAction={readonlyForPublisher ? undefined : { onRefresh: () => refetch() }}
          isRefreshing={isFetching}
        />
      ),
      FUNDS_CONFIRMED: <StageScheduled deal={resolvedDeal} readonly={readonlyForPublisher} />,
      APPROVED_SCHEDULED: <StageScheduled deal={resolvedDeal} readonly={readonlyForPublisher} />,
      POSTED_VERIFYING: <StageVerifying deal={resolvedDeal} readonly={readonlyForPublisher} />,
      COMPLETED: <StageDone deal={resolvedDeal} readonly={readonlyForPublisher} />,
      CANCELED: <StageDone deal={resolvedDeal} readonly={readonlyForPublisher} />,
      REFUNDED: <StageDone deal={resolvedDeal} readonly={readonlyForPublisher} />,
      DISPUTED: <StageDone deal={resolvedDeal} readonly={readonlyForPublisher} />,
    };

    return stageComponents[resolvedDeal.escrowStatus];
  }, [isFetching, refetch, resolvedDeal]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <PageContainer className="py-6 space-y-4">
        {isLoading ? (
          <LoadingSkeleton items={3} />
        ) : error || fallbackListQuery.error || !resolvedDeal ? (
          <ErrorState
            message={getErrorMessage(error ?? fallbackListQuery.error, "Deal not found")}
            description="We couldn't load this deal right now."
            onRetry={() => refetch()}
          />
        ) : (
          <>
            <DealHeaderCard deal={resolvedDeal} />

            <StageTimeline
              stages={availableStages}
              selectedStage={currentStage}
              escrowStatus={resolvedDeal.escrowStatus}
            />

            {stagePanel}
          </>
        )}
      </PageContainer>
    </div>
  );
}

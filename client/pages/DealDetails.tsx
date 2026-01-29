import { useEffect, useMemo, useState } from "react";
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
import { canNavigateTo, getAvailableStages, getCurrentStage, type DealStageId } from "@/features/deals/dealStageMachine";
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
      return ["PAYMENT_AWAITING", "FUNDS_PENDING", "POSTED_VERIFYING"].includes(data.escrowStatus)
        ? 5000
        : false;
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
  const availableStages = resolvedDeal ? getAvailableStages(resolvedDeal.escrowStatus) : [];
  const [selectedStage, setSelectedStage] = useState<DealStageId | null>(null);

  useEffect(() => {
    if (!resolvedDeal) {
      return;
    }
    setSelectedStage((prev) => {
      if (!prev) {
        return currentStage;
      }
      if (!canNavigateTo(prev, resolvedDeal.escrowStatus)) {
        return currentStage;
      }
      return prev;
    });
  }, [currentStage, resolvedDeal]);

  const handleSelectStage = (stage: DealStageId) => {
    if (!resolvedDeal) {
      return;
    }
    if (canNavigateTo(stage, resolvedDeal.escrowStatus)) {
      setSelectedStage(stage);
    }
  };

  const stagePanel = useMemo(() => {
    if (!resolvedDeal || !selectedStage) {
      return null;
    }
    const isCurrent = selectedStage === currentStage;
    switch (selectedStage) {
      case "SCHEDULE":
        return <StageScheduleTime deal={resolvedDeal} isCurrent={isCurrent} />;
      case "SEND_POST":
        return <StageSendPost deal={resolvedDeal} isCurrent={isCurrent} />;
      case "CONFIRM_POST":
        return <StageConfirmPost deal={resolvedDeal} isCurrent={isCurrent} />;
      case "ADMIN_APPROVAL":
        return <StageAdminApproval deal={resolvedDeal} isCurrent={isCurrent} />;
      case "PAYMENT_WINDOW":
        return <StagePaymentWindow deal={resolvedDeal} isCurrent={isCurrent} />;
      case "PAYMENT":
        return <StagePayment deal={resolvedDeal} isCurrent={isCurrent} />;
      case "PAYMENT_PENDING":
        return (
          <StagePaymentPending
            isCurrent={isCurrent}
            onRefresh={() => refetch()}
            isRefreshing={isFetching}
          />
        );
      case "SCHEDULED":
        return <StageScheduled deal={resolvedDeal} isCurrent={isCurrent} />;
      case "VERIFYING":
        return <StageVerifying deal={resolvedDeal} isCurrent={isCurrent} />;
      case "DONE":
        return <StageDone deal={resolvedDeal} />;
      default:
        return null;
    }
  }, [currentStage, isFetching, refetch, resolvedDeal, selectedStage]);

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
            <DealHeaderCard deal={resolvedDeal} currentStage={currentStage} />

            <StageTimeline
              stages={availableStages}
              selectedStage={selectedStage ?? currentStage}
              escrowStatus={resolvedDeal.escrowStatus}
              onSelect={handleSelectStage}
            />

            {stagePanel}
          </>
        )}
      </PageContainer>
    </div>
  );
}

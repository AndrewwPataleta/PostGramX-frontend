import { useMemo, useState } from "react";
import { Copy, Link as LinkIcon } from "lucide-react";
import { useParams } from "react-router-dom";
import DetailHeader from "@/components/deals/DetailHeader";
import InfoCard from "@/components/deals/InfoCard";
import Timeline from "@/components/deals/Timeline";
import {
  USE_MOCK_DEALS,
} from "@/features/deals/api";
import { buildTonConnectTransaction, buildTonTransferLink } from "@/features/deals/payment";
import { formatCountdown, formatRelativeTime, formatScheduleDate } from "@/features/deals/time";
import { getDealPresentation, getTimelineItems } from "@/features/deals/status";
import { toast } from "sonner";
import { useTonConnectModal, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import {
  useApproveCreative,
  useDeal,
  useRequestEdits,
  useSimulatePayment,
  useSimulatePost,
  useSimulateVerifyFail,
  useSimulateVerifyPass,
} from "@/features/deals/hooks";
import LoadingSkeleton from "@/components/feedback/LoadingSkeleton";
import ErrorState from "@/components/feedback/ErrorState";
import { getErrorMessage } from "@/lib/api/errors";

export default function DealDetails() {
  const { dealId } = useParams<{ dealId: string }>();
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [showManualTransfer, setShowManualTransfer] = useState(false);
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();
  const { open: openWalletModal } = useTonConnectModal();
  const {
    data: deal,
    isLoading,
    error,
    refetch,
  } = useDeal(dealId);
  const approveCreativeMutation = useApproveCreative();
  const requestEditsMutation = useRequestEdits();
  const simulatePaymentMutation = useSimulatePayment();
  const simulatePostMutation = useSimulatePost();
  const simulateVerifyPassMutation = useSimulateVerifyPass();
  const simulateVerifyFailMutation = useSimulateVerifyFail();
  const actionInFlight =
    isActionLoading ||
    approveCreativeMutation.isPending ||
    requestEditsMutation.isPending ||
    simulatePaymentMutation.isPending ||
    simulatePostMutation.isPending ||
    simulateVerifyPassMutation.isPending ||
    simulateVerifyFailMutation.isPending;

  const presentation = useMemo(() => (deal ? getDealPresentation(deal) : null), [deal]);
  const timelineItems = useMemo(() => (deal ? getTimelineItems(deal) : []), [deal]);
  const releaseCountdown = formatCountdown(deal?.post?.verifyUntil);

  const handleApproveCreative = async () => {
    if (!deal) {
      return;
    }
    setIsActionLoading(true);
    try {
      await approveCreativeMutation.mutateAsync(deal.id);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleRequestEdits = async () => {
    if (!deal) {
      return;
    }
    setIsActionLoading(true);
    try {
      await requestEditsMutation.mutateAsync({
        id: deal.id,
        note: "Please tweak the CTA and shorten the headline.",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handlePayViaTelegram = async () => {
    if (!deal) {
      return;
    }

    const address = deal.escrow?.depositAddress;
    if (!address) {
      toast.error("Payment address is missing");
      return;
    }

    const amountTon = deal.escrow?.amountTon ?? deal.priceTon;
    if (!Number.isFinite(amountTon) || amountTon <= 0) {
      toast.error("Payment amount is invalid");
      return;
    }

    if (!wallet) {
      openWalletModal();
      toast.info("Connect a TON wallet to continue");
      return;
    }

    setIsActionLoading(true);
    try {
      await tonConnectUI.sendTransaction(
        buildTonConnectTransaction({ address, amountTon })
      );

      if (USE_MOCK_DEALS) {
        await simulatePaymentMutation.mutateAsync(deal.id);
      } else {
        toast.success("Transaction sent. Awaiting confirmation.");
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "Unable to process payment"));
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleSimulatePost = async () => {
    if (!deal) {
      return;
    }
    setIsActionLoading(true);
    try {
      await simulatePostMutation.mutateAsync(deal.id);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleSimulateVerifyPass = async () => {
    if (!deal) {
      return;
    }
    setIsActionLoading(true);
    try {
      await simulateVerifyPassMutation.mutateAsync(deal.id);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleSimulateVerifyFail = async () => {
    if (!deal) {
      return;
    }
    setIsActionLoading(true);
    try {
      await simulateVerifyFailMutation.mutateAsync(deal.id);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleCopy = async (value?: string) => {
    if (!value) {
      return;
    }
    await navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="px-4 py-6 space-y-4">
        {isLoading ? (
          <LoadingSkeleton items={3} />
        ) : error || !deal || !presentation ? (
          <ErrorState
            message={getErrorMessage(error, "Deal not found")}
            description="We couldn't load this deal right now."
            onRetry={() => refetch()}
          />
        ) : (
          <>
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-start">
              <DetailHeader
                status={presentation.label}
                tone={presentation.tone}
                title={deal.channel.title}
                username={deal.channel.username}
                verified={deal.channel.isVerified}
                price={`${deal.priceTon} TON`}
                dealId={deal.id}
                avatarUrl={deal.channel.avatarUrl}
                statusDescription={presentation.description}
              />

              <Timeline items={timelineItems} />
            </div>

            <InfoCard title="Escrow">
              <div className="flex items-center justify-between text-sm text-foreground">
                <span>{deal.escrow?.status ?? "Awaiting payment"}</span>
                <span className="font-semibold">{deal.escrow?.amountTon ?? deal.priceTon} TON</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Escrow holds funds safely until the post is verified.
              </p>
              {deal.escrow?.status === "AWAITING_PAYMENT" ? (
                <div className="mt-4 space-y-3">
                  <button
                    type="button"
                    onClick={handlePayViaTelegram}
                    disabled={actionInFlight}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:pointer-events-none disabled:opacity-70"
                  >
                    Pay via Telegram Wallet
                  </button>
                  <a
                    href={
                      deal.escrow.depositAddress
                        ? buildTonTransferLink({
                            address: deal.escrow.depositAddress,
                            amountTon: deal.escrow.amountTon,
                            memo: deal.escrow.memo,
                          })
                        : undefined
                    }
                    className="inline-flex w-full items-center justify-center rounded-xl border border-border/60 px-4 py-2 text-xs font-semibold text-foreground"
                  >
                    Open TON transfer link
                  </a>
                  <button
                    type="button"
                    onClick={() => setShowManualTransfer((value) => !value)}
                    className="w-full rounded-xl border border-border/60 px-4 py-2 text-sm text-foreground"
                  >
                    {showManualTransfer ? "Hide" : "Show"} manual transfer
                  </button>
                  {showManualTransfer ? (
                    <div className="space-y-2 rounded-xl border border-border/60 bg-background p-3 text-xs text-muted-foreground">
                      <div className="flex items-center justify-between">
                        <span>Address</span>
                        <button type="button" onClick={() => handleCopy(deal.escrow?.depositAddress)}>
                          <Copy size={14} />
                        </button>
                      </div>
                      <p className="break-all text-foreground">{deal.escrow?.depositAddress ?? "-"}</p>
                      <div className="flex items-center justify-between">
                        <span>Memo</span>
                        <button type="button" onClick={() => handleCopy(deal.escrow?.memo)}>
                          <Copy size={14} />
                        </button>
                      </div>
                      <p className="text-foreground">{deal.escrow?.memo ?? "-"}</p>
                    </div>
                  ) : null}
                  {USE_MOCK_DEALS ? (
                    <p className="text-xs text-muted-foreground">
                      Mock payments confirm after the wallet approval flow.
                    </p>
                  ) : null}
                </div>
              ) : null}
              <div className="mt-3 text-[11px] text-muted-foreground">
                {formatRelativeTime(deal.updatedAt)}
              </div>
            </InfoCard>

            <InfoCard title="Creative">
              <p className="text-sm font-semibold text-foreground">
                {deal.creative?.submittedAt
                  ? deal.creative.approvedAt
                    ? "Approved"
                    : "Needs your review"
                  : "Waiting for channel owner"}
              </p>
              <p className="text-sm text-muted-foreground">
                {deal.creative?.text ?? "Creative will appear here once submitted."}
              </p>
              {deal.creative?.submittedAt && !deal.creative?.approvedAt ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleApproveCreative}
                    disabled={actionInFlight}
                    className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={handleRequestEdits}
                    disabled={actionInFlight}
                    className="rounded-full border border-border/60 px-4 py-2 text-xs text-foreground"
                  >
                    Request edits
                  </button>
                </div>
              ) : (
                <p className="mt-3 text-[11px] text-muted-foreground">
                  Approvals are confirmed via bot messaging.
                </p>
              )}
            </InfoCard>

            <InfoCard title="Schedule">
              <p className="text-sm text-foreground">{formatScheduleDate(deal.schedule?.scheduledAt)}</p>
              <p className="text-xs text-muted-foreground">Timezone: {deal.schedule?.timezone ?? "UTC"}</p>
            </InfoCard>

            <InfoCard title="Delivery">
              <p className="text-sm text-foreground">
                {deal.post?.viewUrl ? "Post live" : "Waiting for delivery"}
              </p>
              {deal.post?.viewUrl ? (
                <a
                  href={deal.post.viewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-2 text-xs text-primary"
                >
                  <LinkIcon size={12} /> View in Telegram
                </a>
              ) : null}
              <p className="mt-2 text-xs text-muted-foreground">
                {releaseCountdown ? `Release in: ${releaseCountdown}` : "Verification pending"}
              </p>
              {USE_MOCK_DEALS ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleSimulatePost}
                    disabled={actionInFlight}
                    className="rounded-full border border-border/60 px-3 py-1 text-xs"
                  >
                    Simulate Post Published
                  </button>
                  <button
                    type="button"
                    onClick={handleSimulateVerifyPass}
                    disabled={actionInFlight}
                    className="rounded-full border border-border/60 px-3 py-1 text-xs"
                  >
                    Simulate Verify Pass
                  </button>
                  <button
                    type="button"
                    onClick={handleSimulateVerifyFail}
                    disabled={actionInFlight}
                    className="rounded-full border border-border/60 px-3 py-1 text-xs"
                  >
                    Simulate Verify Fail
                  </button>
                </div>
              ) : null}
            </InfoCard>

            <div className="sticky bottom-4 rounded-2xl border border-border/60 bg-card/90 px-4 py-3 backdrop-blur">
              <button
                type="button"
                className="w-full rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              >
                {presentation.ctaLabel}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

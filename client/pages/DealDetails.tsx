import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Copy, Link as LinkIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import DetailHeader from "@/components/deals/DetailHeader";
import InfoCard from "@/components/deals/InfoCard";
import Timeline from "@/components/deals/Timeline";
import { Skeleton } from "@/components/ui/skeleton";
import {
  approveCreative,
  getDeal,
  requestEdits,
  simulatePayment,
  simulatePost,
  simulateVerifyFail,
  simulateVerifyPass,
} from "@/features/deals/api";
import type { Deal } from "@/features/deals/types";
import { buildTonTransferLink } from "@/features/deals/payment";
import { formatCountdown, formatRelativeTime, formatScheduleDate } from "@/features/deals/time";
import { getDealPresentation, getTimelineItems } from "@/features/deals/status";
import { toast } from "sonner";

const USE_MOCK_DEALS = import.meta.env.VITE_USE_MOCK_DEALS === "true";

export default function DealDetails() {
  const { dealId } = useParams<{ dealId: string }>();
  const navigate = useNavigate();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [showManualTransfer, setShowManualTransfer] = useState(false);

  const loadDeal = async () => {
    if (!dealId) {
      setError("Missing deal ID");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const data = await getDeal(dealId);
      setDeal(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load deal");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadDeal();
  }, [dealId]);

  const presentation = useMemo(() => (deal ? getDealPresentation(deal) : null), [deal]);
  const timelineItems = useMemo(() => (deal ? getTimelineItems(deal) : []), [deal]);
  const releaseCountdown = formatCountdown(deal?.post?.verifyUntil);

  const handleApproveCreative = async () => {
    if (!deal) {
      return;
    }
    setIsActionLoading(true);
    try {
      const updated = await approveCreative(deal.id);
      setDeal(updated);
      toast.success("Creative approved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to approve creative");
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
      const updated = await requestEdits(deal.id, "Please tweak the CTA and shorten the headline.");
      setDeal(updated);
      toast.success("Edits requested");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to request edits");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleSimulatePayment = async () => {
    if (!deal) {
      return;
    }
    setIsActionLoading(true);
    try {
      const updated = await simulatePayment(deal.id);
      setDeal(updated);
      toast.success("Payment status updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to simulate payment");
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
      const updated = await simulatePost(deal.id);
      setDeal(updated);
      toast.success("Post published");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to simulate post");
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
      const updated = await simulateVerifyPass(deal.id);
      setDeal(updated);
      toast.success("Escrow released");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to simulate release");
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
      const updated = await simulateVerifyFail(deal.id);
      setDeal(updated);
      toast.success("Deal refunded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to simulate refund");
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
      <div className="sticky top-0 z-10 border-b border-border/50 bg-card/80 backdrop-blur-glass">
        <div className="flex items-center gap-3 px-4 py-4">
          <button type="button" onClick={() => navigate(-1)} className="text-foreground">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="font-semibold text-foreground">Deal Details</h1>
            <p className="text-xs text-muted-foreground">Advertiser view</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
        ) : error || !deal || !presentation ? (
          <div className="rounded-2xl border border-border/60 bg-card/80 p-6 text-sm text-destructive">
            {error ?? "Deal not found"}
          </div>
        ) : (
          <>
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
                    className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                  >
                    Pay via Telegram Wallet
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
                    <button
                      type="button"
                      onClick={handleSimulatePayment}
                      disabled={isActionLoading}
                      className="w-full rounded-xl bg-secondary px-4 py-2 text-xs font-semibold text-foreground"
                    >
                      Simulate Payment
                    </button>
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
                    disabled={isActionLoading}
                    className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={handleRequestEdits}
                    disabled={isActionLoading}
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
                    disabled={isActionLoading}
                    className="rounded-full border border-border/60 px-3 py-1 text-xs"
                  >
                    Simulate Post Published
                  </button>
                  <button
                    type="button"
                    onClick={handleSimulateVerifyPass}
                    disabled={isActionLoading}
                    className="rounded-full border border-border/60 px-3 py-1 text-xs"
                  >
                    Simulate Verify Pass
                  </button>
                  <button
                    type="button"
                    onClick={handleSimulateVerifyFail}
                    disabled={isActionLoading}
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

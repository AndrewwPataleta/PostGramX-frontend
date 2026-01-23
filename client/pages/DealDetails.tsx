import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import DetailHeader from "@/components/deals/DetailHeader";
import InfoCard from "@/components/deals/InfoCard";
import Timeline from "@/components/deals/Timeline";
import { Skeleton } from "@/components/ui/skeleton";
import { getDeal } from "@/features/deals/api";
import type { Deal } from "@/features/deals/types";
import {
  formatScheduleDate,
  getDealStatusPresentation,
  getMinutesRemaining,
  getTimelineItems,
  getUpdatedLabel,
} from "@/features/deals/utils";

export default function DealDetails() {
  const { id } = useParams();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Missing deal ID");
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    getDeal(id)
      .then((data) => {
        if (!isMounted) {
          return;
        }
        setDeal(data);
        setError(null);
      })
      .catch((err) => {
        if (!isMounted) {
          return;
        }
        setError(err instanceof Error ? err.message : "Unable to load deal");
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
  }, [id]);

  const presentation = useMemo(() => (deal ? getDealStatusPresentation(deal) : null), [deal]);
  const timelineItems = useMemo(() => (deal ? getTimelineItems(deal) : []), [deal]);
  const verifyMinutes = getMinutesRemaining(deal?.post?.verifyUntil);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header with back button */}
      <div className="sticky top-0 bg-card/80 backdrop-blur-glass border-b border-border/50 z-10">
        <div className="flex items-center gap-3 px-4 py-4">
          <Link to="/deals">
            <ArrowLeft size={24} className="text-foreground" />
          </Link>
          <div>
            <h1 className="font-semibold text-foreground">Deal Details</h1>
            <p className="text-xs text-muted-foreground">Campaign progress</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="px-4 py-6 space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-40 w-full rounded-3xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
        ) : error || !deal || !presentation ? (
          <div className="glass p-6 rounded-lg text-sm text-destructive">{error}</div>
        ) : (
          <>
            <DetailHeader
              status={presentation.label}
              statusKey={presentation.statusKey}
              icon={presentation.icon}
              title={deal.channel.title}
              username={deal.channel.username}
              verified={deal.channel.isVerified}
              price={deal.price}
              dealId={deal.id}
              avatarUrl={deal.channel.avatarUrl}
              statusDescription={presentation.description}
            />

            <Timeline items={timelineItems} />

            <InfoCard title="Escrow">
              <p className="flex items-center justify-between text-sm text-white">
                <span>{deal.escrow?.status ?? "Pending"}</span>
                <span className="font-semibold">{deal.escrow?.amount ?? deal.price}</span>
              </p>
              <p>{deal.escrow ? "Funds are secured in escrow." : "Escrow will activate after approval."}</p>
              <div className="rounded-xl border border-white/10 bg-slate-950/70 p-3 text-[11px] text-slate-400">
                <p>Network: {deal.escrow?.network ?? "TON"}</p>
                <p>{getUpdatedLabel(deal.updatedAt)}</p>
              </div>
            </InfoCard>

            <InfoCard title="Creative">
              <p className="text-sm text-white">
                {deal.creative?.approvedAt
                  ? "Approved"
                  : deal.creative?.submittedAt
                  ? "Submitted"
                  : "Drafting"}
              </p>
              <p>{deal.creative?.text ?? "Creative details will appear here once shared."}</p>
              <div className="flex gap-2">
                <button className="rounded-full bg-sky-500 px-3 py-2 text-xs font-semibold text-slate-950">
                  {deal.role === "ADVERTISER" ? "Approve" : "Send Draft"}
                </button>
                <button className="rounded-full border border-white/10 px-3 py-2 text-xs text-slate-200">
                  {deal.role === "ADVERTISER" ? "Request edits" : "Message advertiser"}
                </button>
              </div>
              <p className="text-[11px] text-slate-500">Approvals are confirmed via the bot.</p>
            </InfoCard>

            <InfoCard title="Schedule">
              <p className="text-sm text-white">{formatScheduleDate(deal.schedule?.scheduledAt)}</p>
              <button className="rounded-full border border-white/10 px-3 py-2 text-xs text-slate-200">
                {deal.role === "OWNER" ? "Select time" : "View schedule"}
              </button>
            </InfoCard>

            <InfoCard title="Delivery">
              <p className="text-sm text-white">{presentation.delivery}</p>
              {deal.post?.viewUrl ? (
                <a
                  href={deal.post.viewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-sky-400 underline"
                >
                  View in Telegram
                </a>
              ) : null}
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <div className="h-2 w-2 rounded-full bg-teal-400"></div>
                <span>{verifyMinutes ? `Release in: ${verifyMinutes}m` : "Awaiting verification"}</span>
              </div>
            </InfoCard>

            <div className="sticky bottom-4 mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3">
              <button className="flex-1 rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950">
                {presentation.primaryAction}
              </button>
              <button className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200">
                {presentation.secondaryAction}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

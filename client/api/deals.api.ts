import type { DealCardData } from "@/components/deals/DealCard";
import type { TimelineItem } from "@/components/deals/Timeline";

export interface DealsOverviewResponse {
  active: DealCardData[];
  pending: DealCardData[];
  completed: DealCardData[];
  timeline: TimelineItem[];
  timelineVerifying: TimelineItem[];
  quickFilters: string[];
}

export const dealsOverviewMock: DealsOverviewResponse = {
  active: [
    {
      id: "FGX-10291",
      name: "FlowgramX Daily",
      username: "@flowgramx",
      verified: true,
      status: "Funds Locked",
      statusKey: "fundsLocked",
      icon: "🔒",
      price: "35 TON",
      meta: "Updated 2h ago",
      secondary: "Posting: Jan 30, 18:00",
      action: "View Schedule",
    },
    {
      id: "FGX-10292",
      name: "Crypto Atlas",
      username: "@cryptoatlas",
      verified: false,
      status: "Post Live — Verifying",
      statusKey: "verifying",
      icon: "👁️",
      price: "48 TON",
      meta: "Updated 32m ago",
      secondary: "Release in: 45m",
      action: "View Post",
    },
    {
      id: "FGX-10293",
      name: "Signal Stream",
      username: "@signalstream",
      verified: true,
      status: "Scheduled",
      statusKey: "scheduled",
      icon: "📅",
      price: "22 TON",
      meta: "Updated 1h ago",
      secondary: "Posting: Feb 2, 09:00",
      action: "View Schedule",
    },
  ],
  pending: [
    {
      id: "FGX-10294",
      name: "Market Pulse",
      username: "@marketpulse",
      verified: false,
      status: "Awaiting Channel Approval",
      statusKey: "awaitingApproval",
      icon: "⏳",
      price: "18 TON",
      meta: "Updated 10m ago",
      secondary: "Awaiting approval",
      action: "Open",
    },
    {
      id: "FGX-10295",
      name: "TON Launchpad",
      username: "@tonlaunchpad",
      verified: true,
      status: "Payment Required",
      statusKey: "paymentRequired",
      icon: "💳",
      price: "40 TON",
      meta: "Updated 3h ago",
      secondary: "Awaiting payment",
      action: "Pay Now",
    },
    {
      id: "FGX-10296",
      name: "Founder Notes",
      username: "@foundernotes",
      verified: false,
      status: "Creative Review",
      statusKey: "creativeReview",
      icon: "✏️",
      price: "27 TON",
      meta: "Updated 15m ago",
      secondary: "Creative submitted",
      action: "Review",
    },
  ],
  completed: [
    {
      id: "FGX-10288",
      name: "Web3 Horizon",
      username: "@web3horizon",
      verified: true,
      status: "Completed",
      statusKey: "completed",
      icon: "✅",
      price: "52 TON",
      meta: "Updated yesterday",
      secondary: "Receipt available",
      action: "Receipt",
    },
    {
      id: "FGX-10287",
      name: "Chain Updates",
      username: "@chainupdates",
      verified: false,
      status: "Refunded",
      statusKey: "refunded",
      icon: "↩️",
      price: "14 TON",
      meta: "Updated 2d ago",
      secondary: "Refund sent",
      action: "Details",
    },
  ],
  timeline: [
    { label: "Accepted", state: "completed" },
    { label: "Payment", state: "current" },
    { label: "Creative", state: "upcoming" },
    { label: "Scheduled", state: "upcoming" },
    { label: "Posted", state: "upcoming" },
    { label: "Released", state: "upcoming" },
    { label: "Completed", state: "upcoming" },
  ],
  timelineVerifying: [
    { label: "Accepted", state: "completed" },
    { label: "Payment", state: "completed" },
    { label: "Creative", state: "completed" },
    { label: "Scheduled", state: "completed" },
    { label: "Posted", state: "current" },
    { label: "Released", state: "upcoming" },
    { label: "Completed", state: "upcoming" },
  ],
  quickFilters: ["Payment Required", "Creative Review", "Scheduled", "Verifying"],
};

export const getDealsOverview = async (): Promise<DealsOverviewResponse> =>
  Promise.resolve(dealsOverviewMock);

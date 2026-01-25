import type { Deal, DealStatus } from "./types";

export type DealStage =
  | "REQUESTED"
  | "PAYMENT_REQUIRED"
  | "PAYMENT_CONFIRMING"
  | "FUNDS_LOCKED"
  | "CREATIVE_DRAFTING"
  | "CREATIVE_REVIEW"
  | "CREATIVE_APPROVED"
  | "SCHEDULED"
  | "VERIFYING"
  | "RELEASED"
  | "REFUNDED";

export type DealCategory = "active" | "pending" | "completed";

export interface DealStagePresentation {
  label: string;
  description: string;
  ctaLabel: string;
  listAction: string;
  category: DealCategory;
  tone: "primary" | "warning" | "info" | "success" | "neutral" | "danger";
}

const stagePresentation: Record<DealStage, DealStagePresentation> = {
  REQUESTED: {
    label: "Request sent",
    description: "Your request is with the channel owner. We'll notify you via bot once accepted.",
    ctaLabel: "View request",
    listAction: "View",
    category: "pending",
    tone: "neutral",
  },
  PAYMENT_REQUIRED: {
    label: "Payment required",
    description: "Escrow keeps funds safe until the post is verified.",
    ctaLabel: "Pay escrow",
    listAction: "Pay Now",
    category: "pending",
    tone: "warning",
  },
  PAYMENT_CONFIRMING: {
    label: "Payment confirming",
    description: "We're confirming your TON transfer. This usually takes a minute.",
    ctaLabel: "View payment",
    listAction: "View",
    category: "pending",
    tone: "info",
  },
  FUNDS_LOCKED: {
    label: "Funds locked",
    description: "Funds are secured in escrow while the channel drafts your creative.",
    ctaLabel: "Message via bot",
    listAction: "View",
    category: "active",
    tone: "info",
  },
  CREATIVE_DRAFTING: {
    label: "Creative drafting",
    description: "The channel owner is preparing the creative draft for your review.",
    ctaLabel: "Message via bot",
    listAction: "View",
    category: "active",
    tone: "info",
  },
  CREATIVE_REVIEW: {
    label: "Creative review",
    description: "Review the draft and approve to schedule delivery.",
    ctaLabel: "Review creative",
    listAction: "Review",
    category: "active",
    tone: "primary",
  },
  CREATIVE_APPROVED: {
    label: "Creative approved",
    description: "Creative approved. Waiting for channel to schedule the post.",
    ctaLabel: "View status",
    listAction: "View",
    category: "active",
    tone: "info",
  },
  SCHEDULED: {
    label: "Scheduled",
    description: "The post is scheduled and queued for delivery.",
    ctaLabel: "View schedule",
    listAction: "View",
    category: "active",
    tone: "info",
  },
  VERIFYING: {
    label: "Posted · verifying",
    description: "Post is live. Verification checks will release escrow automatically.",
    ctaLabel: "View post",
    listAction: "View Post",
    category: "active",
    tone: "primary",
  },
  RELEASED: {
    label: "Released",
    description: "Post verified. Escrow released to the channel owner.",
    ctaLabel: "View receipt",
    listAction: "Receipt",
    category: "completed",
    tone: "success",
  },
  REFUNDED: {
    label: "Refunded",
    description: "Verification failed or the deal was cancelled. Funds returned.",
    ctaLabel: "View receipt",
    listAction: "Receipt",
    category: "completed",
    tone: "danger",
  },
};

export const getDealStage = (deal: Deal): DealStage => {
  if (deal.status === "REFUNDED" || deal.escrow?.status === "REFUNDED") {
    return "REFUNDED";
  }
  if (deal.status === "RELEASED" || deal.escrow?.status === "RELEASED") {
    return "RELEASED";
  }
  if (deal.status === "VERIFYING" || deal.status === "POSTED" || deal.post?.viewUrl) {
    return "VERIFYING";
  }
  if (deal.status === "SCHEDULED" || deal.schedule?.scheduledAt) {
    return "SCHEDULED";
  }
  if (deal.status === "CREATIVE_SUBMITTED" && !deal.creative?.approvedAt) {
    return "CREATIVE_REVIEW";
  }
  if (deal.status === "CREATIVE_APPROVED" || deal.creative?.approvedAt) {
    return "CREATIVE_APPROVED";
  }
  if (deal.status === "CREATIVE_DRAFTING") {
    return "CREATIVE_DRAFTING";
  }
  if (deal.status === "FUNDS_LOCKED" || deal.escrow?.status === "FUNDS_LOCKED") {
    return "FUNDS_LOCKED";
  }
  if (deal.status === "PAYMENT_CONFIRMING" || deal.escrow?.status === "PAYMENT_CONFIRMING") {
    return "PAYMENT_CONFIRMING";
  }
  if (
    deal.status === "PAYMENT_REQUIRED" ||
    deal.status === "OWNER_ACCEPTED" ||
    deal.escrow?.status === "AWAITING_PAYMENT"
  ) {
    return "PAYMENT_REQUIRED";
  }
  return "REQUESTED";
};

export const getDealCategory = (deal: Deal): DealCategory => {
  const stage = getDealStage(deal);
  return stagePresentation[stage].category;
};

export const getDealPresentation = (deal: Deal): DealStagePresentation => {
  const stage = getDealStage(deal);
  return stagePresentation[stage];
};

export const timelineSteps = ["Accepted", "Payment", "Creative", "Scheduled", "Posted", "Released"] as const;

const stageToTimelineIndex: Record<DealStage, number> = {
  REQUESTED: 0,
  PAYMENT_REQUIRED: 1,
  PAYMENT_CONFIRMING: 1,
  FUNDS_LOCKED: 2,
  CREATIVE_DRAFTING: 2,
  CREATIVE_REVIEW: 2,
  CREATIVE_APPROVED: 3,
  SCHEDULED: 3,
  VERIFYING: 4,
  RELEASED: 5,
  REFUNDED: 5,
};

export const getTimelineItems = (deal: Deal) => {
  const stage = getDealStage(deal);
  const currentIndex = stageToTimelineIndex[stage];

  return timelineSteps.map((label, index) => {
    if (index < currentIndex) {
      return { label, state: "completed" as const };
    }
    if (index === currentIndex) {
      return { label, state: "current" as const };
    }
    return { label, state: "upcoming" as const };
  });
};

export const getStageFromStatus = (status: DealStatus): DealStage => {
  if (status === "REFUNDED") {
    return "REFUNDED";
  }
  if (status === "RELEASED") {
    return "RELEASED";
  }
  if (status === "VERIFYING" || status === "POSTED") {
    return "VERIFYING";
  }
  if (status === "SCHEDULED") {
    return "SCHEDULED";
  }
  if (status === "CREATIVE_SUBMITTED") {
    return "CREATIVE_REVIEW";
  }
  if (status === "CREATIVE_APPROVED") {
    return "CREATIVE_APPROVED";
  }
  if (status === "CREATIVE_DRAFTING") {
    return "CREATIVE_DRAFTING";
  }
  if (status === "FUNDS_LOCKED") {
    return "FUNDS_LOCKED";
  }
  if (status === "PAYMENT_CONFIRMING") {
    return "PAYMENT_CONFIRMING";
  }
  if (status === "PAYMENT_REQUIRED" || status === "OWNER_ACCEPTED") {
    return "PAYMENT_REQUIRED";
  }
  return "REQUESTED";
};

export const getStagePresentation = (stage: DealStage) => stagePresentation[stage];

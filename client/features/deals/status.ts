import type { Deal, DealStatus } from "./types";
import type { TranslationKey } from "@/i18n/translations";

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
  label: TranslationKey;
  description: TranslationKey;
  ctaLabel: TranslationKey;
  listAction: TranslationKey;
  category: DealCategory;
  tone: "primary" | "warning" | "info" | "success" | "neutral" | "danger";
}

const stagePresentation: Record<DealStage, DealStagePresentation> = {
  REQUESTED: {
    label: "deals.stage.requested.label",
    description: "deals.stage.requested.description",
    ctaLabel: "deals.stage.requested.cta",
    listAction: "common.view",
    category: "pending",
    tone: "neutral",
  },
  PAYMENT_REQUIRED: {
    label: "deals.stage.paymentRequired.label",
    description: "deals.stage.paymentRequired.description",
    ctaLabel: "deals.stage.paymentRequired.cta",
    listAction: "deals.stage.paymentRequired.listAction",
    category: "pending",
    tone: "warning",
  },
  PAYMENT_CONFIRMING: {
    label: "deals.stage.paymentConfirming.label",
    description: "deals.stage.paymentConfirming.description",
    ctaLabel: "deals.stage.paymentConfirming.cta",
    listAction: "common.view",
    category: "pending",
    tone: "info",
  },
  FUNDS_LOCKED: {
    label: "deals.stage.fundsLocked.label",
    description: "deals.stage.fundsLocked.description",
    ctaLabel: "deals.stage.fundsLocked.cta",
    listAction: "common.view",
    category: "active",
    tone: "info",
  },
  CREATIVE_DRAFTING: {
    label: "deals.stage.creativeDrafting.label",
    description: "deals.stage.creativeDrafting.description",
    ctaLabel: "deals.stage.creativeDrafting.cta",
    listAction: "common.view",
    category: "active",
    tone: "info",
  },
  CREATIVE_REVIEW: {
    label: "deals.stage.creativeReview.label",
    description: "deals.stage.creativeReview.description",
    ctaLabel: "deals.stage.creativeReview.cta",
    listAction: "deals.stage.creativeReview.listAction",
    category: "active",
    tone: "primary",
  },
  CREATIVE_APPROVED: {
    label: "deals.stage.creativeApproved.label",
    description: "deals.stage.creativeApproved.description",
    ctaLabel: "deals.stage.creativeApproved.cta",
    listAction: "common.view",
    category: "active",
    tone: "info",
  },
  SCHEDULED: {
    label: "deals.stage.scheduled.label",
    description: "deals.stage.scheduled.description",
    ctaLabel: "deals.stage.scheduled.cta",
    listAction: "common.view",
    category: "active",
    tone: "info",
  },
  VERIFYING: {
    label: "deals.stage.verifying.label",
    description: "deals.stage.verifying.description",
    ctaLabel: "deals.stage.verifying.cta",
    listAction: "deals.stage.verifying.listAction",
    category: "active",
    tone: "primary",
  },
  RELEASED: {
    label: "deals.stage.released.label",
    description: "deals.stage.released.description",
    ctaLabel: "deals.stage.released.cta",
    listAction: "deals.stage.released.listAction",
    category: "completed",
    tone: "success",
  },
  REFUNDED: {
    label: "deals.stage.refunded.label",
    description: "deals.stage.refunded.description",
    ctaLabel: "deals.stage.refunded.cta",
    listAction: "deals.stage.refunded.listAction",
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

export const timelineSteps: TranslationKey[] = [
  "deals.timeline.step.accepted",
  "deals.timeline.step.payment",
  "deals.timeline.step.creative",
  "deals.timeline.step.scheduled",
  "deals.timeline.step.posted",
  "deals.timeline.step.released",
] as const;

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

export const getTimelineItems = (deal: Deal, t: (key: TranslationKey) => string) => {
  const stage = getDealStage(deal);
  const currentIndex = stageToTimelineIndex[stage];

  return timelineSteps.map((label, index) => {
    const resolvedLabel = t(label);
    if (index < currentIndex) {
      return { label: resolvedLabel, state: "completed" as const };
    }
    if (index === currentIndex) {
      return { label: resolvedLabel, state: "current" as const };
    }
    return { label: resolvedLabel, state: "upcoming" as const };
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

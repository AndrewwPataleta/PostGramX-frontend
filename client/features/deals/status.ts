import type { Deal, DealStatus } from "./types";
import type { TranslationKey } from "@/i18n/translations";
import { LEGACY_DEAL_STATUS, LEGACY_ESCROW_STATUS } from "@/constants/deals";

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
  [LEGACY_DEAL_STATUS.REQUESTED]: {
    label: "deals.stage.requested.label",
    description: "deals.stage.requested.description",
    ctaLabel: "deals.stage.requested.cta",
    listAction: "common.view",
    category: "pending",
    tone: "neutral",
  },
  [LEGACY_DEAL_STATUS.PAYMENT_REQUIRED]: {
    label: "deals.stage.paymentRequired.label",
    description: "deals.stage.paymentRequired.description",
    ctaLabel: "deals.stage.paymentRequired.cta",
    listAction: "deals.stage.paymentRequired.listAction",
    category: "pending",
    tone: "warning",
  },
  [LEGACY_DEAL_STATUS.PAYMENT_CONFIRMING]: {
    label: "deals.stage.paymentConfirming.label",
    description: "deals.stage.paymentConfirming.description",
    ctaLabel: "deals.stage.paymentConfirming.cta",
    listAction: "common.view",
    category: "pending",
    tone: "info",
  },
  [LEGACY_DEAL_STATUS.FUNDS_LOCKED]: {
    label: "deals.stage.fundsLocked.label",
    description: "deals.stage.fundsLocked.description",
    ctaLabel: "deals.stage.fundsLocked.cta",
    listAction: "common.view",
    category: "active",
    tone: "info",
  },
  [LEGACY_DEAL_STATUS.CREATIVE_DRAFTING]: {
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
  [LEGACY_DEAL_STATUS.CREATIVE_APPROVED]: {
    label: "deals.stage.creativeApproved.label",
    description: "deals.stage.creativeApproved.description",
    ctaLabel: "deals.stage.creativeApproved.cta",
    listAction: "common.view",
    category: "active",
    tone: "info",
  },
  [LEGACY_DEAL_STATUS.SCHEDULED]: {
    label: "deals.stage.scheduled.label",
    description: "deals.stage.scheduled.description",
    ctaLabel: "deals.stage.scheduled.cta",
    listAction: "common.view",
    category: "active",
    tone: "info",
  },
  [LEGACY_DEAL_STATUS.VERIFYING]: {
    label: "deals.stage.verifying.label",
    description: "deals.stage.verifying.description",
    ctaLabel: "deals.stage.verifying.cta",
    listAction: "deals.stage.verifying.listAction",
    category: "active",
    tone: "primary",
  },
  [LEGACY_DEAL_STATUS.RELEASED]: {
    label: "deals.stage.released.label",
    description: "deals.stage.released.description",
    ctaLabel: "deals.stage.released.cta",
    listAction: "deals.stage.released.listAction",
    category: "completed",
    tone: "success",
  },
  [LEGACY_DEAL_STATUS.REFUNDED]: {
    label: "deals.stage.refunded.label",
    description: "deals.stage.refunded.description",
    ctaLabel: "deals.stage.refunded.cta",
    listAction: "deals.stage.refunded.listAction",
    category: "completed",
    tone: "danger",
  },
};

export const getDealStage = (deal: Deal): DealStage => {
  if (
    deal.status === LEGACY_DEAL_STATUS.REFUNDED ||
    deal.escrow?.status === LEGACY_ESCROW_STATUS.REFUNDED
  ) {
    return LEGACY_DEAL_STATUS.REFUNDED;
  }
  if (
    deal.status === LEGACY_DEAL_STATUS.RELEASED ||
    deal.escrow?.status === LEGACY_ESCROW_STATUS.RELEASED
  ) {
    return LEGACY_DEAL_STATUS.RELEASED;
  }
  if (
    deal.status === LEGACY_DEAL_STATUS.VERIFYING ||
    deal.status === LEGACY_DEAL_STATUS.POSTED ||
    deal.post?.viewUrl
  ) {
    return LEGACY_DEAL_STATUS.VERIFYING;
  }
  if (deal.status === LEGACY_DEAL_STATUS.SCHEDULED || deal.schedule?.scheduledAt) {
    return LEGACY_DEAL_STATUS.SCHEDULED;
  }
  if (deal.status === LEGACY_DEAL_STATUS.CREATIVE_SUBMITTED && !deal.creative?.approvedAt) {
    return "CREATIVE_REVIEW";
  }
  if (deal.status === LEGACY_DEAL_STATUS.CREATIVE_APPROVED || deal.creative?.approvedAt) {
    return LEGACY_DEAL_STATUS.CREATIVE_APPROVED;
  }
  if (deal.status === LEGACY_DEAL_STATUS.CREATIVE_DRAFTING) {
    return LEGACY_DEAL_STATUS.CREATIVE_DRAFTING;
  }
  if (
    deal.status === LEGACY_DEAL_STATUS.FUNDS_LOCKED ||
    deal.escrow?.status === LEGACY_ESCROW_STATUS.FUNDS_LOCKED
  ) {
    return LEGACY_DEAL_STATUS.FUNDS_LOCKED;
  }
  if (
    deal.status === LEGACY_DEAL_STATUS.PAYMENT_CONFIRMING ||
    deal.escrow?.status === LEGACY_ESCROW_STATUS.PAYMENT_CONFIRMING
  ) {
    return LEGACY_DEAL_STATUS.PAYMENT_CONFIRMING;
  }
  if (
    deal.status === LEGACY_DEAL_STATUS.PAYMENT_REQUIRED ||
    deal.status === LEGACY_DEAL_STATUS.OWNER_ACCEPTED ||
    deal.escrow?.status === LEGACY_ESCROW_STATUS.AWAITING_PAYMENT
  ) {
    return LEGACY_DEAL_STATUS.PAYMENT_REQUIRED;
  }
  return LEGACY_DEAL_STATUS.REQUESTED;
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
  [LEGACY_DEAL_STATUS.REQUESTED]: 0,
  [LEGACY_DEAL_STATUS.PAYMENT_REQUIRED]: 1,
  [LEGACY_DEAL_STATUS.PAYMENT_CONFIRMING]: 1,
  [LEGACY_DEAL_STATUS.FUNDS_LOCKED]: 2,
  [LEGACY_DEAL_STATUS.CREATIVE_DRAFTING]: 2,
  CREATIVE_REVIEW: 2,
  [LEGACY_DEAL_STATUS.CREATIVE_APPROVED]: 3,
  [LEGACY_DEAL_STATUS.SCHEDULED]: 3,
  [LEGACY_DEAL_STATUS.VERIFYING]: 4,
  [LEGACY_DEAL_STATUS.RELEASED]: 5,
  [LEGACY_DEAL_STATUS.REFUNDED]: 5,
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
  if (status === LEGACY_DEAL_STATUS.REFUNDED) {
    return LEGACY_DEAL_STATUS.REFUNDED;
  }
  if (status === LEGACY_DEAL_STATUS.RELEASED) {
    return LEGACY_DEAL_STATUS.RELEASED;
  }
  if (status === LEGACY_DEAL_STATUS.VERIFYING || status === LEGACY_DEAL_STATUS.POSTED) {
    return LEGACY_DEAL_STATUS.VERIFYING;
  }
  if (status === LEGACY_DEAL_STATUS.SCHEDULED) {
    return LEGACY_DEAL_STATUS.SCHEDULED;
  }
  if (status === LEGACY_DEAL_STATUS.CREATIVE_SUBMITTED) {
    return "CREATIVE_REVIEW";
  }
  if (status === LEGACY_DEAL_STATUS.CREATIVE_APPROVED) {
    return LEGACY_DEAL_STATUS.CREATIVE_APPROVED;
  }
  if (status === LEGACY_DEAL_STATUS.CREATIVE_DRAFTING) {
    return LEGACY_DEAL_STATUS.CREATIVE_DRAFTING;
  }
  if (status === LEGACY_DEAL_STATUS.FUNDS_LOCKED) {
    return LEGACY_DEAL_STATUS.FUNDS_LOCKED;
  }
  if (status === LEGACY_DEAL_STATUS.PAYMENT_CONFIRMING) {
    return LEGACY_DEAL_STATUS.PAYMENT_CONFIRMING;
  }
  if (
    status === LEGACY_DEAL_STATUS.PAYMENT_REQUIRED ||
    status === LEGACY_DEAL_STATUS.OWNER_ACCEPTED
  ) {
    return LEGACY_DEAL_STATUS.PAYMENT_REQUIRED;
  }
  return LEGACY_DEAL_STATUS.REQUESTED;
};

export const getStagePresentation = (stage: DealStage) => stagePresentation[stage];

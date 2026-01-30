import type { EscrowStatus } from "@/types/deals";
import type { TranslationKey } from "@/i18n/translations";

export type DealStageId =
  | "SCHEDULE"
  | "SEND_POST"
  | "CONFIRM_POST"
  | "CREATIVE_AWAITING_ADMIN_REVIEW"
  | "PAYMENT_WINDOW"
  | "PAYMENT"
  | "PAYMENT_PENDING"
  | "SCHEDULED"
  | "VERIFYING"
  | "DONE";

const stageOrder: DealStageId[] = [
  "SCHEDULE",
  "SEND_POST",
  "CONFIRM_POST",
  "CREATIVE_AWAITING_ADMIN_REVIEW",
  "PAYMENT_WINDOW",
  "PAYMENT",
  "PAYMENT_PENDING",
  "SCHEDULED",
  "VERIFYING",
  "DONE",
];

export const allStages: DealStageId[] = [...stageOrder];

const escrowToStage: Record<EscrowStatus, DealStageId> = {
  SCHEDULING_PENDING: "SCHEDULE",
  CREATIVE_AWAITING_SUBMIT: "SEND_POST",
  CREATIVE_AWAITING_ADMIN_REVIEW: "CREATIVE_AWAITING_ADMIN_REVIEW",
  PAYMENT_AWAITING: "PAYMENT",
  FUNDS_PENDING: "PAYMENT_PENDING",
  FUNDS_CONFIRMED: "SCHEDULED",
  APPROVED_SCHEDULED: "SCHEDULED",
  POSTED_VERIFYING: "VERIFYING",
  COMPLETED: "DONE",
  CANCELED: "DONE",
  REFUNDED: "DONE",
  DISPUTED: "DONE",
};

export const getCurrentStage = (escrowStatus: EscrowStatus): DealStageId =>
  escrowToStage[escrowStatus] ?? "SCHEDULE";

export const getAvailableStages = (escrowStatus: EscrowStatus): DealStageId[] => {
  const currentStage = getCurrentStage(escrowStatus);
  const currentIndex = stageOrder.indexOf(currentStage);
  if (currentIndex === -1) {
    return ["SCHEDULE"];
  }
  return stageOrder.slice(0, currentIndex + 1);
};

export const stageToLabel = (stage: DealStageId, t: (key: TranslationKey) => string) =>
  t(`deals.timeline.stage.${stage}` as TranslationKey);

export const escrowStatusToLabel = (
  escrowStatus: EscrowStatus,
  t: (key: TranslationKey) => string
) => t(`deals.escrowStatus.${escrowStatus}` as TranslationKey);

export const canNavigateTo = (stage: DealStageId, escrowStatus: EscrowStatus) => {
  const currentStage = getCurrentStage(escrowStatus);
  return stageOrder.indexOf(stage) <= stageOrder.indexOf(currentStage);
};

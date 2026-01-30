import type { EscrowStatus } from "@/types/deals";
import { DEAL_ESCROW_STATUS } from "@/constants/deals";
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
  [DEAL_ESCROW_STATUS.DRAFT]: "SCHEDULE",
  [DEAL_ESCROW_STATUS.CREATIVE_AWAITING_SUBMIT]: "SEND_POST",
  [DEAL_ESCROW_STATUS.CREATIVE_AWAITING_ADMIN_REVIEW]: "CREATIVE_AWAITING_ADMIN_REVIEW",
  [DEAL_ESCROW_STATUS.PAYMENT_AWAITING]: "PAYMENT",
  [DEAL_ESCROW_STATUS.FUNDS_PENDING]: "PAYMENT_PENDING",
  [DEAL_ESCROW_STATUS.FUNDS_CONFIRMED]: "SCHEDULED",
  [DEAL_ESCROW_STATUS.APPROVED_SCHEDULED]: "SCHEDULED",
  [DEAL_ESCROW_STATUS.POSTED_VERIFYING]: "VERIFYING",
  [DEAL_ESCROW_STATUS.COMPLETED]: "DONE",
  [DEAL_ESCROW_STATUS.CANCELED]: "DONE",
  [DEAL_ESCROW_STATUS.REFUNDED]: "DONE",
  [DEAL_ESCROW_STATUS.DISPUTED]: "DONE",
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

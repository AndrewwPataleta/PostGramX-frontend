import type { EscrowStatus } from "@/types/deals";

export type DealStageId =
  | "SCHEDULE"
  | "SEND_POST"
  | "CONFIRM_POST"
  | "ADMIN_APPROVAL"
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
  "ADMIN_APPROVAL",
  "PAYMENT_WINDOW",
  "PAYMENT",
  "PAYMENT_PENDING",
  "SCHEDULED",
  "VERIFYING",
  "DONE",
];

const escrowToStage: Record<EscrowStatus, DealStageId> = {
  SCHEDULING_PENDING: "SCHEDULE",
  CREATIVE_AWAITING_SUBMIT: "SEND_POST",
  CREATIVE_AWAITING_CONFIRM: "CONFIRM_POST",
  ADMIN_REVIEW: "ADMIN_APPROVAL",
  PAYMENT_WINDOW_PENDING: "PAYMENT_WINDOW",
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

const stageLabels: Record<DealStageId, string> = {
  SCHEDULE: "Schedule time",
  SEND_POST: "Send post",
  CONFIRM_POST: "Confirm post",
  ADMIN_APPROVAL: "Admin approval",
  PAYMENT_WINDOW: "Payment window",
  PAYMENT: "Payment",
  PAYMENT_PENDING: "Payment pending",
  SCHEDULED: "Scheduled",
  VERIFYING: "Verifying",
  DONE: "Done",
};

const escrowLabels: Record<EscrowStatus, string> = {
  SCHEDULING_PENDING: "Scheduling pending",
  CREATIVE_AWAITING_SUBMIT: "Creative awaiting submit",
  CREATIVE_AWAITING_CONFIRM: "Creative awaiting confirm",
  ADMIN_REVIEW: "Admin review",
  PAYMENT_WINDOW_PENDING: "Payment window pending",
  PAYMENT_AWAITING: "Payment awaiting",
  FUNDS_PENDING: "Funds pending",
  FUNDS_CONFIRMED: "Funds confirmed",
  APPROVED_SCHEDULED: "Approved & scheduled",
  POSTED_VERIFYING: "Posted verifying",
  COMPLETED: "Completed",
  CANCELED: "Canceled",
  REFUNDED: "Refunded",
  DISPUTED: "Disputed",
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

export const stageToLabel = (stage: DealStageId) => stageLabels[stage] ?? stage;

export const escrowStatusToLabel = (escrowStatus: EscrowStatus) =>
  escrowLabels[escrowStatus] ?? escrowStatus.replace(/_/g, " ");

export const canNavigateTo = (stage: DealStageId, escrowStatus: EscrowStatus) => {
  const currentStage = getCurrentStage(escrowStatus);
  return stageOrder.indexOf(stage) <= stageOrder.indexOf(currentStage);
};

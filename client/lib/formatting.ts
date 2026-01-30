const ACRONYMS = new Set(["API", "ID", "TON", "USD"]);

export const formatUiLabel = (text: string) => {
  const normalized = text
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized) {
    return "";
  }

  return normalized
    .split(" ")
    .map((word) => {
      const upper = word.toUpperCase();
      if (ACRONYMS.has(upper)) {
        return upper;
      }
      const lower = word.toLowerCase();
      return `${lower.charAt(0).toUpperCase()}${lower.slice(1)}`;
    })
    .join(" ");
};

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Active",
  ADMIN_REVIEW: "Admin review",
  APPROVED_SCHEDULED: "Scheduled",
  AWAITING_ADMIN_APPROVAL: "Awaiting admin approval",
  AWAITING_CONFIRMATION: "Awaiting confirmation",
  AWAITING_CREATIVE: "Awaiting creative",
  AWAITING_PAYMENT: "Awaiting payment",
  CANCELED: "Canceled",
  CANCELLED: "Canceled",
  COMPLETED: "Completed",
  CREATIVE_AWAITING_ADMIN_REVIEW: "Awaiting admin review",
  CREATIVE_AWAITING_CONFIRM: "Awaiting confirmation",
  CREATIVE_AWAITING_SUBMIT: "Awaiting creative",
  CREATIVE_APPROVED: "Creative approved",
  CREATIVE_DRAFTING: "Creative drafting",
  CREATIVE_REVIEW: "Creative review",
  CREATIVE_SUBMITTED: "Creative submitted",
  DISPUTED: "Disputed",
  EXPIRED: "Expired",
  FUNDS_CONFIRMED: "Funds confirmed",
  FUNDS_LOCKED: "Funds locked",
  FUNDS_PENDING: "Funds pending",
  PAYMENT_AWAITING: "Awaiting payment",
  PAYMENT_CONFIRMING: "Payment confirming",
  PAYMENT_REQUIRED: "Payment required",
  PAYMENT_WINDOW_PENDING: "Payment window",
  PENDING: "Pending",
  POSTED: "Posted",
  POSTED_VERIFYING: "Post verifying",
  READY_FOR_PAYMENT: "Ready for payment",
  REFUNDED: "Refunded",
  REJECTED: "Rejected",
  RELEASED: "Released",
  REQUESTED: "Requested",
  SCHEDULED: "Scheduled",
  SCHEDULING_PENDING: "Scheduling pending",
  VERIFYING: "Verifying",
};

export const formatStatusLabel = (status?: string) => {
  if (!status) {
    return "";
  }
  return STATUS_LABELS[status] ?? formatUiLabel(status);
};

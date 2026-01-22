export const statusStyles = {
  awaitingApproval: "bg-amber-400/15 text-amber-200 border-amber-400/40",
  paymentRequired: "bg-orange-400/15 text-orange-200 border-orange-400/40",
  confirming: "bg-yellow-400/15 text-yellow-100 border-yellow-400/40",
  fundsLocked: "bg-blue-500/15 text-blue-200 border-blue-400/40",
  creativeReview: "bg-purple-500/15 text-purple-200 border-purple-400/40",
  scheduled: "bg-cyan-500/15 text-cyan-200 border-cyan-400/40",
  verifying: "bg-teal-500/15 text-teal-200 border-teal-400/40",
  completed: "bg-emerald-500/15 text-emerald-200 border-emerald-400/40",
  refunded: "bg-red-500/15 text-red-200 border-red-400/40",
};

export type StatusKey = keyof typeof statusStyles;

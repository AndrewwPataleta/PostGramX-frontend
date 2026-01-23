import type { Deal } from "./types";
import type { StatusKey } from "@/components/deals/statusStyles";
import type { TimelineItem } from "@/components/deals/Timeline";

export const getUpdatedLabel = (updatedAt: string) => {
  const diffMs = Date.now() - new Date(updatedAt).getTime();
  const minutes = Math.max(1, Math.round(diffMs / 60000));
  return `Updated ${minutes}m ago`;
};

export const formatScheduleDate = (value?: string | null) => {
  if (!value) {
    return "Scheduling pending";
  }
  const date = new Date(value);
  return `${date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })}, ${date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};

export const getMinutesRemaining = (value?: string) => {
  if (!value) {
    return null;
  }
  const diffMs = new Date(value).getTime() - Date.now();
  const minutes = Math.max(1, Math.round(diffMs / 60000));
  return minutes;
};

export const getDealStatusPresentation = (deal: Deal) => {
  if (deal.status === "COMPLETED") {
    return {
      label: "Completed",
      statusKey: "completed" as StatusKey,
      icon: "✅",
      action: "Receipt",
      secondary: "Receipt available",
      delivery: "Post verified",
      description: "Escrow was released after the post was verified.",
      primaryAction: "Download receipt",
      secondaryAction: "Message via Bot",
    };
  }

  if (deal.status === "CANCELLED") {
    return {
      label: "Refunded",
      statusKey: "refunded" as StatusKey,
      icon: "↩️",
      action: "Details",
      secondary: "Refund sent",
      delivery: "Refunded",
      description: "Escrow was returned after the deal was cancelled.",
      primaryAction: "Contact support",
      secondaryAction: "View details",
    };
  }

  if (deal.status === "AWAITING_OWNER_ACCEPT") {
    return {
      label: "Awaiting Channel Approval",
      statusKey: "awaitingApproval" as StatusKey,
      icon: "⏳",
      action: "Open",
      secondary: "Awaiting approval",
      delivery: "Channel reviewing",
      description: "Channel owner is reviewing the request.",
      primaryAction: "Open chat",
      secondaryAction: "Cancel request",
    };
  }

  if (deal.escrow?.status === "AWAITING_PAYMENT") {
    return {
      label: "Payment Required",
      statusKey: "paymentRequired" as StatusKey,
      icon: "💳",
      action: "Pay Now",
      secondary: "Awaiting payment",
      delivery: "Awaiting payment",
      description: "Secure escrow locks funds once payment is confirmed.",
      primaryAction: "Pay now",
      secondaryAction: "Message via Bot",
    };
  }

  if (deal.escrow?.status === "HELD" && !deal.creative?.submittedAt) {
    return {
      label: "Funds Locked",
      statusKey: "fundsLocked" as StatusKey,
      icon: "🔒",
      action: "Request Draft",
      secondary: "Creative drafting",
      delivery: "Creative in progress",
      description: "Funds are locked while creative assets are drafted.",
      primaryAction: "Request draft",
      secondaryAction: "Open chat",
    };
  }

  if (deal.escrow?.status === "HELD" && deal.creative?.submittedAt && !deal.creative?.approvedAt) {
    return {
      label: "Creative Review",
      statusKey: "creativeReview" as StatusKey,
      icon: "✏️",
      action: "Review",
      secondary: "Creative submitted",
      delivery: "Awaiting review",
      description: "Review the submitted creative before scheduling.",
      primaryAction: "Approve creative",
      secondaryAction: "Request edits",
    };
  }

  if (deal.escrow?.status === "HELD" && deal.creative?.approvedAt && deal.schedule?.scheduledAt) {
    return {
      label: "Scheduled",
      statusKey: "scheduled" as StatusKey,
      icon: "📅",
      action: "View Schedule",
      secondary: `Posting: ${formatScheduleDate(deal.schedule.scheduledAt)}`,
      delivery: "Scheduled",
      description: "Post is scheduled and ready for delivery.",
      primaryAction: "View schedule",
      secondaryAction: "Message via Bot",
    };
  }

  if (deal.escrow?.status === "HELD" && deal.post?.messageId) {
    const minutesRemaining = getMinutesRemaining(deal.post?.verifyUntil);
    return {
      label: "Post Live — Verifying",
      statusKey: "verifying" as StatusKey,
      icon: "👁️",
      action: "View Post",
      secondary: minutesRemaining ? `Release in: ${minutesRemaining}m` : "Verifying post",
      delivery: "Verifying",
      description: "Post is live while verification checks engagement and integrity.",
      primaryAction: "View post",
      secondaryAction: "Message via Bot",
    };
  }

  return {
    label: "In Progress",
    statusKey: "confirming" as StatusKey,
    icon: "⏳",
    action: "View",
    secondary: "Processing",
    delivery: "Processing",
    description: "This deal is currently processing.",
    primaryAction: "View",
    secondaryAction: "Message via Bot",
  };
};

export const getDealCategory = (deal: Deal) => {
  if (deal.status === "COMPLETED" || deal.status === "CANCELLED") {
    return "completed";
  }

  if (deal.status === "AWAITING_OWNER_ACCEPT" || deal.escrow?.status === "AWAITING_PAYMENT") {
    return "pending";
  }

  return "active";
};

export const getTimelineItems = (deal: Deal): TimelineItem[] => {
  const steps = ["Accepted", "Payment", "Creative", "Scheduled", "Posted", "Released", "Completed"];

  const currentStep = (() => {
    if (deal.status === "CANCELLED") {
      return "Released";
    }
    if (deal.status === "COMPLETED") {
      return "Completed";
    }
    if (deal.status === "AWAITING_OWNER_ACCEPT") {
      return "Accepted";
    }
    if (deal.escrow?.status === "AWAITING_PAYMENT") {
      return "Payment";
    }
    if (deal.escrow?.status === "HELD" && !deal.creative?.submittedAt) {
      return "Creative";
    }
    if (deal.escrow?.status === "HELD" && deal.creative?.submittedAt && !deal.creative?.approvedAt) {
      return "Creative";
    }
    if (deal.escrow?.status === "HELD" && deal.creative?.approvedAt && deal.schedule?.scheduledAt) {
      return "Scheduled";
    }
    if (deal.escrow?.status === "HELD" && deal.post?.messageId) {
      return "Posted";
    }
    return "Payment";
  })();

  const currentIndex = steps.indexOf(currentStep);

  return steps.map((label, index) => {
    if (index < currentIndex) {
      return { label, state: "completed" };
    }
    if (index === currentIndex) {
      return { label, state: "current" };
    }
    return { label, state: "upcoming" };
  });
};

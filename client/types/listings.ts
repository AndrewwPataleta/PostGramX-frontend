export type ListingListItem = {
  id: string;
  priceNano: string;
  currency: "TON";
  format: "POST";
  tags: string[];
  pinDurationHours: number | null;
  visibilityDurationHours: number;
  allowEdits: boolean;
  allowLinkTracking: boolean;
  allowPinnedPlacement: boolean;
  requiresApproval: boolean;
  isActive: boolean;
};

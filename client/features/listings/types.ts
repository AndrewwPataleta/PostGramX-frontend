export type ListingFormat = "POST";

export interface Listing {
  id: string;
  channelId: string;
  format: ListingFormat;
  priceTon: number;
  availabilityFrom: string;
  availabilityTo: string;
  pinDurationHours: number | null;
  visibilityDurationHours: number;
  allowEdits: boolean;
  requiresApproval: boolean;
  contentRulesText: string;
  tags: string[];
  isActive: boolean;
  allowLinkTracking: boolean;
  allowPinnedPlacement: boolean;
}

export interface ListingInput {
  channelId: string;
  format: ListingFormat;
  priceTon: number;
  availabilityFrom: string;
  availabilityTo: string;
  pinDurationHours: number | null;
  visibilityDurationHours: number;
  allowEdits: boolean;
  requiresApproval: boolean;
  contentRulesText: string;
  tags: string[];
  isActive: boolean;
  allowLinkTracking: boolean;
  allowPinnedPlacement: boolean;
}

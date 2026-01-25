export type ListingFormat = "POST";

export interface Listing {
  id: string;
  channelId: string;
  format: ListingFormat;
  priceTon: number;
  availabilityFrom: string;
  availabilityTo: string;
  allowEdits: boolean;
  requiresApproval: boolean;
  rulesText: string;
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
  allowEdits: boolean;
  requiresApproval: boolean;
  rulesText: string;
  isActive: boolean;
  allowLinkTracking: boolean;
  allowPinnedPlacement: boolean;
}

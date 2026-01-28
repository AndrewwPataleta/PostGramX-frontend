import type { Listing, ListingInput } from "./types";

const STORAGE_KEY = "flowgramx_mock_listings";
const UPDATE_EVENT = "flowgramx:mock-listings-updated";

export const isMockListingsEnabled = import.meta.env.VITE_USE_MOCK_LISTINGS === "true";

const createDefaultListings = (): Listing[] => {
  const today = new Date();
  const toDate = new Date();
  toDate.setDate(today.getDate() + 7);
  const extendedTo = new Date();
  extendedTo.setDate(today.getDate() + 14);
  const inactiveFrom = new Date();
  inactiveFrom.setDate(today.getDate() - 3);
  const inactiveTo = new Date();
  inactiveTo.setDate(today.getDate() + 4);

  return [
    {
      id: "listing-1",
      channelId: "1",
      format: "POST",
      priceTon: 2.5,
      availabilityFrom: today.toISOString(),
      availabilityTo: toDate.toISOString(),
      pinDurationHours: null,
      visibilityDurationHours: 48,
      allowEdits: true,
      requiresApproval: true,
      contentRulesText: "No gambling links. English only.",
      tags: ["Casino", "Betting", "Crypto tokens / ICO", "English only"],
      isActive: true,
      allowLinkTracking: true,
      allowPinnedPlacement: false,
    },
    {
      id: "listing-2",
      channelId: "1",
      format: "POST",
      priceTon: 4,
      availabilityFrom: today.toISOString(),
      availabilityTo: extendedTo.toISOString(),
      pinDurationHours: 24,
      visibilityDurationHours: 72,
      allowEdits: false,
      requiresApproval: true,
      contentRulesText: "Promo codes allowed. NSFW not allowed.",
      tags: ["Promo codes allowed", "NSFW not allowed", "Must be pre-approved"],
      isActive: true,
      allowLinkTracking: true,
      allowPinnedPlacement: true,
    },
    {
      id: "listing-3",
      channelId: "1",
      format: "POST",
      priceTon: 3,
      availabilityFrom: inactiveFrom.toISOString(),
      availabilityTo: inactiveTo.toISOString(),
      pinDurationHours: null,
      visibilityDurationHours: 24,
      allowEdits: true,
      requiresApproval: true,
      contentRulesText: "Crypto tokens only with approval.",
      tags: ["Crypto tokens / ICO", "Financial advice", "Must be pre-approved"],
      isActive: false,
      allowLinkTracking: true,
      allowPinnedPlacement: false,
    },
    {
      id: "listing-4",
      channelId: "ch-flow-2",
      format: "POST",
      priceTon: 3.5,
      availabilityFrom: today.toISOString(),
      availabilityTo: extendedTo.toISOString(),
      pinDurationHours: 12,
      visibilityDurationHours: 48,
      allowEdits: true,
      requiresApproval: true,
      contentRulesText: "Crypto launches only. Links allowed.",
      tags: ["Crypto tokens / ICO", "Links allowed", "Must be pre-approved"],
      isActive: true,
      allowLinkTracking: true,
      allowPinnedPlacement: true,
    },
    {
      id: "listing-5",
      channelId: "ch-flow-4",
      format: "POST",
      priceTon: 5.1,
      availabilityFrom: today.toISOString(),
      availabilityTo: toDate.toISOString(),
      pinDurationHours: null,
      visibilityDurationHours: 168,
      allowEdits: false,
      requiresApproval: true,
      contentRulesText: "No financial advice. Promo codes allowed.",
      tags: ["Financial advice", "Promo codes allowed", "No edits after posting"],
      isActive: true,
      allowLinkTracking: true,
      allowPinnedPlacement: false,
    },
    {
      id: "listing-6",
      channelId: "ch-flow-6",
      format: "POST",
      priceTon: 3.8,
      availabilityFrom: today.toISOString(),
      availabilityTo: toDate.toISOString(),
      pinDurationHours: 6,
      visibilityDurationHours: 48,
      allowEdits: true,
      requiresApproval: true,
      contentRulesText: "Russian language placements only.",
      tags: ["Russian allowed", "Must be pre-approved", "No edits after posting"],
      isActive: true,
      allowLinkTracking: true,
      allowPinnedPlacement: true,
    },
  ];
};

const readListings = (): Listing[] => {
  if (!isMockListingsEnabled || typeof window === "undefined") {
    return [];
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const defaults = createDefaultListings();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    return defaults;
  }

  try {
    const parsed = JSON.parse(stored) as Listing[];
    if (!Array.isArray(parsed)) {
      throw new Error("Invalid listings data");
    }
    return parsed;
  } catch (error) {
    console.warn("Failed to parse mock listings. Resetting store.", error);
    const defaults = createDefaultListings();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    return defaults;
  }
};

const writeListings = (listings: Listing[]) => {
  if (!isMockListingsEnabled || typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
  window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
};

export const subscribeToMockListings = (callback: () => void) => {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handler = () => callback();
  window.addEventListener(UPDATE_EVENT, handler);
  window.addEventListener("storage", handler);

  return () => {
    window.removeEventListener(UPDATE_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
};

export const getListings = (): Listing[] => readListings();

export const listingsByChannel = (channelId: string): Listing[] => {
  return readListings().filter((listing) => listing.channelId === channelId);
};

export const getActiveListingForChannel = (channelId: string): Listing | undefined => {
  return readListings().find((listing) => listing.channelId === channelId && listing.isActive);
};

export const getListingById = (id: string): Listing | undefined => {
  return readListings().find((listing) => listing.id === id);
};

export const createListing = (input: ListingInput): Listing => {
  const listing: Listing = {
    ...input,
    id: `listing-${Date.now()}`,
  };
  const listings = [listing, ...readListings()];
  writeListings(listings);
  return listing;
};

export const updateListing = (id: string, updates: Partial<ListingInput>): Listing | null => {
  const listings = readListings();
  let updated: Listing | null = null;
  const next = listings.map((listing) => {
    if (listing.id !== id) {
      return listing;
    }
    updated = { ...listing, ...updates };
    return updated;
  });

  if (updated) {
    writeListings(next);
  }

  return updated;
};

export const disableListing = (id: string): Listing | null => {
  return updateListing(id, { isActive: false });
};

export const enableListing = (id: string): Listing | null => {
  return updateListing(id, { isActive: true });
};

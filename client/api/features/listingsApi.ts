import { post } from "@/api/core/apiClient";
import type { ListingInput } from "@/features/listings/types";
import type { Paginated } from "@/types/channels";
import type { ListingListItem, ListingsByChannelParams } from "@/types/listings";

export const createListing = async (payload: ListingInput): Promise<void> =>
  post<void, ListingInput>("/listings/create", { data: payload });

export const listingsByChannel = async (
  params: ListingsByChannelParams
): Promise<Paginated<ListingListItem>> =>
  post<Paginated<ListingListItem>, ListingsByChannelParams>(
    "/listings/by-channel",
    { data: params }
  );

export const listingsApi = {
  createListing,
  listingsByChannel,
};

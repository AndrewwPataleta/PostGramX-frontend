import { post } from "@/api/core/apiClient";
import type { ListingInput } from "@/features/listings/types";
import type {
  ListingsByChannelParams,
  ListingsByChannelResponse,
} from "@/types/listings";

export const createListing = async (payload: ListingInput): Promise<void> =>
  post<void, ListingInput>("/listings/create", payload);

export const postListingsByChannel = async (
  params: ListingsByChannelParams
): Promise<ListingsByChannelResponse> =>
  post<ListingsByChannelResponse, ListingsByChannelParams>(
    "/listings/by-channel",
    params
  );

export const listingsApi = {
  createListing,
  postListingsByChannel,
};

import { post } from "@/api/core/apiClient";
import type { ListingInput } from "@/features/listings/types";

export const createListing = async (payload: ListingInput): Promise<void> =>
  post<void, ListingInput>("/listings/create", payload);

export const listingsApi = {
  createListing,
};

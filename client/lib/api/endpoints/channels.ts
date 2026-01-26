import { apiClient } from "@/lib/api/client";
import {
  getTelegramAuthContext,
  withTelegramEnvelope,
} from "@/lib/api/envelope";
import type { ChannelsListParams, ChannelsListResponse } from "@/types/channels";

export const postChannelsList = async (
  params: ChannelsListParams
): Promise<ChannelsListResponse> => {
  const auth = getTelegramAuthContext();
  const response = await apiClient.post<ChannelsListResponse>(
    "/channels/list",
    withTelegramEnvelope(params, auth)
  );

  return response.data;
};

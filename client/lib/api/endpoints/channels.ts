import { apiClient } from "@/lib/api/client";
import {
  getTelegramAuthContext,
  withTelegramEnvelope,
} from "@/lib/api/envelope";
import type {
  ChannelsListParams,
  ChannelsListResponse,
  LinkChannelResponse,
  PreviewChannelResponse,
  UnlinkChannelResponse,
  VerifyChannelResponse,
} from "@/types/channels";

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

export const previewChannel = async (params: {
  usernameOrLink: string;
}): Promise<PreviewChannelResponse> => {
  const auth = getTelegramAuthContext();
  const response = await apiClient.post<PreviewChannelResponse>(
    "/channels/preview",
    withTelegramEnvelope(params, auth)
  );

  return response.data;
};

export const linkChannel = async (params: {
  username: string;
}): Promise<LinkChannelResponse> => {
  const auth = getTelegramAuthContext();
  const response = await apiClient.post<LinkChannelResponse>(
    "/channels/link",
    withTelegramEnvelope(params, auth)
  );

  return response.data;
};

export const verifyChannel = async (params: {
  id: string;
}): Promise<VerifyChannelResponse> => {
  const auth = getTelegramAuthContext();
  const response = await apiClient.post<VerifyChannelResponse>(
    "/channels/verify",
    withTelegramEnvelope(params, auth)
  );

  return response.data;
};

export const unlinkChannel = async (params: {
  channelId: string;
}): Promise<UnlinkChannelResponse> => {
  const auth = getTelegramAuthContext();
  const response = await apiClient.post<UnlinkChannelResponse>(
    "/channels/unlink",
    withTelegramEnvelope({ channelId: params.channelId }, auth)
  );

  return response.data;
};

export const updateChannelDisabledStatus = async (params: {
  id: string;
  disabled: boolean;
}): Promise<void> => {
  const auth = getTelegramAuthContext();
  await apiClient.post<void>(
    `/channels/${params.id}/disabled`,
    withTelegramEnvelope({ disabled: params.disabled }, auth)
  );
};

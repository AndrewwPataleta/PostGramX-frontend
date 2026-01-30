import { post } from "@/api/core/apiClient";
import type {
  ChannelsListParams,
  ChannelsListResponse,
  ChannelItem,
  ListChannelsParams,
  Paginated,
  LinkChannelResponse,
  PreviewChannelResponse,
  UnlinkChannelResponse,
  VerifyChannelResponse,
} from "@/types/channels";

export const postChannelsList = async (
  params: ChannelsListParams
): Promise<ChannelsListResponse> =>
  post<ChannelsListResponse, ChannelsListParams>("/channels/list", { data: params });

export const listChannels = async (
  params: ListChannelsParams
): Promise<Paginated<ChannelItem>> =>
  post<Paginated<ChannelItem>, ListChannelsParams>("/channels/list", { data: params });

export const previewChannel = async (params: {
  usernameOrLink: string;
}): Promise<PreviewChannelResponse> =>
  post<PreviewChannelResponse, { usernameOrLink: string }>(
    "/channels/preview",
    { data: params }
  );

export const linkChannel = async (params: {
  username: string;
}): Promise<LinkChannelResponse> =>
  post<LinkChannelResponse, { username: string }>("/channels/link", { data: params });

export const verifyChannel = async (params: {
  id: string;
}): Promise<VerifyChannelResponse> =>
  post<VerifyChannelResponse, { id: string }>("/channels/verify", { data: params });

export const unlinkChannel = async (params: {
  channelId: string;
}): Promise<UnlinkChannelResponse> =>
  post<UnlinkChannelResponse, { channelId: string }>(
    "/channels/unlink",
    { data: params }
  );

export const updateChannelDisabledStatus = async (params: {
  id: string;
  disabled: boolean;
}): Promise<void> => {
  await post<void, { disabled: boolean }>(`/channels/${params.id}/disabled`, {
    data: { disabled: params.disabled },
  });
};

export const channelsApi = {
  postChannelsList,
  listChannels,
  previewChannel,
  linkChannel,
  verifyChannel,
  unlinkChannel,
  updateChannelDisabledStatus,
};

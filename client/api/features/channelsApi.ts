import { post } from "@/api/core/apiClient";
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
): Promise<ChannelsListResponse> =>
  post<ChannelsListResponse, ChannelsListParams>("/channels/list", params);

export const previewChannel = async (params: {
  usernameOrLink: string;
}): Promise<PreviewChannelResponse> =>
  post<PreviewChannelResponse, { usernameOrLink: string }>(
    "/channels/preview",
    params
  );

export const linkChannel = async (params: {
  username: string;
}): Promise<LinkChannelResponse> =>
  post<LinkChannelResponse, { username: string }>("/channels/link", params);

export const verifyChannel = async (params: {
  id: string;
}): Promise<VerifyChannelResponse> =>
  post<VerifyChannelResponse, { id: string }>("/channels/verify", params);

export const unlinkChannel = async (params: {
  channelId: string;
}): Promise<UnlinkChannelResponse> =>
  post<UnlinkChannelResponse, { channelId: string }>(
    "/channels/unlink",
    params
  );

export const updateChannelDisabledStatus = async (params: {
  id: string;
  disabled: boolean;
}): Promise<void> => {
  await post<void, { disabled: boolean }>(`/channels/${params.id}/disabled`, {
    disabled: params.disabled,
  });
};

export const channelsApi = {
  postChannelsList,
  previewChannel,
  linkChannel,
  verifyChannel,
  unlinkChannel,
  updateChannelDisabledStatus,
};

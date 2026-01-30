import { post } from "@/api/core/apiClient";
import type {
  ListChannelPayoutsResponse,
  WithdrawResponse,
} from "@/api/types/payouts";

export const listChannelPayouts = async (
  params: { q?: string } = {}
): Promise<ListChannelPayoutsResponse> => {
  return post<ListChannelPayoutsResponse, { q?: string }>(
    "/payments/payouts/channels",
    params
  );
};

export const withdrawFromChannel = async (params: {
  channelId: string;
  amountNano: string;
  destinationAddress?: string;
}): Promise<WithdrawResponse> => {
  return post<WithdrawResponse, typeof params>("/payments/payouts/withdraw", params);
};

export const paymentsPayoutsApi = {
  listChannelPayouts,
  withdrawFromChannel,
};

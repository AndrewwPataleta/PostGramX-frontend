export type ChannelPayoutItem = {
  channel: {
    id: string;
    name: string;
    username?: string | null;
    avatarUrl?: string | null;
  };
  availableNano: string;
  currency: "TON";
};

export type ListChannelPayoutsResponse = {
  items: ChannelPayoutItem[];
  totals?: { availableNano: string };
};

export type WithdrawResponse = {
  id: string;
  status: string;
  amountNano: string;
  currency: "TON";
  channelId: string;
};

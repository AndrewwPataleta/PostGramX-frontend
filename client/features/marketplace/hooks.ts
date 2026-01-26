import { useQuery } from "@tanstack/react-query";
import { getChannel, getChannels } from "./api";

const marketplaceKeys = {
  all: ["marketplace"] as const,
  channels: () => ["marketplace", "channels"] as const,
  channel: (id: string) => ["marketplace", "channels", id] as const,
};

export const useMarketplaceChannels = () =>
  useQuery({
    queryKey: marketplaceKeys.channels(),
    queryFn: getChannels,
  });

export const useMarketplaceChannel = (id?: string) =>
  useQuery({
    queryKey: id ? marketplaceKeys.channel(id) : marketplaceKeys.channel("unknown"),
    queryFn: () => {
      if (!id) {
        throw new Error("Missing channel ID");
      }
      return getChannel(id);
    },
    enabled: Boolean(id),
  });

export const marketplaceQueryKeys = marketplaceKeys;

import { useQuery } from "@tanstack/react-query";
import { getMyChannels } from "./api";

const channelsKeys = {
  all: ["channels"] as const,
  list: () => ["channels", "list"] as const,
};

export const useMyChannels = () =>
  useQuery({
    queryKey: channelsKeys.list(),
    queryFn: getMyChannels,
  });

export const channelsQueryKeys = channelsKeys;

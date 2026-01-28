export interface ManagedChannel {
  id: string;
  name: string;
  username: string;
  avatar: string;
  status: "PENDING_VERIFY" | "VERIFIED" | "FAILED" | "REVOKED" | "DRAFT";
  verified: boolean;
  subscribers: number;
  activeDeals: number;
  description?: string | null;
}

export const managedChannelData: Record<string, ManagedChannel> = {
  "1": {
    id: "1",
    name: "My Crypto Channel",
    username: "@mycryptocha",
    avatar: "📰",
    status: "VERIFIED",
    verified: true,
    subscribers: 45000,
    activeDeals: 1,
    description: "Verified creator channel ready for sponsor placements.",
  },
};

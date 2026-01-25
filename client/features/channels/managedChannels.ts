export interface ManagedChannel {
  id: string;
  name: string;
  username: string;
  avatar: string;
  verified: boolean;
  subscribers: number;
  averageViews: number;
  engagement: number;
  postsPerWeek: number;
  earnings: number;
  activeDeals: number;
  lastVerified: string;
  viewsTrend: number[];
}

export const managedChannelData: Record<string, ManagedChannel> = {
  "1": {
    id: "1",
    name: "My Crypto Channel",
    username: "@mycryptocha",
    avatar: "📰",
    verified: true,
    subscribers: 45000,
    averageViews: 18000,
    engagement: 40,
    postsPerWeek: 3.5,
    earnings: 230,
    activeDeals: 1,
    lastVerified: "2h",
    viewsTrend: [17000, 17800, 18200, 18500, 18100, 18900, 18500, 18200, 18800, 18000],
  },
};

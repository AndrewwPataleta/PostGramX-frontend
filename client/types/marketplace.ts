export interface ChannelCard {
  id: string;
  name: string;
  username: string;
  avatar: string;
  verified: boolean;
  subscribers: number;
  averageViews: number;
  engagement: number;
  pricePerPost: number;
  language: string;
  category: string;
  viewsTrend: number[];
  lastUpdated: string;
}

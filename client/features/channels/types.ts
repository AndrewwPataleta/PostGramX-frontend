export type ChannelVerificationStatus = "verified" | "pending" | "failed";

export interface Channel {
  id: string;
  name: string;
  username: string;
  avatar: string;
  verified: boolean;
  verificationStatus: ChannelVerificationStatus;
  subscribers: number;
  averageViews: number;
  engagement: number;
  activeListings: number;
  earnings: number;
  lastUpdated: string;
  viewsTrend: number[];
}

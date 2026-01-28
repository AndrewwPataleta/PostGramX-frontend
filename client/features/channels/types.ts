export type ChannelVerificationStatus = "verified" | "pending" | "failed";

export interface Channel {
  id: string;
  name: string;
  username: string;
  avatar: string;
  verified: boolean;
  verificationStatus: ChannelVerificationStatus;
  subscribers: number;
  activeListings: number;
}

export type PlatformType = "telegram";
export type AuthType = "telegram";

export interface CreateUserRequest {
  id: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  lang?: string;
  isPremium?: boolean;
}

export interface AuthRequest {
  platformType: PlatformType;
  authType: AuthType;
  token: string;
  data?: CreateUserRequest;
}

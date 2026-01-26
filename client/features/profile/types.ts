export interface WalletTransaction {
  type: string;
  amount: string;
  status: string;
  time: string;
}

export interface WalletBalance {
  available: number;
  locked: number;
  pendingRelease: number;
  instantWithdraw: number;
}

export interface ProfileOverview {
  balance: WalletBalance;
  transactions: WalletTransaction[];
  topUpAddress: string;
  topUpMemo: string;
}

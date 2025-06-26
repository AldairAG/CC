export type CryptoType = 'BTC' | 'ETH' | 'SOL';

export interface CryptoWallet {
  id: string;
  type: CryptoType;
  address: string;
  balance: number;
  isActive: boolean;
}

export interface CryptoTransaction {
  id: string;
  userId: string;
  type: 'DEPOSIT' | 'WITHDRAWAL';
  cryptoType: CryptoType;
  amount: number;
  usdAmount: number;
  fromAddress: string;
  toAddress: string;
  txHash: string;
  status: 'PENDING' | 'CONFIRMED' | 'FAILED' | 'PROCESSING';
  confirmations: number;
  requiredConfirmations: number;
  fee: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface CryptoDepositRequest {
  cryptoType: CryptoType;
  amount: number;
  userWalletAddress: string;
}

export interface CryptoWithdrawalRequest {
  cryptoType: CryptoType;
  amount: number;
  destinationAddress: string;
  twoFactorCode?: string;
}

export interface CryptoExchangeRate {
  currency: CryptoType;
  usdPrice: number;
  changePercent24h: number;
  lastUpdated: string;
}

export interface CryptoNetwork {
  type: CryptoType;
  name: string;
  symbol: string;
  decimals: number;
  confirmationsRequired: number;
  minDeposit: number;
  maxDeposit: number;
  withdrawalFee: number;
  isActive: boolean;
  rpcUrl: string;
  explorerUrl: string;
}

export interface CryptoBalance {
  cryptoType: CryptoType;
  balance: number;
  usdValue: number;
  pendingDeposits: number;
  pendingWithdrawals: number;
}

export interface CryptoDepositAddress {
  cryptoType: CryptoType;
  address: string;
  qrCode: string;
  expiresAt?: string;
}

export interface CryptoTransactionFee {
  network: CryptoType;
  slow: number;
  standard: number;
  fast: number;
}

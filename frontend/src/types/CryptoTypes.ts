export interface CryptoBalance {
  cryptoType: string;
  balance: number;
  usdValue: number;
  pendingDeposits: number;
  pendingWithdrawals: number;
}

export interface ExchangeRate {
  currency: string;
  usdPrice: number;
  timestamp: Date;
}

export interface CryptoToFiatConversionRequest {
  cryptoType: string;
  amount: number;
  notes?: string;
}

export interface CryptoToFiatConversionResponse {
  transactionId: number;
  cryptoType: string;
  cryptoAmount: number;
  usdValue: number;
  fiatAmountAdded: number;
  exchangeRate: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  message?: string;
}

export interface CryptoTransaction {
  id: number;
  userId: number;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'CONVERSION_TO_FIAT' | 'CONVERSION_FROM_FIAT' | 'MANUAL_DEPOSIT_REQUEST' | 'MANUAL_WITHDRAWAL_REQUEST';
  cryptoType: string;
  amount: number;
  usdAmount: number;
  fromAddress?: string;
  toAddress?: string;
  txHash?: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'PENDING_ADMIN_APPROVAL' | 'APPROVED' | 'REJECTED';
  confirmations?: number;
  requiredConfirmations?: number;
  fee?: number;
  notes?: string;
  createdAt: Date;
  usuarioNombre:string;
  completedAt?: Date;
}

export interface CryptoDepositRequest {
  cryptoType: 'BTC' | 'ETH' | 'SOL' | 'TRC20';
  amount: number;
  userWalletAddress: string;
  txHash?: string;
  notes?: string;
}

export interface CryptoManualDepositRequest {
  cryptoType: 'BTC' | 'ETH' | 'SOL' | 'TRC20';
  amount: number;
  fromAddress: string;
  txHash?: string;
  notes?: string;
}

export interface CryptoWithdrawalRequest {
  toAddress: string;
  amount: number;
  cryptoType: 'BTC' | 'ETH' | 'SOL' | 'TRC20';
}

export interface CryptoManualWithdrawalRequest {
  cryptoType: 'BTC' | 'ETH' | 'SOL' | 'TRC20';
  amount: number;
  toAddress: string;
  notes?: string;
}

export interface CryptoAdminApprovalRequest {
  transactionId: number;
  approved: boolean;
  adminNotes?: string;
}

export type CryptoType = 'BTC' | 'ETH' | 'SOL' | 'TRC20';

export interface CryptoBalanceDTO {
  cryptoType: CryptoType;
  balance: number;
  usdValue: number;
  pendingDeposits: number;
  pendingWithdrawals: number;
}

export interface UserWallet {
  id: number;
  userId: number;
  cryptoType: CryptoType;
  address: string;
  balance: number;
  pendingDeposits: number;
  pendingWithdrawals: number;
  totalDeposited: number;
  totalWithdrawn: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateWalletRequest {
  cryptoType: CryptoType;
  address: string;
  notes?: string;
}

export interface UpdateWalletRequest {
  cryptoType?: CryptoType;
  address?: string;
  notes?: string;
}

export interface CryptoWallet {
  id: number;
  userId: number;
  cryptoType: CryptoType;
  balance: number;
  pendingDeposits: number;
  pendingWithdrawals: number;
  totalDeposited: number;
  totalWithdrawn: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  address: string;
}

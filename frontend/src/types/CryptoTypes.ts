export interface CryptoBalance {
  cryptoType: string;
  balance: number;
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
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  message?: string;
  timestamp: Date;
}

export interface CryptoTransaction {
  id: number;
  userId: number;
  cryptoType: string;
  amount: number;
  transactionType: 'DEPOSIT' | 'WITHDRAWAL' | 'CONVERSION';
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CryptoDepositRequest {
  cryptoType: string;
  amount: number;
  transactionHash?: string;
  notes?: string;
}

export type CryptoType = 'BTC' | 'ETH' | 'SOL';

export interface CryptoBalanceDTO {
  cryptoType: CryptoType;
  balance: number;
  usdValue: number;
}

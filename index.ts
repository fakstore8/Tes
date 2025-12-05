export interface User {
  id: string;
  email: string;
  name: string;
  balance: number;
  avatar?: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface TopUpTransaction {
  id: string;
  userId: string;
  amount: number;
  senderName: string;
  recipientName: string;
  note?: string;
  referenceNumber: string;
  status: 'pending' | 'waiting_confirmation' | 'confirmed' | 'failed';
  proofImage?: string;
  createdAt: string;
  confirmedAt?: string;
}

export interface WithdrawalTransaction {
  id: string;
  userId: string;
  amount: number;
  adminFee: number;
  netAmount: number;
  ewallet: 'dana' | 'ovo' | 'gopay' | 'shopeepay' | 'linkaja';
  accountNumber: string;
  accountName: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  processedAt?: string;
}

export interface AppSettings {
  adminFeePercentage: number;
  qrisRecipientName: string;
  qrisMerchantId: string;
}

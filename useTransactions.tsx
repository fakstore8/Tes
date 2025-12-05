import { useState, useEffect } from 'react';
import { TopUpTransaction, WithdrawalTransaction } from '@/types';

const TOPUP_KEY = 'qris_topup_transactions';
const WITHDRAWAL_KEY = 'qris_withdrawal_transactions';

export function useTransactions() {
  const [topUps, setTopUps] = useState<TopUpTransaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalTransaction[]>([]);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = () => {
    const savedTopUps = localStorage.getItem(TOPUP_KEY);
    const savedWithdrawals = localStorage.getItem(WITHDRAWAL_KEY);
    
    if (savedTopUps) setTopUps(JSON.parse(savedTopUps));
    if (savedWithdrawals) setWithdrawals(JSON.parse(savedWithdrawals));
  };

  const saveTopUps = (transactions: TopUpTransaction[]) => {
    localStorage.setItem(TOPUP_KEY, JSON.stringify(transactions));
    setTopUps(transactions);
  };

  const saveWithdrawals = (transactions: WithdrawalTransaction[]) => {
    localStorage.setItem(WITHDRAWAL_KEY, JSON.stringify(transactions));
    setWithdrawals(transactions);
  };

  const createTopUp = (data: Omit<TopUpTransaction, 'id' | 'referenceNumber' | 'status' | 'createdAt'>) => {
    const newTopUp: TopUpTransaction = {
      ...data,
      id: crypto.randomUUID(),
      referenceNumber: `TU${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    const updated = [...topUps, newTopUp];
    saveTopUps(updated);
    return newTopUp;
  };

  const uploadProof = (transactionId: string, proofImage: string) => {
    const updated = topUps.map(t => 
      t.id === transactionId 
        ? { ...t, proofImage, status: 'waiting_confirmation' as const }
        : t
    );
    saveTopUps(updated);
  };

  const confirmTopUp = (transactionId: string) => {
    const updated = topUps.map(t => 
      t.id === transactionId 
        ? { ...t, status: 'confirmed' as const, confirmedAt: new Date().toISOString() }
        : t
    );
    saveTopUps(updated);
    return updated.find(t => t.id === transactionId);
  };

  const rejectTopUp = (transactionId: string) => {
    const updated = topUps.map(t => 
      t.id === transactionId 
        ? { ...t, status: 'failed' as const }
        : t
    );
    saveTopUps(updated);
  };

  const createWithdrawal = (data: Omit<WithdrawalTransaction, 'id' | 'status' | 'createdAt' | 'netAmount'>, adminFeePercentage: number) => {
    const adminFee = Math.round(data.amount * (adminFeePercentage / 100));
    const netAmount = data.amount - adminFee;
    
    const newWithdrawal: WithdrawalTransaction = {
      ...data,
      id: crypto.randomUUID(),
      adminFee,
      netAmount,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    const updated = [...withdrawals, newWithdrawal];
    saveWithdrawals(updated);
    return newWithdrawal;
  };

  const processWithdrawal = (transactionId: string) => {
    const updated = withdrawals.map(t => 
      t.id === transactionId 
        ? { ...t, status: 'processing' as const }
        : t
    );
    saveWithdrawals(updated);
  };

  const completeWithdrawal = (transactionId: string) => {
    const updated = withdrawals.map(t => 
      t.id === transactionId 
        ? { ...t, status: 'completed' as const, processedAt: new Date().toISOString() }
        : t
    );
    saveWithdrawals(updated);
    return updated.find(t => t.id === transactionId);
  };

  const getUserTopUps = (userId: string) => topUps.filter(t => t.userId === userId);
  const getUserWithdrawals = (userId: string) => withdrawals.filter(t => t.userId === userId);

  return {
    topUps,
    withdrawals,
    createTopUp,
    uploadProof,
    confirmTopUp,
    rejectTopUp,
    createWithdrawal,
    processWithdrawal,
    completeWithdrawal,
    getUserTopUps,
    getUserWithdrawals,
    loadTransactions,
  };
}

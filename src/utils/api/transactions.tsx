import axiosInstance from "../axios"; 
import { Transaction } from '../../types'; 
import { DepositForm } from "../../pages/Deposit";
import * as URL from './index'


export const submitDeposit = async (data: DepositForm): Promise<Transaction> => {
  try {
    const res = await axiosInstance.post(URL.DEPOSIT, data);
    return res.data.transaction;
  } catch (err: any) {
    console.error('Error submitting deposit:', err.response?.data || err.message);
    throw err;
  }
};
// Fetch transactions with optional filters and pagination
export const getTransactions = async (
  params?: { type?: 'deposit' | 'withdrawal'; status?: 'pending' | 'approved' | 'rejected'; page?: number; limit?: number }
): Promise<{ transactions: Transaction[]; pagination: any }> => {
  try {
    const res = await axiosInstance.get(URL.GET_TRANSACTIONS, { params });

    // map backend response to your frontend interface
    const transactions: Transaction[] = res.data.transactions.map((tx: any) => ({
      id: tx._id,
      userId: tx.user._id,
      type: tx.type,
      amount: tx.amount,
      status: tx.status,
      netAmount: tx.netAmount || 0,       
  walletAddress: tx.walletAddress || '', 
      transactionId: tx.transactionId || '',
      date: new Date(tx.createdAt),
      fee: tx.fee || 0
    }));

    return { transactions, pagination: res.data.pagination };
  } catch (err: any) {
    console.error('Error fetching transactions:', err.response?.data || err.message);
    throw err;
  }
};

// Submit a withdrawal
export interface WithdrawalForm {
  amount: number;
  walletAddress: string;
}

export const submitWithdrawal = async (data: WithdrawalForm): Promise<Transaction> => {
  try {
    const res = await axiosInstance.post(URL.WITHDRAWAL, data);
    return res.data.transaction;
  } catch (err: any) {
    console.error('Error submitting withdrawal:', err.response?.data || err.message);
    throw err;
  }
};

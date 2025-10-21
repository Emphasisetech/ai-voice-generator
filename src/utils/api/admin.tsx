import * as URL from './index'
import axiosInstance from "../axios";
import { AdminStats } from '../../pages/Admin';
import { RewardResponse, SignupPayload, TransactionResponse, UserResponse } from '../../types';
import toast from 'react-hot-toast';


export const fetchAdminStats = async (): Promise<AdminStats> => {
  try {
    const res = await axiosInstance.get(URL.GET_STATS);
    return res.data.stats;
  } catch (err: any) {
    console.error("Error fetching admin stats:", err.response?.data || err.message);
    throw err;
  }
};

export const fetchDeposit = async (
  page: number = 1,
  limit: number = 10,
  type?: string,
  status?: string
): Promise<TransactionResponse> => {
  try {
    const res = await axiosInstance.get(URL.GET_ADMIN_TRANSACTIONS, {
      params: { page, limit, type, status },
    });
    return res.data;
  } catch (err: any) {
    console.error("Error fetching transactions:", err.response?.data || err.message);
    throw err;
  }
};

export const fetchWithdrawal = async (
  page: number = 1,
  limit: number = 10,
  type?: string,
  status?: string
): Promise<TransactionResponse> => {
  try {
    const res = await axiosInstance.get(URL.GET_ADMIN_TRANSACTIONS, {
      params: { page, limit, type, status },
    });
    return res.data;
  } catch (err: any) {
    console.error("Error fetching transactions:", err.response?.data || err.message);
    throw err;
  }
};


// For deposits
export const updateDepositTransaction = async (
  transactionId: string,
  status: "approved" | "rejected",
  adminNotes?: string
) => {
  const url = URL.UPDATE_DEPOSIT.replace(":id", transactionId);
  const res = await axiosInstance.put(url, {
    status,
    adminNotes,
  });
  return res.data.transaction;
};

// For withdrawals
export const updateWithdrawalTransaction = async (
  transactionId: string,
  status: "approved" | "rejected",
  adminNotes?: string
) => {
  const url = URL.UPDATE_WITHDRAWAL.replace(":id", transactionId);
  const res = await axiosInstance.put(url, {
    status,
    adminNotes,
  });
  return res.data.transaction;
};


export const fetchUsers = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  status?: "active" | "inactive"
): Promise<UserResponse> => {
  try {
    const res = await axiosInstance.get(URL.GET_USERS, {
      params: { page, limit, search, status },
    });
    return res.data;
  } catch (err: any) {
    console.error("Error fetching users:", err.response?.data || err.message);
    return { users: [], pagination: { total: 0, page: 1, limit: 10, pages: 1 } }; // Return empty data on error
  }
};

export const fetchRewards = async (
  page: number = 1,
  limit: number = 10,
  status?: "pending" | "approved" | "rejected"
): Promise<RewardResponse> => {
  try {
    const res = await axiosInstance.get(URL.GET_ADMIN_REWARDS, {
      params: { page, limit, status },
    });
    return res.data;
  } catch (err: any) {
    console.error("Error fetching rewards:", err.response?.data || err.message);
    throw err;
  }
};

export const updateRewardStatus = async (
  rewardId: string,
  status: "approved" | "rejected"
) => {
  try {
    const url = URL.UPDATE_ADMIN_REWARDS.replace(":id", rewardId);
    const res = await axiosInstance.put(url, { status });
    return res.data.reward;
  } catch (err: any) {
    console.error("Error updating reward:", err.response?.data || err.message);
    throw err;
  }
};

export const updateUser = async (id: string, data: SignupPayload) => {
  try {
    const url = URL.ADMIN_UPDATE_USERS.replace(":id", id);
    const res = await axiosInstance.put(url, data);
    return res.data; // { success: true, message, user }
  } catch (error: any) {
    throw error.response?.data || { success: false, message: "Server error" };
  }
};
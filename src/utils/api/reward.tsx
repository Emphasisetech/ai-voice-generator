import * as URL from './index'
import axiosInstance from "../axios";
import { ClaimRewardResponse, Reward } from '../../types';

export const getRewardsData = async (): Promise<Reward[]> => {
  try {
    const res = await axiosInstance.get(URL.GET_REWARDS); 
    return res.data;
  } catch (err: any) {
    console.error("Error fetching team data:", err);
    throw err;
  }
};

export const claimReward = async (rewardId: string): Promise<ClaimRewardResponse> => {
  try {
     const url = URL.CLAIM_REWARDS.replace(":id", rewardId);
     const res = await axiosInstance.post(url);
    return res.data;
  } catch (error: any) {
    console.error('Claim reward API error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Something went wrong'
    };
  }
};
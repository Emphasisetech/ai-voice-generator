import axiosInstance from "../axios"; 
import { EarningsOverview, RecentEarning, ROIDatum, TeamEarningDatum } from '../../types'; 
import * as URL from './index'
import toast from "react-hot-toast";

export const getROI = async (): Promise<ROIDatum[]> => {
  try {
    const res = await axiosInstance.get('/earnings/roi');
    return res?.data?.dailyROIData;
  } catch (err: any) {
    console.error('Error fetching ROI:', err.response?.data || err.message);
    throw err;
  }
};


export const addROI = async (): Promise<ROIDatum[]> => {
  try {
    const res = await axiosInstance.post('/roi/add',{});
    if(res?.data?.success){     
      toast.success(res.data.message);  
      return res?.data?.dailyROIData;
    }else{
      toast.error(res.data.message);  
      return [];
    }
  } catch (err: any) {
    console.error('Error fetching ROI:', err.response?.data || err.message);
    throw err;
  }
};



export const resetTodayData = async (): Promise<ROIDatum[]> => {
  try {
    const res = await axiosInstance.post('/admin/reset-todays-data',{});
    if(res?.data?.success){     
      toast.success(res.data.message);  
      return res?.data?.dailyROIData;
    }else{
      toast.error(res.data.message);  
      return [];
    }
  } catch (err: any) {
    console.error('Error fetching ROI:', err.response?.data || err.message);
    throw err;
  }
};


export const addTeamROI = async (): Promise<ROIDatum[]> => {
  try {
    const res = await axiosInstance.post('/roi/add-team-roi',{});
    if(res?.data?.success){     
      toast.success(res.data.message);  
      return res?.data?.dailyROIData;
    }else{
      toast.error(res.data.message);  
      return [];
    }
  } catch (err: any) {
    console.error('Error fetching ROI:', err.response?.data || err.message);
    throw err;
  }
};

export const getTeamEarnings = async (): Promise<TeamEarningDatum[]> => {
  try {
    const res = await axiosInstance.get('/earnings/team');
    return res?.data?.teamEarningsData;
  } catch (err: any) {
    console.error('Error fetching team earnings:', err.response?.data || err.message);
    throw err;
  }
};

export const getRecentEarnings = async (): Promise<RecentEarning[]> => {
  try {
    const res = await axiosInstance.get('/earnings/recent');
    return res?.data?.recentEarnings?.map((e: any) => ({
      ...e,
      date: new Date(e.date)
    }));
  } catch (err: any) {
    console.error('Error fetching recent earnings:', err.response?.data || err.message);
    throw err;
  }
};

export const getEarningsOverview = async (): Promise<EarningsOverview> => {
  try {
    const res = await axiosInstance.get('/earnings/overview');
    return res?.data?.data;
  } catch (err: any) {
    console.error('Error fetching earnings overview:', err.response?.data || err.message);
    throw err;
  }
};


export const getTeamCommissionByLevel = async (): Promise<TeamEarningDatum[]> => {
  try {
    const res = await axiosInstance.get('/earnings/teamommissionbylevel');
    return res?.data?.data;
  } catch (err: any) {
    console.error('Error fetching team earnings:', err.response?.data || err.message);
    throw err;
  }
};

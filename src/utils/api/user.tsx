import axiosInstance from "../axios";
import { ApiResponse, DashboardData, ForgotPasswordForm, SignupPayload, SignupResponse, User } from "../../types";
import { LoginPayload, LoginResponse } from "../../types";
import * as URL from './index'

export const signupApi = async (payload: SignupPayload): Promise<SignupResponse> => {
  const { data } = await axiosInstance.post<SignupResponse>(URL.SIGN_UP, payload);
  return data;
};

export const loginApi = async (payload: LoginPayload): Promise<LoginResponse> => {
  const { data } = await axiosInstance.post<LoginResponse>(URL.SIGN_IN, payload);
  return data;
};

export const forgotPassword = async (data: ForgotPasswordForm): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.post<ApiResponse>('/auth/forgot-password', data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return error.response.data; // Returns { success, message } from backend
    }
    return { success: false, message: 'Network error' };
  }
};

export const getDashboard = async (): Promise<DashboardData> => {
  try {
    const res = await axiosInstance.get(URL.GET_DASHBOARD);

    const d = res.data.data; // backend wraps inside { success, data }
    const dashboard: DashboardData = {
      totalInvestment: d?.totalInvestment,
      dailyROI: d?.dailyROI,
      totalROI: d?.totalROI,
      todayTeamInvestment: d?.todayTeamInvestment,
      todayNewMembers: d?.todayNewMembers,
      teamEarnings: d?.teamEarnings,
      totalTeamSize: d?.totalTeamSize,
      recentROI: d?.recentROI.map((roi: any) => ({
        name: roi.name,
        value: roi.value,
      })),
      totalTeamInvestments: d?.totalTeamInvestments,
      totalTeamEarnings: d?.totalTeamEarnings,
      todayEarning: d?.todayEarning
    };

    return dashboard;
  } catch (err: any) {
    console.error("Error fetching dashboard:", err.response?.data || err.message);
    throw err;
  }
};



export const getuserDetails = async (): Promise<User> => {
  try {
    const res = await axiosInstance.get(URL.GET_USER_DETAILS);
    const userData: User = res.data.user; // backend wraps inside { success, data }
    return userData;
  } catch (err: any) {
    console.error("Error fetching getuserDetails:", err.response?.data || err.message);
    throw err;
  }
};


export const getactivityForDashboard = async (): Promise<any> => {
  try {
    const res = await axiosInstance.get(URL.GET_ACTIVITY_FOR_DASHBOARD);
    const activityData: any = res.data.data; // backend wraps inside { success, data }

    return activityData;
  } catch (err: any) {
    console.error("Error fetching getactivityForDashboard:", err.response?.data || err.message);
    throw err;
  }
};


export const updateUserProfile = async (data: any): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.put<ApiResponse>('/users/profile', data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return error.response.data; // Returns { success, message } from backend
    }
    return { success: false, message: 'Network error' };
  }
};
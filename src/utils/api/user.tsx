import axiosInstance from "../axios";
import { ApiResponse, ForgotPasswordForm, SignupPayload, SignupResponse,LoginPayload, LoginResponse, User } from "../../types";
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
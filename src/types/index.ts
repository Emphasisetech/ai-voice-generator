export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  profilePicture?: string | null;
  isAdmin: boolean;
  isActive: boolean;
}

export interface UserResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface SignupPayload {
  id: string;
  name: string;
  email: string;
  phone: string;
  profilePicture?: string;
  isAdmin?: boolean;
}

export interface ProfileForm {
  name: string;
  email: string;
  phone: string;
}
export interface SignupForm {
  name: string;
  email: string;
  phone: string;
  walletAddress?: string;
  password: string;
  confirmPassword: string;
  referralCode?: string;
}

export interface ForgotPasswordForm {
  email: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}

export interface SignupResponse {
  success: boolean;
  message: string;
  user?: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  token?: string; // if backend logs user in immediately
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    _id: string;
    email: string;
    name: string;
    phone: string;
  };
}
export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  walletAddress?: string | null;
  profilePicture?: string | null;
  investment: number;
  availableForWithdrawal: number;
  totalROI: number;
  teamEarnings: number;
  referralCode: string;
  referredBy?: {
    _id: string;
    name: string;
    email: string;
    referralCode: string;
  } | null;
  isAdmin: boolean;
  isActive: boolean;
  lastROICalculation: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: string;
  emailVerified: boolean;
  emailVerificationToken?: string;
  teamSize: number; // from virtual
  createdAt: string;
  updatedAt: string;
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
  walletAddress?: string;
  investment: number;
  totalROI: number;
  teamEarnings: number;
  // referralCode: string;
  referredBy?: string;
  profilePicture?: string;
  isAdmin?: boolean;
  createdAt: Date;
  referCode: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  transactionId?: string;
  date: Date;
  fee?: number;
}

export interface GetTransaction {
  _id: string;
  type: "deposit" | "withdrawal";
  amount: number;
  status: "pending" | "approved" | "rejected";
  user?: { name: string; email: string };
  processedBy?: { name: string; email: string };
  createdAt: string;
}

export interface TransactionResponse {
  transactions: Transaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface TeamMember {
  id: string;
  userId: string;
  referrerId: string;
  level: number;
  investment: number;
  teamSize: number;
  earnings: number;
  joinedAt: Date;
}

export interface Rewards {
  _id: string;
  user?: { name: string; email: string };
  status: "pending" | "approved" | "rejected";
  achievedDate: string;
  approvedBy?: { name: string; email: string };
  approvedDate?: string;
}

export interface RewardResponse {
  rewards: Rewards[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface Reward {
  id: string;
  userId: string;
  level: number;
  milestone: number;
  amount: number;
  status: 'pending' | 'approved';
  date: Date;
}

export interface DashboardData {
  totalInvestment: number;
  dailyROI: number;
  totalROI: number;
  todayTeamInvestment: number;
  todayNewMembers: number;
  teamEarnings: number;
  totalTeamSize: number;
  totalTeamInvestments: number;
  totalTeamEarnings: number;
  todayEarning: number;
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


export interface ClaimRewardResponse {
  success: boolean;
  message: string;
  reward?: Reward;
}

export interface DashboardData {
  totalInvestment: number;
  dailyROI: number;
  totalROI: number;
  todayTeamInvestment: number;
  todayNewMembers: number;
  teamEarnings: number;
  totalTeamSize: number;
  todayEarning: number;
  totalTeamInvestments: number;
  totalTeamEarnings: number;
  recentROI: { calculationDate: string; amount: number }[];
}

export interface ROIDatum {
  date: string;
  roi: number;
  cumulative?: number;
}

export interface TeamEarningDatum {
  level?: string;
  amount: number;
  percentage?: number;
  members?: number;
  date?: string;
  earningsFromLevel?: number;
}

export interface RecentEarning {
  id: string | number;
  description: string;
  amount: number;
  type?: 'daily' | 'team';
  date: Date;
}

export interface EarningsOverview {
  totalROI: number;
  totalTeamEarnings: number;
  todaysEarnings: number;
  monthlyAverage: number;
  investment: number;
  type: string;
  roiChange?: string;
  dailyROI?: number;
  teamChange?: string;
}

export interface ForgotPasswordForm {
  email: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}

// Payload sent to backend (no confirmPassword)
// export interface SignupPayload {
//   name: string;
//   email: string;
//   phone: string;
//   walletAddress?: string;
//   password: string;
//   referralCode: string;
//   referredBy?: string;
// }

// Response coming back from backend
export interface SignupResponse {
  success: boolean;
  message: string;
  user?: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    walletAddress?: string;
    referralCode: string;
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
  };
}
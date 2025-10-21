//auth
export const SIGN_UP = "/auth/register";
export const SIGN_IN = "/auth/login";
export const FORGET_PASSWORD = "/auth/forget-password";
export const RESET_PASSWORD = "/auth/reset-password";
export const VERIFY_OTP = "/auth/verify-otp";
export const SET_PASSWORD = "/auth/reset-password";
export const CHANGE_PASSWORD = "/auth/change-password";

//users
export const GET_DASHBOARD = "/users/dashboard"
export const GET_USER_DETAILS = "/users/profile"

//activity for dashboard
export const GET_ACTIVITY_FOR_DASHBOARD = "/activity/today"

// earning
export const GET_EARNING_ROI = "/earnings/roi"
export const GET_TEAM_EARNING = "/earnings/team'"
export const GET_RECENT_EARNING = "/earnings/recent"
export const GET_EARNING_OVERVIEW = "/earnings/overview"



//team 
export const GET_TEAM = "/team";

//rewards
export const GET_REWARDS = "/rewards";
export const CLAIM_REWARDS = "/rewards/:id/claim";

//deposit
export const DEPOSIT = "/transactions/deposit"

//withdrawl
export const WITHDRAWAL = "/transactions/withdrawal"

//get tranasctions 
export const GET_TRANSACTIONS = "/transactions"

//admin
export const GET_USERS = "/admin/users"
export const ADMIN_UPDATE_USERS = "/admin/user/:id"
export const GET_STATS = "/admin/stats"
export const GET_ADMIN_TRANSACTIONS = "/admin/transactions"
export const UPDATE_DEPOSIT ="/admin/transactions/:id/deposit"
export const UPDATE_WITHDRAWAL ="/admin/transactions/:id/withdrawal"
export const GET_ADMIN_REWARDS ="/admin/rewards"
export const UPDATE_ADMIN_REWARDS ="/admin/rewards/:id"




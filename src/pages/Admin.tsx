import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import {
  Users,
  DollarSign,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  Database,
  Gift,
  TrashIcon
} from 'lucide-react';
import { fetchAdminStats, fetchDeposit, fetchRewards, fetchUsers, fetchWithdrawal, updateDepositTransaction, updateRewardStatus, updateUser, updateWithdrawalTransaction } from '../utils/api/admin';
import { RewardResponse, Rewards, SignupPayload, TransactionResponse, User } from '../types';
import toast from 'react-hot-toast';
import { addROI, addTeamROI, resetTodayData } from '../utils/api/earning';

export interface AdminStats {
  totalUsers: number;
  totalInvestments: number;
  pendingDeposits: number;
  pendingWithdrawals: number;
  totalROIPaid: number;
  pendingRewards: number;
}

const Admin: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'deposits' | 'withdrawals' | 'users' | 'rewards'>('overview');
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalInvestments: 0,
    pendingDeposits: 0,
    pendingWithdrawals: 0,
    totalROIPaid: 0,
    pendingRewards: 0,
  });
  const [depositTransactions, setDepositTransactions] = useState<TransactionResponse | null>(null);
  const [withdrawalTransactions, setWithdrawalTransactions] = useState<TransactionResponse | null>(null);
  const [users, setUsers] = useState<User | null>(null);
  const [rewards, setRewards] = useState<RewardResponse | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    walletAddress: "",
    profilePicture: "",
    investment: 0,
    totalROI: 0,
    teamEarnings: 0,
    isAdmin: false
  });


  const openDialog = (user: SignupPayload) => {
    setSelectedUser(user);
    setFormData({
      name: user.name || "",
      phone: user.phone || "",
      walletAddress: user.walletAddress || "",
      profilePicture: user.profilePicture || "",
      investment: user.investment || 0,
      totalROI: user.totalROI || 0,
      teamEarnings: user.teamEarnings || 0,
      isAdmin: user.isAdmin || false,
    });
    setIsOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? Number(value)
            : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const result = await updateUser(selectedUser._id, formData);
      if (result.success) {
        toast.success("User updated successfully!");
        setIsOpen(false);
        loadStats()
      } else {
        alert(result.message);
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Something went wrong!");
    }
  };



  const closeDialog = () => {
    setIsOpen(false);
    setSelectedUser(null);
  };

  // Check if user is admin
  if (!user?.isAdmin) {
    return <Navigate to="/admin" />;
  }

  const loadStats = async () => {
    try {
      const [statsData, deposit, withdrawal, userData, usersRewards] = await Promise.all([
        fetchAdminStats(),
        fetchDeposit(1, 10, "deposit"), // page=1, limit=10
        fetchWithdrawal(1, 10, "withdrawal"),
        fetchUsers(1, 10),
        fetchRewards(1, 10)
      ]);

      setStats(statsData);
      setDepositTransactions(deposit?.transactions)
      setWithdrawalTransactions(withdrawal.transactions)
      setUsers(userData?.users)
      setRewards(usersRewards?.rewards)
    } catch (err: any) {
      console.log(err)
    } finally {
    }
  };


  useEffect(() => {

    loadStats();
  }, []);

  const processTransaction = async (
    type: "deposit" | "withdrawal",
    transactionId: string,
    status: "approved" | "rejected",
    adminNotes?: string
  ) => {
    try {
      let updatedTx;

      if (type === "deposit") {
        updatedTx = await updateDepositTransaction(transactionId, status, adminNotes);
      } else {
        updatedTx = await updateWithdrawalTransaction(transactionId, status, adminNotes);
      }

      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} ${status} successfully!`);
      // Refresh dashboard/lists
      if (loadStats) {
        await loadStats();
      }
      return updatedTx;
    } catch (err: any) {
      console.log(err.response?.data?.message || "Failed to process transaction");

    }
  };

  const processReward = async (
    rewardId: string,
    status: "approved" | "rejected",
    loadRewards?: () => Promise<void>
  ): Promise<any> => {
    try {
      const updatedReward = await updateRewardStatus(rewardId, status);
      toast.success(`Reward ${status} successfully!`);

      // Refresh rewards list if function provided
      if (loadRewards) {
        await loadRewards();
      }

      return updatedReward;
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to process reward";
      console.log(message);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-400" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-400';
      case 'rejected':
        return 'text-red-400';
      case 'pending':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };


  const ResetTodayData = async () => {
    try {
      // Logic to add ROI to all users
      let data = await resetTodayData()
    } catch (error) {
      console.log(error, "Error adding ROI");

    }
  }


  const AddROI = async () => {
    // Logic to add ROI to all users
    let data = await addROI()

  }


  const AddTeamROI = async () => {
    try {
      // Logic to add ROI to all users
      let data = await addTeamROI()
    } catch (error) {
      console.log(error, "Error adding ROI");
    }
  }
  const StatCard: React.FC<{
    title: string;
    value: string;
    icon: React.ReactNode;
    change?: string;
    changeType?: 'positive' | 'negative';
    onClick?: () => void;
  }> = ({ title, value, icon, change, changeType, onClick }) => (
    <Card hover className={onClick ? 'cursor-pointer' : ''} onClick={(onClick)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {/* {change && (
            <p className={`text-sm mt-1 ${changeType === 'positive' ? 'text-green-400' : 'text-red-400'}`}>
              {change}
            </p>
          )} */}
        </div>
        <div className="p-3 bg-blue-500 bg-opacity-20 rounded-lg">
          {icon}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400 mt-2">Manage platform operations and user activities</p>
        </div>

        {/* Admin Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-1 bg-gray-800 rounded-lg p-1">
            {[
              { key: 'addroi', label: 'Add ROI', icon: DollarSign, onClick: AddROI },
              { key: 'addteramroi', label: 'Add Team ROI', icon: DollarSign, onClick: AddTeamROI },
              { key: 'resettodaydata', label: 'Reset Today Data', icon: TrashIcon, onClick: ResetTodayData },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={tab.onClick}
                className={`flex items-center space-x-2 px-4 py-3 rounded-md text-sm font-medium transition-colors bg-blue-500 text-white
                  }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>


        {/* Admin Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-1 bg-gray-800 rounded-lg p-1">
            {[
              { key: 'overview', label: 'Overview', icon: Database },
              { key: 'deposits', label: 'Deposits', icon: DollarSign },
              { key: 'withdrawals', label: 'Withdrawals', icon: TrendingUp },
              { key: 'users', label: 'Users', icon: Users },
              { key: 'rewards', label: 'Rewards', icon: Gift },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-md text-sm font-medium transition-colors ${activeTab === tab.key
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-400 hover:text-white'
                  }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard
                title="Total Users"
                value={stats?.totalUsers.toLocaleString()}
                icon={<Users className="h-6 w-6 text-blue-500" />}
                change="+12% this month"
                changeType="positive"
                onClick={() => setActiveTab('users')}
              />
              <StatCard
                title="Total Investments"
                value={`$${stats?.totalInvestments.toLocaleString()}`}
                icon={<DollarSign className="h-6 w-6 text-blue-500" />}
                change="+8.5% this month"
                changeType="positive"
              />
              <StatCard
                title="Pending Deposits"
                value={stats?.pendingDeposits.toString()}
                icon={<Clock className="h-6 w-6 text-blue-500" />}
                onClick={() => setActiveTab('deposits')}
              />
              <StatCard
                title="Pending Withdrawals"
                value={stats?.pendingWithdrawals.toString()}
                icon={<TrendingUp className="h-6 w-6 text-blue-500" />}
                onClick={() => setActiveTab('withdrawals')}
              />
              <StatCard
                title="Total ROI Paid"
                value={`$${stats?.totalROIPaid.toLocaleString()}`}
                icon={<Shield className="h-6 w-6 text-blue-500" />}
                change="+0.5% daily"
                changeType="positive"
              />
              <StatCard
                title="Pending Rewards"
                value={stats?.pendingRewards.toString()}
                icon={<Gift className="h-6 w-6 text-blue-500" />}
                onClick={() => setActiveTab('rewards')}
              />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <h3 className="text-xl font-semibold text-white mb-4">Recent Deposits</h3>
                <div className="space-y-3">
                  {depositTransactions?.slice(0, 5).map((deposit: any) => (
                    <div key={deposit.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{deposit.user?.name}</p>
                        <p className="text-gray-400 text-sm">${deposit.amount.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(deposit.status)}
                        <span className={`text-sm ${getStatusColor(deposit.status)}`}>{deposit.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <h3 className="text-xl font-semibold text-white mb-4">Recent Withdrawals</h3>
                <div className="space-y-3">
                  {withdrawalTransactions?.slice(0, 5).map((withdrawal: any) => (
                    <div key={withdrawal.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{withdrawal.user.name}</p>
                        <p className="text-gray-400 text-sm">${withdrawal.netAmount.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(withdrawal.status)}
                        <span className={`text-sm ${getStatusColor(withdrawal.status)}`}>{withdrawal.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Deposits Tab */}
        {activeTab === 'deposits' && (
          <Card>
            <h3 className="text-xl font-semibold text-white mb-6">Manage Deposits</h3>
            <div className="space-y-4">
              {depositTransactions?.map((deposit: any) => (
                <div key={deposit.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <p className="text-white font-medium">{deposit.user?.name}</p>
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(deposit.status)}`}>
                        {deposit.status}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">Amount: ${deposit.amount.toLocaleString()}</p>
                    <p className="text-gray-400 text-sm">TX ID: {deposit.transactionId}</p>
                    <p className="text-gray-400 text-sm">Date: {new Date(deposit.createdAt).toLocaleDateString()}</p>
                  </div>

                  {deposit.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => processTransaction("deposit", deposit._id, "approved", "Approved by admin")}
                        variant="success"
                        size="sm">
                        Approve
                      </Button>
                      <Button
                        onClick={() => processTransaction("deposit", deposit._id, "rejected", "Approved by admin")}
                        variant="danger"
                        size="sm">
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Withdrawals Tab */}
        {activeTab === 'withdrawals' && (
          <Card>
            <h3 className="text-xl font-semibold text-white mb-6">Manage Withdrawals</h3>
            <div className="space-y-4">
              {withdrawalTransactions?.map((withdrawal: any) => (
                <div key={withdrawal.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <p className="text-white font-medium">{withdrawal?.user?.name}</p>
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(withdrawal.status)}`}>
                        {withdrawal.status}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Amount: ${withdrawal.amount.toLocaleString()}
                      (Net: ${withdrawal.netAmount.toLocaleString()})
                    </p>
                    <p className="text-gray-400 text-sm">Date: {new Date(withdrawal.createdAt).toLocaleDateString()}</p>
                  </div>

                  {withdrawal.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => processTransaction("withdrawal", withdrawal._id, "approved", "Approved by admin")}
                        variant="success"
                        size="sm"
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={() => processTransaction("withdrawal", withdrawal._id, "rejected", "Approved by admin")}
                        variant="danger"
                        size="sm">
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <Card>
            <h3 className="text-xl font-semibold text-white mb-6">Manage Users</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="pb-3 text-gray-400 font-medium">User</th>
                    <th className="pb-3 text-gray-400 font-medium">Investment</th>
                    <th className="pb-3 text-gray-400 font-medium">Team Size</th>
                    <th className="pb-3 text-gray-400 font-medium">Status</th>
                    <th className="pb-3 text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((user: any) => (
                    <tr key={user.id} className="border-b border-gray-700">
                      <td className="py-4">
                        <div>
                          <p className="text-white font-medium">{user.name}</p>
                          <p className="text-gray-400 text-sm">{user.email}</p>
                        </div>
                      </td>
                      <td className="py-4 text-white">${user.investment.toLocaleString()}</td>
                      <td className="py-4 text-white">{user.teamSize}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded text-xs ${user.status === 'active' ? 'text-green-400 bg-green-400/20' : 'text-gray-400 bg-gray-400/20'
                          }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex space-x-2">
                          <Button variant="secondary" size="sm">
                            View
                          </Button>
                          <Button variant="secondary" size="sm" onClick={() => openDialog(user)}>
                            Edit
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Dialog */}
        {isOpen && selectedUser && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-gray-800 p-6 rounded-lg w-96">
              <h2 className="text-lg font-semibold text-white mb-4">
                Edit {selectedUser.name}
              </h2>

              <div className="space-y-3">

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  placeholder="Name"
                />

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  placeholder="Phone"
                />

                <input
                  type="text"
                  name="walletAddress"
                  value={formData.walletAddress}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  placeholder="Wallet Address"
                />

                <input
                  type="text"
                  name="profilePicture"
                  value={formData.profilePicture}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  placeholder="Profile Picture URL"
                />

                <input
                  type="number"
                  name="investment"
                  value={formData.investment}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  placeholder="Investment"
                />

                <input
                  type="number"
                  name="totalROI"
                  value={formData.totalROI}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  placeholder="Total ROI"
                />

                <input
                  type="number"
                  name="teamEarnings"
                  value={formData.teamEarnings}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  placeholder="Team Earnings"
                />


              </div>


              <div className="flex justify-end space-x-2 mt-4">
                <button
                  className="px-4 py-2 bg-gray-600 text-white rounded"
                  onClick={closeDialog}
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleSubmit}>
                  Save
                </button>
              </div>
            </div>
          </div>
        )}


        {/* Rewards Tab */}
        {activeTab === 'rewards' && (
          <Card>
            <h3 className="text-xl font-semibold text-white mb-6">Manage Rewards</h3>
            <div className="space-y-4">
              <div className="bg-yellow-900/20 border border-yellow-400/30 rounded-lg p-4">
                <p className="text-yellow-400 font-semibold mb-2">Pending Reward Approvals: {stats?.pendingRewards}</p>
                <p className="text-gray-300 text-sm">Review and approve milestone rewards for team achievements</p>
              </div>

              <div className="space-y-3">
                {rewards?.map((reward: any) => (
                  <div key={reward._id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{reward.user.name}</p>
                      <p className="text-gray-400 text-sm">
                        Level {reward.level} - ${reward.milestone} milestone achieved
                      </p>
                      <p className="text-gray-400 text-sm">Reward: ${reward.amount} USDT</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => processReward(reward._id, "approved", loadStats)}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => processReward(reward._id, "rejected", loadRewards)}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Admin;
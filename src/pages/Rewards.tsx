import React, { useEffect, useState } from 'react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { Gift, Trophy, Star, Clock, CheckCircle, Target, TrendingUp, Users } from 'lucide-react';
import { format, set } from 'date-fns';
import { claimReward, getRewardsData } from '../utils/api/reward';
import toast from 'react-hot-toast';
import { ClaimRewardResponse } from '../types';
import { getuserDetails } from '../utils/api/user';

interface Reward {
  id: string;
  level: number;
  milestone: number;
  amount: number;
  status: 'pending' | 'approved' | 'claimed';
  achievedDate: Date;
  claimedDate?: Date;
}

interface MilestoneProgress {
  level: number;
  currentBusiness: number;
  targetBusiness: number;
  progress: number;
  estimatedReward: number;
}

// Mock rewards data
// const rewards: Reward[] = [
//   {
//     id: '1',
//     level: 1,
//     milestone: 10000,
//     amount: 10,
//     status: 'claimed',
//     achievedDate: new Date('2024-01-15'),
//     claimedDate: new Date('2024-01-16'),
//   },
//   {
//     id: '2',
//     level: 2,
//     milestone: 10000,
//     amount: 10,
//     status: 'approved',
//     achievedDate: new Date('2024-01-20'),
//   },
//   {
//     id: '3',
//     level: 1,
//     milestone: 20000,
//     amount: 10,
//     status: 'pending',
//     achievedDate: new Date('2024-01-22'),
//   },
// ];

// Mock milestone progress
const milestoneProgress: MilestoneProgress[] = [
  { level: 1, currentBusiness: 100, targetBusiness: 1000, progress: 0, estimatedReward: 10 },
  { level: 2, currentBusiness: 0, targetBusiness: 10000, progress: 0, estimatedReward: 20 },
  { level: 3, currentBusiness: 0, targetBusiness: 20000, progress: 0, estimatedReward: 20 },
  { level: 4, currentBusiness: 0, targetBusiness: 30000, progress: 0, estimatedReward: 20 },
  { level: 5, currentBusiness: 0, targetBusiness: 40000, progress: 0, estimatedReward: 20 },
];

const Rewards: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'earned' | 'progress'>('earned');
  const [rewards, setRewards] = useState<Reward[]>([]);
  // const [loading, setLoading] = useState(true);
  const totalRewards = rewards.reduce((sum, reward) => sum + reward.amount, 0);
  const claimedRewards = rewards.filter(r => r.status === 'claimed').reduce((sum, reward) => sum + reward.amount, 0);
  const pendingRewards = rewards.filter(r => r.status !== 'claimed').reduce((sum, reward) => sum + reward.amount, 0);
  const [loading, setLoading] = useState(false);
  const [milestoneProgressData, setMilestoneProgressData] = useState<MilestoneProgress[]>(milestoneProgress);
  const [activeLavels, setActiveLevels] = useState<number | null>(0);
  const [userDetails, setUserDetails] = useState({
    userId: '',    // Labels earnings
    depositeInLabel1: 0,
    depositeInLabel2: 0,
    depositeInLabel3: 0,
    depositeInLabel4: 0,
    depositeInLabel5: 0,
  });
  const fetchUserDetails = async () => {
    try {

      const userdata: any = await getuserDetails();
      setUserDetails(userdata)
      // setPagination(pagination);
      const mappedMilestones = milestoneProgressData.map(milestone => {
        const depositKey = `depositeInLabel${milestone.level}`;
        const currentBusiness = userdata[depositKey] || 0;

        const progress = Number(((currentBusiness / milestone.targetBusiness) * 100).toFixed(2));

        return {
          ...milestone,
          currentBusiness,
          progress
        };
      });
      setMilestoneProgressData(mappedMilestones);
      const activeLevelsCount = mappedMilestones.filter(milestone => milestone.currentBusiness > 0).length;
      setActiveLevels(activeLevelsCount);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    } finally {
      setLoading(false);
    }
  };
  const fetchRewards = async () => {
    try {
      await fetchUserDetails();
      const data = await getRewardsData();
      setRewards(data.rewards);
    } catch (err) {
      console.error("Failed to load team:", err);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  const handleClaimReward = async (rewardId: string): Promise<ClaimRewardResponse | null> => {
    // setLoading(true);
    // setError(null);
    // setSuccessMessage(null);

    const result = await claimReward(rewardId);

    if (result.success) {
      toast.success(result.message);
      fetchRewards()
      // setSuccessMessage(result.message);
    } else {
      // setError(result.message);
    }

    // setLoading(false);
    return result;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'claimed':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'approved':
        return <Gift className="h-5 w-5 text-blue-400" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'claimed':
        return 'text-green-400';
      case 'approved':
        return 'text-blue-400';
      case 'pending':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  const getLevelColor = (level: number) => {
    const colors = {
      1: 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30',
      2: 'bg-blue-400/20 text-blue-400 border-blue-400/30',
      3: 'bg-green-400/20 text-green-400 border-green-400/30',
      4: 'bg-purple-400/20 text-purple-400 border-purple-400/30',
      5: 'bg-pink-400/20 text-pink-400 border-pink-400/30',
    };
    return colors[level as keyof typeof colors] || 'bg-gray-400/20 text-gray-400 border-gray-400/30';
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Rewards Center</h1>
          <p className="text-gray-400 mt-2">Earn $10 USDT rewards when team levels reach $10,000 business</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <Trophy className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Rewards Earned</p>
                <p className="text-2xl font-bold text-white">${totalRewards} USDT</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Claimed Rewards</p>
                <p className="text-2xl font-bold text-white">${claimedRewards} USDT</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Pending Rewards</p>
                <p className="text-2xl font-bold text-white">${pendingRewards} USDT</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setSelectedTab('earned')}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-colors ${selectedTab === 'earned'
                ? 'bg-yellow-500 text-gray-900'
                : 'text-gray-400 hover:text-white'
                }`}
            >
              Earned Rewards
            </button>
            <button
              onClick={() => setSelectedTab('progress')}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-colors ${selectedTab === 'progress'
                ? 'bg-yellow-500 text-gray-900'
                : 'text-gray-400 hover:text-white'
                }`}
            >
              Milestone Progress
            </button>
          </div>
        </div>

        {selectedTab === 'earned' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Earned Rewards List */}
            <div className="lg:col-span-2">
              <Card>
                <h3 className="text-xl font-semibold text-white mb-4">Your Rewards History</h3>
                <div className="space-y-4">
                  {rewards.map((reward) => (
                    <div
                      key={reward.id}
                      className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(reward.status)}
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <div className={`px-2 py-1 rounded text-xs font-semibold border ${getLevelColor(reward.level)}`}>
                              Level {reward.level}
                            </div>
                            <span className="text-white font-medium">
                              ${reward.milestone.toLocaleString()} Milestone
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm">
                            Achieved: {format(reward.achievedDate, 'MMM dd, yyyy')}
                            {reward.claimedDate && (
                              <> • Claimed: {format(reward.claimedDate, 'MMM dd, yyyy')}</>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <p className="text-green-400 font-bold">${reward.amount} USDT</p>
                          <p className={`text-xs capitalize ${getStatusColor(reward.status)}`}>
                            {reward.status}
                          </p>
                        </div>

                        {reward.status === 'approved' && (
                          <Button onClick={() => handleClaimReward(reward?._id)} size="sm">
                            Claim
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {rewards.length === 0 && (
                  <div className="text-center py-12">
                    <Gift className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg mb-2">No rewards earned yet</p>
                    <p className="text-gray-500">Build your team to start earning milestone rewards!</p>
                  </div>
                )}
              </Card>
            </div>

            {/* Reward Info */}
            <div>
              <Card>
                <h3 className="text-xl font-semibold text-white mb-4">How Rewards Work</h3>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 border border-yellow-400/30 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Star className="h-5 w-5 text-yellow-400" />
                      <span className="text-yellow-400 font-semibold">Milestone Reward</span>
                    </div>
                    <p className="text-white font-bold text-2xl mb-1">$10 USDT</p>
                    <p className="text-gray-300 text-sm">Per $1000 business milestone</p>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                      <p className="text-gray-300">
                        Earn $10 USDT when level 1 reaches $1,000 in total business
                      </p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                      <p className="text-gray-300">
                        Earn $20 USDT when level 2 reaches $10,000 in total business
                      </p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                      <p className="text-gray-300">
                        Earn $20 USDT when level 3 reaches $20,000 in total business
                      </p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                      <p className="text-gray-300">
                        Earn $20 USDT when level 4 reaches $30,000 in total business
                      </p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                      <p className="text-gray-300">
                        Earn $20 USDT when level 5 reaches $40,000 in total business
                      </p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                      <p className="text-gray-300">
                        Rewards repeat each time the milestone is reached again
                      </p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                      <p className="text-gray-300">
                        All rewards require admin approval before claiming
                      </p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                      <p className="text-gray-300">
                        Business includes all investments from team members in that level
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <h3 className="text-xl font-semibold text-white mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                    <span className="text-gray-400">Milestones Achieved</span>
                    <span className="text-white font-semibold">{rewards.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                    <span className="text-gray-400">Active Levels</span>
                    <span className="text-white font-semibold">{activeLavels}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                    <span className="text-gray-400">Next Reward</span>
                    <span className="text-yellow-400 font-semibold">$10 USDT</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <Card>
              <h3 className="text-xl font-semibold text-white mb-6">Milestone Progress by Level</h3>
              <div className="space-y-6">
                {milestoneProgressData.map((progress) => (
                  <div key={progress.level} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`px-3 py-1 rounded text-sm font-semibold border ${getLevelColor(progress.level)}`}>
                          Level {progress.level}
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            ${progress.currentBusiness.toLocaleString()} / ${progress.targetBusiness.toLocaleString()}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {progress.progress >= 100 ? 'Milestone Achieved!' : `$${(progress.targetBusiness - progress.currentBusiness).toLocaleString()} remaining`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-yellow-400 font-semibold">${progress.estimatedReward} USDT</p>
                        <p className="text-gray-400 text-sm">Reward</p>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-300 ${progress.progress >= 100 ? 'bg-green-400' : 'bg-yellow-400'
                            }`}
                          style={{ width: `${Math.min(progress.progress, 100)}%` }}
                        ></div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-semibold text-gray-900">
                          {progress.progress.toFixed(0)}%
                        </span>
                      </div>
                    </div>

                    {progress.progress >= 100 && (
                      <div className="flex items-center space-x-2 text-green-400">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Ready to claim reward!</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h3 className="text-xl font-semibold text-white mb-4">Potential Rewards</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                    <span className="text-gray-400">Ready to Claim</span>
                    <span className="text-green-400 font-semibold">
                      ${milestoneProgress.filter(p => p.progress >= 100).length * 10} USDT
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                    <span className="text-gray-400">In Progress</span>
                    <span className="text-yellow-400 font-semibold">
                      ${10} USDT
                      {/* ${milestoneProgress.filter(p => p.progress < 100).length * 10} USDT */}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                    <span className="text-gray-400">Total Potential</span>
                    <span className="text-blue-400 font-semibold">
                      {/* ${milestoneProgress.length * 10} USDT */}
                      ${10} USDT
                    </span>
                  </div>
                </div>
              </Card>

              <Card>
                <h3 className="text-xl font-semibold text-white mb-4">Tips to Earn More</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <Target className="h-4 w-4 text-yellow-400 mt-1" />
                    <p className="text-gray-300">
                      Focus on helping your direct referrals (Level 1) reach higher investments
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <TrendingUp className="h-4 w-4 text-yellow-400 mt-1" />
                    <p className="text-gray-300">
                      Support your team members in building their own networks
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Users className="h-4 w-4 text-yellow-400 mt-1" />
                    <p className="text-gray-300">
                      Share your referral code to grow your Level 1 team
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Gift className="h-4 w-4 text-yellow-400 mt-1" />
                    <p className="text-gray-300">
                      Remember: Rewards repeat for every $10K milestone reached
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rewards;
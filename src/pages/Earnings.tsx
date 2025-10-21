import React, { useEffect, useState } from 'react';
import Card from '../components/UI/Card';
import { TrendingUp, Users, DollarSign, Calendar, Clock, PiggyBank } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format, subDays } from 'date-fns';
import { getEarningsOverview, getRecentEarnings, getROI, getTeamCommissionByLevel, getTeamEarnings } from '../utils/api/earning';
import { EarningsOverview, RecentEarning, ROIDatum, TeamEarningDatum } from '../types';

const Earnings: React.FC = () => {
  const [roi, setROI] = useState<ROIDatum[]>([]);
  const [team, setTeam] = useState<TeamEarningDatum[]>([]);
  const [recent, setRecent] = useState<RecentEarning[]>([]);
  const [teamCommissionByLevelData, setTeamCommissionByLevelData] = useState<TeamEarningDatum[]>([]);
  const [overview, setOverview] = useState<EarningsOverview>({
    totalROI: 0,
    totalTeamEarnings: 0,
    todaysEarnings: 0,
    monthlyAverage: 0,
    dailyROI: 0,
    investment: 0,
    type: 'daily'
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const [roiData, teamData, recentData, overviewData,teamCommissionByLevel] = await Promise.all([
          getROI(),
          getTeamEarnings(),
          getRecentEarnings(),
          getEarningsOverview(),
          getTeamCommissionByLevel()
        ]);
        setTeamCommissionByLevelData(teamCommissionByLevel);
        setROI(roiData);
        setTeam(teamData);
        setRecent(recentData);
        setOverview(overviewData);
      } catch (err) {
        console.error("Earnings fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  const getEarningIcon = (type: string) => (
    type === 'daily' ? (
      <div className="p-2 bg-green-500/20 rounded-lg">
        <PiggyBank className="h-4 w-4 text-green-400" />
      </div>
    ) : (
      <div className="p-2 bg-blue-500/20 rounded-lg">
        <Users className="h-4 w-4 text-blue-400" />
      </div>
    )
  );

  const StatCard: React.FC<{
    title: string;
    value: string;
    icon: React.ReactNode;
    change?: string;
    changeType?: 'positive' | 'negative';
  }> = ({ title, value, icon, change, changeType }) => (
    <Card hover>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 flex items-center ${changeType === 'positive' ? 'text-green-400' : 'text-red-400'}`}>
              <TrendingUp className="h-3 w-3 mr-1" />
              {change}
            </p>
          )}
        </div>
        <div className="p-3 bg-yellow-500 bg-opacity-20 rounded-lg">
          {icon}
        </div>
      </div>
    </Card>
  );

  if (loading) return <div className="text-white text-center mt-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Earnings Overview</h1>
          <p className="text-gray-400 mt-2">Track your ROI and team commission earnings</p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total ROI Earnings"
            value={`$${overview?.totalROI}`}
            icon={<PiggyBank className="h-6 w-6 text-yellow-500" />}
            // change={overview?.roiChange || "+0.5% daily"}
            change={ "+0.5% daily"}
            changeType="positive"
          />
          <StatCard
            title="Team Earnings"
            value={`$${overview?.totalTeamEarnings}`}
            icon={<Users className="h-6 w-6 text-yellow-500" />}
            // change={ "+15.3%"}
            // change={overview?.teamChange || "+15.3%"}
            changeType="positive"
          />
          <StatCard
            title="Today's Earnings"
            value={`$${overview?.todaysEarnings}`}
            icon={<Calendar className="h-6 w-6 text-yellow-500" />}
          />
          {/* <StatCard
            title="Monthly Average"
            value={`$${overview?.monthlyAverage}`}
            icon={<TrendingUp className="h-6 w-6 text-yellow-500" />}
            change="+8.2%"
            changeType="positive"
          /> */}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Daily ROI Chart */}
          <Card className="col-span-1">
            <h3 className="text-xl font-semibold text-white mb-4">Daily ROI Progress (30 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={roi}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="cumulative" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2 }}
                  name="Cumulative ROI"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Team Earnings Chart */}
          <Card>
            <h3 className="text-xl font-semibold text-white mb-4">Team Commission by Level</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={teamCommissionByLevelData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="level" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }} 
                />
                <Bar dataKey="amount" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Recent Earnings */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <h3 className="text-xl font-semibold text-white mb-4">Recent Earnings</h3>
              <div className="space-y-4">
                {recent.map((earning:any) => (
                  <div key={earning.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                    <div className="flex items-center space-x-3">
                      {getEarningIcon(earning.type)}
                      <div>
                        <p className="text-white font-medium">{earning.description}</p>
                        <p className="text-gray-400 text-sm">{format(new Date(earning.date), 'MMM dd, yyyy HH:mm')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-bold">+${earning.amount}</p>
                      <p className="text-gray-400 text-sm">{earning.type === 'daily' ? 'ROI' : 'Team Commission'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* ROI & Commission Details */}
          <div className="space-y-6">
            {/* ROI Details */}
            <Card>
              <h3 className="text-xl font-semibold text-white mb-4">ROI Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                  <span className="text-gray-400">Investment Amount</span>
                  <span className="text-white font-semibold">${overview?.investment}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                  <span className="text-gray-400">Daily Rate</span>
                  <span className="text-green-400 font-semibold">{'0.5%'}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                  <span className="text-gray-400">Daily ROI</span>
                  <span className="text-green-400 font-semibold">${overview?.dailyROI || 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                  <span className="text-gray-400">Total ROI</span>
                  <span className="text-green-400 font-semibold">${overview?.totalROI}</span>
                </div>
              </div>
            </Card>

            {/* Commission Structure */}
            <Card>
              <h3 className="text-xl font-semibold text-white mb-4">Commission Structure</h3>
              <div className="space-y-2">
                {team.map((level, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-700 rounded-lg">
                    <div>
                      <span className="text-white text-sm font-medium">{level.level}</span>
                      <p className="text-gray-400 text-xs">{level.members} members</p>
                    </div>
                    <div className="text-right">
                      <span className="text-yellow-400 font-semibold">{level.percentage}%</span>
                      {/* <p className="text-green-400 text-sm">${level.amount}</p> */}
                      <p className="text-green-400 text-sm">${level.earningsFromLevel}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Next Payout */}
            <Card>
              <h3 className="text-xl font-semibold text-white mb-4">Next Payout</h3>
              <div className="text-center">
                <Clock className="h-12 w-12 text-yellow-400 mx-auto mb-3" />
                <p className="text-gray-400 mb-2">Daily ROI Payment</p>
                <p className="text-2xl font-bold text-yellow-400">${overview?.dailyROI?.toFixed(2) || 0}</p>
                <p className="text-gray-400 text-sm mt-2">
                  Next payment in {24 - new Date().getHours()} hours
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Earnings;
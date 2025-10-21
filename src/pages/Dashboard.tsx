import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import {
  DollarSign,
  TrendingUp,
  Users,
  UserPlus,
  Wallet,
  ArrowUpRight,
  PiggyBank,
  Gift
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DashboardData } from '../types';
import { getactivityForDashboard, getDashboard } from '../utils/api/user';
import { RobotIcon } from '../components/icons/RobotIcon';

// Mock data for charts
const roiData = [
  { calculationDate: 'Day 1', amount: 0 },
  { calculationDate: 'Day 2', amount: 0 },
  { calculationDate: 'Day 3', amount: 0 },
  { calculationDate: 'Day 4', amount: 0 },
  { calculationDate: 'Day 5', amount: 0 },
  { calculationDate: 'Day 6', amount: 0 },
  { calculationDate: 'Day 7', amount: 0 },
];

interface IActivityData {
  teamInvestment?: number;
  newMembers?: number;
  totalTeamEarnings?: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalInvestment: 0,
    dailyROI: 0,
    totalROI: 0,
    todayTeamInvestment: 0,
    todayNewMembers: 0,
    teamEarnings: 0,
    totalTeamSize: 0,
    totalTeamInvestments: 0,
    totalTeamEarnings: 0,
    todayEarning: 0,
    recentROI: roiData,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      try {
        const data = await getDashboard();
        if (active) setDashboardData(data);
      } catch (err: any) {
        if (active) setError(err.response?.data?.message || "Failed to load dashboard");
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchData();
    return () => {
      active = false;
    };
  }, []);


  const StatCard: React.FC<{
    title: string;
    value: string;
    icon: React.ReactNode;
    change?: string;
    changeType?: 'positive' | 'negative';
    onClick?: () => void;
    path?: string;
  }> = ({ title, value, icon, change, changeType, onClick, path }) => (
    <Card hover className="relative overflow-hidden">
      <Link to={path} className="text-gray-300 hover:text-yellow-400 transition-colors">

        <div className="flex items-center justify-between" onClick={onClick}>
          <div className="p-3 bg-yellow-500 bg-opacity-20 rounded-lg">
            {icon}
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl margin-left:27px">
              {title}
            </h1>
          </div>
        </div>

      </Link>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Welcome Back, {user?.name
            ? user.name.charAt(0).toUpperCase() + user.name.slice(1)
            : ""}</h1>
          <p className="text-gray-400 mt-2">Here's your investment overview</p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="AI Voice Generator"
            value={`$${dashboardData?.totalInvestment}`}
            icon={<RobotIcon className="w-10 h-10 text-cyan-400" />}
            onClick={() => {
              console.log(">>>>>>>>");
            }}
            path='/voice-genrator'
          />

        </div>


      </div>
    </div>
  );
};

export default Dashboard;
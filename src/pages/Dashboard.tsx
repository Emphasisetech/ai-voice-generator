import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/UI/Card';
import { RobotIcon } from '../components/icons/RobotIcon';
import toast from "react-hot-toast";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCardClick = (path?: string, isActive?: boolean) => {
    if (isActive && path) {
      navigate(path);
    } else {
      toast("🚧 Coming Soon!", {
        icon: "⏳",
        style: {
          borderRadius: "8px",
          background: "#1e293b",
          color: "#facc15",
          fontWeight: 500,
        },
      });
    }
  };

  const FeatureCard: React.FC<{
    title: string;
    description: string;
    icon: React.ReactNode;
    path?: string;
    isActive?: boolean;
  }> = ({ title, description, icon, path, isActive = false }) => (
    <div
      onClick={() => handleCardClick(path, isActive)}
      className={`cursor-pointer group block rounded-2xl bg-[#0f172a]/60 border border-gray-700/50 
                 hover:border-yellow-400/60 hover:shadow-[0_4px_20px_rgba(250,204,21,0.15)]
                 transition-all duration-300 ease-out p-6 backdrop-blur-md
                 ${!isActive ? "opacity-70 hover:opacity-90" : ""}`}
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-cyan-500/10 rounded-xl group-hover:bg-cyan-500/20 transition">
          {icon}
        </div>
        <div>
          <h3
            className={`text-xl font-semibold ${
              isActive
                ? "text-white group-hover:text-yellow-400"
                : "text-gray-400 group-hover:text-yellow-400"
            } transition`}
          >
            {title}
          </h3>
          <p className="text-gray-400 text-sm mt-1">{description}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0f1f] via-[#111827] to-[#0f172a] p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Hello,{" "}
              <span className="text-yellow-400">
                {user?.name
                  ? user.name.charAt(0).toUpperCase() + user.name.slice(1)
                  : "User"}
              </span>
            </h1>
            <p className="text-gray-400 mt-1">
              Welcome back — manage your AI tools and productivity suite
            </p>
          </div>

          <div className="mt-4 sm:mt-0">
            <button
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 font-semibold 
                         px-5 py-2.5 rounded-lg shadow hover:shadow-lg hover:from-yellow-500 hover:to-yellow-700 
                         transition-all duration-200"
            >
              Upgrade Plan
            </button>
          </div>
        </header>

        {/* Cards Section */}
        <section>
          <h2 className="text-xl font-semibold text-gray-300 mb-6">
            My Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <FeatureCard
              title="AI Voice Generator"
              description="Create lifelike AI voices in seconds with multiple languages."
              icon={<RobotIcon className="w-8 h-8 text-cyan-400" />}
              path="/voice-genrator"
              isActive={true}
            />
            <FeatureCard
              title="Image Generator"
              description="Generate high-quality images from text prompts instantly."
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-cyan-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              }
              isActive={false}
              path="/image-generator"
            />
            <FeatureCard
              title="Video Tools"
              description="AI-powered tools for video editing, face swap, and more."
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-cyan-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 10l4.553 2.276A1 1 0 0120 13.17V17a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h14a1 1 0 011 1v3.83a1 1 0 01-.447.894L15 13v-3z"
                  />
                </svg>
              }
              isActive={false}
            />
            <FeatureCard
              title="Analytics"
              description="Track usage, performance, and user engagement metrics."
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-cyan-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 19V5m8 14V9m8 10V3"
                  />
                </svg>
              }
              isActive={false}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { RobotIcon } from '../components/icons/RobotIcon';
import FeatureCard from '../commonComponents/ToolsCards';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const tools = [
    {
      title: "AI Voice Generator",
      description: "Create lifelike AI voices in seconds with multiple languages.",
      icon: <RobotIcon className="w-8 h-8 text-cyan-400" />,
      path: "/voice-genrator",
      isActive: true,
    },
    {
      title: "Image Generator",
      description: "Generate high-quality images from text prompts instantly.",
      icon: (
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
      ),
      path: "/image-generator",
      isActive: false,
    },
    {
      title: "Video Tools",
      description: "AI-powered tools for video editing, face swap, and more.",
      icon: (
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
      ),
      isActive: false,
    },
    {
      title: "Analytics",
      description: "Track usage, performance, and user engagement metrics.",
      icon: (
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
      ),
      isActive: false,
    },
  ];
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
            {tools.map((tool) => (
              <FeatureCard
                key={tool.title}
                title={tool.title}
                description={tool.description}
                icon={tool.icon}
                path={tool.path}
                isActive={tool.isActive}
              />))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;

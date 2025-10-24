

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from "react-hot-toast";

const FeatureCard: React.FC<{
    title: string;
    description: string;
    icon: React.ReactNode;
    path?: string;
    isActive?: boolean;
}> = ({ title, description, icon, path, isActive = false }) => {
    
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

    return (
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
                        className={`text-xl font-semibold ${isActive
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
    )
}

export default FeatureCard;
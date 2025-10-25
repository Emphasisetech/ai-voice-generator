import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
              <span className="text-gray-900 font-bold text-sm">AT</span>
            </div>
            <span className="text-white font-bold text-xl">AI Tools</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/dashboard" className="text-gray-300 hover:text-yellow-400 transition-colors">
              Dashboard
            </Link>
            {/* <Link to="/team" className="text-gray-300 hover:text-yellow-400 transition-colors">
              Team
            </Link>
            <Link to="/earnings" className="text-gray-300 hover:text-yellow-400 transition-colors">
              Earnings
            </Link>
            <Link to="/rewards" className="text-gray-300 hover:text-yellow-400 transition-colors">
              Rewards
            </Link>
            {user?.isAdmin && (
              <Link to="/admin" className="text-blue-400 hover:text-blue-300 transition-colors">
                Admin
              </Link>
            )} */}
          </nav>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/profile" 
              className="flex items-center space-x-2 text-gray-300 hover:text-yellow-400 transition-colors"
            >
              <User className="h-5 w-5" />
              <span>{user?.name}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-gray-300 hover:text-white"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/dashboard" 
                className="text-gray-300 hover:text-yellow-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              {/* <Link 
                to="/team" 
                className="text-gray-300 hover:text-yellow-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Team
              </Link>
              <Link 
                to="/earnings" 
                className="text-gray-300 hover:text-yellow-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Earnings
              </Link>
              <Link 
                to="/rewards" 
                className="text-gray-300 hover:text-yellow-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Rewards
              </Link>
              {user?.isAdmin && (
                <Link 
                  to="/admin" 
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin
                </Link>
              )} */}
              <Link 
                to="/profile" 
                className="text-gray-300 hover:text-yellow-400 transition-colors flex items-center space-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="h-5 w-5" />
                <span>Profile</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-left text-gray-400 hover:text-red-400 transition-colors flex items-center space-x-2"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
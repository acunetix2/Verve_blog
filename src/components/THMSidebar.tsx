import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Target,
  Trophy,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  Flame,
  Zap,
  Award,
  TrendingUp,
  Home,
} from 'lucide-react';
import { toast } from 'sonner';

interface THMSidebarProps {
  userLevel?: number;
  userStreak?: number;
  userPoints?: number;
}

const THMSidebar: React.FC<THMSidebarProps> = ({
  userLevel = 1,
  userStreak = 0,
  userPoints = 0,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Rooms', path: '/rooms', icon: BookOpen },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { name: 'Badges', path: '/badges', icon: Award },
    { name: 'Community', path: '/community', icon: Users },
    { name: 'Forum', path: '/forum', icon: MessageSquare },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsMobile(!isMobile)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 hover:bg-gray-800 rounded"
      >
        {isMobile ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:relative top-0 left-0 h-screen bg-[#1A1A1A] border-r border-gray-800 w-64 flex flex-col z-40 transition-transform md:translate-x-0 ${
          isMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-800">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">VerveHub</span>
          </Link>
        </div>

        {/* User Stats */}
        <div className="p-6 border-b border-gray-800 space-y-4">
          <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-orange-100">Level</span>
              <span className="text-2xl font-bold">{userLevel}</span>
            </div>
            <div className="text-xs text-orange-100">{userPoints} points</div>
          </div>

          <div className="flex items-center space-x-3 text-sm text-gray-300">
            <Flame className="w-4 h-4 text-red-500 flex-shrink-0" />
            <div>
              <div className="font-semibold">{userStreak} day streak</div>
              <div className="text-xs text-gray-500">Keep it going!</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobile(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  active
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-gray-800 space-y-2">
          <Link
            to="/settings"
            onClick={() => setIsMobile(false)}
            className="flex items-center space-x-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            <span>Settings</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500 hover:bg-opacity-10 rounded-lg transition-all"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsMobile(false)}
        ></div>
      )}
    </>
  );
};

export default THMSidebar;
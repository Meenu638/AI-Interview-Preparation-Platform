import { NavLink } from 'react-router-dom';
import {
  FiHome,
  FiPlusCircle,
  FiClock,
  FiBarChart2,
  FiAward,
  FiBookmark,
  FiUser,
  FiSettings,
  FiShield,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: FiHome },
  { to: '/interview/new', label: 'New Interview', icon: FiPlusCircle },
  { to: '/history', label: 'History', icon: FiClock },
  { to: '/analytics', label: 'Analytics', icon: FiBarChart2 },
  { to: '/achievements', label: 'Achievements', icon: FiAward },
  { to: '/bookmarks', label: 'Bookmarks', icon: FiBookmark },
  { to: '/profile', label: 'Profile', icon: FiUser },
  { to: '/settings', label: 'Settings', icon: FiSettings },
];

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-surface-light border-r border-surface-border px-4 py-6">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center font-display font-bold text-lg">
          AI
        </div>
        <span className="font-display font-bold text-lg">InterviewPrep</span>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive ? 'bg-primary-600/20 text-primary-400' : 'text-gray-400 hover:bg-surface-border hover:text-white'
              }`
            }
          >
            <Icon className="text-lg" />
            {label}
          </NavLink>
        ))}

        {user?.role === 'admin' && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive ? 'bg-primary-600/20 text-primary-400' : 'text-gray-400 hover:bg-surface-border hover:text-white'
              }`
            }
          >
            <FiShield className="text-lg" />
            Admin Panel
          </NavLink>
        )}
      </nav>

      <div className="glass-card !p-4 mt-4">
        <p className="text-xs text-gray-400 mb-1">Current Streak</p>
        <p className="text-2xl font-display font-bold text-accent-amber">{user?.streak?.current || 0} days 🔥</p>
      </div>
    </aside>
  );
};

export default Sidebar;

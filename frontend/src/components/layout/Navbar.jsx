import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiBell, FiSun, FiMoon, FiChevronDown, FiLogOut, FiUser, FiClock, FiBarChart2, FiSettings } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import Avatar from '../ui/Avatar';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 h-16 flex items-center justify-between px-6 bg-surface/80 backdrop-blur-md border-b border-surface-border">
      <div className="relative w-full max-w-md">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Search interviews, topics..."
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface-light border border-surface-border text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="flex items-center gap-3">
        <button onClick={toggleTheme} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-light text-gray-300 transition-colors">
          {darkMode ? <FiSun /> : <FiMoon />}
        </button>

        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((prev) => !prev)}
            className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-light text-gray-300 transition-colors"
          >
            <FiBell />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 rounded-full text-[10px] flex items-center justify-center font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 glass-card !p-0 overflow-hidden animate-fade-in">
              <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border">
                <span className="font-semibold text-sm">Notifications</span>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs text-primary-400 hover:text-primary-300">
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-6">No notifications yet</p>
                ) : (
                  notifications.map((n) => (
                    <button
                      key={n._id}
                      onClick={() => markRead(n._id)}
                      className={`w-full text-left px-4 py-3 border-b border-surface-border/50 hover:bg-surface-light transition-colors ${
                        !n.isRead ? 'bg-primary-500/5' : ''
                      }`}
                    >
                      <p className="text-sm font-medium text-white">{n.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{n.message}</p>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setDropdownOpen((prev) => !prev)} className="flex items-center gap-2">
            <Avatar user={user} size="sm" />
            <FiChevronDown className={`text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 glass-card !p-2 animate-fade-in">
              <Link to="/profile" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-light text-sm text-gray-200">
                <FiUser /> My Profile
              </Link>
              <Link to="/history" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-light text-sm text-gray-200">
                <FiClock /> Interview History
              </Link>
              <Link to="/analytics" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-light text-sm text-gray-200">
                <FiBarChart2 /> Analytics
              </Link>
              <Link to="/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-light text-sm text-gray-200">
                <FiSettings /> Settings
              </Link>
              <hr className="border-surface-border my-1" />
              <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-rose-500/10 text-sm text-rose-400 w-full">
                <FiLogOut /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

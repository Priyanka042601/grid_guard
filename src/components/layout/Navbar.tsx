import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Zap,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  Bell,
  Shield,
  Layers,
  CheckCircle,
  AlertTriangle,
  Menu,
  X,
  Gauge,
  Activity,
  BarChart3,
  Sliders,
  Users,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    switchRole,
    notifications,
    markNotificationAsRead,
    activeSession,
    activeReservation,
  } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const evUserLinks = [
    { name: 'Dashboard', path: '/user/dashboard', icon: Gauge },
    { name: 'Map', path: '/user/map', icon: MapPin },
    { name: 'Find Chargers', path: '/user/stations', icon: Zap },
    { name: 'Smart Charging', path: '/user/smart-charging', icon: Sparkles },
    { name: 'Reservations', path: '/user/reservations', icon: Calendar },
    { name: 'Queue', path: '/user/queue', icon: Clock },
  ];

  const ownerLinks = [
    { name: 'Dashboard', path: '/owner/dashboard', icon: Gauge },
    { name: 'Charger Fleet', path: '/owner/chargers', icon: Zap },
    { name: 'Reservations', path: '/owner/reservations', icon: Calendar },
    { name: 'Live Sessions', path: '/owner/live-sessions', icon: Activity },
    { name: 'Queue', path: '/owner/queue', icon: Clock },
    { name: 'Analytics', path: '/owner/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/owner/settings', icon: Sliders },
  ];

  const adminLinks = [
    { name: 'Admin Dashboard', path: '/admin/dashboard', icon: Gauge },
    { name: 'Station Network', path: '/admin/stations', icon: Layers },
    { name: 'Conflicts & Rules', path: '/admin/conflicts', icon: Shield },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Platform Reports', path: '/admin/reports', icon: BarChart3 },
    { name: 'Settings', path: '/admin/settings', icon: Sliders },
  ];

  let currentNavLinks = evUserLinks;
  if (currentUser.role === 'station_owner') currentNavLinks = ownerLinks;
  if (currentUser.role === 'admin') currentNavLinks = adminLinks;

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as any;
    switchRole(newRole);
    if (newRole === 'ev_user') navigate('/user/dashboard');
    else if (newRole === 'station_owner') navigate('/owner/dashboard');
    else if (newRole === 'admin') navigate('/admin/dashboard');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      {/* Top Utility Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Chennai Grid Active
          </span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden sm:inline text-slate-400">Currency: ₹ INR • Distance: km • Time: IST</span>
        </div>

        {/* Ecosystem Role Switcher for seamless test drive */}
        <div className="flex items-center gap-2">
          <label htmlFor="role-select" className="text-slate-400 hidden sm:inline">
            Active Role:
          </label>
          <div className="relative">
            <select
              id="role-select"
              value={currentUser.role}
              onChange={handleRoleChange}
              className="bg-slate-800 text-white font-medium px-2 py-0.5 rounded border border-slate-700 text-xs focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="ev_user">EV User (Karthik)</option>
              <option value="station_owner">Station Owner (GreenVolt)</option>
              <option value="admin">Platform Admin (Chennai)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-emerald-700 flex items-center justify-center text-white shadow-sm">
                <Zap className="w-5 h-5 fill-white text-white" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-slate-900">
                  Charge<span className="text-emerald-700">Smart</span>
                </span>
                <span className="block text-[10px] text-slate-500 -mt-1 tracking-wide uppercase font-semibold">
                  Chennai
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {currentNavLinks.map((link) => {
                const isActive = location.pathname.startsWith(link.path);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md transition ${
                      isActive
                        ? 'bg-slate-100 text-emerald-800'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-700' : 'text-slate-400'}`} />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Utility: Live Battery (if EV user), Active Session badge, Notifications & Profile */}
          <div className="flex items-center gap-3">
            {/* Live session banner pill if charging */}
            {activeSession && activeSession.status === 'charging' && (
              <Link
                to="/user/active-session"
                className="hidden sm:flex items-center gap-2 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs px-3 py-1.5 rounded font-medium hover:bg-emerald-100 transition animate-pulse"
              >
                <Zap className="w-3.5 h-3.5 fill-emerald-700 text-emerald-700" />
                <span>Charging: {activeSession.currentBatteryPercent}%</span>
              </Link>
            )}

            {/* EV User vehicle battery indicator */}
            {currentUser.role === 'ev_user' && currentUser.vehicle && !activeSession && (
              <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1 rounded text-xs">
                <div className="text-right">
                  <span className="block font-semibold text-slate-800 leading-tight">
                    {currentUser.vehicle.batteryPercent}%
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {currentUser.vehicle.estimatedRangeKm} km
                  </span>
                </div>
                <div className="w-5 h-8 border-2 border-slate-400 rounded-sm p-0.5 relative flex flex-col justify-end">
                  <div className="absolute -top-1 left-1.5 w-2 h-0.5 bg-slate-400 rounded-t"></div>
                  <div
                    className={`w-full rounded-xs transition-all ${
                      currentUser.vehicle.batteryPercent > 40
                        ? 'bg-emerald-600'
                        : currentUser.vehicle.batteryPercent > 20
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ height: `${currentUser.vehicle.batteryPercent}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md relative transition"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-rose-600 rounded-full"></span>
                )}
              </button>

              {/* Notifications Popup */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-800">Notifications</span>
                    <span className="text-[11px] text-slate-500">{notifications.length} total</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-xs text-slate-500 text-center">No notifications</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationAsRead(n.id)}
                          className={`p-3 text-xs cursor-pointer hover:bg-slate-50 transition ${
                            !n.read ? 'bg-emerald-50/40' : ''
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {n.type === 'success' ? (
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                            ) : n.type === 'warning' ? (
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                            ) : (
                              <Zap className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                            )}
                            <div>
                              <p className="font-semibold text-slate-800">{n.title}</p>
                              <p className="text-slate-600 mt-0.5">{n.message}</p>
                              <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="px-4 py-2 border-t border-slate-100 text-right">
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-xs text-slate-500 hover:text-slate-800 font-medium"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar & Name */}
            <Link
              to="/user/profile"
              className="flex items-center gap-2 pl-2 border-l border-slate-200 text-slate-700 hover:text-slate-900"
            >
              <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-700">
                {currentUser.name.charAt(0)}
              </div>
              <span className="text-xs font-medium hidden sm:inline">{currentUser.name.split(' ')[0]}</span>
            </Link>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {currentNavLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-medium ${
                  isActive ? 'bg-slate-100 text-emerald-800' : 'text-slate-600'
                }`}
              >
                <Icon className="w-4 h-4 text-slate-400" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-8 text-xs text-slate-500 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-slate-900 font-semibold mb-1">
            <Zap className="w-4 h-4 text-emerald-700 fill-emerald-700" />
            <span>ChargeSmart India — Chennai Pilot</span>
          </div>
          <p className="text-slate-500">
            Smart EV Charging Reservation & Station Management Platform.
          </p>
        </div>

        <div className="flex items-center gap-6 text-slate-600">
          <Link to="/" className="hover:text-slate-900">Home</Link>
          <Link to="/user/map" className="hover:text-slate-900">Chennai Stations</Link>
          <Link to="/owner/dashboard" className="hover:text-slate-900">Station Partner Portal</Link>
          <Link to="/admin/dashboard" className="hover:text-slate-900">Platform Admin</Link>
          <Link to="/login" className="hover:text-slate-900">Sign In</Link>
        </div>

        <div className="text-right text-slate-400">
          <span>₹ INR • 24x7 Support • TANGEDCO Grid Compliant</span>
        </div>
      </div>
    </footer>
  );
};

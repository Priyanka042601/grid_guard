import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Zap, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { UserRole } from '../../types';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { switchRole } = useApp();

  const [email, setEmail] = useState('karthik.s@example.com');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [role, setRole] = useState<UserRole>('ev_user');
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    switchRole(role);
    if (role === 'ev_user') navigate('/user/dashboard');
    else if (role === 'station_owner') navigate('/owner/dashboard');
    else if (role === 'admin') navigate('/admin/dashboard');
  };

  const quickLoginAs = (targetRole: UserRole) => {
    setRole(targetRole);
    switchRole(targetRole);
    if (targetRole === 'ev_user') {
      setEmail('karthik.s@example.com');
      navigate('/user/dashboard');
    } else if (targetRole === 'station_owner') {
      setEmail('owner@greenvolt-chennai.in');
      navigate('/owner/dashboard');
    } else {
      setEmail('admin@gridguard.gov.in');
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg border border-slate-200 shadow-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-10 h-10 rounded bg-emerald-700 mx-auto flex items-center justify-center text-white mb-3">
            <Zap className="w-6 h-6 fill-white text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Sign in to Grid Guard</h2>
          <p className="text-xs text-slate-500 mt-1">
            Access your reservations, active sessions, and station network
          </p>
        </div>

        {/* Quick Demo Switcher */}
        <div className="mb-6 p-3 bg-slate-50 rounded border border-slate-200 text-xs">
          <span className="font-semibold text-slate-700 block mb-2">Quick Demo Access:</span>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => quickLoginAs('ev_user')}
              className="py-1.5 px-2 bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-800 border border-slate-200 rounded text-center font-medium transition"
            >
              EV User
            </button>
            <button
              type="button"
              onClick={() => quickLoginAs('station_owner')}
              className="py-1.5 px-2 bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-800 border border-slate-200 rounded text-center font-medium transition"
            >
              Station Owner
            </button>
            <button
              type="button"
              onClick={() => quickLoginAs('admin')}
              className="py-1.5 px-2 bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-800 border border-slate-200 rounded text-center font-medium transition"
            >
              Admin
            </button>
          </div>
        </div>

        {forgotSent && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800">
            Password reset link sent to {email}. Check your inbox.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Select Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded bg-white text-slate-900 focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600"
            >
              <option value="ev_user">EV User (Driver)</option>
              <option value="station_owner">EV Charging Station Owner</option>
              <option value="admin">Platform Administrator</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded bg-white text-slate-900 focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">Password</label>
              <button
                type="button"
                onClick={() => setForgotSent(true)}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-medium"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded bg-white text-slate-900 focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
            />
            <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-600">
              Remember this device
            </label>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs py-2.5 px-4 rounded shadow-sm transition active:scale-95"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-semibold text-emerald-700 hover:text-emerald-800">
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Zap, Lock, Mail, User as UserIcon, Phone, ArrowRight } from 'lucide-react';
import { UserRole } from '../../types';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentUser, switchRole } = useApp();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('ev_user');
  const [vehicleModel, setVehicleModel] = useState('Tata Nexon EV');
  const [vehiclePlate, setVehiclePlate] = useState('TN 09 BX 7842');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser({
      id: `usr_${Date.now()}`,
      name: fullName || 'Karthik Subramanian',
      email: email || 'driver@chennai.in',
      phone: phone || '+91 98401 23456',
      role,
      vehicle:
        role === 'ev_user'
          ? {
              model: vehicleModel,
              variant: 'XZ+ Lux 40.5 kWh',
              registrationNumber: vehiclePlate,
              batteryPercent: 32,
              batteryCapacityKwh: 40.5,
              estimatedRangeKm: 108,
              maxChargingSpeedKw: 50,
              connectorType: 'CCS2',
            }
          : undefined,
    });

    switchRole(role);
    if (role === 'ev_user') navigate('/user/dashboard');
    else navigate('/owner/dashboard');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg border border-slate-200 shadow-sm">
        <div className="text-center mb-8">
          <div className="w-10 h-10 rounded bg-emerald-700 mx-auto flex items-center justify-center text-white mb-3">
            <Zap className="w-6 h-6 fill-white text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Create your Grid Guard account</h2>
          <p className="text-xs text-slate-500 mt-1">
            Join the Chennai EV charging ecosystem
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Account Role</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('ev_user')}
                className={`py-2 px-3 text-xs font-medium rounded border text-center transition ${
                  role === 'ev_user'
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                EV User / Driver
              </button>
              <button
                type="button"
                onClick={() => setRole('station_owner')}
                className={`py-2 px-3 text-xs font-medium rounded border text-center transition ${
                  role === 'station_owner'
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Station Owner
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <UserIcon className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Karthik Subramanian"
                className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded bg-white text-slate-900 focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded bg-white text-slate-900 focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number (+91)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98401 23456"
                className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded bg-white text-slate-900 focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600"
              />
            </div>
          </div>

          {role === 'ev_user' && (
            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded border border-slate-200">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">EV Model</label>
                <select
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  className="w-full text-xs px-2 py-1.5 border border-slate-300 rounded bg-white"
                >
                  <option value="Tata Nexon EV">Tata Nexon EV</option>
                  <option value="MG ZS EV">MG ZS EV</option>
                  <option value="Mahindra XUV400">Mahindra XUV400</option>
                  <option value="Hyundai Ioniq 5">Hyundai Ioniq 5</option>
                  <option value="BYD Atto 3">BYD Atto 3</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Registration No.</label>
                <input
                  type="text"
                  value={vehiclePlate}
                  onChange={(e) => setVehiclePlate(e.target.value)}
                  placeholder="TN 09 BX 7842"
                  className="w-full text-xs px-2 py-1.5 border border-slate-300 rounded bg-white"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded bg-white text-slate-900 focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-4 flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs py-2.5 px-4 rounded shadow-sm transition active:scale-95"
          >
            <span>Create Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            Already registered?{' '}
            <Link to="/login" className="font-semibold text-emerald-700 hover:text-emerald-800">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

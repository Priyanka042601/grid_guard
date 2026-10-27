import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Car,
  CreditCard,
  Bell,
  Shield,
  Save,
  CheckCircle2,
} from 'lucide-react';

export const UserProfilePage: React.FC = () => {
  const { currentUser, setCurrentUser, updateUserBattery } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [vehicleModel, setVehicleModel] = useState(currentUser.vehicle?.model || 'Tata Nexon EV');
  const [regNo, setRegNo] = useState(currentUser.vehicle?.registrationNumber || 'TN 09 BX 7842');
  const [savedAlert, setSavedAlert] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser((prev) => ({
      ...prev,
      name,
      email,
      phone,
      vehicle: prev.vehicle
        ? {
            ...prev.vehicle,
            model: vehicleModel,
            registrationNumber: regNo,
          }
        : undefined,
    }));
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full font-sans">
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Driver Profile & Settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your personal details, connected EV specifications, and charging preferences.
        </p>
      </div>

      {savedAlert && (
        <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>Profile changes updated successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="mt-6 space-y-6">
        {/* Personal Details */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-700" />
            <span>Personal Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-slate-300 rounded px-3 py-2 bg-white"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-300 rounded px-3 py-2 bg-white"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Mobile (+91)</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-slate-300 rounded px-3 py-2 bg-white"
              />
            </div>
          </div>
        </div>

        {/* EV Vehicle Specifications */}
        {currentUser.vehicle && (
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Car className="w-4 h-4 text-emerald-700" />
              <span>Registered Vehicle</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">EV Model</label>
                <input
                  type="text"
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 bg-white"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Registration Plate</label>
                <input
                  type="text"
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 bg-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Battery Capacity</label>
                <div className="p-2 bg-slate-50 border border-slate-200 rounded font-semibold text-slate-800">
                  {currentUser.vehicle.batteryCapacityKwh} kWh
                </div>
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Connector</label>
                <div className="p-2 bg-slate-50 border border-slate-200 rounded font-semibold text-slate-800">
                  {currentUser.vehicle.connectorType} (DC Fast)
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span>Current Battery Simulation: <strong>{currentUser.vehicle.batteryPercent}% ({currentUser.vehicle.estimatedRangeKm} km)</strong></span>
              <input
                type="range"
                min="5"
                max="100"
                value={currentUser.vehicle.batteryPercent}
                onChange={(e) => updateUserBattery(Number(e.target.value))}
                className="w-48 accent-emerald-700"
              />
            </div>
          </div>
        )}

        {/* Payment Methods */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-700" />
            <span>Grid Guard Wallet & Fastag</span>
          </h2>
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-200 text-xs">
            <div>
              <span className="font-semibold text-slate-900 block">Grid Guard Prepaid Balance</span>
              <span className="text-slate-500">Auto-debit on unplugging</span>
            </div>
            <div className="text-right">
              <span className="text-base font-bold text-emerald-800 block">₹1,250.00</span>
              <button
                type="button"
                className="text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold underline"
              >
                Top up via UPI
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-5 py-2.5 rounded shadow-sm transition flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
};

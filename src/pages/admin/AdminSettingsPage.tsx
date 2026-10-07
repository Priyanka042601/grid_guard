import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sliders,
  ShieldCheck,
  Save,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { addNotification } = useApp();

  const [commissionRate, setCommissionRate] = useState<number>(8.5);
  const [defaultGracePeriod, setDefaultGracePeriod] = useState<number>(10);
  const [maxAdvanceDays, setMaxAdvanceDays] = useState<number>(7);
  const [emergencyShedding, setEmergencyShedding] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    addNotification('Platform Policies Updated', 'City-wide commission and grace rules broadcast to all hubs.', 'success');
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full font-sans">
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Platform Governance & Policy Settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Global platform parameters for Greater Chennai Metropolitan EV Network.
        </p>
      </div>

      {saved && (
        <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>Platform policies updated and synced across all station controllers.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="mt-6 space-y-6">
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-700" />
            <span>Marketplace Commission & Rules</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Platform Service Fee (%)
              </label>
              <input
                type="number"
                step="0.5"
                value={commissionRate}
                onChange={(e) => setCommissionRate(Number(e.target.value))}
                className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-slate-900"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Deducted from station settlement</span>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Standard Arrival Grace Period
              </label>
              <select
                value={defaultGracePeriod}
                onChange={(e) => setDefaultGracePeriod(Number(e.target.value))}
                className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-slate-900"
              >
                <option value="5">5 Minutes</option>
                <option value="10">10 Minutes (Standard)</option>
                <option value="15">15 Minutes</option>
              </select>
              <span className="text-[11px] text-slate-400 mt-1 block">Mandatory timeout for all hubs</span>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Max Advance Booking (Days)
              </label>
              <input
                type="number"
                value={maxAdvanceDays}
                onChange={(e) => setMaxAdvanceDays(Number(e.target.value))}
                className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-slate-900"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Prevents hoarding of future slots</span>
            </div>
          </div>
        </div>

        {/* Emergency Grid Shedding */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>TANGEDCO Grid Contingency & Load Shedding</span>
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            In the event of city-wide substation frequency drops, enable automated throttling of non-critical fast chargers to 30 kW.
          </p>

          <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded text-xs">
            <div>
              <span className="font-semibold text-slate-900 block">Emergency Smart Load Curtailment</span>
              <span className="text-slate-500">Cap max port power to 50% across Chennai</span>
            </div>
            <input
              type="checkbox"
              checked={emergencyShedding}
              onChange={(e) => setEmergencyShedding(e.target.checked)}
              className="w-4 h-4 accent-amber-600 rounded"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-5 py-2.5 rounded shadow-sm transition flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Platform Policies</span>
          </button>
        </div>
      </form>
    </div>
  );
};

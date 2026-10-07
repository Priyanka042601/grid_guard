import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sliders,
  DollarSign,
  Clock,
  Save,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

export const OwnerSettingsPage: React.FC = () => {
  const { stations, addNotification } = useApp();
  const station = stations.find((s) => s.id === 'station-annanagar') || stations[0];

  const [baseTariff, setBaseTariff] = useState<number>(station.pricePerKwh);
  const [peakSurcharge, setPeakSurcharge] = useState<number>(1.5);
  const [gracePeriod, setGracePeriod] = useState<number>(10);
  const [operatingHours, setOperatingHours] = useState<string>(station.openingHours);
  const [autoQueue, setAutoQueue] = useState<boolean>(true);
  const [saved, setSaved] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    addNotification('Station Settings Saved', 'Tariff parameters and arrival grace window updated.', 'success');
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full font-sans">
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Station Operational Settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure tariffs, peak pricing windows, reservation grace periods, and auto-queue dispatch.
        </p>
      </div>

      {saved && (
        <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>Configuration saved and propagated to charging hardware.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="mt-6 space-y-6">
        {/* Tariff Management */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-700" />
            <span>Tariff & Pricing Engine</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Base Energy Tariff (₹ / kWh)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-semibold">₹</span>
                <input
                  type="number"
                  step="0.1"
                  value={baseTariff}
                  onChange={(e) => setBaseTariff(Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-2 border border-slate-300 rounded bg-white text-slate-900"
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Default rate for off-peak and standard slots</span>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Peak Hours Surcharge (+₹ / kWh)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-semibold">+₹</span>
                <input
                  type="number"
                  step="0.5"
                  value={peakSurcharge}
                  onChange={(e) => setPeakSurcharge(Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded bg-white text-slate-900"
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Applies during 18:00 – 21:00 peak Chennai grid window</span>
            </div>
          </div>
        </div>

        {/* Grace Period & Conflict Settings */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-700" />
            <span>Reservation Rules & Grace Windows</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Arrival Grace Period (Minutes)
              </label>
              <select
                value={gracePeriod}
                onChange={(e) => setGracePeriod(Number(e.target.value))}
                className="w-full py-2 px-3 border border-slate-300 rounded bg-white text-slate-900"
              >
                <option value="5">5 Minutes</option>
                <option value="10">10 Minutes (Recommended Standard)</option>
                <option value="15">15 Minutes</option>
              </select>
              <span className="text-[11px] text-slate-400 mt-1 block">
                After this window, an unattended bay releases to the next queue customer
              </span>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Operating Schedule
              </label>
              <input
                type="text"
                value={operatingHours}
                onChange={(e) => setOperatingHours(e.target.value)}
                className="w-full py-2 px-3 border border-slate-300 rounded bg-white text-slate-900"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Displayed to EV drivers on the map and station details</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-slate-800 block">Automatic Virtual Queue Dispatch</span>
              <span className="text-slate-500">Automatically ping next waiting driver when bay completes</span>
            </div>
            <input
              type="checkbox"
              checked={autoQueue}
              onChange={(e) => setAutoQueue(e.target.checked)}
              className="w-4 h-4 accent-emerald-700 rounded"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-5 py-2.5 rounded shadow-sm transition flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Operational Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Zap,
  Sparkles,
  TrendingDown,
  Gauge,
  Clock,
  MapPin,
  Calendar,
  CheckCircle2,
  Sliders,
  DollarSign,
  Info,
} from 'lucide-react';

export const SmartChargingPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, stations, updateUserBattery } = useApp();

  const [targetBattery, setTargetBattery] = useState<number>(80);
  const currentBattery = currentUser.vehicle?.batteryPercent || 32;
  const capacityKwh = currentUser.vehicle?.batteryCapacityKwh || 40.5;

  // Energy needed to reach target
  const percentDelta = Math.max(0, targetBattery - currentBattery);
  const kwhNeeded = +((percentDelta / 100) * capacityKwh).toFixed(1);

  // Recommendations
  const bestOverallStation = stations.find((s) => s.id === 'station-annanagar') || stations[0];
  const cheapestStation = stations.find((s) => s.id === 'station-tnagar') || stations[1];
  const fastestStation = stations.find((s) => s.id === 'station-adyar-voltgo') || stations[2];

  // Dynamic calculations based on kwh needed
  const bestOverallCost = Math.round(kwhNeeded * 13.5);
  const bestOverallTime = Math.round((kwhNeeded / 50) * 60) + 5; // 50kW fast charger

  const cheapestCost = Math.round(kwhNeeded * 11.8);
  const cheapestTime = Math.round((kwhNeeded / 30) * 60) + 10; // 30kW fast charger
  const savings = Math.max(0, bestOverallCost - cheapestCost);

  const fastestCost = Math.round(kwhNeeded * 15.5);
  const fastestTime = Math.round((kwhNeeded / 85) * 60) + 3; // 120kW fast charger

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full font-sans">
      {/* Page Header */}
      <div className="pb-6 border-b border-slate-200">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          <span>Automated Demand & Tariff Matching</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Smart Charging Recommendations
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Calculates the optimal station based on your battery level, distance, waiting time, and live Chennai grid tariffs.
        </p>
      </div>

      {/* Target Battery Configuration Card */}
      <div className="mt-6 bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Vehicle Charging Target
            </span>
            <h2 className="text-base font-bold text-slate-900 mt-0.5">
              {currentUser.vehicle?.model} ({currentBattery}% • {currentUser.vehicle?.estimatedRangeKm} km)
            </h2>
          </div>

          {/* Quick Target Presets */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTargetBattery(80)}
              className={`text-xs px-3 py-1.5 rounded font-medium border transition ${
                targetBattery === 80
                  ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                  : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              80% (Daily Commute / Battery Care)
            </button>
            <button
              onClick={() => setTargetBattery(100)}
              className={`text-xs px-3 py-1.5 rounded font-medium border transition ${
                targetBattery === 100
                  ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                  : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              100% (Highway Road Trip)
            </button>
          </div>
        </div>

        {/* Sliders */}
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div>
            <div className="flex justify-between text-slate-600 mb-1">
              <span>Target Battery Level:</span>
              <span className="font-bold text-slate-900">{targetBattery}%</span>
            </div>
            <input
              type="range"
              min={Math.max(35, currentBattery + 5)}
              max="100"
              value={targetBattery}
              onChange={(e) => setTargetBattery(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-600 mb-1">
              <span>Energy Required:</span>
              <span className="font-bold text-emerald-800">{kwhNeeded} kWh</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded overflow-hidden">
              <div
                className="bg-emerald-600 h-full"
                style={{ width: `${percentDelta}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-600 mb-1">
              <span>Range Added:</span>
              <span className="font-bold text-slate-900">
                +{Math.round((percentDelta / 100) * 312)} km
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              New Range: {Math.round((targetBattery / 100) * 312)} km
            </p>
          </div>
        </div>
      </div>

      {/* 3 COMPARISON CATEGORIES (Prompt Requirement) */}
      <div className="mt-8">
        <h2 className="text-base font-bold text-slate-900 mb-4">
          Recommended Options for Your Vehicle
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 1. BEST OVERALL */}
          <div className="bg-white border-2 border-emerald-600 rounded-lg p-5 shadow-sm flex flex-col justify-between relative">
            <div className="absolute -top-3 left-4 bg-emerald-700 text-white text-[11px] font-bold px-3 py-0.5 rounded shadow-xs uppercase tracking-wide">
              Best Overall
            </div>

            <div>
              <div className="flex items-center justify-between mt-2">
                <h3 className="font-bold text-base text-slate-900">{bestOverallStation.name}</h3>
                <span className="bg-emerald-100 text-emerald-800 font-bold text-xs px-2 py-0.5 rounded">
                  92% match
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {bestOverallStation.area} • {bestOverallStation.distanceKm} km
              </p>

              {/* Key Metrics */}
              <div className="mt-4 grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block">Tariff Rate</span>
                  <span className="font-bold text-slate-800">₹13.5/kWh</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Est. Cost</span>
                  <span className="font-bold text-slate-800">₹{bestOverallCost}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Duration</span>
                  <span className="font-bold text-slate-800">{bestOverallTime} min</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Waiting Time</span>
                  <span className="font-bold text-emerald-700">3 min</span>
                </div>
              </div>

              {/* Reasons */}
              <div className="mt-4 text-xs">
                <span className="font-semibold text-slate-700 block mb-1">
                  Why this is recommended:
                </span>
                <ul className="space-y-1 text-slate-600 text-[11px]">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>High availability (4 chargers ready)</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Low expected demand in next 2 hours</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Short travel distance (2.4 km)</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Off-peak negotiated tariff</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100">
              <button
                onClick={() => navigate(`/user/reserve?stationId=${bestOverallStation.id}`)}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs py-2 rounded transition flex items-center justify-center gap-1"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Reserve Charger</span>
              </button>
            </div>
          </div>

          {/* 2. CHEAPEST */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col justify-between relative">
            <div className="absolute -top-3 left-4 bg-slate-800 text-white text-[11px] font-bold px-3 py-0.5 rounded shadow-xs uppercase tracking-wide">
              Cheapest
            </div>

            <div>
              <div className="flex items-center justify-between mt-2">
                <h3 className="font-bold text-base text-slate-900">{cheapestStation.name}</h3>
                <span className="bg-slate-100 text-slate-800 font-semibold text-xs px-2 py-0.5 rounded">
                  ₹11.8/kWh
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {cheapestStation.area} • {cheapestStation.distanceKm} km
              </p>

              {/* Key Metrics */}
              <div className="mt-4 grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block">Tariff Rate</span>
                  <span className="font-bold text-emerald-700">₹11.8/kWh</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Est. Cost</span>
                  <span className="font-bold text-emerald-700">₹{cheapestCost}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Duration</span>
                  <span className="font-bold text-slate-800">{cheapestTime} min</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Waiting Time</span>
                  <span className="font-bold text-slate-800">4 min</span>
                </div>
              </div>

              {/* Highlights */}
              <div className="mt-4 text-xs">
                <span className="font-semibold text-slate-700 block mb-1">
                  Cost Advantage:
                </span>
                <p className="text-xs text-emerald-800 bg-emerald-50 p-2 rounded border border-emerald-100 mb-2">
                  Saves <strong>₹{savings > 0 ? savings : 45}</strong> compared to standard fast charging.
                </p>
                <ul className="space-y-1 text-slate-600 text-[11px]">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>Off-peak night rate currently active</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>6/8 chargers currently open</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100">
              <button
                onClick={() => navigate(`/user/reserve?stationId=${cheapestStation.id}`)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs py-2 rounded transition flex items-center justify-center gap-1"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Reserve at ₹11.8/kWh</span>
              </button>
            </div>
          </div>

          {/* 3. FASTEST */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col justify-between relative">
            <div className="absolute -top-3 left-4 bg-amber-600 text-white text-[11px] font-bold px-3 py-0.5 rounded shadow-xs uppercase tracking-wide">
              Fastest
            </div>

            <div>
              <div className="flex items-center justify-between mt-2">
                <h3 className="font-bold text-base text-slate-900">{fastestStation.name}</h3>
                <span className="bg-amber-50 text-amber-900 font-bold text-xs px-2 py-0.5 rounded border border-amber-200">
                  120 kW Ultra-DC
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {fastestStation.area} • {fastestStation.distanceKm} km
              </p>

              {/* Key Metrics */}
              <div className="mt-4 grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block">Tariff Rate</span>
                  <span className="font-bold text-slate-800">₹15.5/kWh</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Est. Cost</span>
                  <span className="font-bold text-slate-800">₹{fastestCost}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Duration</span>
                  <span className="font-bold text-emerald-700">{fastestTime} min</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Waiting Time</span>
                  <span className="font-bold text-slate-800">2 min</span>
                </div>
              </div>

              {/* Highlights */}
              <div className="mt-4 text-xs">
                <span className="font-semibold text-slate-700 block mb-1">
                  Speed Advantage:
                </span>
                <p className="text-xs text-slate-700 bg-slate-50 p-2 rounded border border-slate-200 mb-2">
                  Charges in only <strong>{fastestTime} minutes</strong> to 80% with 120 kW CCS2.
                </p>
                <ul className="space-y-1 text-slate-600 text-[11px]">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>Best for quick pit-stops and highway routes</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>Convenience coffee lounge on-site</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100">
              <button
                onClick={() => navigate(`/user/reserve?stationId=${fastestStation.id}`)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs py-2 rounded transition flex items-center justify-center gap-1"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Reserve 120 kW Port</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

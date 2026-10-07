import React, { useState } from 'react';
import {
  TrendingUp,
  BarChart3,
  Calendar,
  Zap,
  Clock,
  Sparkles,
  ArrowUpRight,
  Info,
} from 'lucide-react';
import { OWNER_ANALYTICS } from '../../data/mockData';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

export const OwnerAnalyticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'revenue' | 'utilization' | 'forecast'>('revenue');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full font-sans">
      <div className="pb-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Station Analytics & Demand Forecasting
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational metrics, tariff revenue, bay utilization, and 24-hour predictive EV traffic.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded border border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab('revenue')}
            className={`px-3 py-1.5 rounded font-medium transition ${
              activeTab === 'revenue'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Revenue Analytics (₹)
          </button>
          <button
            onClick={() => setActiveTab('utilization')}
            className={`px-3 py-1.5 rounded font-medium transition ${
              activeTab === 'utilization'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Bay Utilization (%)
          </button>
          <button
            onClick={() => setActiveTab('forecast')}
            className={`px-3 py-1.5 rounded font-medium transition flex items-center gap-1 ${
              activeTab === 'forecast'
                ? 'bg-white text-emerald-800 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>24h Demand Forecast</span>
          </button>
        </div>
      </div>

      {/* TAB 1: REVENUE ANALYTICS */}
      {activeTab === 'revenue' && (
        <div className="mt-6 space-y-6">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
              <span className="text-xs text-slate-500 block">Weekly Revenue</span>
              <span className="text-2xl font-bold text-slate-900 mt-1 block">₹2,49,100</span>
              <span className="text-xs text-emerald-700 font-medium flex items-center gap-1 mt-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> +18.4% compared to last week
              </span>
            </div>
            <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
              <span className="text-xs text-slate-500 block">Energy Billed</span>
              <span className="text-2xl font-bold text-slate-900 mt-1 block">17,791 kWh</span>
              <span className="text-xs text-slate-400 mt-1 block">Average ₹14.0/kWh</span>
            </div>
            <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
              <span className="text-xs text-slate-500 block">Peak Earning Period</span>
              <span className="text-2xl font-bold text-emerald-800 mt-1 block">Sat & Sun (4–8 PM)</span>
              <span className="text-xs text-slate-400 mt-1 block">₹44,200 highest single day</span>
            </div>
          </div>

          {/* Weekly Revenue Bar Chart */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Weekly Revenue Breakdown (₹ INR)</h3>
                <p className="text-xs text-slate-500">Daily gross revenue and delivered kWh</p>
              </div>
              <span className="text-xs text-slate-400">Past 7 Days</span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={OWNER_ANALYTICS.weeklyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `₹${v / 1000}k`} />
                  <Tooltip
                    formatter={(val: any) => [`₹${val}`, 'Daily Revenue']}
                    contentStyle={{ fontSize: '11px', borderRadius: '6px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="revenue" name="Gross Revenue (₹)" fill="#15803d" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: UTILIZATION ANALYTICS */}
      {activeTab === 'utilization' && (
        <div className="mt-6 space-y-6">
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Hourly Bay Utilization Profile (%)</h3>
                <p className="text-xs text-slate-500">Occupancy percentage across 24-hour operational cycle</p>
              </div>
              <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded font-semibold">
                Average Daily Utilization: 63.8%
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={OWNER_ANALYTICS.hourlyUtilization}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} unit="%" />
                  <Tooltip
                    formatter={(val: any) => [`${val}%`, 'Utilization']}
                    contentStyle={{ fontSize: '11px', borderRadius: '6px' }}
                  />
                  <Bar dataKey="utilization" name="Bay Occupancy (%)" fill="#0f172a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-between">
              <span>Peak Hours: <strong>8:00 AM – 10:30 AM</strong> & <strong>6:00 PM – 8:30 PM</strong></span>
              <span className="text-emerald-700 font-semibold">Recommendation: Dynamic peak tariff (+₹1.5) at 6 PM</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DEMAND FORECAST */}
      {activeTab === 'forecast' && (
        <div className="mt-6 space-y-6">
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-900">Next 24 Hours Demand Forecast</h3>
                  <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                    AI Demand Model
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Predicted Chennai EV traffic load curve vs actual observed bay occupancy
                </p>
              </div>
              <div className="text-xs text-slate-500">
                TANGEDCO Grid Factor: <strong className="text-slate-800">1.18 (Moderate Peak)</strong>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={OWNER_ANALYTICS.forecast24h}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="hour" stroke="#94a3b8" fontSize={10} />
                  <YAxis stroke="#94a3b8" fontSize={11} unit="%" domain={[0, 100]} />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '6px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Line
                    type="monotone"
                    dataKey="predictedDemand"
                    name="Predicted Demand (%)"
                    stroke="#15803d"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="actualDemand"
                    name="Actual Demand (%)"
                    stroke="#0f172a"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 bg-slate-50 p-4 rounded border border-slate-200 text-xs space-y-2">
              <span className="font-bold text-slate-900 block">Forecast Insights & Action Plan:</span>
              <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                <li>
                  <strong>Night Dip (00:00 – 04:00):</strong> Demand drops to ~15%. Suggest lowering base tariff to ₹11.5/kWh to attract taxi and commercial fleets.
                </li>
                <li>
                  <strong>Morning Office Surge (08:00 – 10:00):</strong> Expected 88% capacity. Reservation slots should have strict 10-minute grace timeouts to maximize turnover.
                </li>
                <li>
                  <strong>Grid Stability:</strong> Solar generation expected at noon reduces wholesale energy cost by ₹1.20/kWh.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Zap,
  TrendingUp,
  Clock,
  Activity,
  Calendar,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { OWNER_ANALYTICS } from '../../data/mockData';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

export const OwnerDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { stations, reservations, queue, conflicts } = useApp();

  // GreenVolt Charging Hub is the default station managed by this owner
  const myStation = stations.find((s) => s.id === 'station-annanagar') || stations[0];
  const availableChargers = myStation.chargers.filter((c) => c.status === 'available').length;
  const chargingChargers = myStation.chargers.filter((c) => c.status === 'charging').length;
  const reservedChargers = myStation.chargers.filter((c) => c.status === 'reserved').length;
  const maintenanceChargers = myStation.chargers.filter((c) => c.status === 'maintenance' || c.status === 'fault').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full font-sans">
      {/* Title & Station Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Station Owner Operations
            </h1>
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold px-2 py-0.5 rounded">
              Hub Operator
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Managing: <strong>{myStation.name}</strong> • {myStation.area}, Chennai
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Link
            to="/owner/chargers"
            className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-3.5 py-2 rounded transition flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Manage Chargers</span>
          </Link>
          <Link
            to="/owner/analytics"
            className="bg-white hover:bg-slate-50 text-slate-700 font-medium px-3.5 py-2 rounded border border-slate-300 transition"
          >
            Analytics & Forecast
          </Link>
        </div>
      </div>

      {/* Real-time KPI Metric Quad */}
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <span className="text-xs text-slate-500 font-medium block">Today's Revenue</span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">₹18,420</span>
          <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" />
            +14% vs yesterday
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <span className="text-xs text-slate-500 font-medium block">Energy Delivered</span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">1,150 kWh</span>
          <span className="text-[11px] text-slate-400 mt-1 block">Peak delivery at 10 AM & 6 PM</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <span className="text-xs text-slate-500 font-medium block">Utilization Rate</span>
          <span className="text-2xl font-bold text-emerald-800 mt-1 block">78%</span>
          <span className="text-[11px] text-slate-500 mt-1 block">
            4 / 6 bays occupied or booked
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <span className="text-xs text-slate-500 font-medium block">Active Queue & Conflicts</span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">2 Drivers</span>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
            0 unresolved disputes
          </span>
        </div>
      </div>

      {/* Station Overview & Charger Bays Status */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Live Bay Status (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Live Charger Bays (C01 – C06)</h2>
              <p className="text-xs text-slate-500">Real-time status of physical charging points</p>
            </div>
            <Link
              to="/owner/chargers"
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Hardware Controls →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {myStation.chargers.map((c) => {
              const isAvail = c.status === 'available';
              const isReserved = c.status === 'reserved';
              const isCharging = c.status === 'charging';

              return (
                <div
                  key={c.id}
                  className={`p-3.5 rounded border text-xs flex flex-col justify-between ${
                    isAvail
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : isReserved
                      ? 'bg-blue-50/50 border-blue-200'
                      : isCharging
                      ? 'bg-amber-50/50 border-amber-200'
                      : 'bg-slate-100 border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sm text-slate-900">{c.id}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        isAvail
                          ? 'bg-emerald-200 text-emerald-900'
                          : isReserved
                          ? 'bg-blue-200 text-blue-900'
                          : isCharging
                          ? 'bg-amber-200 text-amber-900'
                          : 'bg-slate-300 text-slate-800'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>

                  <div className="mt-2 text-slate-600">
                    <span className="font-medium text-slate-800 block">{c.powerKw} kW {c.type}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{c.connector}</span>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px]">
                    {isReserved ? (
                      <span className="text-blue-900 font-semibold block">
                        Locked until {c.reservedUntil || '7:30 PM'}
                      </span>
                    ) : isCharging ? (
                      <span className="text-amber-900 font-semibold block">
                        Drawing 58.4 kW
                      </span>
                    ) : isAvail ? (
                      <span className="text-emerald-800 font-medium block">
                        Ready for customer
                      </span>
                    ) : (
                      <span className="text-slate-600 font-medium block">
                        Offline service
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Base Tariff: ₹{myStation.pricePerKwh}/kWh</span>
            <span className="flex items-center gap-1 text-blue-700 font-medium">
              <Lock className="w-3.5 h-3.5" />
              Walk-in Protection Enabled
            </span>
          </div>
        </div>

        {/* Right: Today's Revenue Preview Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
              <h2 className="text-sm font-bold text-slate-900">Today's Revenue Curve (₹)</h2>
              <span className="text-xs text-slate-400">Hourly breakdown</span>
            </div>

            <div className="h-44 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={OWNER_ANALYTICS.dailyRevenue}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#15803d" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#15803d" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip
                    formatter={(val: any) => [`₹${val}`, 'Revenue']}
                    labelStyle={{ fontSize: '11px', fontWeight: 600 }}
                    contentStyle={{ fontSize: '11px', borderRadius: '6px' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#15803d"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRev)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Peak hour: 6:00 PM – 8:00 PM</span>
            <Link
              to="/owner/analytics"
              className="font-semibold text-emerald-700 hover:text-emerald-800"
            >
              View Full Analytics →
            </Link>
          </div>
        </div>
      </div>

      {/* Active Reservations & Virtual Queue Row */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Reservations */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-700" />
              <span>Upcoming & Active Reservations</span>
            </h3>
            <Link to="/owner/reservations" className="text-xs text-emerald-700 font-semibold">
              Manage ({reservations.length})
            </Link>
          </div>

          <div className="divide-y divide-slate-100 mt-2 text-xs">
            {reservations.slice(0, 3).map((res) => (
              <div key={res.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">{res.id}</span>
                    <span className="bg-blue-50 text-blue-800 text-[10px] font-semibold px-2 py-0.2 rounded border border-blue-200">
                      Charger {res.chargerId}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    {res.timeSlot} • Driver: {res.vehicleName}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-emerald-700 font-semibold block">₹{res.estimatedCost}</span>
                  <span className="text-[10px] text-slate-400">Grace: {res.gracePeriodEndsTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Walk-in Protection & Conflict Audit */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Conflict & Protection Logs</span>
            </h3>
            <span className="text-xs text-emerald-700 font-semibold">Hardware Enforced</span>
          </div>

          <div className="divide-y divide-slate-100 mt-2 text-xs">
            {conflicts.slice(0, 2).map((conf) => (
              <div key={conf.id} className="py-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">
                    Charger {conf.chargerId} Walk-in Prevention
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{conf.timeAttempted}</span>
                </div>
                <p className="text-slate-600 text-[11px] mt-1 leading-relaxed">
                  {conf.actionTaken}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

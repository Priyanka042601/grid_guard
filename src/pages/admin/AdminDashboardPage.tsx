import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Zap,
  MapPin,
  Users,
  Activity,
  Layers,
  BarChart3,
  AlertTriangle,
  TrendingUp,
  Building2,
  Lock,
} from 'lucide-react';
import { ADMIN_STATS } from '../../data/mockData';

export const AdminDashboardPage: React.FC = () => {
  const { stations, reservations, conflicts, queue } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full font-sans">
      {/* Title */}
      <div className="pb-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Platform Administration
            </h1>
            <span className="bg-slate-900 text-white text-[11px] font-bold px-2.5 py-0.5 rounded">
              Chennai Central Grid Command
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            City-wide oversight: {ADMIN_STATS.totalStationsChennai} charging hubs, {ADMIN_STATS.totalChargers} physical ports across Greater Chennai.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Link
            to="/admin/conflicts"
            className="bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold px-3 py-1.5 rounded border border-amber-300 transition flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            <span>Conflict Audit Log ({conflicts.length})</span>
          </Link>
          <Link
            to="/admin/stations"
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-3 py-1.5 rounded transition"
          >
            Manage Station Fleet
          </Link>
        </div>
      </div>

      {/* High-Level Network KPIs */}
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <span className="text-xs text-slate-500 font-medium block">Daily City Turnover</span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">
            ₹{ADMIN_STATS.dailyPlatformTurnoverInr.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" />
            +9.2% month-on-month
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <span className="text-xs text-slate-500 font-medium block">Daily Grid Energy</span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">
            {ADMIN_STATS.dailyEnergyMWh} MWh
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">2.4 MW peak instantaneous</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <span className="text-xs text-slate-500 font-medium block">Operational Ports</span>
          <span className="text-2xl font-bold text-emerald-800 mt-1 block">
            {ADMIN_STATS.operationalChargers} / {ADMIN_STATS.totalChargers}
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {ADMIN_STATS.underMaintenance} maintenance, {ADMIN_STATS.faultState} fault
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <span className="text-xs text-slate-500 font-medium block">Network Health Uptime</span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">
            {ADMIN_STATS.averageUptimePercent}%
          </span>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
            SLA target exceeded
          </span>
        </div>
      </div>

      {/* Chennai Regional Zone Distribution */}
      <div className="mt-8 bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Regional Substation & Zone Distribution</h2>
            <p className="text-xs text-slate-500">Utilization & revenue share across Chennai corridors</p>
          </div>
          <span className="text-xs text-slate-400">5 Urban Zones</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {ADMIN_STATS.zoneDistribution.map((z) => (
            <div key={z.zone} className="bg-slate-50 p-3.5 rounded border border-slate-100 flex flex-col justify-between">
              <div>
                <span className="font-bold text-slate-900 block">{z.zone}</span>
                <span className="text-slate-500 text-[11px]">{z.chargers} Ports Configured</span>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200 flex justify-between items-center text-[11px]">
                <span className="font-semibold text-emerald-800">{z.utilization}% load</span>
                <span className="text-slate-500">{z.revenueShare} share</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conflict Management & Network Status Row */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Conflict Resolutions (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <h3 className="text-sm font-bold text-slate-900">Recent Conflict Incidents & Auto-Resolutions</h3>
            </div>
            <Link to="/admin/conflicts" className="text-xs text-emerald-700 font-semibold">
              View All →
            </Link>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {conflicts.map((conf) => (
              <div key={conf.id} className="py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">{conf.id}</span>
                    <span className="font-semibold text-slate-800">{conf.stationName} (Bay {conf.chargerId})</span>
                  </div>
                  <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                    RESOLVED
                  </span>
                </div>
                <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">
                  {conf.actionTaken}
                </p>
                <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Reserved for: {conf.reservedUser}</span>
                  <span>Time: {conf.timeAttempted}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Quick Admin Actions (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-slate-100 mb-3">
              <h3 className="text-sm font-bold text-slate-900">Platform Quick Actions</h3>
              <p className="text-xs text-slate-500">Administrative triggers for Tamil Nadu power compliance</p>
            </div>

            <div className="space-y-2.5 text-xs">
              <Link
                to="/admin/stations"
                className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded border border-slate-200 text-slate-800 transition"
              >
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-600" />
                  <span className="font-semibold">Station Directory & Approvals</span>
                </div>
                <span className="text-slate-400 text-xs">11 Active</span>
              </Link>

              <Link
                to="/admin/users"
                className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded border border-slate-200 text-slate-800 transition"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-600" />
                  <span className="font-semibold">User & Fleet Management</span>
                </div>
                <span className="text-slate-400 text-xs">Manage Users</span>
              </Link>

              <Link
                to="/admin/reports"
                className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded border border-slate-200 text-slate-800 transition"
              >
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-slate-600" />
                  <span className="font-semibold">Download Audit & Tax Reports</span>
                </div>
                <span className="text-slate-400 text-xs">PDF / CSV</span>
              </Link>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            Platform Gateway: <strong>v2.8.4 Chennai Node</strong> • TANGEDCO Open Access Compliant
          </div>
        </div>
      </div>
    </div>
  );
};

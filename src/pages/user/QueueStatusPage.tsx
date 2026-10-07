import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Clock,
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  XCircle,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const QueueStatusPage: React.FC = () => {
  const { queue, leaveQueue, joinQueue, stations } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full font-sans">
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Virtual Charging Queue
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Wait digitally instead of idling in your vehicle. When busy stations free up, slots are allocated fairly.
        </p>
      </div>

      <div className="mt-6 space-y-6">
        {/* Active Queue Status */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-700" />
              <span>Current Queues Across Chennai Network</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">{queue.length} active waitlists</span>
          </div>

          {queue.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p>No drivers currently waiting in the virtual queue.</p>
              <p className="mt-1">All charging stations have immediate capacity.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 mt-2">
              {queue.map((item) => (
                <div key={item.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{item.stationName}</span>
                      <span className="bg-emerald-50 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                        Position #{item.position}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Driver: {item.userName} • Preference: {item.chargerPreference} • Joined: {item.joinedAt}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px]">Estimated Wait</span>
                      <span className="font-bold text-slate-800">{item.estimatedWaitMin} minutes</span>
                    </div>

                    <button
                      onClick={() => leaveQueue(item.id)}
                      className="bg-slate-100 hover:bg-slate-200 text-rose-700 font-semibold px-3 py-1.5 rounded transition flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Leave</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Join Queue at High-Demand Stations */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Stations with High Demand
          </h3>
          <p className="text-xs text-slate-600 mb-4">
            If a station has no free ports right now, you can queue in advance before driving over:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {stations
              .filter((s) => s.demandLevel === 'high' || s.chargers.filter((c) => c.status === 'available').length <= 2)
              .slice(0, 4)
              .map((st) => (
                <div key={st.id} className="bg-white p-3.5 rounded border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">{st.name}</span>
                    <span className="text-slate-500 text-[11px]">{st.area} • Est wait: {st.estimatedWaitMin}m</span>
                  </div>
                  <button
                    onClick={() => joinQueue(st.id, 'DC Fast')}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs px-3 py-1.5 rounded transition"
                  >
                    Join Queue
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

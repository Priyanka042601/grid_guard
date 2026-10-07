import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Zap,
  Activity,
  AlertTriangle,
  RotateCcw,
  Power,
  Shield,
  Sliders,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { ChargerStatus } from '../../types';

export const ChargerManagementPage: React.FC = () => {
  const { stations, updateChargerStatus, addNotification } = useApp();
  const station = stations.find((s) => s.id === 'station-annanagar') || stations[0];

  const [filter, setFilter] = useState<string>('all');

  const handleStatusChange = (chargerId: string, newStatus: ChargerStatus) => {
    updateChargerStatus(station.id, chargerId, newStatus);
    addNotification(
      'Charger Status Updated',
      `Charger ${chargerId} status changed to ${newStatus.toUpperCase()}`,
      'info'
    );
  };

  const handleRemoteReset = (chargerId: string) => {
    if (window.confirm(`Initiate remote OCPP reset for Charger ${chargerId}?`)) {
      handleStatusChange(chargerId, 'available');
      addNotification(
        'Remote Reset Executed',
        `OCPP reset packet acknowledged by Charger ${chargerId}. State restored to AVAILABLE.`,
        'success'
      );
    }
  };

  const filteredChargers = station.chargers.filter((c) => {
    if (filter === 'all') return true;
    return c.status === filter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full font-sans">
      <div className="pb-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Charger Fleet Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time OCPP 1.6 / 2.0.1 hardware controls for {station.name} ({station.chargers.length} Bays)
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 text-xs">
          {['all', 'available', 'reserved', 'charging', 'maintenance'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded font-medium capitalize transition ${
                filter === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Fleet Grid */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredChargers.map((c) => {
          const isAvail = c.status === 'available';
          const isReserved = c.status === 'reserved';
          const isCharging = c.status === 'charging';
          const isMaint = c.status === 'maintenance' || c.status === 'fault';

          return (
            <div
              key={c.id}
              className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-base text-slate-900">{c.id}</span>
                    <span className="text-xs text-slate-500 font-medium">({c.powerKw} kW {c.type})</span>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${
                      isAvail
                        ? 'bg-emerald-100 text-emerald-800'
                        : isReserved
                        ? 'bg-blue-100 text-blue-800'
                        : isCharging
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {c.status}
                  </span>
                </div>

                {/* Telemetry info */}
                <div className="mt-4 space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Connector Interface:</span>
                    <span className="font-mono font-semibold text-slate-800">{c.connector}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Power Delivery:</span>
                    <span className="font-semibold text-slate-800">
                      {isCharging ? '58.4 kW (Active)' : '0.0 kW (Idle)'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Thermal Temp:</span>
                    <span className="text-slate-800 font-medium">{isCharging ? '38.2°C' : '29.1°C'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Reservation Lock:</span>
                    <span className="font-medium text-slate-800">
                      {isReserved ? `Locked (${c.reservedUntil || '7:30 PM'})` : 'Unlocked'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Toolbar */}
              <div className="mt-5 pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 text-[11px]">Set Status:</span>
                  <select
                    value={c.status}
                    onChange={(e) => handleStatusChange(c.id, e.target.value as ChargerStatus)}
                    className="flex-1 bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-800 text-xs font-medium"
                  >
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="charging">Charging</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="fault">Fault</option>
                  </select>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    onClick={() => handleRemoteReset(c.id)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-1.5 px-2 rounded text-center transition flex items-center justify-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>

                  <button
                    onClick={() => handleStatusChange(c.id, isMaint ? 'available' : 'maintenance')}
                    className={`flex-1 font-medium py-1.5 px-2 rounded text-center transition flex items-center justify-center gap-1 ${
                      isMaint
                        ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                        : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{isMaint ? 'Restore' : 'Service'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

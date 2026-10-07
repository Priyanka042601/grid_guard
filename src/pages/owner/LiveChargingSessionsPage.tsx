import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Activity,
  Zap,
  StopCircle,
  AlertTriangle,
  Clock,
  Shield,
  Gauge,
} from 'lucide-react';

export const LiveChargingSessionsPage: React.FC = () => {
  const { activeSession, stopActiveSession, addNotification } = useApp();

  const handleEmergencyCutoff = () => {
    if (window.confirm('WARNING: Trigger remote emergency power cut-off to Bay C02?')) {
      stopActiveSession();
      addNotification(
        'Emergency Cut-off Triggered',
        'Bay power contactor opened. Session forcefully safely terminated.',
        'warning'
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full font-sans">
      <div className="pb-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Live Charging Sessions
            </h1>
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time power draw, thermal sensors, and safety interlocks for GreenVolt Charging Hub.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-700">Total Load:</span>
          <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded">
            {activeSession ? '58.4 kW' : '0.0 kW'} / 360 kW Max Substation
          </span>
        </div>
      </div>

      <div className="mt-6">
        {activeSession ? (
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <span className="font-mono text-xs text-slate-400 block font-semibold">
                  Session: {activeSession.sessionId}
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                  Charger {activeSession.chargerId} • {activeSession.vehicleName}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-1 rounded">
                  Status: CHARGING ({activeSession.currentBatteryPercent}%)
                </span>
                <button
                  onClick={handleEmergencyCutoff}
                  className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3.5 py-1 rounded transition flex items-center gap-1.5"
                >
                  <StopCircle className="w-4 h-4" />
                  <span>Contactor Cut-off</span>
                </button>
              </div>
            </div>

            {/* Live Metrics Quad */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-50 p-4 rounded border border-slate-100 text-center">
                <span className="text-[11px] text-slate-500 block">Current Delivery</span>
                <span className="text-2xl font-bold text-slate-900 mt-1 block">
                  {activeSession.currentPowerKw} kW
                </span>
                <span className="text-[10px] text-slate-400">CC-CV Curve Mode</span>
              </div>

              <div className="bg-slate-50 p-4 rounded border border-slate-100 text-center">
                <span className="text-[11px] text-slate-500 block">Total Energy</span>
                <span className="text-2xl font-bold text-slate-900 mt-1 block">
                  {activeSession.energyDeliveredKwh} kWh
                </span>
                <span className="text-[10px] text-slate-400">Revenue: ₹{activeSession.currentCostInr}</span>
              </div>

              <div className="bg-slate-50 p-4 rounded border border-slate-100 text-center">
                <span className="text-[11px] text-slate-500 block">Bus Voltage</span>
                <span className="text-2xl font-bold text-slate-900 mt-1 block">
                  {activeSession.voltage} V
                </span>
                <span className="text-[10px] text-slate-400">Draw: {activeSession.currentAmps} A</span>
              </div>

              <div className="bg-slate-50 p-4 rounded border border-slate-100 text-center">
                <span className="text-[11px] text-slate-500 block">Duration Elapsed</span>
                <span className="text-2xl font-bold text-slate-900 mt-1 block">
                  {activeSession.elapsedMinutes} mins
                </span>
                <span className="text-[10px] text-slate-400">{activeSession.estimatedMinutesRemaining}m to cutoff</span>
              </div>
            </div>

            {/* Safety Interlocks */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded text-xs space-y-1">
              <span className="font-bold text-slate-800 block mb-1">Safety Interlocks Status:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-600">
                <span className="text-emerald-700">✓ Ground fault monitoring: Normal</span>
                <span className="text-emerald-700">✓ Cable temperature: 36.4°C (Safe &lt; 65°C)</span>
                <span className="text-emerald-700">✓ Pilot signal lock: Latched</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-lg p-10 text-center text-xs text-slate-500">
            <Activity className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="font-bold text-sm text-slate-800">No Active Sessions Right Now</h3>
            <p className="mt-1">All bays are currently idle or reserved for upcoming bookings.</p>
          </div>
        )}
      </div>
    </div>
  );
};

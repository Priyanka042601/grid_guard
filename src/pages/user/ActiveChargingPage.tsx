import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Zap,
  BatteryCharging,
  Clock,
  DollarSign,
  Activity,
  AlertTriangle,
  StopCircle,
  CheckCircle2,
  Receipt,
  Download,
  Share2,
} from 'lucide-react';
import { ChargingHistoryRecord } from '../../types';

export const ActiveChargingPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeSession, stopActiveSession, startDirectCharging } = useApp();
  const [completedInvoice, setCompletedInvoice] = useState<ChargingHistoryRecord | null>(null);

  const handleStopCharging = () => {
    if (window.confirm('Are you sure you want to stop charging? Power delivery will end.')) {
      const record = stopActiveSession();
      setCompletedInvoice(record);
    }
  };

  const handleStartDemoSession = () => {
    startDirectCharging('station-annanagar', 'C02');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full font-sans">
      {completedInvoice ? (
        /* Completed Session Invoice / Receipt */
        <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-sm">
          <div className="text-center pb-6 border-b border-slate-200">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Charging Session Complete</h1>
            <p className="text-xs text-slate-500 mt-1">
              Invoice #{completedInvoice.invoiceNumber} • Generated on {completedInvoice.date}
            </p>
          </div>

          <div className="py-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-slate-50 p-3 rounded border border-slate-100">
              <span className="text-[11px] text-slate-500 block">Energy Delivered</span>
              <span className="text-lg font-bold text-slate-900">{completedInvoice.energyDeliveredKwh} kWh</span>
            </div>
            <div className="bg-slate-50 p-3 rounded border border-slate-100">
              <span className="text-[11px] text-slate-500 block">Session Time</span>
              <span className="text-lg font-bold text-slate-900">{completedInvoice.durationMinutes} mins</span>
            </div>
            <div className="bg-slate-50 p-3 rounded border border-slate-100">
              <span className="text-[11px] text-slate-500 block">Tariff Rate</span>
              <span className="text-lg font-bold text-slate-900">₹{completedInvoice.ratePerKwh}/kWh</span>
            </div>
            <div className="bg-slate-50 p-3 rounded border border-slate-100">
              <span className="text-[11px] text-slate-500 block">Amount Paid</span>
              <span className="text-lg font-bold text-emerald-800">₹{completedInvoice.amountPaidInr}</span>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded border border-slate-200 text-xs space-y-2 mb-6">
            <div className="flex justify-between text-slate-600">
              <span>Location:</span>
              <span className="font-semibold text-slate-900">{completedInvoice.stationName} ({completedInvoice.stationArea})</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Charger Bay:</span>
              <span className="font-mono font-semibold text-slate-900">{completedInvoice.chargerId}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Vehicle:</span>
              <span className="font-semibold text-slate-900">{completedInvoice.vehicleName}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>GST (18% included):</span>
              <span className="font-semibold text-slate-900">₹{(completedInvoice.amountPaidInr * 0.18 / 1.18).toFixed(2)}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
            <Link
              to="/user/history"
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
            >
              View Full Charging History
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-4 py-2 rounded border border-slate-300 transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Tax Invoice</span>
              </button>

              <button
                onClick={() => navigate('/user/dashboard')}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-4 py-2 rounded transition"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      ) : activeSession ? (
        /* LIVE ACTIVE CHARGING SESSION DASHBOARD */
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                  Active Session • {activeSession.stationName}
                </span>
              </div>
              <h1 className="text-xl font-bold text-slate-900 mt-0.5">
                Charging Bay {activeSession.chargerId}
              </h1>
              <p className="text-xs text-slate-500">
                Connected to {activeSession.vehicleName}
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 block">Session ID</span>
              <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">
                {activeSession.sessionId}
              </span>
            </div>
          </div>

          {/* Large Battery Gauge Widget */}
          <div className="bg-slate-900 text-white rounded-lg p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <span className="text-xs text-emerald-400 uppercase tracking-wider font-semibold block">
                  State of Charge (SoC)
                </span>
                <div className="mt-2 flex items-baseline justify-center md:justify-start gap-3">
                  <span className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white leading-none">
                    {activeSession.currentBatteryPercent}%
                  </span>
                  <span className="text-xs text-slate-400">
                    Target: {activeSession.targetBatteryPercent}%
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Estimated Range: ~{Math.round((activeSession.currentBatteryPercent / 100) * 312)} km
                </p>
              </div>

              {/* Graphical Battery Visual */}
              <div className="w-full md:w-64">
                <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                  <span>Progress</span>
                  <span className="text-emerald-400 font-medium">
                    {activeSession.estimatedMinutesRemaining} mins remaining
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-4 rounded-full p-0.5 border border-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${activeSession.currentBatteryPercent}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Live Metrics Quad */}
            <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <span className="text-[11px] text-slate-400 block">Current Power</span>
                <span className="text-2xl font-bold text-emerald-400 mt-0.5 block">
                  {activeSession.currentPowerKw} <span className="text-xs font-normal text-slate-400">kW</span>
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Energy Delivered</span>
                <span className="text-2xl font-bold text-white mt-0.5 block">
                  {activeSession.energyDeliveredKwh} <span className="text-xs font-normal text-slate-400">kWh</span>
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Elapsed Time</span>
                <span className="text-2xl font-bold text-white mt-0.5 block">
                  {activeSession.elapsedMinutes} <span className="text-xs font-normal text-slate-400">min</span>
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Current Total</span>
                <span className="text-2xl font-bold text-emerald-400 mt-0.5 block">
                  ₹{activeSession.currentCostInr}
                </span>
              </div>
            </div>
          </div>

          {/* Electrical Diagnostics & Voltage Panel */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Electrical Bus Telemetry
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Bus Voltage</span>
                <span className="font-semibold text-slate-900 text-sm">{activeSession.voltage} V DC</span>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Delivered Current</span>
                <span className="font-semibold text-slate-900 text-sm">{activeSession.currentAmps} A</span>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Tariff Rate</span>
                <span className="font-semibold text-slate-900 text-sm">₹{activeSession.ratePerKwh}/kWh</span>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Connector Protocol</span>
                <span className="font-semibold text-slate-900 text-sm">ISO 15118 (CCS2)</span>
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center justify-between pt-2">
            <Link
              to="/user/dashboard"
              className="text-xs text-slate-600 hover:text-slate-900 font-semibold"
            >
              Back to Dashboard
            </Link>

            <button
              onClick={handleStopCharging}
              className="bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold px-5 py-2.5 rounded shadow-sm transition flex items-center gap-2 active:scale-95"
            >
              <StopCircle className="w-4 h-4" />
              <span>Stop Charging Session</span>
            </button>
          </div>
        </div>
      ) : (
        /* No active session state */
        <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-sm text-center">
          <BatteryCharging className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-900">No Active Charging Session</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            You do not currently have a vehicle plugged in at any Chennai charging station.
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              onClick={handleStartDemoSession}
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-4 py-2 rounded transition"
            >
              Simulate Plug-in at C02
            </button>
            <Link
              to="/user/stations"
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-4 py-2 rounded border border-slate-300 transition"
            >
              Find a Station
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

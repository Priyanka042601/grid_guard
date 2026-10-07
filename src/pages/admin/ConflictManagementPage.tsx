import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Users,
  Search,
} from 'lucide-react';

export const ConflictManagementPage: React.FC = () => {
  const { conflicts, resolveConflict, addNotification } = useApp();
  const [filterType, setFilterType] = useState<string>('all');

  const handleResolveAction = (conflictId: string, action: string) => {
    resolveConflict(conflictId, action);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full font-sans">
      <div className="pb-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Conflict & Reservation Rule Engine
            </h1>
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold px-2.5 py-0.5 rounded">
              Active Protection Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated arbitration between Online Bookings, Walk-in Customers, and 10-Minute Grace Timeouts.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-600">Hardware Rule:</span>
          <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded font-mono font-medium">
            Lock Relay on Reserved Ports
          </span>
        </div>
      </div>

      {/* Educational Scenario Callout (Prompt Section 22) */}
      <div className="mt-6 bg-slate-900 text-white p-5 rounded-lg shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded bg-emerald-700 flex items-center justify-center shrink-0">
            <Lock className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">
              Primary Protection Scenario: Online Reservation vs. Walk-In Contention
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              <strong>Scenario:</strong> User A books Charger C02 for 6:30 PM – 7:30 PM at GreenVolt Hub. When User B arrives as an unreserved walk-in at 6:32 PM, the charger display and hardware relay strictly reject session initialization with:
            </p>
            <div className="mt-2 p-2.5 bg-slate-800 rounded border border-slate-700 text-xs font-mono text-emerald-400">
              "This charger is reserved until 7:30 PM by CS-20261007-4821. Reserved customer has 10-minute arrival grace period. Please join virtual queue or select available Bay C01."
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              <strong>10-Minute Grace Rule:</strong> If User A does not punch their OTP by 6:40 PM, the system automatically voids the booking, issues a warning SMS, and frees Bay C02 for the next queued walk-in driver.
            </p>
          </div>
        </div>
      </div>

      {/* Incident Audit Table */}
      <div className="mt-8 bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">
            Recorded Incidents & Automated Safeguards ({conflicts.length})
          </h2>
          <span className="text-xs text-slate-500">Live OCPP 1.6 Security Log</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-semibold text-[11px]">
              <tr>
                <th className="py-3 px-4">Incident ID</th>
                <th className="py-3 px-4">Station & Bay</th>
                <th className="py-3 px-4">Reservation Link</th>
                <th className="py-3 px-4">Contention Type</th>
                <th className="py-3 px-4">Enforced Action</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Arbitration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {conflicts.map((conf) => (
                <tr key={conf.id} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{conf.id}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {conf.stationName} • {conf.chargerId}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-blue-700 font-medium">
                    {conf.reservationId}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="bg-slate-100 text-slate-800 text-[10px] font-semibold px-2 py-0.5 rounded capitalize">
                      {conf.conflictType.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 max-w-xs">{conf.actionTaken}</td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                    {conf.timeAttempted}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center gap-1 text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded text-[11px]">
                      <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                      Enforced
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

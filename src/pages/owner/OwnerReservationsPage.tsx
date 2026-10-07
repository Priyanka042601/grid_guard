import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Clock,
  Zap,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
} from 'lucide-react';

export const OwnerReservationsPage: React.FC = () => {
  const { reservations, cancelReservation, verifyOtp, addNotification } = useApp();

  const handleManualCheckIn = (resId: string) => {
    verifyOtp(resId, '482913');
  };

  const handleReleaseBay = (resId: string) => {
    if (window.confirm('Release bay early? The slot will become immediately available to walk-ins and queue.')) {
      cancelReservation(resId);
    }
  };

  const handleExtendGrace = (resId: string) => {
    addNotification('Grace Period Extended', `Added 5 minutes to arrival window for booking ${resId}`, 'info');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full font-sans">
      <div className="pb-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Station Reservation Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor incoming bookings, 10-minute arrival grace windows, and automated walk-in locks.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-slate-50 border border-slate-200 px-3 py-1.5 rounded">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span className="font-semibold text-slate-700">Walk-in Conflict Engine: Active</span>
        </div>
      </div>

      <div className="mt-6 bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">
            Bookings Schedule ({reservations.length} total)
          </h2>
          <span className="text-xs text-slate-500">GreenVolt Hub • Anna Nagar</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-semibold text-[11px]">
              <tr>
                <th className="py-3 px-4">Reservation ID</th>
                <th className="py-3 px-4">Bay & Power</th>
                <th className="py-3 px-4">Time Slot</th>
                <th className="py-3 px-4">Driver / Vehicle</th>
                <th className="py-3 px-4">Grace Window</th>
                <th className="py-3 px-4">Status & Lock</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reservations.map((res) => {
                const isConfirmed = res.status === 'confirmed';
                const isActive = res.status === 'active';

                return (
                  <tr key={res.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {res.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">Charger {res.chargerId}</span>
                      <span className="text-slate-500 text-[11px]">{res.chargerPower}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-900 block">{res.timeSlot}</span>
                      <span className="text-slate-500 text-[11px]">{res.date}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-900 block">{res.vehicleName}</span>
                      <span className="text-slate-500 text-[11px]">User: {res.userId}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        <Clock className="w-3 h-3 text-amber-700" />
                        Ends {res.gracePeriodEndsTime}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase ${
                            isActive
                              ? 'bg-emerald-100 text-emerald-800'
                              : isConfirmed
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {res.status}
                        </span>
                        {isConfirmed && (
                          <span className="text-[10px] text-blue-700 font-semibold flex items-center gap-0.5" title="Hardware bay locked for walk-ins">
                            <Lock className="w-3 h-3" />
                            Locked
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {isConfirmed && (
                          <>
                            <button
                              onClick={() => handleManualCheckIn(res.id)}
                              className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-2.5 py-1 rounded text-xs transition"
                            >
                              Arrived (Verify)
                            </button>
                            <button
                              onClick={() => handleExtendGrace(res.id)}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-2 py-1 rounded text-xs border border-slate-300 transition"
                              title="+5 min grace"
                            >
                              +5m
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleReleaseBay(res.id)}
                          className="text-rose-600 hover:text-rose-800 font-medium px-2 py-1 rounded text-xs transition"
                        >
                          Release
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

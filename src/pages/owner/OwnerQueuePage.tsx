import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Clock,
  CheckCircle2,
  Zap,
  ArrowRight,
  Shield,
  UserCheck,
} from 'lucide-react';

export const OwnerQueuePage: React.FC = () => {
  const { queue, leaveQueue, stations, startDirectCharging, addNotification } = useApp();
  const station = stations.find((s) => s.id === 'station-annanagar') || stations[0];

  const handleAdmitToCharger = (queueId: string, chargerId: string) => {
    leaveQueue(queueId);
    startDirectCharging(station.id, chargerId);
    addNotification('Queue Customer Admitted', `Customer assigned to Charger ${chargerId}`, 'success');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full font-sans">
      <div className="pb-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Station Queue Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Fair virtual queue sequencing for walk-ins and overflow traffic at {station.name}.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-600">Available Bays:</span>
          <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded">
            {station.chargers.filter((c) => c.status === 'available').length} free bays
          </span>
        </div>
      </div>

      <div className="mt-6 bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-700" />
            <span>Waiting Drivers Line ({queue.length} in queue)</span>
          </h2>
          <span className="text-xs text-slate-500">Auto-allocation enabled</span>
        </div>

        {queue.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p>No customers currently waiting in the queue.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-semibold text-[11px]">
                <tr>
                  <th className="py-3 px-4">Position</th>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Preference</th>
                  <th className="py-3 px-4">Joined At</th>
                  <th className="py-3 px-4">Est. Wait</th>
                  <th className="py-3 px-4 text-right">Assign Bay</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {queue.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-sm text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                        #{q.position}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{q.userName}</td>
                    <td className="py-3.5 px-4 text-slate-600">{q.chargerPreference}</td>
                    <td className="py-3.5 px-4 text-slate-500">{q.joinedAt}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">{q.estimatedWaitMin} mins</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleAdmitToCharger(q.id, 'C01')}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-2.5 py-1 rounded text-xs transition"
                        >
                          Admit to C01
                        </button>
                        <button
                          onClick={() => handleAdmitToCharger(q.id, 'C04')}
                          className="bg-slate-800 hover:bg-slate-900 text-white font-medium px-2.5 py-1 rounded text-xs transition"
                        >
                          Admit to C04 (120 kW)
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

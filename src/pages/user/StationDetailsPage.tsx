import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Zap,
  MapPin,
  Clock,
  Star,
  ShieldCheck,
  Calendar,
  Navigation,
  Phone,
  AlertTriangle,
  Lock,
  CheckCircle2,
  Users,
  ChevronLeft,
  CreditCard,
  Wifi,
  Coffee,
} from 'lucide-react';

export const StationDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    stations,
    getStationById,
    simulateWalkInAttempt,
    joinQueue,
    startDirectCharging,
  } = useApp();

  const [conflictModalOpen, setConflictModalOpen] = useState(false);
  const [conflictMessage, setConflictMessage] = useState<{
    chargerId: string;
    reason: string;
    reservedUntil?: string;
  } | null>(null);

  const [queueModalOpen, setQueueModalOpen] = useState(false);
  const [queuedPosition, setQueuedPosition] = useState<number | null>(null);

  const station = getStationById(id || '') || stations[0];
  const availableCount = station.chargers.filter((c) => c.status === 'available').length;

  const handleChargerClick = (chargerId: string) => {
    const charger = station.chargers.find((c) => c.id === chargerId);
    if (!charger) return;

    if (charger.status === 'available') {
      // Direct option to reserve or start charge
      navigate(`/user/reserve?stationId=${station.id}&chargerId=${chargerId}`);
    } else {
      // Simulate walk-in conflict attempt
      const result = simulateWalkInAttempt(station.id, chargerId);
      if (!result.allowed) {
        setConflictMessage({
          chargerId,
          reason: result.reason || 'Charger is unavailable.',
          reservedUntil: result.reservedUntil,
        });
        setConflictModalOpen(true);
      }
    }
  };

  const handleJoinQueue = (pref: string) => {
    const entry = joinQueue(station.id, pref);
    setQueuedPosition(entry.position);
    setConflictModalOpen(false);
    setQueueModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            Available
          </span>
        );
      case 'reserved':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded text-xs font-semibold">
            <Lock className="w-3 h-3 text-blue-600" />
            Reserved
          </span>
        );
      case 'charging':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded text-xs font-semibold">
            <Zap className="w-3 h-3 text-amber-600 fill-amber-600" />
            Charging
          </span>
        );
      case 'maintenance':
        return (
          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 border border-slate-300 px-2.5 py-0.5 rounded text-xs font-semibold">
            Maintenance
          </span>
        );
      case 'fault':
        return (
          <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-800 border border-rose-200 px-2.5 py-0.5 rounded text-xs font-semibold">
            Fault
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full font-sans">
      {/* Back button */}
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 font-semibold"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Stations</span>
        </button>
      </div>

      {/* Main Station Header Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900">{station.name}</h1>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold px-2.5 py-0.5 rounded">
                Operational
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <span>{station.address}</span> • <span>{station.area}</span> •{' '}
              <span className="font-semibold text-slate-700">{station.distanceKm} km from Central</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-3.5 py-2 rounded border border-slate-300 transition"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Get Directions</span>
            </a>
            <button
              onClick={() => navigate(`/user/reserve?stationId=${station.id}`)}
              className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-4 py-2 rounded shadow-sm transition"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Reserve Charger</span>
            </button>
          </div>
        </div>

        {/* Key Station Metrics Grid */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-slate-50 p-3 rounded border border-slate-100">
            <span className="text-[11px] text-slate-500 block">Available Ports</span>
            <span className="text-lg font-bold text-emerald-700">
              {availableCount} <span className="text-xs font-normal text-slate-500">/ {station.chargers.length}</span>
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded border border-slate-100">
            <span className="text-[11px] text-slate-500 block">Tariff</span>
            <span className="text-lg font-bold text-slate-900">
              ₹{station.pricePerKwh} <span className="text-xs font-normal text-slate-500">/ kWh</span>
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded border border-slate-100">
            <span className="text-[11px] text-slate-500 block">Est. Waiting Time</span>
            <span className="text-lg font-bold text-slate-900 flex items-center gap-1">
              <Clock className="w-4 h-4 text-slate-400" />
              {station.estimatedWaitMin} min
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded border border-slate-100">
            <span className="text-[11px] text-slate-500 block">Demand Level</span>
            <span className="text-sm font-semibold capitalize text-slate-800 mt-1 block">
              {station.demandLevel} Demand
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded border border-slate-100">
            <span className="text-[11px] text-slate-500 block">User Rating</span>
            <span className="text-lg font-bold text-slate-900 flex items-center gap-1">
              <Star className="w-4 h-4 text-emerald-600 fill-emerald-600" />
              {station.rating} <span className="text-xs font-normal text-slate-400">({station.reviewCount})</span>
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded border border-slate-100">
            <span className="text-[11px] text-slate-500 block">Operating Hours</span>
            <span className="text-xs font-semibold text-slate-800 mt-1 block">
              {station.openingHours}
            </span>
          </div>
        </div>
      </div>

      {/* CHARGER LIST SECTION (Core Requirement) */}
      <div className="mt-8 bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900">Station Chargers ({station.chargers.length} Ports)</h2>
            <p className="text-xs text-slate-500">
              Live status, power specifications, and walk-in conflict protection rules.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span> 10-minute arrival grace window applies to all reservations
          </div>
        </div>

        {/* Table of Chargers */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Charger</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Power</th>
                <th className="py-3 px-4">Connector</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Reservation Info</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {station.chargers.map((charger) => {
                const isAvailable = charger.status === 'available';
                const isReserved = charger.status === 'reserved';

                return (
                  <tr
                    key={charger.id}
                    className={`hover:bg-slate-50 transition ${
                      isReserved ? 'bg-blue-50/20' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {charger.id}
                    </td>
                    <td className="py-3.5 px-4 font-medium">{charger.type}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {charger.powerKw} kW
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono text-[11px]">
                        {charger.connector}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(charger.status)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {isReserved ? (
                        <div className="text-[11px]">
                          <span className="font-semibold text-blue-900 block">
                            Reserved until {charger.reservedUntil || '7:30 PM'}
                          </span>
                          <span className="text-slate-500 font-mono">
                            {charger.reservedByReservationId || 'CS-20261007-4821'}
                          </span>
                        </div>
                      ) : charger.status === 'charging' ? (
                        <span className="text-[11px] text-amber-800">
                          Active session in progress
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-medium">Ready for booking</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {isAvailable ? (
                        <button
                          onClick={() =>
                            navigate(
                              `/user/reserve?stationId=${station.id}&chargerId=${charger.id}`
                            )
                          }
                          className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-3 py-1.5 rounded transition text-xs"
                        >
                          Reserve {charger.id}
                        </button>
                      ) : isReserved ? (
                        <button
                          onClick={() => handleChargerClick(charger.id)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-medium px-2.5 py-1.5 rounded transition text-xs"
                          title="Click to simulate walk-in attempt"
                        >
                          Walk-in Lock Active
                        </button>
                      ) : (
                        <button
                          onClick={() => handleChargerClick(charger.id)}
                          className="text-slate-400 font-medium px-2.5 py-1.5 rounded text-xs cursor-not-allowed"
                          disabled
                        >
                          Unavailable
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Amenities & Payment Methods Details */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
            <Coffee className="w-4 h-4 text-emerald-700" />
            <span>Station Amenities</span>
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {station.amenities.map((am) => (
              <div key={am} className="flex items-center gap-2 text-slate-700 p-2 bg-slate-50 rounded border border-slate-100">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{am}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-700" />
            <span>Accepted Payment Methods</span>
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {station.paymentMethods.map((pm) => (
              <div key={pm} className="flex items-center gap-2 text-slate-700 p-2 bg-slate-50 rounded border border-slate-100">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{pm}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Operator: <strong>{station.operator}</strong></span>
            <span>Helpline: {station.phone}</span>
          </div>
        </div>
      </div>

      {/* Walk-in Conflict Protected Modal */}
      {conflictModalOpen && conflictMessage && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl border border-slate-200 text-slate-900">
            <div className="flex items-center gap-2 text-rose-600 mb-2">
              <Lock className="w-5 h-5" />
              <h3 className="font-bold text-base">Charger Reserved — Walk-in Prohibited</h3>
            </div>

            <p className="text-xs text-slate-600 mt-1">
              Charger <strong>{conflictMessage.chargerId}</strong> is reserved by an online user.
            </p>

            <div className="mt-4 bg-blue-50 border border-blue-200 p-3.5 rounded text-xs text-blue-900">
              <p className="font-semibold">Reservation Lock Details:</p>
              <p className="mt-1">
                This charger is reserved until {conflictMessage.reservedUntil || '7:30 PM'}.
              </p>
              <p className="mt-1 text-[11px] text-blue-700">
                Hardware connector lock is active. The reserving user has a 10-minute arrival grace period.
              </p>
            </div>

            <p className="text-xs text-slate-600 mt-4">
              Would you like to join the virtual waiting queue for the next free charger?
            </p>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => setConflictModalOpen(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-3 py-2 rounded transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleJoinQueue('DC Fast')}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-4 py-2 rounded transition flex items-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Join Virtual Queue</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Queue Confirmation Modal */}
      {queueModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl border border-slate-200 text-slate-900">
            <div className="flex items-center gap-2 text-emerald-700 mb-2">
              <CheckCircle2 className="w-5 h-5" />
              <h3 className="font-bold text-base">Added to Virtual Queue</h3>
            </div>

            <div className="mt-3 bg-emerald-50 border border-emerald-200 p-4 rounded text-center">
              <span className="text-xs text-emerald-800 font-medium block">Your Queue Position</span>
              <span className="text-3xl font-extrabold text-emerald-900 mt-1 block">
                #{queuedPosition}
              </span>
              <span className="text-xs text-emerald-700 mt-1 block">
                Estimated wait: ~{queuedPosition ? queuedPosition * 8 : 8} minutes
              </span>
            </div>

            <p className="text-xs text-slate-600 mt-3 text-center">
              We will notify you via push notification and SMS the moment a charger becomes available.
            </p>

            <div className="mt-5 flex items-center justify-center gap-2">
              <button
                onClick={() => {
                  setQueueModalOpen(false);
                  navigate('/user/queue');
                }}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-5 py-2 rounded transition"
              >
                View Queue Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

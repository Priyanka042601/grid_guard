import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Battery,
  Zap,
  MapPin,
  Clock,
  Star,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Navigation,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  TrendingDown,
} from 'lucide-react';

export const UserDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    stations,
    activeReservation,
    activeSession,
    updateUserBattery,
    simulateWalkInAttempt,
  } = useApp();

  const [conflictModalOpen, setConflictModalOpen] = useState(false);
  const [conflictResult, setConflictResult] = useState<{
    allowed: boolean;
    reason?: string;
    reservedUntil?: string;
  } | null>(null);

  const vehicle = currentUser.vehicle || {
    model: 'Tata Nexon EV',
    variant: 'XZ+ Lux 40.5 kWh',
    registrationNumber: 'TN 09 BX 7842',
    batteryPercent: 32,
    batteryCapacityKwh: 40.5,
    estimatedRangeKm: 108,
    maxChargingSpeedKw: 50,
    connectorType: 'CCS2' as const,
  };

  const nearbyStations = stations.slice(0, 4);

  const handleTestWalkInConflict = () => {
    // Attempt walk-in on C02 at GreenVolt (which is reserved by User A)
    const result = simulateWalkInAttempt('station-annanagar', 'C02');
    setConflictResult(result);
    setConflictModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Page Title & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            EV Driver Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time status for {currentUser.name} • Chennai Network
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Direct link to test the walk-in conflict protection */}
          <button
            onClick={handleTestWalkInConflict}
            className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold px-3 py-1.5 rounded transition"
            title="Demonstrate how reserved chargers reject walk-in customers"
          >
            <ShieldAlert className="w-4 h-4 text-amber-700" />
            <span>Test Walk-in Conflict Scenario</span>
          </button>

          <Link
            to="/user/map"
            className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-3 py-1.5 rounded transition"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Open Map</span>
          </Link>
        </div>
      </div>

      {/* Grid Layout: Top Row = Vehicle Card + Active Reservation / Active Session */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Vehicle Card (4 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Connected Vehicle
              </span>
              <span className="text-xs font-mono font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                {vehicle.registrationNumber}
              </span>
            </div>

            <div className="mt-4 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{vehicle.model}</h2>
                <p className="text-xs text-slate-500 mt-0.5">{vehicle.variant}</p>
              </div>
              <div className="bg-emerald-50 text-emerald-800 text-[11px] font-semibold px-2 py-0.5 rounded border border-emerald-200">
                CCS2 Fast Charging
              </div>
            </div>

            {/* Battery Visualization */}
            <div className="mt-6 bg-slate-50 p-4 rounded border border-slate-100">
              <div className="flex items-end justify-between mb-2">
                <div>
                  <span className="text-xs text-slate-500 block">Current Battery</span>
                  <span className="text-3xl font-extrabold text-slate-900 leading-none">
                    {vehicle.batteryPercent}%
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Estimated Range</span>
                  <span className="text-lg font-bold text-slate-800">
                    {vehicle.estimatedRangeKm} <span className="text-xs font-normal text-slate-500">km</span>
                  </span>
                </div>
              </div>

              {/* Practical Battery Bar */}
              <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    vehicle.batteryPercent > 40
                      ? 'bg-emerald-600'
                      : vehicle.batteryPercent > 20
                      ? 'bg-amber-500'
                      : 'bg-rose-600'
                  }`}
                  style={{ width: `${vehicle.batteryPercent}%` }}
                ></div>
              </div>

              {/* Battery Simulator slider for interactive evaluation */}
              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                <span>Simulate Battery Level:</span>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={vehicle.batteryPercent}
                  onChange={(e) => updateUserBattery(Number(e.target.value))}
                  className="w-32 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Usable capacity: 40.5 kWh</span>
            <Link
              to="/user/smart-charging"
              className="text-emerald-700 font-semibold hover:text-emerald-800 flex items-center gap-1"
            >
              Optimize Charge <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Active Reservation / Live Charging Session (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {activeSession && activeSession.status === 'charging' ? (
            /* Live Charging Session In Progress */
            <div className="bg-white border-2 border-emerald-600 rounded-lg p-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping"></span>
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                    Live Charging Session Active
                  </span>
                </div>
                <span className="text-xs font-mono font-medium text-slate-600">
                  {activeSession.sessionId}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                  <span className="text-[11px] text-slate-500 block">Current Battery</span>
                  <span className="text-lg font-bold text-emerald-700">{activeSession.currentBatteryPercent}%</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                  <span className="text-[11px] text-slate-500 block">Delivered</span>
                  <span className="text-lg font-bold text-slate-800">{activeSession.energyDeliveredKwh} kWh</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                  <span className="text-[11px] text-slate-500 block">Live Rate</span>
                  <span className="text-lg font-bold text-slate-800">{activeSession.currentPowerKw} kW</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                  <span className="text-[11px] text-slate-500 block">Amount</span>
                  <span className="text-lg font-bold text-slate-800">₹{activeSession.currentCostInr}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-800">{activeSession.stationName}</span> • Charger {activeSession.chargerId}
                </div>
                <Link
                  to="/user/active-session"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium px-3.5 py-1.5 rounded transition"
                >
                  View Live Session Details
                </Link>
              </div>
            </div>
          ) : activeReservation ? (
            /* Active Reservation Card */
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    Active Reservation
                  </span>
                </div>
                <span className="text-xs font-mono font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  {activeReservation.id}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-bold text-base text-slate-900">{activeReservation.stationName}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{activeReservation.stationArea} • Charger {activeReservation.chargerId}</p>

                  <div className="mt-3 space-y-1 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{activeReservation.timeSlot}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{activeReservation.chargerPower}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded border border-slate-100 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Status</span>
                      <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {activeReservation.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-slate-600">
                      <span className="text-slate-500 block text-[11px]">Grace Period</span>
                      <span className="font-medium text-slate-800">
                        10 minutes (Ends {activeReservation.gracePeriodEndsTime})
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-800">
                    <span>Est. Price:</span>
                    <span>₹{activeReservation.pricePerKwh}/kWh (~₹{activeReservation.estimatedCost})</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Link
                    to={`/user/reservation/${activeReservation.id}`}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded transition"
                  >
                    View Reservation
                  </Link>
                  <Link
                    to="/user/verify-otp"
                    className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-3 py-1.5 rounded transition flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Punch OTP & Charge</span>
                  </Link>
                </div>

                <a
                  href="https://www.google.com/maps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Directions</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm text-center py-8">
              <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-semibold text-slate-800">No active reservation</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Reserve a charger in advance to lock your port and prevent walk-in contention.
              </p>
              <Link
                to="/user/stations"
                className="inline-block mt-3 bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded hover:bg-emerald-800 transition"
              >
                Find & Reserve Charger
              </Link>
            </div>
          )}

          {/* Smart Recommendation Card (Google Maps / Banking style, NOT chatbot) */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">
                  Smart Recommendation
                </span>
                <span className="bg-emerald-100 text-emerald-900 text-[11px] font-bold px-2 py-0.2 rounded">
                  92% match
                </span>
              </div>
              <span className="text-[11px] text-slate-400">Based on battery & Chennai traffic</span>
            </div>

            <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">GreenVolt Charging Hub</h3>
                <p className="text-xs text-slate-500 mt-0.5">Anna Nagar • 2.4 km away</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block">Availability</span>
                  <span className="font-semibold text-slate-800">4 chargers free</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Tariff</span>
                  <span className="font-semibold text-slate-800">₹13.5/kWh</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Duration</span>
                  <span className="font-semibold text-slate-800">42 min to 80%</span>
                </div>
              </div>
            </div>

            <div className="mt-3 bg-slate-50 p-3 rounded text-xs text-slate-600 border border-slate-100">
              <span className="font-semibold text-slate-700 block mb-1">Recommendation factors:</span>
              <ul className="grid grid-cols-2 gap-1 text-[11px] list-disc list-inside">
                <li>High availability (4 free)</li>
                <li>Low expected demand</li>
                <li>Short travel distance (2.4 km)</li>
                <li>Off-peak tariff slot</li>
              </ul>
            </div>

            <div className="mt-4 flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Est. wait: 3 min
              </span>
              <button
                onClick={() => navigate('/user/reserve?stationId=station-annanagar')}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-4 py-1.5 rounded transition"
              >
                Reserve Charger
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Nearby Chargers Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Nearby Chargers in Chennai</h2>
            <p className="text-xs text-slate-500">Live availability within driving radius</p>
          </div>
          <Link
            to="/user/stations"
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            View all 11 stations <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {nearbyStations.map((station) => {
            const availableCount = station.chargers.filter((c) => c.status === 'available').length;
            return (
              <div
                key={station.id}
                className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:border-slate-300 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <h3 className="font-semibold text-sm text-slate-900 leading-snug">
                      {station.name}
                    </h3>
                    <div className="flex items-center gap-0.5 text-xs font-semibold text-slate-700 shrink-0">
                      <Star className="w-3 h-3 text-emerald-600 fill-emerald-600" />
                      <span>{station.rating}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500">{station.area} • {station.distanceKm} km away</p>

                  <div className="mt-3 space-y-1.5 text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Availability:</span>
                      <span className="font-semibold text-emerald-700">
                        {availableCount}/{station.chargers.length} chargers
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tariff:</span>
                      <span className="font-semibold text-slate-800">₹{station.pricePerKwh}/kWh</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Est. Wait:</span>
                      <span className="font-medium text-slate-700">{station.estimatedWaitMin} min</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                  <Link
                    to={`/user/stations/${station.id}`}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold py-1.5 px-2 rounded text-center transition"
                  >
                    View Station
                  </Link>
                  <Link
                    to={`/user/reserve?stationId=${station.id}`}
                    className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold py-1.5 px-2 rounded text-center transition"
                  >
                    Reserve
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Conflict Demonstration Modal */}
      {conflictModalOpen && conflictResult && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl border border-slate-200 text-slate-900">
            <div className="flex items-center gap-2 text-rose-600 mb-3">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="font-bold text-base">Walk-in Conflict Protected</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Simulated Action:</strong> Walk-in customer (User B) arrived at{' '}
              <em>GreenVolt Charging Hub</em> and attempted to plug into <strong>Charger C02</strong>.
            </p>

            <div className="mt-3 bg-rose-50 border border-rose-200 p-3 rounded text-xs text-rose-900">
              <p className="font-semibold">Hardware Lock Engaged:</p>
              <p className="mt-1">{conflictResult.reason}</p>
              <p className="mt-1 text-[11px] text-rose-700">
                Reservation: CS-20261007-4821 (10-minute grace period active).
              </p>
            </div>

            <div className="mt-4 bg-slate-50 p-3 rounded border border-slate-200 text-xs text-slate-700">
              <p className="font-semibold mb-1">System Alternatives Offered to Walk-in:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>Occupy Charger C01 (60 kW DC Fast — Available)</li>
                <li>Occupy Charger C04 (120 kW DC Fast — Available)</li>
                <li>Join Virtual Queue for C02 (after 7:30 PM)</li>
              </ul>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => setConflictModalOpen(false)}
                className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded transition"
              >
                Close Simulation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

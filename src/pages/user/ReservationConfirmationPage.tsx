import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  Zap,
  Navigation,
  ShieldCheck,
  QrCode,
  KeyRound,
  AlertTriangle,
  XCircle,
} from 'lucide-react';

export const ReservationConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { reservations, cancelReservation } = useApp();

  const reservation =
    reservations.find((r) => r.id === id) ||
    reservations[0] || {
      id: 'CS-20261007-4821',
      stationId: 'station-annanagar',
      stationName: 'GreenVolt Charging Hub',
      stationArea: 'Anna Nagar',
      chargerId: 'C02',
      chargerPower: '60 kW DC Fast',
      date: 'Today, 07 Oct 2026',
      timeSlot: '6:30 PM – 7:30 PM',
      gracePeriodMinutes: 10,
      gracePeriodEndsTime: '6:40 PM',
      status: 'confirmed' as const,
      pricePerKwh: 14.0,
      estimatedCost: 350,
      vehicleName: 'Tata Nexon EV (TN 09 BX 7842)',
      otp: '482913',
      isVerified: false,
    };

  const [showOtpModal, setShowOtpModal] = useState<boolean>(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(584); // ~9 mins 44 sec

  // Countdown timer for 10-minute grace period simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel this reservation? The charger will be released.')) {
      cancelReservation(reservation.id);
      navigate('/user/dashboard');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 w-full font-sans">
      {/* Confirmation Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5 flex items-start gap-4 shadow-xs">
        <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <span className="text-xs uppercase font-bold text-emerald-800 tracking-wider">
            Booking Confirmed
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-0.5">
            Reservation Confirmed
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Charger <strong>{reservation.chargerId}</strong> is reserved exclusively for your vehicle. Walk-in customers are locked out.
          </p>
        </div>
      </div>

      {/* Main Ticket Card */}
      <div className="mt-6 bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        {/* Ticket Header */}
        <div className="bg-slate-900 text-white p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Reservation Token</span>
            <span className="text-lg font-mono font-bold tracking-wider text-emerald-400">
              {reservation.id}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Status</span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-700/60 px-2 py-0.5 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              {reservation.status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* 10-Minute Grace Period Live Countdown Banner */}
        <div className="bg-amber-50 border-y border-amber-200 px-5 py-3 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-700" />
            <span>
              <strong>Arrival Grace Window:</strong> Valid until {reservation.gracePeriodEndsTime}
            </span>
          </div>
          <div className="font-mono font-bold text-sm text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded border border-amber-300">
            {formatTimer(secondsRemaining)} remaining
          </div>
        </div>

        {/* Ticket Details Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 space-y-4 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">
                Station & Location
              </span>
              <p className="text-base font-bold text-slate-900 mt-0.5">{reservation.stationName}</p>
              <p className="text-slate-500">{reservation.stationArea}, Chennai</p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">
                  Reserved Bay
                </span>
                <p className="text-sm font-mono font-bold text-slate-900 mt-0.5">
                  Charger {reservation.chargerId}
                </p>
                <p className="text-slate-500">{reservation.chargerPower}</p>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">
                  Time Slot
                </span>
                <p className="text-sm font-semibold text-slate-900 mt-0.5">{reservation.timeSlot}</p>
                <p className="text-slate-500">{reservation.date}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">
                  Vehicle
                </span>
                <p className="text-xs font-semibold text-slate-800 mt-0.5">
                  {reservation.vehicleName}
                </p>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">
                  Estimated Tariff
                </span>
                <p className="text-xs font-semibold text-slate-800 mt-0.5">
                  ₹{reservation.pricePerKwh}/kWh (~₹{reservation.estimatedCost})
                </p>
              </div>
            </div>
          </div>

          {/* QR Code and Quick Code box */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-50 rounded border border-slate-200 text-center">
            {/* Functional QR Code SVG */}
            <div className="p-2 bg-white rounded border border-slate-300 shadow-2xs">
              <svg className="w-32 h-32 text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                <path d="M10 10h30v30h-30zM15 15v20h20v-20zM60 10h30v30h-30zM65 15v20h20v-20zM10 60h30v30h-30zM15 65v20h20v-20zM22 22h6v6h-6zM72 22h6v6h-6zM22 72h6v6h-6zM45 10h10v10h-10zM10 45h10v10h-10zM45 45h10v10h-10zM60 45h10v10h-10zM75 45h15v10h-15zM45 60h10v15h-10zM60 60h15v10h-15zM75 60h15v20h-15zM45 80h10v10h-10zM60 80h10v10h-10z" />
              </svg>
            </div>
            <span className="text-[11px] text-slate-500 mt-2 font-mono">Scan at Charger Screen</span>
            <button
              onClick={() => setShowOtpModal(true)}
              className="mt-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 underline"
            >
              Or Show 6-Digit OTP
            </button>
          </div>
        </div>

        {/* Action Buttons Toolbar (Prompt Requirements) */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowOtpModal(true)}
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-4 py-2 rounded transition flex items-center gap-1.5 shadow-xs"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Show OTP</span>
            </button>

            <Link
              to="/user/verify-otp"
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded transition"
            >
              Proceed to OTP Check-in
            </Link>

            <a
              href="https://www.google.com/maps"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold px-3 py-2 rounded transition flex items-center gap-1"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Get Directions</span>
            </a>
          </div>

          <div>
            <button
              onClick={handleCancel}
              className="text-rose-600 hover:text-rose-700 font-semibold text-xs px-3 py-2 flex items-center gap-1"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Cancel Reservation</span>
            </button>
          </div>
        </div>
      </div>

      {/* OTP Display Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-6 shadow-xl border border-slate-200 text-slate-900 text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center mb-3">
              <KeyRound className="w-5 h-5" />
            </div>

            <h3 className="font-bold text-base">Your Check-in OTP</h3>
            <p className="text-xs text-slate-500 mt-1">
              Enter this on the charger screen at {reservation.stationName}
            </p>

            <div className="my-5 p-3 bg-slate-100 border border-slate-200 rounded-lg">
              <span className="font-mono text-3xl font-extrabold tracking-widest text-slate-900">
                {reservation.otp || '482913'}
              </span>
            </div>

            <p className="text-[11px] text-slate-500 mb-4">
              Demo preset OTP: <strong>482913</strong>
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowOtpModal(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-2 rounded transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowOtpModal(false);
                  navigate('/user/verify-otp');
                }}
                className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold py-2 rounded transition"
              >
                Verify Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

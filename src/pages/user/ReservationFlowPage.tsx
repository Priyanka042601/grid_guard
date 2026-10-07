import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Clock,
  Zap,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Lock,
} from 'lucide-react';

export const ReservationFlowPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { stations, createReservation } = useApp();

  const stationIdParam = searchParams.get('stationId') || 'station-annanagar';
  const chargerIdParam = searchParams.get('chargerId') || '';

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedStationId, setSelectedStationId] = useState<string>(stationIdParam);
  const [selectedDate, setSelectedDate] = useState<string>('Today, 07 Oct 2026');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('6:30 PM – 7:30 PM');
  const [selectedChargerId, setSelectedChargerId] = useState<string>(chargerIdParam || 'C01');

  const station = stations.find((s) => s.id === selectedStationId) || stations[0];

  useEffect(() => {
    // If a charger was passed in URL and is available, preselect
    if (chargerIdParam) {
      setSelectedChargerId(chargerIdParam);
    } else {
      const firstFree = station.chargers.find((c) => c.status === 'available');
      if (firstFree) setSelectedChargerId(firstFree.id);
    }
  }, [station, chargerIdParam]);

  const timeSlots = [
    '6:00 PM – 7:00 PM',
    '6:30 PM – 7:30 PM',
    '7:00 PM – 8:00 PM',
    '7:30 PM – 8:30 PM',
    '8:00 PM – 9:00 PM',
    '9:00 PM – 10:00 PM',
  ];

  const dates = [
    { label: 'Today (07 Oct)', value: 'Today, 07 Oct 2026' },
    { label: 'Tomorrow (08 Oct)', value: 'Tomorrow, 08 Oct 2026' },
    { label: 'Friday (09 Oct)', value: 'Friday, 09 Oct 2026' },
  ];

  const selectedCharger = station.chargers.find((c) => c.id === selectedChargerId) || station.chargers[0];

  const handleConfirm = () => {
    const reservation = createReservation({
      stationId: station.id,
      chargerId: selectedChargerId,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
    });

    navigate(`/user/reservation/${reservation.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full font-sans">
      {/* Step Indicator Header */}
      <div className="mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Reserve an EV Charger
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Step {currentStep} of 5: Guaranteed port lock with 10-minute grace arrival protection.
        </p>

        {/* 5-step visual bar */}
        <div className="mt-4 grid grid-cols-5 gap-2 text-xs">
          {[
            { step: 1, label: 'Date' },
            { step: 2, label: 'Time' },
            { step: 3, label: 'Charger' },
            { step: 4, label: 'Review' },
            { step: 5, label: 'Confirm' },
          ].map((s) => (
            <div
              key={s.step}
              className={`p-2 rounded border text-center transition ${
                currentStep === s.step
                  ? 'border-emerald-700 bg-emerald-50 text-emerald-900 font-bold'
                  : currentStep > s.step
                  ? 'border-slate-300 bg-slate-100 text-slate-700 font-medium'
                  : 'border-slate-200 bg-white text-slate-400'
              }`}
            >
              <span className="block text-[10px] uppercase text-slate-400">Step {s.step}</span>
              <span className="text-xs">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Step Cards */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
        {/* STEP 1: Select Date */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900">Step 1: Select Date</h2>
            <p className="text-xs text-slate-500">
              Station: <strong>{station.name}</strong> ({station.area})
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {dates.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setSelectedDate(d.value)}
                  className={`p-4 rounded border text-left transition ${
                    selectedDate === d.value
                      ? 'border-emerald-700 bg-emerald-50 text-emerald-900 font-semibold ring-1 ring-emerald-700'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Calendar className="w-4 h-4 mb-2 text-slate-500" />
                  <span className="block text-xs font-bold">{d.label}</span>
                  <span className="text-[11px] text-slate-500">Slots open</span>
                </button>
              ))}
            </div>

            <div className="pt-6 flex justify-end">
              <button
                onClick={() => setCurrentStep(2)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs px-5 py-2 rounded flex items-center gap-1 transition"
              >
                <span>Continue to Time Slot</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Select Time */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900">Step 2: Select Time Slot</h2>
            <p className="text-xs text-slate-500">
              Date: <strong>{selectedDate}</strong> at {station.name}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedTimeSlot(slot)}
                  className={`p-3.5 rounded border text-center transition ${
                    selectedTimeSlot === slot
                      ? 'border-emerald-700 bg-emerald-50 text-emerald-900 font-semibold ring-1 ring-emerald-700'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Clock className="w-4 h-4 mx-auto mb-1 text-slate-500" />
                  <span className="block text-xs font-bold">{slot}</span>
                  <span className="text-[10px] text-emerald-700 font-medium">Standard Slot</span>
                </button>
              ))}
            </div>

            <div className="pt-6 flex items-center justify-between border-t border-slate-100">
              <button
                onClick={() => setCurrentStep(1)}
                className="text-xs text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs px-5 py-2 rounded flex items-center gap-1 transition"
              >
                <span>Select Charger</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Select Charger */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900">Step 3: Select Charger</h2>
            <p className="text-xs text-slate-500">
              Choose your physical charging bay at {station.name}.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {station.chargers.map((c) => {
                const isAvail = c.status === 'available';
                const isSelected = selectedChargerId === c.id;

                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      if (isAvail) setSelectedChargerId(c.id);
                    }}
                    className={`p-4 rounded border transition ${
                      !isAvail
                        ? 'opacity-50 bg-slate-50 border-slate-200 cursor-not-allowed'
                        : isSelected
                        ? 'border-emerald-700 bg-emerald-50 cursor-pointer ring-1 ring-emerald-700'
                        : 'border-slate-200 bg-white hover:bg-slate-50 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-sm text-slate-900">{c.id}</span>
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                          isAvail
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {isAvail ? 'Available' : 'Occupied / Reserved'}
                      </span>
                    </div>

                    <div className="mt-2 text-xs text-slate-600">
                      <p className="font-medium text-slate-800">{c.powerKw} kW • {c.type}</p>
                      <p className="text-[11px] text-slate-500">Connector: {c.connector}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-6 flex items-center justify-between border-t border-slate-100">
              <button
                onClick={() => setCurrentStep(2)}
                className="text-xs text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs px-5 py-2 rounded flex items-center gap-1 transition"
              >
                <span>Review Reservation</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Review Reservation */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900">Step 4: Review Reservation Details</h2>

            <div className="bg-slate-50 p-4 rounded border border-slate-200 divide-y divide-slate-200 text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500">Charging Station:</span>
                <span className="font-semibold text-slate-900">{station.name} ({station.area})</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500">Assigned Charger:</span>
                <span className="font-mono font-semibold text-slate-900">
                  {selectedCharger.id} ({selectedCharger.powerKw} kW {selectedCharger.type})
                </span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500">Date & Slot:</span>
                <span className="font-semibold text-slate-900">{selectedDate} • {selectedTimeSlot}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500">Tariff Rate:</span>
                <span className="font-semibold text-slate-900">₹{station.pricePerKwh}/kWh</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500">Estimated Cost (~24 kWh):</span>
                <span className="font-bold text-emerald-800">
                  ₹{Math.round(station.pricePerKwh * 24)}
                </span>
              </div>
            </div>

            {/* Mandatory Policies & Rules (Prompt Requirement) */}
            <div className="bg-blue-50 border border-blue-200 p-4 rounded text-xs text-blue-950 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-blue-900">
                <ShieldCheck className="w-4 h-4 text-blue-700" />
                <span>Reservation Rules & Walk-in Protection</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-blue-900 text-[11px]">
                <li>
                  <strong>10-Minute Grace Period:</strong> Your charger is locked for you until 10 minutes past the slot start time.
                </li>
                <li>
                  <strong>Walk-in Lock:</strong> Walk-in customers cannot initiate sessions on your reserved port.
                </li>
                <li>
                  <strong>Cancellation Policy:</strong> Free cancellation up to 30 minutes before slot start.
                </li>
              </ul>
            </div>

            <div className="pt-6 flex items-center justify-between border-t border-slate-100">
              <button
                onClick={() => setCurrentStep(3)}
                className="text-xs text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setCurrentStep(5)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs px-5 py-2 rounded flex items-center gap-1 transition"
              >
                <span>Proceed to Confirmation</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Confirm & Book */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900">Step 5: Confirm Booking</h2>
            <p className="text-xs text-slate-500">
              Click below to generate your reservation token and check-in OTP.
            </p>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-900">
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Ready to Confirm</span>
              </div>
              <p className="mt-1 text-slate-700">
                Reservation will be recorded immediately in Chennai Central Dispatch. No pre-payment required; billed post-charge.
              </p>
            </div>

            <div className="pt-6 flex items-center justify-between border-t border-slate-100">
              <button
                onClick={() => setCurrentStep(4)}
                className="text-xs text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={handleConfirm}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-6 py-2.5 rounded shadow-sm transition active:scale-95"
              >
                Confirm Reservation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

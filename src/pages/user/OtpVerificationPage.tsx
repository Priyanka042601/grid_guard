import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Zap,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const OtpVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeReservation, verifyOtp } = useApp();

  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const reservationId = activeReservation?.id || 'CS-20261007-4821';
  const stationName = activeReservation?.stationName || 'GreenVolt Charging Hub';
  const chargerId = activeReservation?.chargerId || 'C02';

  const handleDigitChange = (index: number, val: string) => {
    if (val.length > 1) {
      val = val.slice(-1);
    }
    const next = [...otpDigits];
    next[index] = val;
    setOtpDigits(next);
    setErrorMsg('');

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleQuickPasteDemo = () => {
    const demo = ['4', '8', '2', '9', '1', '3'];
    setOtpDigits(demo);
    setErrorMsg('');
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otpDigits.join('');

    if (fullOtp.length < 6) {
      setErrorMsg('Please enter all 6 digits of your OTP.');
      return;
    }

    const result = verifyOtp(reservationId, fullOtp);
    if (result.success) {
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/user/active-session');
      }, 1500);
    } else {
      setErrorMsg(result.message);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 w-full font-sans">
      <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-sm">
        {/* Verification Icon Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 mx-auto flex items-center justify-center mb-3">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">OTP Verification</h1>
          <p className="text-xs text-slate-500 mt-1">
            Punch in OTP on charger screen to unlock bay and begin power delivery
          </p>
        </div>

        {/* Reservation Context Card */}
        <div className="bg-slate-50 p-3.5 rounded border border-slate-200 text-xs mb-6 space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-500">Reservation:</span>
            <span className="font-mono font-bold text-slate-900">{reservationId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Station:</span>
            <span className="font-medium text-slate-800">{stationName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Charger:</span>
            <span className="font-mono font-bold text-emerald-700">{chargerId} (60 kW DC)</span>
          </div>
        </div>

        {/* Success Banner */}
        {isSuccess ? (
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded text-center text-xs text-emerald-900 mb-6 animate-pulse">
            <CheckCircle2 className="w-6 h-6 text-emerald-700 mx-auto mb-1" />
            <h3 className="font-bold text-sm text-emerald-900">Reservation Verified!</h3>
            <p className="mt-1 text-slate-600">
              Charger status changed: <strong>Reserved → Charging</strong>. Unlocking plug...
            </p>
          </div>
        ) : (
          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 text-center mb-3">
                Enter 6-Digit OTP:
              </label>

              {/* 6 Digit Inputs */}
              <div className="flex justify-center gap-2">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-11 h-12 text-center text-xl font-bold font-mono border border-slate-300 rounded focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 bg-white"
                  />
                ))}
              </div>

              {errorMsg && (
                <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-rose-600">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>

            {/* Quick Demo Paste Button */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleQuickPasteDemo}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold underline"
              >
                Auto-fill Demo Code (482913)
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs py-2.5 rounded shadow-sm transition flex items-center justify-center gap-2 active:scale-95"
            >
              <Zap className="w-4 h-4" />
              <span>Verify OTP & Start Charging</span>
            </button>
          </form>
        )}

        {/* Security explanation */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <span>
            Hardware relay locks the CCS2 plug until validated by Chennai Central Cloud.
          </span>
        </div>
      </div>
    </div>
  );
};

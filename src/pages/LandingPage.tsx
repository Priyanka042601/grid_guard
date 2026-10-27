import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Zap,
  ShieldCheck,
  CalendarCheck,
  TrendingUp,
  Clock,
  ArrowRight,
  MapPin,
  CheckCircle2,
  Lock,
  BatteryCharging,
  SlidersHorizontal,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { switchRole } = useApp();

  const handleOwnerClick = () => {
    switchRole('station_owner');
    navigate('/owner/dashboard');
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 font-sans">
      {/* Hero Section */}
      <section className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              Chennai EV Charging Network • Tamil Nadu
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
              Charge smarter. Reserve faster. Drive further.
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              Find available EV chargers, compare stations, predict demand, reserve a charger, and avoid unnecessary waiting.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/user/stations"
                className="inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-sm px-5 py-2.5 rounded shadow-sm transition active:scale-95"
              >
                <span>Find a Charger</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={handleOwnerClick}
                className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-sm px-5 py-2.5 rounded border border-slate-300 transition"
              >
                <span>Station Owner Login</span>
              </button>

              <Link
                to="/user/map"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 px-3 py-2"
              >
                <MapPin className="w-4 h-4" />
                <span>Explore Chennai Map</span>
              </Link>
            </div>
          </div>

          {/* Practical Product Preview Card (Realistic Dashboard Snapshot, not floating AI blobs) */}
          <div className="mt-12 bg-slate-50 border border-slate-200 rounded-lg p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  Live Network Snapshot
                </span>
                <h3 className="text-base font-semibold text-slate-900 mt-0.5">
                  Greater Chennai Metropolitan Area
                </h3>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span> 52 Available
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span> 9 Reserved
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span> 5 Charging
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded border border-slate-200">
                <div className="text-xs text-slate-500 font-medium">Recommended Nearest</div>
                <div className="font-semibold text-sm text-slate-900 mt-1">GreenVolt Charging Hub</div>
                <div className="text-xs text-slate-600 mt-0.5">Anna Nagar West • 2.4 km</div>
                <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                  <span className="text-emerald-700 font-semibold">4/6 Available</span>
                  <span className="font-medium text-slate-800">₹14/kWh</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded border border-slate-200">
                <div className="text-xs text-slate-500 font-medium">Active Reservation Protection</div>
                <div className="font-semibold text-sm text-slate-900 mt-1">CS-20261007-4821</div>
                <div className="text-xs text-slate-600 mt-0.5">Charger C02 • 6:30 PM - 7:30 PM</div>
                <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                  <span className="text-blue-700 font-semibold">10-min Grace Period</span>
                  <span className="text-slate-500">Walk-in Locked</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded border border-slate-200">
                <div className="text-xs text-slate-500 font-medium">Fastest Ultra-DC (120 kW)</div>
                <div className="font-semibold text-sm text-slate-900 mt-1">VoltGo Express</div>
                <div className="text-xs text-slate-600 mt-0.5">Adyar • 7.5 km</div>
                <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                  <span className="text-emerald-700 font-semibold">3/4 Available</span>
                  <span className="font-medium text-slate-800">25 min to 80%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-200">
        <div className="text-left mb-10">
          <span className="text-xs uppercase font-semibold text-emerald-800 tracking-wider">Process Flow</span>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">How Grid Guard Works</h2>
          <p className="text-sm text-slate-600 mt-1">From discovery to departure without friction or queues.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            {
              step: '1',
              title: 'Find a Charger',
              desc: 'Search Chennai stations by area, charging speed (60/120 kW), pricing, and real-time status.',
            },
            {
              step: '2',
              title: 'Compare Availability',
              desc: 'See live slot occupancy, wait times, tariffs, and smart demand forecasts before leaving.',
            },
            {
              step: '3',
              title: 'Reserve a Charger',
              desc: 'Book your exact slot and charger ID. Walk-ins are automatically locked out.',
            },
            {
              step: '4',
              title: 'Verify with OTP',
              desc: 'Arrive within the 10-minute grace window and punch in your secure OTP (482913).',
            },
            {
              step: '5',
              title: 'Charge Without Waiting',
              desc: 'Monitor real-time kWh telemetry, battery percent, and pay seamlessly via UPI.',
            },
          ].map((item) => (
            <div key={item.step} className="bg-white p-5 rounded border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="w-7 h-7 rounded bg-slate-900 text-white flex items-center justify-center text-xs font-bold mb-3">
                  {item.step}
                </div>
                <h3 className="font-semibold text-sm text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{item.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-medium text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Step</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Key Capabilities Grid */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-10">
            <span className="text-xs uppercase font-semibold text-emerald-800 tracking-wider">Features</span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">Key Capabilities</h2>
            <p className="text-sm text-slate-600 mt-1">Engineered to eliminate charging anxiety and station downtime.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-5 rounded border border-slate-200 bg-slate-50">
              <div className="w-8 h-8 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
                <Zap className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-sm text-slate-900">Real-time charger availability</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Live OCPP telemetry directly from chargers across Anna Nagar, T Nagar, Adyar, Guindy, and OMR.
              </p>
            </div>

            <div className="p-5 rounded border border-slate-200 bg-slate-50">
              <div className="w-8 h-8 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-sm text-slate-900">Smart charging recommendations</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Considers your Tata Nexon EV battery (32%), travel distance, tariff differences, and waiting time.
              </p>
            </div>

            <div className="p-5 rounded border border-slate-200 bg-slate-50">
              <div className="w-8 h-8 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
                <CalendarCheck className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-sm text-slate-900">Online reservations</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Guaranteed slot booking with instant confirmation ID (e.g. CS-20261007-4821) and directions.
              </p>
            </div>

            <div className="p-5 rounded border border-slate-200 bg-slate-50">
              <div className="w-8 h-8 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
                <Lock className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-sm text-slate-900">Walk-in conflict protection</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Reserved chargers are electronically locked. Walk-in drivers are advised to join the virtual queue or choose alternate ports.
              </p>
            </div>

            <div className="p-5 rounded border border-slate-200 bg-slate-50">
              <div className="w-8 h-8 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
                <Clock className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-sm text-slate-900">Queue management</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Virtual line assignment with transparent queue position, live wait estimations, and instant ping when ready.
              </p>
            </div>

            <div className="p-5 rounded border border-slate-200 bg-slate-50">
              <div className="w-8 h-8 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-sm text-slate-900">Demand forecasting & analytics</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Station operators and platform admins monitor 24-hour load curves, peak utilization, and tariff optimizations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="py-12 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold tracking-tight">Ready to test the Grid Guard platform?</h3>
            <p className="text-xs text-slate-400 mt-1">
              Switch seamlessly between EV Driver, Station Owner, and Platform Admin experiences.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/user/dashboard"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded transition"
            >
              Open EV User Dashboard
            </Link>
            <button
              onClick={handleOwnerClick}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded border border-slate-700 transition"
            >
              Open Station Owner Portal
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

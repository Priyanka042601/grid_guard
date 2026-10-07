import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Zap,
  MapPin,
  Star,
  CheckCircle2,
  Plus,
  Search,
  Filter,
  Edit,
  Power,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminStationsPage: React.FC = () => {
  const { stations, addNotification } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredStations = stations.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleStationStatus = (stationName: string) => {
    addNotification('Station State Toggled', `Audit status refreshed for ${stationName}`, 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full font-sans">
      <div className="pb-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Station Fleet Administration
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage all 11 registered EV charging hubs across Greater Chennai.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs px-3.5 py-2 rounded transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Onboard New Station</span>
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by station name or Chennai neighborhood..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded bg-white"
          />
        </div>
        <span className="text-xs text-slate-500">
          Showing {filteredStations.length} of {stations.length} hubs
        </span>
      </div>

      {/* Stations Table */}
      <div className="mt-4 bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-semibold text-[11px]">
              <tr>
                <th className="py-3 px-4">Station Name</th>
                <th className="py-3 px-4">Area & Location</th>
                <th className="py-3 px-4">Bays</th>
                <th className="py-3 px-4">Base Tariff</th>
                <th className="py-3 px-4">Operator</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Compliance</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStations.map((st) => {
                const avail = st.chargers.filter((c) => c.status === 'available').length;
                return (
                  <tr key={st.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <Link to={`/user/stations/${st.id}`} className="hover:text-emerald-700">
                        {st.name}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 block">{st.area}</span>
                      <span className="text-slate-500 text-[11px] line-clamp-1">{st.address}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900">{avail} / {st.chargers.length} Free</span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      ₹{st.pricePerKwh}/kWh
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{st.operator}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 font-semibold text-slate-800">
                        <Star className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                        <span>{st.rating}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                        TANGEDCO Certified
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/user/stations/${st.id}`}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded text-xs font-medium"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleToggleStationStatus(st.name)}
                          className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-2 py-1 rounded text-xs font-medium border border-emerald-200"
                        >
                          Audit
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

      {/* Onboard Modal Mock */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl border border-slate-200 text-slate-900 text-xs">
            <h3 className="font-bold text-base mb-1">Onboard New Chennai Charging Station</h3>
            <p className="text-slate-500 mb-4">Register station with Chennai Central Cloud</p>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Station Name</label>
                <input
                  type="text"
                  placeholder="e.g. Alwarpet GreenPoint Hub"
                  className="w-full border border-slate-300 rounded px-3 py-1.5 bg-white"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Chennai Area / Neighborhood</label>
                <input
                  type="text"
                  placeholder="e.g. Alwarpet / TTK Road"
                  className="w-full border border-slate-300 rounded px-3 py-1.5 bg-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Charger Ports</label>
                  <input
                    type="number"
                    defaultValue={4}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Base Tariff (₹/kWh)</label>
                  <input
                    type="number"
                    defaultValue={14.0}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  addNotification('Station Registered', 'New station submitted for grid safety inspection.', 'success');
                }}
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded font-semibold"
              >
                Submit Station
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

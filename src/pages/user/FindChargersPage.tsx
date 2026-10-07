import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Filter,
  Zap,
  Clock,
  Star,
  MapPin,
  Calendar,
  Navigation,
  ArrowUpDown,
  CheckCircle2,
  AlertTriangle,
  Flame,
} from 'lucide-react';

export const FindChargersPage: React.FC = () => {
  const navigate = useNavigate();
  const { stations } = useApp();

  const [query, setQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('All');
  const [chargerType, setChargerType] = useState('All');
  const [minPower, setMinPower] = useState(0);
  const [maxPrice, setMaxPrice] = useState(25);
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'recommended' | 'nearest' | 'cheapest' | 'fastest' | 'rating'>('recommended');

  const areas = ['All', 'Anna Nagar', 'T Nagar', 'Adyar', 'Guindy', 'OMR', 'Velachery', 'Tambaram', 'Porur', 'Sholinganallur'];

  const filteredStations = useMemo(() => {
    let result = stations.filter((station) => {
      // Text search
      if (
        query &&
        !station.name.toLowerCase().includes(query.toLowerCase()) &&
        !station.area.toLowerCase().includes(query.toLowerCase()) &&
        !station.address.toLowerCase().includes(query.toLowerCase())
      ) {
        return false;
      }

      // Area
      if (selectedArea !== 'All' && station.area !== selectedArea) {
        return false;
      }

      // Connector type
      if (chargerType !== 'All') {
        const hasConnector = station.chargers.some((c) => c.connector === chargerType);
        if (!hasConnector) return false;
      }

      // Min power
      if (minPower > 0) {
        const maxKw = Math.max(...station.chargers.map((c) => c.powerKw));
        if (maxKw < minPower) return false;
      }

      // Price limit
      if (station.pricePerKwh > maxPrice) {
        return false;
      }

      // Open now
      if (openNowOnly && !station.openingHours.includes('24 Hours')) {
        return false;
      }

      // Available only
      if (availableOnly) {
        const freeCount = station.chargers.filter((c) => c.status === 'available').length;
        if (freeCount === 0) return false;
      }

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'nearest') return a.distanceKm - b.distanceKm;
      if (sortBy === 'cheapest') return a.pricePerKwh - b.pricePerKwh;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'fastest') {
        const maxA = Math.max(...a.chargers.map((c) => c.powerKw));
        const maxB = Math.max(...b.chargers.map((c) => c.powerKw));
        return maxB - maxA;
      }
      // 'recommended': balanced score
      const scoreA = a.rating * 20 - a.distanceKm * 2 - a.pricePerKwh;
      const scoreB = b.rating * 20 - b.distanceKm * 2 - b.pricePerKwh;
      return scoreB - scoreA;
    });

    return result;
  }, [stations, query, selectedArea, chargerType, minPower, maxPrice, openNowOnly, availableOnly, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full font-sans">
      {/* Title & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Find EV Chargers in Chennai
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare live station availability, charging power, waiting times, and tariffs.
          </p>
        </div>

        <Link
          to="/user/map"
          className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-3.5 py-2 rounded border border-slate-300 transition"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Switch to Map View</span>
        </Link>
      </div>

      {/* Filter and Search Bar Section */}
      <div className="mt-6 bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
        {/* Search bar + Sort Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search location, road, or station (e.g. Anna Nagar, Guindy, OMR, GreenVolt)..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded focus:bg-white focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700"
            />
          </div>

          <div className="md:col-span-4 flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 shrink-0">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full text-xs bg-white border border-slate-300 rounded px-2.5 py-2 text-slate-800 font-medium focus:ring-emerald-700 focus:border-emerald-700"
            >
              <option value="recommended">Recommended (Smart Match)</option>
              <option value="nearest">Nearest Distance (km)</option>
              <option value="cheapest">Cheapest Tariff (₹/kWh)</option>
              <option value="fastest">Fastest Charging Power (kW)</option>
              <option value="rating">Highest User Rating</option>
            </select>
          </div>
        </div>

        {/* Detailed Filter Pills */}
        <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          {/* Area */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Chennai Zone</label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded px-2 py-1.5 bg-white text-slate-800"
            >
              {areas.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* Charger Type */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Connector</label>
            <select
              value={chargerType}
              onChange={(e) => setChargerType(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded px-2 py-1.5 bg-white text-slate-800"
            >
              <option value="All">All Connectors</option>
              <option value="CCS2">CCS2 (DC Fast)</option>
              <option value="Type 2">Type 2 (AC)</option>
              <option value="CHAdeMO">CHAdeMO</option>
            </select>
          </div>

          {/* Speed */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Speed</label>
            <select
              value={minPower}
              onChange={(e) => setMinPower(Number(e.target.value))}
              className="w-full text-xs border border-slate-300 rounded px-2 py-1.5 bg-white text-slate-800"
            >
              <option value="0">Any Speed</option>
              <option value="50">50 kW+ Fast</option>
              <option value="100">100 kW+ Ultra-DC</option>
            </select>
          </div>

          {/* Max Price */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Max Tariff (₹{maxPrice}/kWh)
            </label>
            <input
              type="range"
              min="10"
              max="20"
              step="0.5"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-700 mt-2"
            />
          </div>

          {/* Checkboxes */}
          <div className="flex flex-col justify-end">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 py-1">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="font-medium text-xs">Available Ports Only</span>
            </label>
          </div>

          <div className="flex flex-col justify-end">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 py-1">
              <input
                type="checkbox"
                checked={openNowOnly}
                onChange={(e) => setOpenNowOnly(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="font-medium text-xs">24/7 Open Stations</span>
            </label>
          </div>
        </div>
      </div>

      {/* Results Count & Station Cards Grid */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-slate-700">
            Showing {filteredStations.length} of {stations.length} Charging Stations
          </span>
          <span className="text-xs text-slate-400">Live OCPP 1.6 / 2.0.1 Connected</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredStations.map((station) => {
            const availableCount = station.chargers.filter((c) => c.status === 'available').length;
            const fastChargerCount = station.chargers.filter((c) => c.type === 'DC Fast').length;

            return (
              <div
                key={station.id}
                className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm hover:border-slate-300 transition flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-base text-slate-900 leading-snug">
                        {station.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {station.area} • {station.distanceKm} km away
                      </p>
                    </div>

                    <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-xs font-semibold text-slate-800 shrink-0">
                      <Star className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                      <span>{station.rating}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({station.reviewCount})</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-1">{station.address}</p>

                  {/* Operational Metrics Block */}
                  <div className="mt-4 grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded border border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Availability</span>
                      <span
                        className={`font-semibold ${
                          availableCount > 0 ? 'text-emerald-700' : 'text-rose-600'
                        }`}
                      >
                        {availableCount}/{station.chargers.length} free
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Tariff</span>
                      <span className="font-semibold text-slate-800">₹{station.pricePerKwh}/kWh</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Est. Wait</span>
                      <span className="font-medium text-slate-700">{station.estimatedWaitMin} min</span>
                    </div>
                  </div>

                  {/* Highlights / Power info */}
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-slate-600 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{fastChargerCount} DC Fast Ports</span>
                    </span>
                    <span className="text-slate-500 text-[11px]">{station.openingHours}</span>
                  </div>

                  {/* Power levels pills */}
                  <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                    {station.powerLevels.map((pwr) => (
                      <span
                        key={pwr}
                        className="text-[10px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded"
                      >
                        {pwr}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/user/stations/${station.id}`)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold py-2 px-3 rounded text-center transition"
                  >
                    View Station
                  </button>
                  <button
                    onClick={() => navigate(`/user/reserve?stationId=${station.id}`)}
                    className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold py-2 px-3 rounded text-center transition flex items-center justify-center gap-1"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Reserve</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

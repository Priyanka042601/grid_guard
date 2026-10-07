import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ChargingMap } from '../../components/map/ChargingMap';
import {
  Search,
  Filter,
  Zap,
  Clock,
  Star,
  MapPin,
  Calendar,
  Navigation,
  SlidersHorizontal,
  ChevronRight,
  Info,
} from 'lucide-react';

export const InteractiveMapPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    stations,
    selectedStationId,
    setSelectedStationId,
    searchQuery,
    setSearchQuery,
    filterArea,
    setFilterArea,
  } = useApp();

  const [minPower, setMinPower] = useState<number>(0);
  const [availableOnly, setAvailableOnly] = useState<boolean>(false);
  const [maxPrice, setMaxPrice] = useState<number>(20);

  // Areas in Chennai
  const areas = ['All', 'Anna Nagar', 'T Nagar', 'Adyar', 'Guindy', 'OMR', 'Velachery', 'Tambaram', 'Porur', 'Sholinganallur'];

  // Filter logic
  const filteredStations = useMemo(() => {
    return stations.filter((station) => {
      // Search term
      if (
        searchQuery &&
        !station.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !station.area.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !station.address.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Area filter
      if (filterArea !== 'All' && station.area !== filterArea) {
        return false;
      }

      // Available only filter
      if (availableOnly) {
        const freeCount = station.chargers.filter((c) => c.status === 'available').length;
        if (freeCount === 0) return false;
      }

      // Price filter
      if (station.pricePerKwh > maxPrice) {
        return false;
      }

      // Min power filter
      if (minPower > 0) {
        const maxStationPower = Math.max(...station.chargers.map((c) => c.powerKw));
        if (maxStationPower < minPower) return false;
      }

      return true;
    });
  }, [stations, searchQuery, filterArea, availableOnly, maxPrice, minPower]);

  const selectedStation = useMemo(
    () => stations.find((s) => s.id === selectedStationId) || stations[0],
    [stations, selectedStationId]
  );

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-6rem)] min-h-[600px] overflow-hidden bg-slate-50">
      {/* Top filter bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-[280px] max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Chennai area, road or station name..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded focus:bg-white focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700"
              />
            </div>
          </div>

          {/* Quick area pill filters */}
          <div className="hidden md:flex items-center gap-1.5 overflow-x-auto text-xs">
            {areas.map((area) => (
              <button
                key={area}
                onClick={() => setFilterArea(area)}
                className={`px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap transition ${
                  filterArea === area
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {area}
              </button>
            ))}
          </div>

          {/* Additional Filter Controls */}
          <div className="flex items-center gap-3 text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="font-medium">Available Only</span>
            </label>

            <select
              value={minPower}
              onChange={(e) => setMinPower(Number(e.target.value))}
              aria-label="Filter by minimum charging speed"
              className="text-xs bg-white border border-slate-300 rounded px-2 py-1 text-slate-700 font-medium"
            >
              <option value="0">Any Speed</option>
              <option value="50">50+ kW (DC)</option>
              <option value="100">100+ kW (Ultra-Fast)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main split viewport: Left Station List + Right Map (Desktop), Map top + Results below (Mobile) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left Side: Station Search / Filter / Results List */}
        <div className="w-full lg:w-[420px] xl:w-[460px] h-1/2 lg:h-full flex flex-col bg-white border-r border-slate-200 shrink-0 z-20 order-2 lg:order-1">
          {/* Header count info */}
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <span className="font-semibold text-slate-800">
              {filteredStations.length} Stations Found
            </span>
            <span className="text-slate-500">Sorted by distance from Central</span>
          </div>

          {/* Scrollable list */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredStations.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="font-semibold text-slate-700">No stations match the selected filters</p>
                <p className="mt-1">Try resetting the area filter or unchecking "Available Only".</p>
                <button
                  onClick={() => {
                    setFilterArea('All');
                    setAvailableOnly(false);
                    setSearchQuery('');
                  }}
                  className="mt-3 px-3 py-1.5 bg-slate-100 text-slate-800 rounded font-medium hover:bg-slate-200"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredStations.map((station) => {
                const availableCount = station.chargers.filter((c) => c.status === 'available').length;
                const isSelected = station.id === selectedStationId;

                return (
                  <div
                    key={station.id}
                    onClick={() => setSelectedStationId(station.id)}
                    className={`p-4 cursor-pointer transition text-xs border-l-4 ${
                      isSelected
                        ? 'border-emerald-700 bg-emerald-50/40'
                        : 'border-transparent hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-sm text-slate-900">{station.name}</h3>
                        <p className="text-slate-500 mt-0.5">{station.address}</p>
                      </div>
                      <div className="flex items-center gap-1 bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[11px] font-semibold text-slate-700 shrink-0">
                        <Star className="w-3 h-3 text-emerald-600 fill-emerald-600" />
                        <span>{station.rating}</span>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2 bg-white p-2 rounded border border-slate-200 text-[11px]">
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
                        <span className="text-slate-400 block text-[10px]">Price</span>
                        <span className="font-semibold text-slate-800">₹{station.pricePerKwh}/kWh</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Wait Time</span>
                        <span className="font-medium text-slate-700">{station.estimatedWaitMin} min</span>
                      </div>
                    </div>

                    {/* Speed tags */}
                    <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                      {station.powerLevels.map((pwr) => (
                        <span
                          key={pwr}
                          className="text-[10px] bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded"
                        >
                          {pwr}
                        </span>
                      ))}
                    </div>

                    {/* Action buttons */}
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/user/stations/${station.id}`);
                        }}
                        className="text-slate-700 hover:text-slate-900 font-semibold text-xs flex items-center gap-0.5"
                      >
                        <span>Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center gap-1.5">
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 text-slate-600 hover:bg-slate-100 border border-slate-200 rounded"
                          title="Get Directions"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/user/reserve?stationId=${station.id}`);
                          }}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs px-3 py-1.5 rounded transition flex items-center gap-1"
                        >
                          <Calendar className="w-3 h-3" />
                          <span>Reserve</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Large Interactive Leaflet Map */}
        <div className="w-full lg:flex-1 h-1/2 lg:h-full relative order-1 lg:order-2">
          <ChargingMap
            stations={filteredStations}
            selectedStationId={selectedStationId}
            onSelectStation={(id) => setSelectedStationId(id)}
            onSearchArea={(center, zoom) => {
              // Smooth bounds refresh
              console.log('Map searched around:', center, zoom);
            }}
          />
        </div>
      </div>
    </div>
  );
};

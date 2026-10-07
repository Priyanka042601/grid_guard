import React, { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Station } from '../../types';
import { useNavigate } from 'react-router-dom';
import { Zap, Clock, Star, Navigation, Calendar } from 'lucide-react';

interface ChargingMapProps {
  stations: Station[];
  selectedStationId: string | null;
  onSelectStation: (id: string) => void;
  onSearchArea?: (center: [number, number], zoom: number) => void;
  height?: string;
}

// Controller component to smoothly pan/zoom when station selection changes
const MapController: React.FC<{
  selectedStation: Station | null;
  onAreaMoved: (center: [number, number], zoom: number) => void;
}> = ({ selectedStation, onAreaMoved }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedStation) {
      map.flyTo([selectedStation.lat, selectedStation.lng], 14, {
        duration: 1.2,
      });
    }
  }, [selectedStation, map]);

  useMapEvents({
    moveend: () => {
      const center = map.getCenter();
      onAreaMoved([center.lat, center.lng], map.getZoom());
    },
  });

  return null;
};

// Creates a professional, human-designed custom Leaflet marker
const createStationIcon = (station: Station, isSelected: boolean) => {
  const availableChargers = station.chargers.filter((c) => c.status === 'available').length;
  const totalChargers = station.chargers.length;

  let bgColor = '#16a34a'; // Green (Available)
  let textColor = '#ffffff';

  if (availableChargers === 0) {
    bgColor = '#dc2626'; // Red (Unavailable / Full)
  } else if (station.demandLevel === 'high') {
    bgColor = '#ea580c'; // Orange (High demand)
  } else if (availableChargers <= 1) {
    bgColor = '#2563eb'; // Blue (Reserved / Limited)
  }

  const selectedRing = isSelected ? 'box-shadow: 0 0 0 4px #0f172a, 0 6px 14px rgba(0,0,0,0.35); transform: scale(1.15);' : 'box-shadow: 0 2px 6px rgba(0,0,0,0.22);';

  const html = `
    <div style="
      background-color: ${bgColor};
      color: ${textColor};
      width: 34px;
      height: 34px;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border: 2px solid #ffffff;
      font-weight: 700;
      font-size: 11px;
      line-height: 1;
      cursor: pointer;
      transition: all 0.2s ease;
      ${selectedRing}
    ">
      <span style="font-size: 10px; margin-bottom: 1px;">⚡</span>
      <span>${availableChargers}</span>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-station-pin',
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -20],
  });
};

export const ChargingMap: React.FC<ChargingMapProps> = ({
  stations,
  selectedStationId,
  onSelectStation,
  onSearchArea,
  height = '100%',
}) => {
  const navigate = useNavigate();
  const [showSearchAreaBtn, setShowSearchAreaBtn] = React.useState(false);
  const currentCenterRef = useRef<[number, number]>([13.0418, 80.2341]);
  const currentZoomRef = useRef<number>(12);

  const selectedStation = useMemo(
    () => stations.find((s) => s.id === selectedStationId) || null,
    [stations, selectedStationId]
  );

  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
  const tileUrl = mapboxToken
    ? `https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/{z}/{x}/{y}?access_token=${mapboxToken}`
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  const tileAttribution = mapboxToken
    ? '&copy; <a href="https://www.mapbox.com/">Mapbox</a> &copy; OpenStreetMap'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  const handleMapMoved = (center: [number, number], zoom: number) => {
    currentCenterRef.current = center;
    currentZoomRef.current = zoom;
    setShowSearchAreaBtn(true);
  };

  const handleSearchThisAreaClick = () => {
    setShowSearchAreaBtn(false);
    if (onSearchArea) {
      onSearchArea(currentCenterRef.current, currentZoomRef.current);
    }
  };

  return (
    <div className="relative w-full overflow-hidden bg-slate-100 border border-slate-200" style={{ height }}>
      {/* Floating "Search this area" Button */}
      {showSearchAreaBtn && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] transition-all">
          <button
            onClick={handleSearchThisAreaClick}
            className="flex items-center gap-2 bg-white text-slate-800 text-xs font-semibold px-4 py-2 rounded-md shadow-md border border-slate-200 hover:bg-slate-50 transition active:scale-95"
          >
            <span>Search this area</span>
          </button>
        </div>
      )}

      {/* Map Legend / Guide */}
      <div className="absolute bottom-4 right-4 z-[400] bg-white/95 backdrop-blur-sm border border-slate-200 rounded-md p-2.5 shadow-sm text-xs hidden md:block">
        <div className="font-semibold text-slate-700 mb-1.5 flex items-center justify-between gap-4">
          <span>Charger Status</span>
          <span className="text-[10px] text-slate-400 font-normal">Chennai</span>
        </div>
        <div className="space-y-1 text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600"></span>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-blue-600"></span>
            <span>Limited / Reserved</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-600"></span>
            <span>High Demand</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-600"></span>
            <span>Full / Fault</span>
          </div>
        </div>
      </div>

      <MapContainer
        center={[13.0418, 80.2341]} // Chennai Central coordinates
        zoom={12}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer attribution={tileAttribution} url={tileUrl} maxZoom={19} />

        <MapController
          selectedStation={selectedStation}
          onAreaMoved={handleMapMoved}
        />

        {stations.map((st) => {
          const availableCount = st.chargers.filter((c) => c.status === 'available').length;
          const isSelected = st.id === selectedStationId;

          return (
            <Marker
              key={st.id}
              position={[st.lat, st.lng]}
              icon={createStationIcon(st, isSelected)}
              eventHandlers={{
                click: () => onSelectStation(st.id),
              }}
            >
              <Popup className="station-popup">
                <div className="w-64 p-1 text-slate-900 font-sans">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2 mb-2">
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900 leading-tight">
                        {st.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">{st.area} • {st.distanceKm} km</p>
                    </div>
                    <div className="flex items-center gap-1 bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded text-xs font-semibold">
                      <Star className="w-3 h-3 fill-emerald-700 text-emerald-700" />
                      <span>{st.rating}</span>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-2 text-xs py-1 mb-2 bg-slate-50 p-2 rounded border border-slate-100">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Availability</span>
                      <span className="font-semibold text-slate-800">
                        {availableCount} / {st.chargers.length} chargers
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Tariff</span>
                      <span className="font-semibold text-slate-800">₹{st.pricePerKwh}/kWh</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Est. Wait</span>
                      <span className="font-semibold text-slate-800 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {st.estimatedWaitMin} min
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Max Speed</span>
                      <span className="font-semibold text-slate-800 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-emerald-600" />
                        {st.powerLevels[0]}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <button
                      onClick={() => navigate(`/user/stations/${st.id}`)}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium py-1.5 px-2 rounded text-center transition"
                    >
                      View Station
                    </button>
                    <button
                      onClick={() => navigate(`/user/reserve?stationId=${st.id}`)}
                      className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium py-1.5 px-2 rounded text-center transition flex items-center justify-center gap-1"
                    >
                      <Calendar className="w-3 h-3" />
                      <span>Reserve</span>
                    </button>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${st.lat},${st.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-slate-600 hover:bg-slate-100 border border-slate-200 rounded"
                      title="Directions"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

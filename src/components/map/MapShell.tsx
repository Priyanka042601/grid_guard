import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { WildfireIncident } from '../../types/wildfire';
import { Badge } from '../common/Badge';
import { formatCoordinates } from '../../utils/formatters';
import { Link } from 'react-router-dom';
import { Crosshair, Eye } from 'lucide-react';
import '../../styles/leaflet.css';

interface MapShellProps {
  fires: WildfireIncident[];
  selectedFire?: WildfireIncident | null;
  onSelectFire?: (fire: WildfireIncident) => void;
  className?: string;
}

export const MapShell: React.FC<MapShellProps> = ({
  fires,
  selectedFire,
  onSelectFire,
  className = '',
}) => {
  const defaultCenter: [number, number] = [43.5, -117.5];
  const defaultZoom = 5;

  const createFireIcon = (severity: string, isSelected: boolean) => {
    return L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div class="fire-marker ${severity} ${isSelected ? 'ring-4 ring-[#00e5ff] scale-125' : ''}" style="width: 26px; height: 26px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z" />
          </svg>
        </div>
      `,
      iconSize: [26, 26],
      iconAnchor: [13, 13],
      popupAnchor: [0, -15],
    });
  };

  const markers = useMemo(() => {
    return fires.map((fire) => {
      const isSelected = selectedFire?.id === fire.id;
      const icon = createFireIcon(fire.severity, isSelected);

      return (
        <Marker
          key={fire.id}
          position={[fire.coordinates.lat, fire.coordinates.lng]}
          icon={icon}
          eventHandlers={{
            click: () => onSelectFire?.(fire),
          }}
        >
          <Popup className="stitch-popup">
            <div className="space-y-2 max-w-xs text-slate-100 font-sans">
              <div className="flex items-center justify-between gap-2 border-b border-[#1e293f] pb-1.5">
                <span className="font-extrabold text-sm text-white tracking-tight">{fire.name}</span>
                <Badge severity={fire.severity} />
              </div>
              <div className="text-xs space-y-1 text-slate-300">
                <div>
                  <span className="text-slate-400 font-mono text-[11px]">LOCATION: </span>
                  <span className="font-medium text-slate-200">{fire.locationName}, {fire.stateOrProvince}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-mono text-[11px]">RADIATIVE POWER: </span>
                  <span className="font-mono font-bold text-[#ff5500]">{fire.fireRadiativePowerMW} MW FRP</span>
                </div>
                <div>
                  <span className="text-slate-400 font-mono text-[11px]">CONTAINMENT: </span>
                  <span className="font-mono font-bold text-emerald-400">{fire.containmentPercent}%</span>
                </div>
                <div>
                  <span className="text-slate-400 font-mono text-[11px]">COORDINATES: </span>
                  <span className="font-mono text-[11px] text-[#00e5ff]">
                    {formatCoordinates(fire.coordinates.lat, fire.coordinates.lng)}
                  </span>
                </div>
              </div>
              <div className="pt-1.5">
                <Link
                  to={`/fire-details?id=${fire.id}`}
                  className="flex items-center justify-center gap-1.5 w-full py-1.5 px-3 rounded bg-[#ff5500] hover:bg-[#e04b00] text-white text-xs font-semibold shadow-sm transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Inspect Telemetry</span>
                </Link>
              </div>
            </div>
          </Popup>
        </Marker>
      );
    });
  }, [fires, selectedFire, onSelectFire]);

  return (
    <div className={`relative rounded-xl overflow-hidden border border-[#1e293f] bg-[#090d16] ${className}`}>
      {/* Top Left: Radar status pill */}
      <div className="absolute top-3 left-3 z-[400] bg-[#111625]/90 backdrop-blur border border-[#1e293f] rounded-lg px-3 py-1.5 text-xs text-slate-200 flex items-center gap-2 shadow-lg select-none">
        <Crosshair className="w-3.5 h-3.5 text-[#00e5ff]" aria-hidden="true" />
        <span className="font-mono font-semibold text-white">Tactical Hotspot Radar</span>
        <span className="text-slate-400 text-[11px] font-mono">({fires.length} active anomalies)</span>
      </div>

      <div className="sr-only" tabIndex={0} aria-label="Geographical map summary">
        Tactical satellite map displaying {fires.length} active thermal anomalies across North America.
        Refer to the incident table below for a structured keyboard accessible representation.
      </div>

      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        scrollWheelZoom={false}
        className="w-full h-full min-h-[360px] z-0"
        aria-label="Wildfire incident spatial map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {markers}
      </MapContainer>

      {/* Threat Legend matching Stitch */}
      <div className="absolute bottom-3 right-3 z-[400] bg-[#111625]/90 backdrop-blur border border-[#1e293f] rounded-lg p-2.5 text-xs shadow-lg space-y-1 select-none">
        <div className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Threat Legend
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-slate-300 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
            <span>Extreme</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#ff5500]" aria-hidden="true" />
            <span>High</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" aria-hidden="true" />
            <span>Moderate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" aria-hidden="true" />
            <span>Low</span>
          </div>
        </div>
      </div>
    </div>
  );
};

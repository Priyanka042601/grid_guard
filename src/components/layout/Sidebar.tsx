import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Satellite,
  Flame,
  Filter,
  Accessibility,
  Crosshair,
  Clock,
  Radio,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { PRIMARY_NAV_ITEMS, AUXILIARY_NAV_ITEMS } from '../../types/navigation';

interface SidebarProps {
  activeHotspotCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeHotspotCount = 0 }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Satellite':
        return <Satellite className="w-4 h-4" aria-hidden="true" />;
      case 'Flame':
        return <Flame className="w-4 h-4" aria-hidden="true" />;
      case 'Filter':
        return <Filter className="w-4 h-4" aria-hidden="true" />;
      case 'Accessibility':
        return <Accessibility className="w-4 h-4" aria-hidden="true" />;
      case 'Crosshair':
        return <Crosshair className="w-4 h-4" aria-hidden="true" />;
      case 'Clock':
        return <Clock className="w-4 h-4" aria-hidden="true" />;
      default:
        return <Flame className="w-4 h-4" aria-hidden="true" />;
    }
  };

  return (
    <aside
      aria-label="Operations Sidebar"
      className="hidden lg:flex flex-col w-60 bg-[#090d16] border-r border-[#1e293f] shrink-0 h-[calc(100vh-3.5rem)] sticky top-14 select-none justify-between"
    >
      <div className="p-3 space-y-4">
        {/* Top FIRMS Banner matching Stitch */}
        <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#111625] border border-[#1e293f]">
          <div className="w-8 h-8 rounded-md bg-[#00e5ff]/15 border border-[#00e5ff]/30 flex items-center justify-center text-[#00e5ff]">
            <Radio className="w-4 h-4 animate-pulse" aria-hidden="true" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white tracking-wide">NASA FIRMS</span>
            <span className="text-[10px] font-mono text-[#00e5ff] font-medium tracking-tight">
              VIIRS / MODIS Live
            </span>
          </div>
        </div>

        {/* Primary Navigation matching Stitch */}
        <nav className="space-y-1" aria-label="Incident Operations">
          {PRIMARY_NAV_ITEMS.map((item) => {
            const isThermal = item.name === 'Thermal Detections';
            const displayBadge = isThermal ? activeHotspotCount : item.badge;

            return (
              <NavLink
                key={item.href}
                to={item.href}
                aria-label={item.ariaLabel}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-[#151d2f] text-[#ff5500] font-semibold border-l-2 border-[#ff5500]'
                      : 'text-slate-300 hover:text-white hover:bg-[#111625] border-l-2 border-transparent'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`${
                          isActive
                            ? 'text-[#ff5500]'
                            : 'text-slate-400 group-hover:text-slate-200'
                        }`}
                      >
                        {getIcon(item.iconName)}
                      </span>
                      <span>{item.name}</span>
                    </div>

                    {/* Badge or Dot Indicator */}
                    {item.badgeType === 'count' && (
                      <span className="px-1.5 py-0.5 rounded bg-[#1e293f] text-[10px] font-mono font-bold text-slate-300">
                        {displayBadge}
                      </span>
                    )}
                    {item.badgeType === 'dot' && (
                      <span className="w-2 h-2 rounded-full bg-[#ff5500]" aria-hidden="true" />
                    )}
                    {item.badgeType === 'tag' && (
                      <span className="px-1 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/30 text-[9px] font-mono text-emerald-400 font-bold">
                        AA
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}

          {/* Auxiliary Nav Items from Stitch */}
          <div className="pt-2">
            {AUXILIARY_NAV_ITEMS.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => alert(`Satellite subsystem: ${item.name} modal triggered.`)}
                aria-label={item.ariaLabel}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-[#111625] transition-colors border-l-2 border-transparent text-left"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-slate-400">{getIcon(item.iconName)}</span>
                  <span>{item.name}</span>
                </div>
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Bottom Area matching Stitch */}
      <div className="p-3 space-y-3 border-t border-[#1e293f] bg-[#090d16]">
        {/* Task Satellite Button */}
        <button
          type="button"
          onClick={() => alert('Sensor Tasking Request: Orbit pass queue updated.')}
          aria-label="Task satellite pass for current sector"
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-[#00e5ff]/40 bg-[#00e5ff]/5 hover:bg-[#00e5ff]/10 text-[#00e5ff] text-xs font-mono font-semibold transition-all focus-visible:ring-2 focus-visible:ring-[#00e5ff]"
        >
          <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Task Satellite</span>
        </button>

        {/* System Status & Docs */}
        <div className="space-y-1.5 text-[11px] text-slate-400 px-1">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] animate-pulse" aria-hidden="true" />
            <span>System Status: <strong className="text-white font-medium">Optimal</strong></span>
          </div>
          <NavLink
            to="/accessibility"
            className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors pt-0.5"
          >
            <HelpCircle className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Documentation & A11y</span>
          </NavLink>
        </div>
      </div>
    </aside>
  );
};

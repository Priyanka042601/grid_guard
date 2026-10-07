import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Flame,
  Search,
  Bell,
  SlidersHorizontal,
  Menu,
} from 'lucide-react';

interface HeaderProps {
  onOpenMobileNav: () => void;
  isMobileNavOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileNav,
  isMobileNavOpen,
}) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 sm:px-6 bg-[#0b0f19] border-b border-[#1e293f] select-none">
      {/* Left: Mobile Toggle & Brand Logo */}
      <div className="flex items-center gap-4 lg:gap-6">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={onOpenMobileNav}
          aria-label="Open navigation menu"
          aria-expanded={isMobileNavOpen}
          className="lg:hidden p-1.5 -ml-1 text-slate-400 hover:text-white rounded-lg focus-visible:ring-2 focus-visible:ring-[#ff5500]"
        >
          <Menu className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Brand Logo */}
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-white font-bold text-base tracking-tight hover:opacity-95 focus-visible:ring-2 focus-visible:ring-[#ff5500] rounded px-1"
        >
          <div className="w-6 h-6 rounded-md bg-[#ff5500] flex items-center justify-center text-white shadow-sm shadow-[#ff5500]/40">
            <Flame className="w-4 h-4 fill-white" aria-hidden="true" />
          </div>
          <span className="font-extrabold tracking-tight text-white text-base">Wildfire Tracker</span>
        </Link>

        {/* Search Bar matching Stitch */}
        <div className="hidden md:flex items-center relative w-64 lg:w-80">
          <label htmlFor="stitch-header-search" className="sr-only">
            Search sectors, coordinates, orbits
          </label>
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" aria-hidden="true" />
          <input
            id="stitch-header-search"
            type="text"
            placeholder="Search sectors, coordinates, orbits..."
            className="w-full bg-[#111625] border border-[#1e293f] rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-[#ff5500] focus:ring-1 focus:ring-[#ff5500] transition-colors"
          />
        </div>
      </div>

      {/* Center Tabs matching Stitch */}
      <nav aria-label="Global Sections" className="hidden xl:flex items-center space-x-6 text-xs font-medium">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `py-4 transition-colors relative ${
              isActive
                ? 'text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`
          }
        >
          Live Feed
        </NavLink>
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `py-4 transition-colors relative ${
              isActive
                ? 'text-[#ff5500] font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`
          }
        >
          Anomalies
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ff5500] rounded-full" />
        </NavLink>
        <Link
          to="/fire-details"
          className="text-slate-400 hover:text-slate-200 py-4 transition-colors"
        >
          Analytics
        </Link>
        <Link
          to="/accessibility"
          className="text-slate-400 hover:text-slate-200 py-4 transition-colors"
        >
          Reports
        </Link>
      </nav>

      {/* Right Controls matching Stitch */}
      <div className="flex items-center gap-2.5">
        {/* FIRMS 200 OK Badge */}
        <div
          role="status"
          aria-label="FIRMS API status: 200 OK"
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00e5ff]/10 border border-[#00e5ff]/30 text-[11px] font-mono text-[#00e5ff] font-semibold"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] animate-pulse" aria-hidden="true" />
          <span>FIRMS 200 OK</span>
        </div>

        {/* Notification Bell */}
        <button
          type="button"
          aria-label="Notifications"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#111625] transition-colors focus-visible:ring-2 focus-visible:ring-[#ff5500]"
        >
          <Bell className="w-4 h-4" aria-hidden="true" />
        </button>

        {/* Filters Quick Action */}
        <Link
          to="/filters"
          aria-label="Configure Detection Filters"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#111625] transition-colors focus-visible:ring-2 focus-visible:ring-[#ff5500]"
        >
          <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
        </Link>

        {/* Export Telemetry Button (Stitch Orange) */}
        <button
          type="button"
          onClick={() => alert('Exporting FIRMS telemetry dataset (JSON/CSV)...')}
          aria-label="Export Telemetry Data"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#ff5500] hover:bg-[#e04b00] active:bg-[#c94200] text-white text-xs font-semibold shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-[#ff5500]"
        >
          <span>Export Telemetry</span>
        </button>

        {/* User Pill / Avatar */}
        <div
          aria-label="User Profile GO"
          className="w-7 h-7 rounded-full bg-[#1e293f] border border-[#2d3d5e] flex items-center justify-center text-[10px] font-bold text-slate-300 select-none"
        >
          GO
        </div>
      </div>
    </header>
  );
};

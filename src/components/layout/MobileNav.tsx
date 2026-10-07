import React, { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import {
  X,
  Satellite,
  Flame,
  Filter,
  Accessibility,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { PRIMARY_NAV_ITEMS } from '../../types/navigation';
import { trapFocus } from '../../utils/a11y';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  activeHotspotCount?: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  activeHotspotCount = 0,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (drawerRef.current) {
        trapFocus(drawerRef.current, e);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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
      default:
        return <Flame className="w-4 h-4" aria-hidden="true" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#090d16]/85 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
        className="fixed inset-y-0 left-0 w-4/5 max-w-xs bg-[#0b0f19] border-r border-[#1e293f] shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-150 justify-between"
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between px-4 h-14 border-b border-[#1e293f]">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#ff5500] flex items-center justify-center text-white">
                <Flame className="w-4 h-4 fill-white" aria-hidden="true" />
              </div>
              <span className="font-extrabold text-white text-sm">Wildfire Tracker</span>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close navigation menu"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#111625] focus-visible:ring-2 focus-visible:ring-[#ff5500]"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* FIRMS Banner */}
          <div className="p-3">
            <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#111625] border border-[#1e293f] mb-3">
              <div className="w-7 h-7 rounded-md bg-[#00e5ff]/15 border border-[#00e5ff]/30 flex items-center justify-center text-[#00e5ff]">
                <Radio className="w-3.5 h-3.5 animate-pulse" aria-hidden="true" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">NASA FIRMS</span>
                <span className="text-[10px] font-mono text-[#00e5ff]">VIIRS / MODIS Live</span>
              </div>
            </div>

            {/* Navigation links */}
            <nav className="space-y-1" aria-label="Mobile Navigation Menu">
              {PRIMARY_NAV_ITEMS.map((item) => {
                const isThermal = item.name === 'Thermal Detections';
                const displayBadge = isThermal ? activeHotspotCount : item.badge;

                return (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    onClick={onClose}
                    aria-label={item.ariaLabel}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-[#151d2f] text-[#ff5500] font-bold border-l-2 border-[#ff5500]'
                          : 'text-slate-300 hover:text-white hover:bg-[#111625] border-l-2 border-transparent'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-3">
                          <span className={isActive ? 'text-[#ff5500]' : 'text-slate-400'}>
                            {getIcon(item.iconName)}
                          </span>
                          <span>{item.name}</span>
                        </div>
                        {item.badgeType === 'count' && (
                          <span className="px-1.5 py-0.5 rounded bg-[#1e293f] text-[10px] font-mono font-bold text-slate-300">
                            {displayBadge}
                          </span>
                        )}
                        {item.badgeType === 'dot' && (
                          <span className="w-2 h-2 rounded-full bg-[#ff5500]" aria-hidden="true" />
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-[#1e293f] space-y-2 bg-[#090d16]">
          <button
            type="button"
            onClick={() => alert('Sensor Tasking Pass requested.')}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-[#00e5ff]/40 bg-[#00e5ff]/5 text-[#00e5ff] text-xs font-mono font-semibold"
          >
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Task Satellite</span>
          </button>
        </div>
      </div>
    </div>
  );
};

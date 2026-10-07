import React from 'react';
import type { DashboardViewStatus } from '../../types/wildfire';
import { Activity, Loader2, Inbox, AlertTriangle } from 'lucide-react';

interface StateSwitcherProps {
  currentStatus: DashboardViewStatus;
  onStatusChange: (status: DashboardViewStatus) => void;
}

export const StateSwitcher: React.FC<StateSwitcherProps> = ({
  currentStatus,
  onStatusChange,
}) => {
  const states: { id: DashboardViewStatus; label: string; icon: React.ReactNode; activeColor: string }[] = [
    {
      id: 'normal',
      label: 'Normal',
      icon: <Activity className="w-3 h-3 text-[#00e5ff]" aria-hidden="true" />,
      activeColor: 'bg-[#151d2f] text-white border-[#00e5ff]/50 font-bold',
    },
    {
      id: 'loading',
      label: 'Loading',
      icon: <Loader2 className="w-3 h-3 animate-spin text-[#00e5ff]" aria-hidden="true" />,
      activeColor: 'bg-[#151d2f] text-white border-[#00e5ff]/50 font-bold',
    },
    {
      id: 'empty',
      label: 'Empty',
      icon: <Inbox className="w-3 h-3 text-[#ff5500]" aria-hidden="true" />,
      activeColor: 'bg-[#151d2f] text-white border-[#ff5500]/50 font-bold',
    },
    {
      id: 'error',
      label: 'Error',
      icon: <AlertTriangle className="w-3 h-3 text-red-400" aria-hidden="true" />,
      activeColor: 'bg-red-950/40 text-red-200 border-red-500/50 font-bold',
    },
  ];

  return (
    <div
      role="group"
      aria-label="Dashboard State Simulator"
      className="inline-flex items-center gap-1 p-1 bg-[#111625] border border-[#1e293f] rounded-lg text-xs select-none"
    >
      <span className="px-2 font-mono text-[10px] uppercase tracking-wider text-slate-400">
        Simulate State:
      </span>
      {states.map((st) => {
        const isSelected = currentStatus === st.id;
        return (
          <button
            key={st.id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onStatusChange(st.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono transition-all border ${
              isSelected
                ? st.activeColor
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#162035]'
            }`}
          >
            <span>{st.icon}</span>
            <span>{st.label}</span>
          </button>
        );
      })}
    </div>
  );
};

import React from 'react';
import type { IncidentSeverity } from '../../types/wildfire';
import { getSeverityClasses } from '../../utils/formatters';

interface BadgeProps {
  severity?: IncidentSeverity;
  variant?: 'default' | 'outline' | 'dot';
  children?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  severity,
  children,
  className = '',
}) => {
  if (severity) {
    const config = getSeverityClasses(severity);
    return (
      <span
        role="status"
        aria-label={`Severity: ${config.label}`}
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border tracking-wide uppercase ${config.badgeBg} ${config.badgeText} ${config.badgeBorder} ${className}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor} animate-pulse`} aria-hidden="true" />
        {children || config.label}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 ${className}`}
    >
      {children}
    </span>
  );
};

import type { IncidentSeverity } from '../types/wildfire';

export function formatCoordinates(lat: number, lng: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(3)}° ${latDir}, ${Math.abs(lng).toFixed(3)}° ${lngDir}`;
}

export function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    }).format(date);
  } catch {
    return isoString;
  }
}

export function formatAcreage(acres: number): string {
  return new Intl.NumberFormat('en-US').format(acres) + ' acres';
}

export function getSeverityClasses(severity: IncidentSeverity): {
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  iconColor: string;
  dotColor: string;
  label: string;
} {
  switch (severity) {
    case 'extreme':
      return {
        badgeBg: 'bg-red-500/15',
        badgeText: 'text-red-300',
        badgeBorder: 'border-red-500/40',
        iconColor: 'text-red-400',
        dotColor: 'bg-red-500',
        label: 'Extreme Threat',
      };
    case 'high':
      return {
        badgeBg: 'bg-orange-500/15',
        badgeText: 'text-orange-300',
        badgeBorder: 'border-orange-500/40',
        iconColor: 'text-orange-400',
        dotColor: 'bg-orange-500',
        label: 'High Threat',
      };
    case 'moderate':
      return {
        badgeBg: 'bg-amber-500/15',
        badgeText: 'text-amber-300',
        badgeBorder: 'border-amber-500/40',
        iconColor: 'text-amber-400',
        dotColor: 'bg-amber-500',
        label: 'Moderate',
      };
    case 'low':
    default:
      return {
        badgeBg: 'bg-emerald-500/15',
        badgeText: 'text-emerald-300',
        badgeBorder: 'border-emerald-500/40',
        iconColor: 'text-emerald-400',
        dotColor: 'bg-emerald-500',
        label: 'Low / Controlled',
      };
  }
}

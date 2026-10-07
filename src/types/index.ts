export type UserRole = 'ev_user' | 'station_owner' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  vehicle?: Vehicle;
}

export interface Vehicle {
  model: string;
  variant: string;
  registrationNumber: string;
  batteryPercent: number;
  batteryCapacityKwh: number;
  estimatedRangeKm: number;
  maxChargingSpeedKw: number;
  connectorType: 'CCS2' | 'Type 2' | 'CHAdeMO';
}

export type ChargerStatus = 'available' | 'reserved' | 'charging' | 'maintenance' | 'fault';

export interface Charger {
  id: string; // e.g. "C01", "C02"
  stationId: string;
  type: 'DC Fast' | 'AC';
  powerKw: number;
  connector: 'CCS2' | 'Type 2' | 'CHAdeMO' | 'Bharat AC001';
  status: ChargerStatus;
  reservedUntil?: string; // e.g. "7:30 PM"
  reservedByReservationId?: string; // e.g. "CS-20261007-4821"
  currentSessionId?: string;
}

export interface Station {
  id: string;
  name: string;
  area: string;
  address: string;
  lat: number;
  lng: number;
  distanceKm: number;
  rating: number;
  reviewCount: number;
  pricePerKwh: number;
  openingHours: string;
  demandLevel: 'low' | 'moderate' | 'high';
  estimatedWaitMin: number;
  powerLevels: string[];
  amenities: string[];
  paymentMethods: string[];
  operator: string;
  phone: string;
  chargers: Charger[];
}

export type ReservationStatus = 'confirmed' | 'active' | 'completed' | 'cancelled' | 'expired';

export interface Reservation {
  id: string; // e.g. "CS-20261007-4821"
  stationId: string;
  stationName: string;
  stationArea: string;
  chargerId: string;
  chargerPower: string;
  date: string;
  timeSlot: string; // e.g. "6:30 PM – 7:30 PM"
  startTimeIso: string;
  gracePeriodMinutes: number;
  gracePeriodEndsTime: string; // e.g. "6:40 PM"
  status: ReservationStatus;
  pricePerKwh: number;
  estimatedCost: number;
  vehicleName: string;
  otp: string; // e.g. "482913"
  isVerified: boolean;
  createdAt: string;
  userId: string;
}

export interface ActiveChargingSession {
  sessionId: string;
  reservationId?: string;
  stationId: string;
  stationName: string;
  chargerId: string;
  vehicleName: string;
  startBatteryPercent: number;
  currentBatteryPercent: number;
  targetBatteryPercent: number;
  energyDeliveredKwh: number;
  currentPowerKw: number;
  elapsedMinutes: number;
  estimatedMinutesRemaining: number;
  ratePerKwh: number;
  currentCostInr: number;
  status: 'charging' | 'completed' | 'stopped';
  voltage: number;
  currentAmps: number;
}

export interface ChargingHistoryRecord {
  id: string;
  stationName: string;
  stationArea: string;
  chargerId: string;
  date: string;
  durationMinutes: number;
  energyDeliveredKwh: number;
  amountPaidInr: number;
  ratePerKwh: number;
  vehicleName: string;
  invoiceNumber: string;
}

export interface QueueEntry {
  id: string;
  stationId: string;
  stationName: string;
  userId: string;
  userName: string;
  position: number;
  estimatedWaitMin: number;
  chargerPreference: string;
  joinedAt: string;
  status: 'waiting' | 'ready' | 'served' | 'cancelled';
}

export interface ConflictIncident {
  id: string;
  stationId: string;
  stationName: string;
  chargerId: string;
  reservationId: string;
  reservedUser: string;
  timeAttempted: string;
  conflictType: 'walk_in_blocked' | 'grace_expired_auto_release' | 'overstay_warning';
  actionTaken: string;
  status: 'resolved' | 'monitoring' | 'overridden';
}

export interface SmartRecommendation {
  type: 'best_overall' | 'cheapest' | 'fastest';
  station: Station;
  matchPercentage: number;
  estimatedChargingMin: number;
  estimatedCostInr: number;
  reasons: string[];
}

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Station,
  ChargerStatus,
  Reservation,
  ActiveChargingSession,
  ChargingHistoryRecord,
  QueueEntry,
  ConflictIncident,
} from '../types';
import {
  INITIAL_USER,
  INITIAL_STATIONS,
  INITIAL_ACTIVE_RESERVATION,
  INITIAL_CHARGING_HISTORY,
  INITIAL_QUEUE,
  INITIAL_CONFLICTS,
} from '../data/mockData';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  read: boolean;
}

interface AppContextType {
  currentUser: User;
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>;
  switchRole: (role: UserRole) => void;
  stations: Station[];
  getStationById: (id: string) => Station | undefined;
  updateChargerStatus: (stationId: string, chargerId: string, status: ChargerStatus) => void;
  
  // Reservations
  reservations: Reservation[];
  activeReservation: Reservation | null;
  createReservation: (data: {
    stationId: string;
    chargerId: string;
    date: string;
    timeSlot: string;
  }) => Reservation;
  cancelReservation: (id: string) => void;
  verifyOtp: (reservationId: string, otp: string) => { success: boolean; message: string };
  
  // Active Charging Session
  activeSession: ActiveChargingSession | null;
  stopActiveSession: () => ChargingHistoryRecord | null;
  startDirectCharging: (stationId: string, chargerId: string) => void;
  
  // Charging History
  history: ChargingHistoryRecord[];
  
  // Queue
  queue: QueueEntry[];
  joinQueue: (stationId: string, chargerPreference: string) => QueueEntry;
  leaveQueue: (queueId: string) => void;
  
  // Walk-in Conflict Management
  conflicts: ConflictIncident[];
  simulateWalkInAttempt: (stationId: string, chargerId: string) => {
    allowed: boolean;
    reason?: string;
    reservedUntil?: string;
    reservationId?: string;
  };
  resolveConflict: (conflictId: string, resolution: string) => void;

  // Search & Map state
  selectedStationId: string | null;
  setSelectedStationId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filterArea: string;
  setFilterArea: (area: string) => void;
  filterType: string;
  setFilterType: (type: string) => void;
  filterMinPower: number;
  setFilterMinPower: (kw: number) => void;
  sortBy: 'recommended' | 'nearest' | 'cheapest' | 'fastest' | 'rating';
  setSortBy: (sort: 'recommended' | 'nearest' | 'cheapest' | 'fastest' | 'rating') => void;

  // Notifications
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  addNotification: (title: string, message: string, type?: AppNotification['type']) => void;

  // Vehicle battery updater
  updateUserBattery: (percent: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('chargesmart_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [stations, setStations] = useState<Station[]>(() => {
    const saved = localStorage.getItem('chargesmart_stations');
    return saved ? JSON.parse(saved) : INITIAL_STATIONS;
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem('chargesmart_reservations');
    return saved ? JSON.parse(saved) : [INITIAL_ACTIVE_RESERVATION];
  });

  const [activeSession, setActiveSession] = useState<ActiveChargingSession | null>(() => {
    const saved = localStorage.getItem('chargesmart_active_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [history, setHistory] = useState<ChargingHistoryRecord[]>(() => {
    const saved = localStorage.getItem('chargesmart_history');
    return saved ? JSON.parse(saved) : INITIAL_CHARGING_HISTORY;
  });

  const [queue, setQueue] = useState<QueueEntry[]>(() => {
    const saved = localStorage.getItem('chargesmart_queue');
    return saved ? JSON.parse(saved) : INITIAL_QUEUE;
  });

  const [conflicts, setConflicts] = useState<ConflictIncident[]>(() => {
    const saved = localStorage.getItem('chargesmart_conflicts');
    return saved ? JSON.parse(saved) : INITIAL_CONFLICTS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Upcoming Reservation at GreenVolt',
      message: 'Charger C02 is reserved for you at 6:30 PM. 10-minute grace period applies until 6:40 PM.',
      time: '15m ago',
      type: 'info',
      read: false,
    },
    {
      id: 'notif-2',
      title: 'OTP Ready for Check-in',
      message: 'Your verification OTP for C02 is 482913. Punch in on screen or station keypad upon arrival.',
      time: '10m ago',
      type: 'success',
      read: false,
    },
    {
      id: 'notif-3',
      title: 'Off-Peak Tariff Alert',
      message: 'EcoCharge Central (T Nagar) is offering ₹11.8/kWh right now with high availability.',
      time: '1h ago',
      type: 'info',
      read: true,
    },
  ]);

  // UI state
  const [selectedStationId, setSelectedStationId] = useState<string | null>('station-annanagar');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterArea, setFilterArea] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [filterMinPower, setFilterMinPower] = useState(0);
  const [sortBy, setSortBy] = useState<'recommended' | 'nearest' | 'cheapest' | 'fastest' | 'rating'>('recommended');

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('chargesmart_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('chargesmart_stations', JSON.stringify(stations));
  }, [stations]);

  useEffect(() => {
    localStorage.setItem('chargesmart_reservations', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem('chargesmart_active_session', JSON.stringify(activeSession));
  }, [activeSession]);

  useEffect(() => {
    localStorage.setItem('chargesmart_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('chargesmart_queue', JSON.stringify(queue));
  }, [queue]);

  useEffect(() => {
    localStorage.setItem('chargesmart_conflicts', JSON.stringify(conflicts));
  }, [conflicts]);

  // Live active charging session simulation tick
  useEffect(() => {
    if (!activeSession || activeSession.status !== 'charging') return;

    const interval = setInterval(() => {
      setActiveSession((prev) => {
        if (!prev || prev.status !== 'charging') return prev;

        const maxBattery = prev.targetBatteryPercent;
        if (prev.currentBatteryPercent >= maxBattery) {
          // Reached full target
          return {
            ...prev,
            status: 'completed',
            estimatedMinutesRemaining: 0,
            currentPowerKw: 0,
          };
        }

        const newBattery = Math.min(maxBattery, prev.currentBatteryPercent + 1);
        const energyIncrement = 0.405; // ~1% of 40.5kWh
        const newEnergy = +(prev.energyDeliveredKwh + energyIncrement).toFixed(2);
        const newCost = Math.round(newEnergy * prev.ratePerKwh);
        const remainingMinutes = Math.max(0, prev.estimatedMinutesRemaining - 1);
        const elapsed = prev.elapsedMinutes + 1;

        // Also update currentUser battery in state
        setCurrentUser((u) => {
          if (!u.vehicle) return u;
          const newRange = Math.round((newBattery / 100) * 312);
          return {
            ...u,
            vehicle: {
              ...u.vehicle,
              batteryPercent: newBattery,
              estimatedRangeKm: newRange,
            },
          };
        });

        return {
          ...prev,
          currentBatteryPercent: newBattery,
          energyDeliveredKwh: newEnergy,
          currentCostInr: newCost,
          elapsedMinutes: elapsed,
          estimatedMinutesRemaining: remainingMinutes,
          currentPowerKw: +(56.5 + (Math.random() * 3 - 1.5)).toFixed(1),
        };
      });
    }, 4000); // Progresses every 4 seconds for interactive demonstration

    return () => clearInterval(interval);
  }, [activeSession]);

  const addNotification = (title: string, message: string, type: AppNotification['type'] = 'info') => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      time: 'Just now',
      type,
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const switchRole = (role: UserRole) => {
    let name = 'Karthik Subramanian';
    let email = 'karthik.s@example.com';
    let phone = '+91 98401 23456';

    if (role === 'station_owner') {
      name = 'Ramanathan Sethuraman';
      email = 'owner@greenvolt-chennai.in';
      phone = '+91 98410 77889';
    } else if (role === 'admin') {
      name = 'Meenakshi Sundaram';
      email = 'admin@chargesmart.gov.in';
      phone = '+91 94440 11223';
    }

    setCurrentUser((prev) => ({
      ...prev,
      name,
      email,
      phone,
      role,
    }));

    addNotification('Switched Workspace Role', `Now viewing ChargeSmart as ${role.toUpperCase().replace('_', ' ')}`, 'info');
  };

  const getStationById = (id: string) => {
    return stations.find((s) => s.id === id);
  };

  const updateChargerStatus = (stationId: string, chargerId: string, status: ChargerStatus) => {
    setStations((prev) =>
      prev.map((s) => {
        if (s.id !== stationId) return s;
        return {
          ...s,
          chargers: s.chargers.map((c) =>
            c.id === chargerId ? { ...c, status } : c
          ),
        };
      })
    );
  };

  const createReservation = ({
    stationId,
    chargerId,
    date,
    timeSlot,
  }: {
    stationId: string;
    chargerId: string;
    date: string;
    timeSlot: string;
  }): Reservation => {
    const station = getStationById(stationId) || stations[0];
    const charger = station.chargers.find((c) => c.id === chargerId);
    const powerStr = charger ? `${charger.powerKw} kW ${charger.type}` : '60 kW DC Fast';
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newId = `CS-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${randomSuffix}`;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const newRes: Reservation = {
      id: newId,
      stationId,
      stationName: station.name,
      stationArea: station.area,
      chargerId,
      chargerPower: powerStr,
      date,
      timeSlot,
      startTimeIso: new Date().toISOString(),
      gracePeriodMinutes: 10,
      gracePeriodEndsTime: '6:40 PM',
      status: 'confirmed',
      pricePerKwh: station.pricePerKwh,
      estimatedCost: Math.round(station.pricePerKwh * 24),
      vehicleName: currentUser.vehicle ? `${currentUser.vehicle.model} (${currentUser.vehicle.registrationNumber})` : 'Tata Nexon EV',
      otp,
      isVerified: false,
      createdAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      userId: currentUser.id,
    };

    setReservations((prev) => [newRes, ...prev]);

    // Mark charger as reserved in station
    setStations((prev) =>
      prev.map((s) => {
        if (s.id !== stationId) return s;
        return {
          ...s,
          chargers: s.chargers.map((c) =>
            c.id === chargerId
              ? {
                  ...c,
                  status: 'reserved',
                  reservedUntil: timeSlot.split('–')[1]?.trim() || '7:30 PM',
                  reservedByReservationId: newId,
                }
              : c
          ),
        };
      })
    );

    addNotification(
      'Reservation Confirmed',
      `Booking ${newId} confirmed for ${chargerId} at ${station.name}. OTP: ${otp}`,
      'success'
    );

    return newRes;
  };

  const cancelReservation = (id: string) => {
    const res = reservations.find((r) => r.id === id);
    if (!res) return;

    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'cancelled' } : r))
    );

    // Free the charger back
    setStations((prev) =>
      prev.map((s) => {
        if (s.id !== res.stationId) return s;
        return {
          ...s,
          chargers: s.chargers.map((c) =>
            c.id === res.chargerId && c.reservedByReservationId === id
              ? { ...c, status: 'available', reservedUntil: undefined, reservedByReservationId: undefined }
              : c
          ),
        };
      })
    );

    addNotification(
      'Reservation Cancelled',
      `Reservation ${id} was cancelled. Charger ${res.chargerId} released.`,
      'info'
    );
  };

  const verifyOtp = (reservationId: string, otp: string) => {
    const res = reservations.find((r) => r.id === reservationId);
    if (!res) {
      return { success: false, message: 'Reservation not found.' };
    }

    // Accept valid demo OTP '482913' or the reservation's generated OTP
    const valid = otp === '482913' || otp === res.otp;
    if (!valid) {
      return { success: false, message: 'Invalid OTP code. Please try 482913.' };
    }

    // Mark verified
    setReservations((prev) =>
      prev.map((r) =>
        r.id === reservationId ? { ...r, isVerified: true, status: 'active' } : r
      )
    );

    // Charger status changes: Reserved -> Charging
    updateChargerStatus(res.stationId, res.chargerId, 'charging');

    // Start live active session
    const currentBattery = currentUser.vehicle?.batteryPercent || 32;
    const initialSession: ActiveChargingSession = {
      sessionId: `SES-${Date.now().toString().slice(-6)}`,
      reservationId,
      stationId: res.stationId,
      stationName: res.stationName,
      chargerId: res.chargerId,
      vehicleName: res.vehicleName,
      startBatteryPercent: currentBattery,
      currentBatteryPercent: currentBattery,
      targetBatteryPercent: 85,
      energyDeliveredKwh: 1.2,
      currentPowerKw: 58.4,
      elapsedMinutes: 2,
      estimatedMinutesRemaining: 38,
      ratePerKwh: res.pricePerKwh,
      currentCostInr: Math.round(1.2 * res.pricePerKwh),
      status: 'charging',
      voltage: 398,
      currentAmps: 147,
    };

    setActiveSession(initialSession);

    addNotification(
      'OTP Verified — Session Started',
      `Charger ${res.chargerId} unlocked! Charging initiated for ${res.vehicleName}.`,
      'success'
    );

    return { success: true, message: 'Verification successful! Charging initiated.' };
  };

  const startDirectCharging = (stationId: string, chargerId: string) => {
    const station = getStationById(stationId) || stations[0];
    const currentBattery = currentUser.vehicle?.batteryPercent || 32;
    updateChargerStatus(stationId, chargerId, 'charging');

    const session: ActiveChargingSession = {
      sessionId: `SES-${Date.now().toString().slice(-6)}`,
      stationId,
      stationName: station.name,
      chargerId,
      vehicleName: currentUser.vehicle ? currentUser.vehicle.model : 'Tata Nexon EV',
      startBatteryPercent: currentBattery,
      currentBatteryPercent: currentBattery,
      targetBatteryPercent: 85,
      energyDeliveredKwh: 0.5,
      currentPowerKw: 57.8,
      elapsedMinutes: 1,
      estimatedMinutesRemaining: 42,
      ratePerKwh: station.pricePerKwh,
      currentCostInr: Math.round(0.5 * station.pricePerKwh),
      status: 'charging',
      voltage: 401,
      currentAmps: 144,
    };

    setActiveSession(session);
    addNotification('Direct Session Started', `Charging begun on ${chargerId} at ${station.name}.`, 'success');
  };

  const stopActiveSession = (): ChargingHistoryRecord | null => {
    if (!activeSession) return null;

    const completedRecord: ChargingHistoryRecord = {
      id: `CH-${Date.now().toString().slice(-8)}`,
      stationName: activeSession.stationName,
      stationArea: getStationById(activeSession.stationId)?.area || 'Chennai',
      chargerId: activeSession.chargerId,
      date: new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      durationMinutes: activeSession.elapsedMinutes,
      energyDeliveredKwh: activeSession.energyDeliveredKwh,
      amountPaidInr: activeSession.currentCostInr,
      ratePerKwh: activeSession.ratePerKwh,
      vehicleName: activeSession.vehicleName,
      invoiceNumber: `INV-CS-${Math.floor(1000 + Math.random() * 9000)}-TN`,
    };

    // Free charger
    updateChargerStatus(activeSession.stationId, activeSession.chargerId, 'available');

    // Update reservations if linked
    if (activeSession.reservationId) {
      setReservations((prev) =>
        prev.map((r) =>
          r.id === activeSession.reservationId ? { ...r, status: 'completed' } : r
        )
      );
    }

    // Add to history
    setHistory((prev) => [completedRecord, ...prev]);

    // Clear active session
    setActiveSession(null);

    addNotification(
      'Charging Session Ended',
      `Session complete. ${completedRecord.energyDeliveredKwh} kWh delivered. Total: ₹${completedRecord.amountPaidInr}.`,
      'info'
    );

    return completedRecord;
  };

  const joinQueue = (stationId: string, chargerPreference: string): QueueEntry => {
    const station = getStationById(stationId) || stations[0];
    const newEntry: QueueEntry = {
      id: `Q-${Date.now().toString().slice(-4)}`,
      stationId,
      stationName: station.name,
      userId: currentUser.id,
      userName: currentUser.name,
      position: queue.filter((q) => q.stationId === stationId && q.status === 'waiting').length + 1,
      estimatedWaitMin: (queue.filter((q) => q.stationId === stationId).length + 1) * 8,
      chargerPreference,
      joinedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      status: 'waiting',
    };

    setQueue((prev) => [...prev, newEntry]);
    addNotification(
      'Joined Virtual Queue',
      `You are position #${newEntry.position} at ${station.name}. Estimated wait: ~${newEntry.estimatedWaitMin} mins.`,
      'info'
    );

    return newEntry;
  };

  const leaveQueue = (queueId: string) => {
    setQueue((prev) => prev.filter((q) => q.id !== queueId));
    addNotification('Left Queue', 'You have been removed from the waiting queue.', 'info');
  };

  // Conflict management: Walk-in prevention
  const simulateWalkInAttempt = (stationId: string, chargerId: string) => {
    const station = getStationById(stationId);
    if (!station) return { allowed: true };

    const charger = station.chargers.find((c) => c.id === chargerId);
    if (!charger) return { allowed: true };

    if (charger.status === 'reserved') {
      const reservation = reservations.find(
        (r) => r.stationId === stationId && r.chargerId === chargerId && r.status === 'confirmed'
      );

      const until = charger.reservedUntil || (reservation ? reservation.timeSlot.split('–')[1]?.trim() : '7:30 PM');
      const resId = charger.reservedByReservationId || reservation?.id || 'CS-20261007-4821';

      // Log conflict incident
      const incident: ConflictIncident = {
        id: `CONF-${Date.now().toString().slice(-4)}`,
        stationId,
        stationName: station.name,
        chargerId,
        reservationId: resId,
        reservedUser: reservation ? reservation.vehicleName : 'Reserved Customer',
        timeAttempted: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        conflictType: 'walk_in_blocked',
        actionTaken: `Walk-in blocked by hardware lock. Charger reserved until ${until}. Prompted to join queue or select available charger.`,
        status: 'resolved',
      };

      setConflicts((prev) => [incident, ...prev]);

      return {
        allowed: false,
        reason: `This charger is reserved until ${until}. Walk-in customers cannot occupy it.`,
        reservedUntil: until,
        reservationId: resId,
      };
    }

    if (charger.status === 'charging') {
      return {
        allowed: false,
        reason: `Charger ${chargerId} is currently actively in use.`,
      };
    }

    if (charger.status === 'maintenance' || charger.status === 'fault') {
      return {
        allowed: false,
        reason: `Charger ${chargerId} is temporarily out of service for scheduled maintenance.`,
      };
    }

    return { allowed: true };
  };

  const resolveConflict = (conflictId: string, resolution: string) => {
    setConflicts((prev) =>
      prev.map((c) =>
        c.id === conflictId ? { ...c, status: 'resolved', actionTaken: resolution } : c
      )
    );
    addNotification('Conflict Resolved', `Resolution applied to incident ${conflictId}`, 'info');
  };

  const updateUserBattery = (percent: number) => {
    setCurrentUser((prev) => {
      if (!prev.vehicle) return prev;
      const range = Math.round((percent / 100) * 312);
      return {
        ...prev,
        vehicle: {
          ...prev.vehicle,
          batteryPercent: percent,
          estimatedRangeKm: range,
        },
      };
    });
  };

  const activeReservation =
    reservations.find((r) => r.status === 'confirmed' || r.status === 'active') || null;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        stations,
        getStationById,
        updateChargerStatus,
        reservations,
        activeReservation,
        createReservation,
        cancelReservation,
        verifyOtp,
        activeSession,
        stopActiveSession,
        startDirectCharging,
        history,
        queue,
        joinQueue,
        leaveQueue,
        conflicts,
        simulateWalkInAttempt,
        resolveConflict,
        selectedStationId,
        setSelectedStationId,
        searchQuery,
        setSearchQuery,
        filterArea,
        setFilterArea,
        filterType,
        setFilterType,
        filterMinPower,
        setFilterMinPower,
        sortBy,
        setSortBy,
        notifications,
        markNotificationAsRead,
        clearNotifications,
        addNotification,
        updateUserBattery,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

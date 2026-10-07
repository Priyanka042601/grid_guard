import { useState, useCallback } from 'react';
import type { WildfireIncident, WildfireMetrics, DashboardViewStatus } from '../types/wildfire';
import { mockFireService, calculateMetrics, MOCK_WILDFIRES } from '../services/mockFireService';
import { announceToScreenReader } from '../utils/a11y';

export interface UseWildfiresReturn {
  fires: WildfireIncident[];
  metrics: WildfireMetrics;
  status: DashboardViewStatus;
  error: string | null;
  selectedFire: WildfireIncident | null;
  selectFire: (fire: WildfireIncident | null) => void;
  setStatus: (status: DashboardViewStatus) => void;
  refreshData: () => Promise<void>;
}

export function useWildfires(initialStatus: DashboardViewStatus = 'normal'): UseWildfiresReturn {
  const [status, setStatusState] = useState<DashboardViewStatus>(initialStatus);
  const [fires, setFires] = useState<WildfireIncident[]>(initialStatus === 'normal' ? MOCK_WILDFIRES : []);
  const [metrics, setMetrics] = useState<WildfireMetrics>(
    calculateMetrics(initialStatus === 'normal' ? MOCK_WILDFIRES : [])
  );
  const [error, setError] = useState<string | null>(null);
  const [selectedFire, setSelectedFire] = useState<WildfireIncident | null>(
    initialStatus === 'normal' ? MOCK_WILDFIRES[0] : null
  );

  const loadData = useCallback(async (targetStatus: DashboardViewStatus) => {
    setStatusState(targetStatus);
    setError(null);

    if (targetStatus === 'loading') {
      announceToScreenReader('Synchronizing NASA FIRMS satellite telemetry...', 'polite');
      setFires([]);
      return;
    }

    if (targetStatus === 'empty') {
      setFires([]);
      setMetrics(calculateMetrics([]));
      setSelectedFire(null);
      announceToScreenReader('Wildfire telemetry updated: No thermal anomalies detected for current sector filter.', 'polite');
      return;
    }

    if (targetStatus === 'error') {
      const errMsg = 'NASA FIRMS downlink stream timed out after 3 retries (503 Service Unavailable).';
      setError(errMsg);
      setFires([]);
      setMetrics(calculateMetrics([]));
      setSelectedFire(null);
      announceToScreenReader(`Telemetry synchronization failed: ${errMsg}`, 'assertive');
      return;
    }

    // Default 'normal' state
    const result = await mockFireService.getWildfires('normal');
    setFires(result.data);
    setMetrics(result.metrics);
    setSelectedFire(result.data[0] || null);
    announceToScreenReader(`NASA FIRMS telemetry synchronized: ${result.data.length} active thermal anomalies detected.`, 'polite');
  }, []);

  const setStatus = useCallback((newStatus: DashboardViewStatus) => {
    loadData(newStatus);
  }, [loadData]);

  const refreshData = useCallback(async () => {
    await loadData('normal');
  }, [loadData]);

  return {
    fires,
    metrics,
    status,
    error,
    selectedFire,
    selectFire: setSelectedFire,
    setStatus,
    refreshData,
  };
}

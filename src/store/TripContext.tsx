import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { TripState, ControlAlert, AbnormalAlert, DriveScene } from '@/types';
import { mockTripState } from '@/data/mock';

const STORAGE_KEY = 'cold_chain_trip_state_v1';

interface TripContextType {
  state: TripState;
  setScene: (scene: DriveScene) => void;
  executeControl: (alertId: string, photoUrl: string) => void;
  handleAbnormal: (alertId: string) => void;
  setHandoverSignature: (role: 'driver' | 'receiver', name: string) => void;
  confirmHandover: () => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

const STORAGE_KEY = 'cold_chain_trip_state_v1';

const mergeWithPersistedState = (mock: TripState, persisted: Partial<TripState>): TripState => {
  const result: TripState = { ...mock, ...persisted };

  if (persisted.controlAlerts && Array.isArray(persisted.controlAlerts)) {
    const executedMap = new Map<string, { executed: boolean; executedAt?: string; photoUrl?: string }>();
    persisted.controlAlerts.forEach(a => {
      if (a.executed) {
        executedMap.set(a.id, {
          executed: a.executed,
          executedAt: a.executedAt,
          photoUrl: a.photoUrl
        });
      }
    });

    result.controlAlerts = mock.controlAlerts.map(mockAlert => {
      const saved = executedMap.get(mockAlert.id);
      if (saved) {
        return { ...mockAlert, ...saved };
      }
      return mockAlert;
    });

    const persistedExtra = persisted.controlAlerts.filter(
      pa => !mock.controlAlerts.find(ma => ma.id === pa.id) && pa.executed
    );
    result.controlAlerts = [...result.controlAlerts, ...persistedExtra];

    console.log('[TripContext] Merged control alerts:', {
      total: result.controlAlerts.length,
      executed: result.controlAlerts.filter(a => a.executed).length,
      newAdded: mock.controlAlerts.length - persisted.controlAlerts.length
    });
  } else {
    result.controlAlerts = mock.controlAlerts;
  }

  if (persisted.abnormalAlerts && Array.isArray(persisted.abnormalAlerts)) {
    const handledMap = new Map<string, boolean>();
    persisted.abnormalAlerts.forEach(a => {
      if (a.handled) {
        handledMap.set(a.id, true);
      }
    });
    result.abnormalAlerts = mock.abnormalAlerts.map(mockAlert => ({
      ...mockAlert,
      handled: handledMap.get(mockAlert.id) || mockAlert.handled
    }));
  }

  if (persisted.handover) {
    result.handover = {
      ...mock.handover,
      ...persisted.handover
    };
  }

  return result;
};

const loadPersistedState = (): TripState => {
  try {
    const stored = Taro.getStorageSync(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log('[TripContext] Loaded persisted state, merging with latest mock...');
      return mergeWithPersistedState(mockTripState, parsed);
    }
  } catch (err) {
    console.error('[TripContext] Failed to load persisted state:', err);
  }
  console.log('[TripContext] Using fresh mock state');
  return mockTripState;
};

export const TripProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<TripState>(() => loadPersistedState());

  useEffect(() => {
    try {
      Taro.setStorageSync(STORAGE_KEY, JSON.stringify(state));
      console.log('[TripContext] State persisted');
    } catch (err) {
      console.error('[TripContext] Failed to persist state:', err);
    }
  }, [state]);

  const setScene = useCallback((scene: DriveScene) => {
    const sceneLabelMap: Record<DriveScene, string> = {
      loading: '装货作业中',
      waiting: '服务区等待',
      driving: '高速行驶中',
      unloading: '卸货作业中',
      idle: '驻车休息'
    };
    setState(prev => ({
      ...prev,
      currentScene: scene,
      currentSceneLabel: sceneLabelMap[scene]
    }));
    console.log('[TripContext] Scene changed:', scene);
  }, []);

  const executeControl = useCallback((alertId: string, photoUrl: string) => {
    if (!photoUrl) {
      console.warn('[TripContext] executeControl called without photoUrl, rejected');
      return;
    }
    setState(prev => ({
      ...prev,
      controlAlerts: prev.controlAlerts.map(alert =>
        alert.id === alertId
          ? {
              ...alert,
              executed: true,
              executedAt: new Date().toISOString(),
              photoUrl
            }
          : alert
      )
    }));
    console.log('[TripContext] Control executed with photo:', alertId, photoUrl);
  }, []);

  const handleAbnormal = useCallback((alertId: string) => {
    setState(prev => ({
      ...prev,
      abnormalAlerts: prev.abnormalAlerts.map(alert =>
        alert.id === alertId ? { ...alert, handled: true } : alert
      )
    }));
    console.log('[TripContext] Abnormal handled:', alertId);
  }, []);

  const setHandoverSignature = useCallback((role: 'driver' | 'receiver', name: string) => {
    setState(prev => ({
      ...prev,
      handover: {
        ...prev.handover,
        driverSignature: role === 'driver' ? name : prev.handover.driverSignature,
        receiverSignature: role === 'receiver' ? name : prev.handover.receiverSignature
      }
    }));
    console.log('[TripContext] Handover signature set:', role, name);
  }, []);

  const confirmHandover = useCallback(() => {
    setState(prev => ({
      ...prev,
      handover: {
        ...prev.handover,
        confirmed: true
      }
    }));
    console.log('[TripContext] Handover confirmed');
  }, []);

  return (
    <TripContext.Provider value={{ state, setScene, executeControl, handleAbnormal, setHandoverSignature, confirmHandover }}>
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = (): TripContextType => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within TripProvider');
  }
  return context;
};

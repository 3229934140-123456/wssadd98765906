import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { TripState, ControlAlert, AbnormalAlert } from '@/types';
import { mockTripState } from '@/data/mock';

interface TripContextType {
  state: TripState;
  executeControl: (alertId: string, photoUrl?: string) => void;
  handleAbnormal: (alertId: string) => void;
  confirmHandover: (driverSig: string, receiverSig: string) => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<TripState>(mockTripState);

  const executeControl = useCallback((alertId: string, photoUrl?: string) => {
    setState(prev => ({
      ...prev,
      controlAlerts: prev.controlAlerts.map(alert =>
        alert.id === alertId
          ? {
              ...alert,
              executed: true,
              executedAt: new Date().toISOString(),
              photoUrl: photoUrl || alert.photoUrl
            }
          : alert
      )
    }));
    console.log('[TripContext] Control executed:', alertId);
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

  const confirmHandover = useCallback((driverSig: string, receiverSig: string) => {
    setState(prev => ({
      ...prev,
      handover: {
        ...prev.handover,
        confirmed: true,
        driverSignature: driverSig,
        receiverSignature: receiverSig
      }
    }));
    console.log('[TripContext] Handover confirmed');
  }, []);

  return (
    <TripContext.Provider value={{ state, executeControl, handleAbnormal, confirmHandover }}>
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

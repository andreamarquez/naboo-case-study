import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface DebugContextType {
  canUseDebugMode: boolean;
}

const DebugContext = createContext<DebugContextType | undefined>(undefined);

interface DebugProviderProps {
  children: React.ReactNode;
}

export function DebugProvider({ children }: DebugProviderProps) {
  const { isAdmin, isAuthenticated } = useAuth();
  const canUseDebugMode = isAuthenticated && isAdmin;


  return (
    <DebugContext.Provider
      value={{
        canUseDebugMode
      }}
    >
      {children}
    </DebugContext.Provider>
  );
}

export function useDebugMode(): DebugContextType {
  const context = useContext(DebugContext);
  if (context === undefined) {
    throw new Error('useDebugMode must be used within a DebugProvider');
  }
  return context;
}

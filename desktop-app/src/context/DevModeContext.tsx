import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface DevModeContextType {
  isDevMode: boolean;
  toggleDevMode: () => void;
}

const DevModeContext = createContext<DevModeContextType | undefined>(undefined);

export function DevModeProvider({ children }: { children: ReactNode }) {
  const [isDevMode, setIsDevMode] = useState(() => {
    const saved = localStorage.getItem('isDevMode');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('isDevMode', String(isDevMode));
  }, [isDevMode]);

  const toggleDevMode = () => setIsDevMode((prev) => !prev);

  return (
    <DevModeContext.Provider value={{ isDevMode, toggleDevMode }}>
      {children}
    </DevModeContext.Provider>
  );
}

export function useDevMode() {
  const context = useContext(DevModeContext);
  if (context === undefined) {
    throw new Error('useDevMode must be used within a DevModeProvider');
  }
  return context;
}

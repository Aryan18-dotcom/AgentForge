import React, { createContext, useContext } from 'react';
import { useNavigate, type NavigateFunction } from 'react-router-dom';

const NavigationContext = createContext<NavigateFunction | null>(null);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate(); // Safe to execute here because this component renders INSIDE the RouterProvider tree
  return (
    <NavigationContext.Provider value={navigate}>
      {children}
    </NavigationContext.Provider>
  );
}

// Custom hook so any child component can grab the global navigate channel cleanly
export function useGlobalNavigate() {
  const context = useContext(NavigationContext);
  if (!context) throw new Error("useGlobalNavigate must be used within a NavigationProvider");
  return context;
}
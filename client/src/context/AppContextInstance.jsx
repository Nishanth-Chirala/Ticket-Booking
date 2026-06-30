import { createContext, useContext } from 'react';

// Only functional constants, contexts, and hooks are exported here
export const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

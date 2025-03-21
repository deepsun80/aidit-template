// context/GlobalErrorContext.tsx
'use client';

import { createContext, useContext, useState } from 'react';

interface GlobalErrorContextType {
  error: string | null;
  showError: (message: string) => void;
  clearError: () => void;
}

const GlobalErrorContext = createContext<GlobalErrorContextType | undefined>(
  undefined
);

export const GlobalErrorProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [error, setError] = useState<string | null>(null);

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 5000); // auto-dismiss
  };

  const clearError = () => setError(null);

  return (
    <GlobalErrorContext.Provider value={{ error, showError, clearError }}>
      {children}
    </GlobalErrorContext.Provider>
  );
};

export const useGlobalError = () => {
  const context = useContext(GlobalErrorContext);
  if (!context) {
    throw new Error('useGlobalError must be used within GlobalErrorProvider');
  }
  return context;
};

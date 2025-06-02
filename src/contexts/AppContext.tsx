// src/contexts/AppContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

interface AppContextValue {
  // put here any values you want to share globally, for example:
  userId: string | null;
  setUserId: (id: string | null) => void;
  // ...you can add more shared state or functions as needed
}

// Create the context
const AppContext = createContext<AppContextValue | undefined>(undefined);

// Create a provider that wraps your app (already existing)
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);

  // The “value” object is what consumers will be able to read
  const value: AppContextValue = {
    userId,
    setUserId,
    // …any other shared state/functions here
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// ⚠️ Add and export this custom hook so consumers can read from context
export function useAppContext(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}


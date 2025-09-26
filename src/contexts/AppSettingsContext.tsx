import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of our context data
interface AppSettingsContextType {
  // State values
  level: number;
  selectedLayout: string;
  shiftMode: boolean;

  // Functions to update state
  setLevel: (level: number) => void;
  setSelectedLayout: (layout: string) => void;
  setShiftMode: (mode: boolean) => void;

  // Handler functions that components can call
  handleLevelChange: (newLevel: number) => void;
  handleLayoutChange: (newLayout: string) => void;
  handleShiftChange: (newShiftMode: boolean) => void;
}

// Create the context with undefined default (we'll provide actual values in the Provider)
const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

// Provider component props
interface AppSettingsProviderProps {
  children: ReactNode;
}

// The Provider component that wraps our app and provides the context values
export const AppSettingsProvider: React.FC<AppSettingsProviderProps> = ({
  children
}) => {
  // Local state managed by the provider
  const [level, setLevel] = useState<number>(2);
  const [selectedLayout, setSelectedLayout] = useState<string>("Qwerty");
  const [shiftMode, setShiftMode] = useState<boolean>(false);

  // Handler functions that encapsulate business logic
  const handleLevelChange = (newLevel: number): void => {
    if (newLevel >= 1 && newLevel <= 25) {
      setLevel(newLevel);
    }
  };

  const handleLayoutChange = (newLayout: string): void => {
    setSelectedLayout(newLayout);
  };

  const handleShiftChange = (newShiftMode: boolean): void => {
    setShiftMode(newShiftMode);
  };

  // The value object that will be provided to consuming components
  const contextValue: AppSettingsContextType = {
    // State
    level,
    selectedLayout,
    shiftMode,

    // Setters (for direct state updates when needed)
    setLevel,
    setSelectedLayout,
    setShiftMode,

    // Handlers (for UI interactions)
    handleLevelChange,
    handleLayoutChange,
    handleShiftChange,
  };

  return (
    <AppSettingsContext.Provider value={contextValue}>
      {children}
    </AppSettingsContext.Provider>
  );
};

// Custom hook for consuming the context
// This provides type safety and a better error message if context is used outside provider
export const useAppSettings = (): AppSettingsContextType => {
  const context = useContext(AppSettingsContext);
  if (context === undefined) {
    throw new Error('useAppSettings must be used within an AppSettingsProvider');
  }
  return context;
};
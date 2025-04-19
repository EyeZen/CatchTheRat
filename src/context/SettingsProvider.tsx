import React, { createContext, useContext, useState } from 'react';

// Define the context for settings
interface ISettingsContext {
  dispatchCatAgent: boolean;
  dispatchRatAgent: boolean;
  movementSpeed: number;
  toggleSetting: (setting: keyof Omit<ISettingsContext, 'movementSpeed'>) => void;
  setMovementSpeed: (speed: number) => void;
}

const SettingsContext = createContext<ISettingsContext | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState({
    dispatchCatAgent: false,
    dispatchRatAgent: false,
    movementSpeed: 1,
  });

  const toggleSetting = (setting: keyof Omit<ISettingsContext, 'movementSpeed'>) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !(prev as any)[setting],
    }));
  };

  const setMovementSpeed = (speed: number) => {
    setSettings((prev) => ({
      ...prev,
      movementSpeed: speed,
    }));
  };

  return (
    <SettingsContext.Provider value={{ ...settings, toggleSetting, setMovementSpeed }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
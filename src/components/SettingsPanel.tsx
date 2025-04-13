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

const SettingsPanel: React.FC = () => {
  const { dispatchCatAgent, dispatchRatAgent, movementSpeed, toggleSetting, setMovementSpeed } = useSettings();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-72">
      <h2 className="text-lg font-semibold mb-4">Settings</h2>
      <div className="flex items-center justify-between mb-4">
        <label htmlFor="dispatchCatAgent" className="text-gray-700">
          Dispatch Cat-Agent
        </label>
        <div
          className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors ${
            dispatchCatAgent ? 'bg-blue-500' : 'bg-gray-300'
          }`}
          onClick={() => toggleSetting('dispatchCatAgent')}
        >
          <div
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
              dispatchCatAgent ? 'transform translate-x-6' : ''
            }`}
          ></div>
        </div>
      </div>
      <div className="flex items-center justify-between mb-4">
        <label htmlFor="dispatchRatAgent" className="text-gray-700">
          Dispatch Rat-Agent
        </label>
        <div
          className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors ${
            dispatchRatAgent ? 'bg-blue-500' : 'bg-gray-300'
          }`}
          onClick={() => toggleSetting('dispatchRatAgent')}
        >
          <div
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
              dispatchRatAgent ? 'transform translate-x-6' : ''
            }`}
          ></div>
        </div>
      </div>
      {(dispatchCatAgent || dispatchRatAgent) && (
        <div className="mt-4">
          <label htmlFor="movementSpeed" className="text-gray-700 block mb-2">
            Movement Speed
          </label>
          <input
            id="movementSpeed"
            type="range"
            min="1"
            max="5"
            value={movementSpeed}
            onChange={(e) => setMovementSpeed(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-center text-sm text-gray-600 mt-1">
            Speed: {movementSpeed}
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPanel;


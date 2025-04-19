import React from 'react';
import { useSettings } from '../context/SettingsProvider';

interface SettingsPanelProps {
  setShowHowToPlay: (show: boolean) => void; // Add prop to control the popup
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ setShowHowToPlay }) => {
  const { dispatchCatAgent, dispatchRatAgent, movementSpeed, toggleSetting, setMovementSpeed } = useSettings();

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-4">Settings</h2>
      <div className="flex items-center justify-between mb-4">
        <label htmlFor="dispatchCatAgent" className="text-gray-700">
          Dispatch agent Cat&nbsp;
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
          Dispatch agent Rat&nbsp;
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
      <div className="mt-4">
        <button
          onClick={() => setShowHowToPlay(true)} // Show the popup when clicked
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md w-full"
        >
          How to Play
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;


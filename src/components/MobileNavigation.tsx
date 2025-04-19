import React, { useState } from 'react';
import SettingsPanel from './SettingsPanel';

interface MobileNavigationProps {
  setPaused: (paused: boolean) => void;
  setShowHowToPlay: (show: boolean) => void; // Add prop to control the popup
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ setPaused, setShowHowToPlay }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const openMenu = () => {
    setIsMenuOpen(true);
    setPaused(true); // Pause the game when the menu is opened
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setPaused(false); // Resume the game when the menu is closed
  };

  return (
    <div className="sm:hidden fixed top-0 left-0 right-0 bg-white shadow-md p-4 flex justify-between items-center z-50">
      {/* Hamburger Menu Button */}
      <button
        onClick={openMenu}
        className="text-gray-800 focus:outline-none"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
        </svg>
      </button>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMenu}
        ></div>
      )}

      {/* Sliding Menu */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg w-64 transform transition-transform duration-300 z-50 ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={closeMenu}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          ✖
        </button>
        <h2 className="text-lg font-semibold mb-4 p-4">Menu</h2>
        <div className="p-4">
          <button
            onClick={() => {
              setShowHowToPlay(true); // Show the "How to Play" popup
              closeMenu(); // Close the menu
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md w-full mb-4"
          >
            How to Play
          </button>
          <SettingsPanel setShowHowToPlay={setShowHowToPlay} />
        </div>
      </div>
    </div>
  );
};

export default MobileNavigation;
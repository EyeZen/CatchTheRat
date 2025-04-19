import React, { useState } from 'react';
import Game from './components/Game';
import SettingsPanel from './components/SettingsPanel';
import { SettingsProvider } from './context/SettingsProvider';
import MoveHistory from './components/MoveHistory';
import MobileNavigation from './components/MobileNavigation';
import { MoveHistoryProvider } from './context/MoveHistoryContext';

function App() {
  const [paused, setPaused] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(true); // State to control the popup visibility

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 w-full overflow-x-hidden">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Cat vs Rat</h1>
      <SettingsProvider>
        <MoveHistoryProvider>
          <MobileNavigation setPaused={setPaused} setShowHowToPlay={setShowHowToPlay} />
          <div className="flex gap-6">
            <div className="hidden sm:block">
              <SettingsPanel setShowHowToPlay={setShowHowToPlay} /> {/* Pass the function to SettingsPanel */}
            </div>
            <Game paused={paused} setPaused={setPaused} />
            <MoveHistory />
          </div>
        </MoveHistoryProvider>
      </SettingsProvider>

      {/* How to Play Popup */}
      {showHowToPlay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-11/12">
            <h2 className="text-xl font-bold mb-4 text-center text-gray-800">How to Play</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                The <span className="font-semibold">rat</span> and <span className="font-semibold">cat</span> take turns moving between checkpoints.
              </li>
              <li>
                The <span className="font-semibold">rat</span> moves first.
              </li>
              <li>
                No more than <span className="font-semibold">2 repetitive moves</span> are allowed.
              </li>
              <li>
                Click on a valid checkpoint to move.
              </li>
              <li>
                The <span className="font-semibold">cat</span> wins if it catches the <span className="font-semibold">rat</span>!
              </li>
            </ul>
            <button
              onClick={() => setShowHowToPlay(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md mt-6 w-full"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
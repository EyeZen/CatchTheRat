import React, { useState } from 'react';
import Game from './components/Game';
import SettingsPanel from './components/SettingsPanel';
import { SettingsProvider } from './context/SettingsProvider';
import MoveHistory from './components/MoveHistory';
import MobileNavigation from './components/MobileNavigation';
import { MoveHistoryProvider } from './context/MoveHistoryContext';

function App() {
  const [paused, setPaused] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 w-full overflow-x-hidden">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Cat vs Rat</h1>
      <SettingsProvider>
        <MoveHistoryProvider>
          <MobileNavigation setPaused={setPaused} />
          <div className="flex gap-6">
            <div className="hidden sm:block">
              <SettingsPanel />
            </div>
            <Game paused={paused} setPaused={setPaused} />
            <MoveHistory />
          </div>
        </MoveHistoryProvider>
      </SettingsProvider>
      <div className="mt-8 text-gray-600 max-w-md text-center">
        <h2 className="font-semibold mb-2">How to Play:</h2>
        <p>
          The rat and cat take turns moving between checkpoints. The rat moves first. 
          No more than 2 repetitive moves are allowed.
          Click on a valid checkpoint to move. The cat wins if it catches the rat!
        </p>
      </div>
    </div>
  );
}

export default App;
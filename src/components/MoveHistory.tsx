import React from 'react';
import { useMoveHistory } from '../context/MoveHistoryContext';
import Actors from '../types/Actors';

const MoveHistory: React.FC = () => {
  const { moveHistory } = useMoveHistory();

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-72 h-64 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Move History</h2>
      {moveHistory.length === 0 ? (
        <p className="text-gray-500 text-center">No moves yet.</p>
      ) : (
        <ul className="space-y-2">
          {[...moveHistory].reverse().map((move, index) => (
            <li key={index} className="flex items-center gap-4">
              <span className="text-2xl">
                {move.actor === Actors.CAT ? '🐱' : '🐀'}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-gray-700 font-semibold">{move.from}</span>
                <span className="text-gray-500">→</span>
                <span className="text-gray-700 font-semibold">{move.to}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MoveHistory;
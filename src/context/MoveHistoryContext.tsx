import React, { createContext, useContext, useState } from 'react';
import { Actor } from '../types/Actors';

interface IMove {
  actor: Actor;
  from: number;
  to: number;
}

interface IMoveHistoryContext {
  moveHistory: IMove[];
  addMove: (move: IMove) => void;
  clearHistory: () => void;
}

const MoveHistoryContext = createContext<IMoveHistoryContext | undefined>(undefined);

export const MoveHistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [moveHistory, setMoveHistory] = useState<IMove[]>([]);

  const addMove = (move: IMove) => {
    setMoveHistory((prev) => [...prev, move]);
  };

  const clearHistory = () => {
    setMoveHistory([]);
  };

  return (
    <MoveHistoryContext.Provider value={{ moveHistory, addMove, clearHistory }}>
      {children}
    </MoveHistoryContext.Provider>
  );
};

export const useMoveHistory = () => {
  const context = useContext(MoveHistoryContext);
  if (!context) {
    throw new Error('useMoveHistory must be used within a MoveHistoryProvider');
  }
  return context;
};
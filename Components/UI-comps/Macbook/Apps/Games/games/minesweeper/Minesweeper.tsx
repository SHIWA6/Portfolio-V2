/**
 * Minesweeper Game
 * 
 * Classic Minesweeper with customizable difficulty.
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { GameComponentProps } from '../../types';
import { Flag, Bomb } from 'lucide-react';

interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

type Difficulty = 'easy' | 'medium' | 'hard';

const DIFFICULTIES = {
  easy: { rows: 8, cols: 8, mines: 10 },
  medium: { rows: 12, cols: 12, mines: 25 },
  hard: { rows: 16, cols: 16, mines: 50 },
};

const Minesweeper: React.FC<GameComponentProps> = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [board, setBoard] = useState<Cell[][]>([]);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
  const [flagCount, setFlagCount] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [firstClick, setFirstClick] = useState(true);

  const { rows, cols, mines } = DIFFICULTIES[difficulty];

  // Create empty board
  const createEmptyBoard = useCallback((): Cell[][] => {
    return Array(rows).fill(null).map(() =>
      Array(cols).fill(null).map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0,
      }))
    );
  }, [rows, cols]);

  // Place mines (avoiding first click position)
  const placeMines = useCallback((board: Cell[][], safeRow: number, safeCol: number): Cell[][] => {
    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    let placedMines = 0;

    while (placedMines < mines) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);

      // Don't place mine on safe cell or adjacent cells
      const isSafeZone = Math.abs(r - safeRow) <= 1 && Math.abs(c - safeCol) <= 1;

      if (!newBoard[r][c].isMine && !isSafeZone) {
        newBoard[r][c].isMine = true;
        placedMines++;
      }
    }

    // Calculate neighbor counts
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!newBoard[r][c].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && newBoard[nr][nc].isMine) {
                count++;
              }
            }
          }
          newBoard[r][c].neighborMines = count;
        }
      }
    }

    return newBoard;
  }, [rows, cols, mines]);

  // Initialize game
  const initGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setGameState('idle');
    setFlagCount(0);
    setStartTime(null);
    setElapsedTime(0);
    setFirstClick(true);
  }, [createEmptyBoard]);

  // Initialize on mount and difficulty change - using layout effect
  useEffect(() => {
    const timeoutId = setTimeout(() => initGame(), 0);
    return () => clearTimeout(timeoutId);
  }, [initGame, difficulty]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (gameState === 'playing' && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState, startTime]);

  // Reveal cell
  const revealCell = useCallback((r: number, c: number, currentBoard: Cell[][]): Cell[][] => {
    const newBoard = currentBoard.map(row => row.map(cell => ({ ...cell })));

    const reveal = (row: number, col: number) => {
      if (row < 0 || row >= rows || col < 0 || col >= cols) return;
      if (newBoard[row][col].isRevealed || newBoard[row][col].isFlagged) return;

      newBoard[row][col].isRevealed = true;

      if (newBoard[row][col].neighborMines === 0 && !newBoard[row][col].isMine) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            reveal(row + dr, col + dc);
          }
        }
      }
    };

    reveal(r, c);
    return newBoard;
  }, [rows, cols]);

  // Check win condition
  const checkWin = useCallback((board: Cell[][]): boolean => {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!board[r][c].isMine && !board[r][c].isRevealed) {
          return false;
        }
      }
    }
    return true;
  }, [rows, cols]);

  // Handle cell click
  const handleCellClick = useCallback((r: number, c: number) => {
    if (gameState === 'won' || gameState === 'lost') return;
    if (board[r][c].isRevealed || board[r][c].isFlagged) return;

    let currentBoard = board;

    // First click - place mines
    if (firstClick) {
      currentBoard = placeMines(board, r, c);
      setFirstClick(false);
      setGameState('playing');
      setStartTime(Date.now());
    }

    // Check if mine
    if (currentBoard[r][c].isMine) {
      // Reveal all mines
      const lostBoard = currentBoard.map(row =>
        row.map(cell => cell.isMine ? { ...cell, isRevealed: true } : cell)
      );
      setBoard(lostBoard);
      setGameState('lost');
      return;
    }

    // Reveal cell
    const newBoard = revealCell(r, c, currentBoard);
    setBoard(newBoard);

    // Check win
    if (checkWin(newBoard)) {
      setGameState('won');
    }
  }, [board, gameState, firstClick, placeMines, revealCell, checkWin]);

  // Handle right click (flag)
  const handleRightClick = useCallback((e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameState === 'won' || gameState === 'lost') return;
    if (board[r][c].isRevealed) return;

    setBoard(prev => {
      const newBoard = prev.map(row => row.map(cell => ({ ...cell })));
      newBoard[r][c].isFlagged = !newBoard[r][c].isFlagged;
      return newBoard;
    });

    setFlagCount(prev => board[r][c].isFlagged ? prev - 1 : prev + 1);
  }, [board, gameState]);

  // Get cell color based on number
  const getNumberColor = (num: number): string => {
    const colors = [
      '', 'text-blue-400', 'text-green-400', 'text-red-400',
      'text-purple-400', 'text-yellow-400', 'text-pink-400',
      'text-cyan-400', 'text-white'
    ];
    return colors[num] || '';
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 overflow-auto">
      {/* Header */}
      <div className="shrink-0 p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-white">Minesweeper</h1>
          <button
            onClick={initGame}
            className="px-3 py-1 bg-blue-500 hover:bg-blue-400 text-white text-sm font-semibold rounded transition-colors"
          >
            New Game
          </button>
        </div>

        {/* Difficulty selector */}
        <div className="flex gap-2 mb-3">
          {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`px-3 py-1 text-sm rounded capitalize transition-colors ${
                difficulty === d
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Bomb size={16} className="text-red-400" />
            <span className="text-gray-300">{mines - flagCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <Flag size={16} className="text-yellow-400" />
            <span className="text-gray-300">{flagCount}</span>
          </div>
          <div className="text-gray-300">
            ⏱️ {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* Game Board */}
      <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
        <div
          className="grid gap-0.5 bg-gray-700 p-1 rounded"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {board.map((row, r) =>
            row.map((cell, c) => (
              <button
                key={`${r}-${c}`}
                onClick={() => handleCellClick(r, c)}
                onContextMenu={(e) => handleRightClick(e, r, c)}
                className={`
                  w-6 h-6 text-xs font-bold flex items-center justify-center rounded-sm transition-colors
                  ${cell.isRevealed
                    ? cell.isMine
                      ? 'bg-red-500'
                      : 'bg-gray-600'
                    : 'bg-gray-500 hover:bg-gray-400'
                  }
                  ${getNumberColor(cell.neighborMines)}
                `}
              >
                {cell.isRevealed ? (
                  cell.isMine ? (
                    <Bomb size={14} className="text-white" />
                  ) : cell.neighborMines > 0 ? (
                    cell.neighborMines
                  ) : null
                ) : cell.isFlagged ? (
                  <Flag size={14} className="text-yellow-400" />
                ) : null}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Game over overlay */}
      {(gameState === 'won' || gameState === 'lost') && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70">
          <div className="text-center">
            <span className="text-6xl mb-4 block">
              {gameState === 'won' ? '🎉' : '💥'}
            </span>
            <h2 className={`text-2xl font-bold mb-2 ${gameState === 'won' ? 'text-green-400' : 'text-red-400'}`}>
              {gameState === 'won' ? 'You Win!' : 'Game Over'}
            </h2>
            <p className="text-gray-300 mb-4">
              Time: {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}
            </p>
            <button
              onClick={initGame}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-lg transition-colors"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Minesweeper;

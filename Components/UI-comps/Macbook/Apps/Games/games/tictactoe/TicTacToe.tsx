/**
 * Tic-Tac-Toe Game
 * 
 * Classic two-player (or vs AI) Tic-Tac-Toe.
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { GameComponentProps } from '../../types';

type Player = 'X' | 'O' | null;
type Board = Player[];
type Difficulty = 'easy' | 'medium' | 'hard';

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6], // Diagonals
];

const TicTacToe: React.FC<GameComponentProps> = () => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [mode, setMode] = useState<'pvp' | 'pvc'>('pvc');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });

  // Check for winner
  const checkWinner = useCallback((boardState: Board): { winner: Player | 'draw' | null; line: number[] | null } => {
    for (const combo of WINNING_COMBINATIONS) {
      const [a, b, c] = combo;
      if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
        return { winner: boardState[a], line: combo };
      }
    }
    if (boardState.every(cell => cell !== null)) {
      return { winner: 'draw', line: null };
    }
    return { winner: null, line: null };
  }, []);

  // Minimax algorithm for AI - using regular function to allow recursion
  const minimax = useMemo(() => {
    const fn = (boardState: Board, depth: number, isMaximizing: boolean, alpha: number, beta: number): number => {
      const result = checkWinner(boardState);
      
      if (result.winner === 'O') return 10 - depth;
      if (result.winner === 'X') return depth - 10;
      if (result.winner === 'draw') return 0;

      if (isMaximizing) {
        let maxEval = -Infinity;
        for (let i = 0; i < 9; i++) {
          if (boardState[i] === null) {
            boardState[i] = 'O';
            const evalScore = fn(boardState, depth + 1, false, alpha, beta);
            boardState[i] = null;
            maxEval = Math.max(maxEval, evalScore);
            alpha = Math.max(alpha, evalScore);
            if (beta <= alpha) break;
          }
        }
        return maxEval;
      } else {
        let minEval = Infinity;
        for (let i = 0; i < 9; i++) {
          if (boardState[i] === null) {
            boardState[i] = 'X';
            const evalScore = fn(boardState, depth + 1, true, alpha, beta);
            boardState[i] = null;
            minEval = Math.min(minEval, evalScore);
            beta = Math.min(beta, evalScore);
            if (beta <= alpha) break;
          }
        }
        return minEval;
      }
    };
    return fn;
  }, [checkWinner]);

  // AI move
  const makeAIMove = useCallback((boardState: Board) => {
    const emptySquares = boardState.map((cell, idx) => cell === null ? idx : -1).filter(idx => idx !== -1);
    
    if (emptySquares.length === 0) return;

    let moveIndex: number;

    if (difficulty === 'easy') {
      // Random move
      moveIndex = emptySquares[Math.floor(Math.random() * emptySquares.length)];
    } else if (difficulty === 'medium') {
      // 50% chance of optimal move, 50% random
      if (Math.random() < 0.5) {
        moveIndex = emptySquares[Math.floor(Math.random() * emptySquares.length)];
      } else {
        let bestScore = -Infinity;
        moveIndex = emptySquares[0];
        for (const idx of emptySquares) {
          boardState[idx] = 'O';
          const score = minimax(boardState, 0, false, -Infinity, Infinity);
          boardState[idx] = null;
          if (score > bestScore) {
            bestScore = score;
            moveIndex = idx;
          }
        }
      }
    } else {
      // Always optimal (minimax)
      let bestScore = -Infinity;
      moveIndex = emptySquares[0];
      for (const idx of emptySquares) {
        boardState[idx] = 'O';
        const score = minimax(boardState, 0, false, -Infinity, Infinity);
        boardState[idx] = null;
        if (score > bestScore) {
          bestScore = score;
          moveIndex = idx;
        }
      }
    }

    const newBoard = [...boardState];
    newBoard[moveIndex] = 'O';
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result.winner) {
      setWinner(result.winner);
      setWinningLine(result.line);
      if (result.winner === 'O') {
        setScores(prev => ({ ...prev, O: prev.O + 1 }));
      } else if (result.winner === 'draw') {
        setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
      }
    } else {
      setCurrentPlayer('X');
    }
  }, [checkWinner, minimax, difficulty]);

  // Handle cell click
  const handleCellClick = useCallback((index: number) => {
    if (board[index] || winner) return;
    if (mode === 'pvc' && currentPlayer === 'O') return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result.winner) {
      setWinner(result.winner);
      setWinningLine(result.line);
      if (result.winner === 'X') {
        setScores(prev => ({ ...prev, X: prev.X + 1 }));
      } else if (result.winner === 'O') {
        setScores(prev => ({ ...prev, O: prev.O + 1 }));
      } else {
        setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
      }
    } else {
      if (mode === 'pvc') {
        setCurrentPlayer('O');
        setTimeout(() => makeAIMove(newBoard), 300);
      } else {
        setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
      }
    }
  }, [board, currentPlayer, winner, mode, checkWinner, makeAIMove]);

  // Reset game
  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setWinningLine(null);
  }, []);

  // Reset all
  const resetAll = useCallback(() => {
    resetGame();
    setScores({ X: 0, O: 0, draws: 0 });
  }, [resetGame]);

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
      {/* Header */}
      <div className="mb-4 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Tic-Tac-Toe</h1>
        
        {/* Mode selector */}
        <div className="flex gap-2 mb-2 justify-center">
          <button
            onClick={() => { setMode('pvc'); resetGame(); }}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              mode === 'pvc' 
                ? 'bg-purple-500 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            vs Computer
          </button>
          <button
            onClick={() => { setMode('pvp'); resetGame(); }}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              mode === 'pvp' 
                ? 'bg-purple-500 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Two Players
          </button>
        </div>

        {/* Difficulty selector (AI only) */}
        {mode === 'pvc' && (
          <div className="flex gap-1 justify-center mb-2">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
              <button
                key={d}
                onClick={() => { setDifficulty(d); resetGame(); }}
                className={`px-2 py-1 text-xs rounded transition-colors capitalize ${
                  difficulty === d 
                    ? 'bg-pink-500 text-white' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Scoreboard */}
      <div className="flex gap-6 mb-4 text-sm">
        <div className="text-center">
          <span className="text-blue-400 font-bold text-lg">X</span>
          <p className="text-white font-semibold">{scores.X}</p>
        </div>
        <div className="text-center">
          <span className="text-gray-400 text-lg">Draws</span>
          <p className="text-white font-semibold">{scores.draws}</p>
        </div>
        <div className="text-center">
          <span className="text-red-400 font-bold text-lg">O</span>
          <p className="text-white font-semibold">{scores.O}</p>
        </div>
      </div>

      {/* Turn indicator */}
      {!winner && (
        <div className="mb-4 text-lg text-white">
          {mode === 'pvc' && currentPlayer === 'O' ? (
            <span className="text-gray-400">Computer is thinking...</span>
          ) : (
            <span>
              Turn: <span className={currentPlayer === 'X' ? 'text-blue-400' : 'text-red-400'}>
                {currentPlayer}
              </span>
            </span>
          )}
        </div>
      )}

      {/* Game Board */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {board.map((cell, index) => {
          const isWinningCell = winningLine?.includes(index);
          return (
            <button
              key={index}
              onClick={() => handleCellClick(index)}
              disabled={!!winner || !!cell || (mode === 'pvc' && currentPlayer === 'O')}
              className={`
                w-20 h-20 text-4xl font-bold rounded-lg transition-all
                ${isWinningCell 
                  ? 'bg-green-500/50 scale-105' 
                  : 'bg-white/10 hover:bg-white/20'
                }
                ${cell === 'X' ? 'text-blue-400' : 'text-red-400'}
                disabled:cursor-not-allowed
              `}
            >
              {cell}
            </button>
          );
        })}
      </div>

      {/* Winner announcement */}
      {winner && (
        <div className="text-center mb-4">
          <p className="text-2xl font-bold text-white mb-2">
            {winner === 'draw' ? (
              "It's a Draw! 🤝"
            ) : (
              <>
                <span className={winner === 'X' ? 'text-blue-400' : 'text-red-400'}>
                  {winner}
                </span>
                {' '}Wins! 🎉
              </>
            )}
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={resetGame}
          className="px-4 py-2 bg-purple-500 hover:bg-purple-400 text-white font-semibold rounded-lg transition-colors"
        >
          New Game
        </button>
        <button
          onClick={resetAll}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
        >
          Reset Scores
        </button>
      </div>
    </div>
  );
};

export default TicTacToe;

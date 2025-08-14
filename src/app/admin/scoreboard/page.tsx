'use client';

import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import ProtectedRoute from '@/components/ProtectedRoute';
import UserProfile from '@/components/UserProfile';

interface Score {
  teamA: number;
  teamB: number;
  updatedAt: string;
}

export default function AdminScoreboard() {
  const [score, setScore] = useState<Score>({ teamA: 0, teamB: 0, updatedAt: '' });
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Fetch initial score
    fetchScore();

    // Connect to WebSocket for live updates
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('score:update', (updatedScore: Score) => {
      setScore(updatedScore);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const fetchScore = async () => {
    try {
      const response = await fetch('/api/score');
      if (response.ok) {
        const data = await response.json();
        setScore(data);
      }
    } catch (error) {
      console.error('Failed to fetch score:', error);
    }
  };

  const updateScore = async (team: 'teamA' | 'teamB', increment: number) => {
    setIsUpdating(true);
    try {
      const newScore = Math.max(0, score[team] + increment);
      const response = await fetch('/api/score/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team, score: newScore }),
      });

      if (response.ok) {
        const updatedScore = await response.json();
        setScore(updatedScore);
      }
    } catch (error) {
      console.error('Failed to update score:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const resetScore = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamA: 0, teamB: 0 }),
      });

      if (response.ok) {
        const resetScore = await response.json();
        setScore(resetScore);
      }
    } catch (error) {
      console.error('Failed to reset score:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">
                  🏀 Scoreboard Admin
                </h1>
                <div className="ml-4 flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  <span className="text-sm text-gray-600">
                    {isConnected ? 'Live' : 'Disconnected'}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <a 
                  href="/scoreboard" 
                  target="_blank"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  View Public Scoreboard →
                </a>
                <UserProfile />
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Current Score Display */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Current Score</h2>
              <div className="grid grid-cols-3 gap-8 items-center">
                <div className="text-center">
                  <div className="text-gray-600 text-sm font-medium mb-2">HOME TEAM</div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">{score.teamA}</div>
                  <div className="text-gray-500 text-sm">4bs0lut3-m4dn3ss</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400 text-lg font-bold">VS</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-600 text-sm font-medium mb-2">AWAY TEAM</div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">{score.teamB}</div>
                  <div className="text-gray-500 text-sm">Opponents</div>
                </div>
              </div>
              <div className="mt-4 text-center text-sm text-gray-500">
                Last updated: {score.updatedAt ? new Date(score.updatedAt).toLocaleString() : 'Loading...'}
              </div>
            </div>

            {/* Score Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Team A Controls */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Home Team Controls</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Current Score: {score.teamA}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => updateScore('teamA', 1)}
                      disabled={isUpdating}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      +1 Point
                    </button>
                    <button
                      onClick={() => updateScore('teamA', 2)}
                      disabled={isUpdating}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      +2 Points
                    </button>
                    <button
                      onClick={() => updateScore('teamA', 3)}
                      disabled={isUpdating}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      +3 Points
                    </button>
                  </div>
                  <button
                    onClick={() => updateScore('teamA', -1)}
                    disabled={isUpdating || score.teamA === 0}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    -1 Point
                  </button>
                </div>
              </div>

              {/* Team B Controls */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Away Team Controls</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Current Score: {score.teamB}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => updateScore('teamB', 1)}
                      disabled={isUpdating}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      +1 Point
                    </button>
                    <button
                      onClick={() => updateScore('teamB', 2)}
                      disabled={isUpdating}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      +2 Points
                    </button>
                    <button
                      onClick={() => updateScore('teamB', 3)}
                      disabled={isUpdating}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      +3 Points
                    </button>
                  </div>
                  <button
                    onClick={() => updateScore('teamB', -1)}
                    disabled={isUpdating || score.teamB === 0}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    -1 Point
                  </button>
                </div>
              </div>
            </div>

            {/* Game Management */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Game Management</h3>
              <div className="flex space-x-4">
                <button
                  onClick={resetScore}
                  disabled={isUpdating}
                  className="bg-gray-600 text-white py-2 px-6 rounded-md hover:bg-gray-700 disabled:opacity-50 transition-colors"
                >
                  Reset Score (0-0)
                </button>
                <button
                  onClick={fetchScore}
                  disabled={isUpdating}
                  className="bg-orange-600 text-white py-2 px-6 rounded-md hover:bg-orange-700 disabled:opacity-50 transition-colors"
                >
                  Refresh Score
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
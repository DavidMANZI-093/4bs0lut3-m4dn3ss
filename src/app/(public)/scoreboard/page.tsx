'use client';

import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

interface Score {
  teamA: number;
  teamB: number;
  updatedAt: string;
}

export default function PublicScoreboard() {
  const [score, setScore] = useState<Score>({ teamA: 0, teamB: 0, updatedAt: '' });
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-orange-800 to-red-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
            🏀 4bs0lut3-m4dn3ss
          </h1>
          <p className="text-xl text-orange-200">Live Game Scoreboard</p>
          <div className="flex items-center justify-center mt-4">
            <div className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span className="text-orange-200 text-sm">
              {isConnected ? 'Live Updates Active' : 'Connecting...'}
            </span>
          </div>
        </div>

        {/* Main Scoreboard */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-black/30 backdrop-blur-sm rounded-3xl p-8 border border-orange-500/30">
            <div className="grid grid-cols-3 gap-8 items-center">
              {/* Team A */}
              <div className="text-center">
                <div className="text-orange-300 text-lg font-semibold mb-2">HOME TEAM</div>
                <div className="text-6xl md:text-8xl font-bold text-white mb-2">
                  {score.teamA}
                </div>
                <div className="text-orange-200 text-sm">4bs0lut3-m4dn3ss</div>
              </div>

              {/* VS Separator */}
              <div className="text-center">
                <div className="text-orange-400 text-2xl font-bold">VS</div>
                <div className="w-16 h-1 bg-orange-500 mx-auto mt-4"></div>
              </div>

              {/* Team B */}
              <div className="text-center">
                <div className="text-orange-300 text-lg font-semibold mb-2">AWAY TEAM</div>
                <div className="text-6xl md:text-8xl font-bold text-white mb-2">
                  {score.teamB}
                </div>
                <div className="text-orange-200 text-sm">Opponents</div>
              </div>
            </div>

            {/* Game Info */}
            <div className="mt-8 pt-6 border-t border-orange-500/30">
              <div className="text-center">
                <div className="text-orange-300 text-sm mb-1">LAST UPDATED</div>
                <div className="text-orange-200 text-sm">
                  {score.updatedAt ? new Date(score.updatedAt).toLocaleString() : 'Loading...'}
                </div>
              </div>
            </div>
          </div>

          {/* Game Status */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center bg-green-600/20 text-green-300 px-4 py-2 rounded-full border border-green-500/30">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              GAME IN PROGRESS
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 text-center border border-orange-500/20">
              <div className="text-orange-300 text-sm font-semibold">QUARTER</div>
              <div className="text-white text-xl font-bold">4th</div>
            </div>
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 text-center border border-orange-500/20">
              <div className="text-orange-300 text-sm font-semibold">TIME</div>
              <div className="text-white text-xl font-bold">02:45</div>
            </div>
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 text-center border border-orange-500/20">
              <div className="text-orange-300 text-sm font-semibold">VENUE</div>
              <div className="text-white text-xl font-bold">Home Court</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-orange-300 text-sm">
            Follow the game live • Updates in real-time
          </p>
          <div className="mt-4">
            <a 
              href="/tickets/public" 
              className="inline-block bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Get Tickets for Next Game
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
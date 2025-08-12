'use client'

import { useState, useEffect } from 'react'
import { io, Socket } from 'socket.io-client'

interface Score {
  id: string
  teamA: number
  teamB: number
  updatedAt: string
}

export default function BasketballScoreboard() {
  const [score, setScore] = useState<Score | null>(null)
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Fetch initial score
    fetchScore()

    // Connect to WebSocket
    const socketInstance = io('http://localhost:3001')
    setSocket(socketInstance)

    socketInstance.on('connect', () => {
      setIsConnected(true)
      console.log('Connected to WebSocket')
    })

    socketInstance.on('disconnect', () => {
      setIsConnected(false)
      console.log('Disconnected from WebSocket')
    })

    socketInstance.on('score:update', (updatedScore: Score) => {
      setScore(updatedScore)
      console.log('Score updated:', updatedScore)
    })

    socketInstance.on('score:reset', (resetScore: Score) => {
      setScore(resetScore)
      console.log('Score reset:', resetScore)
    })

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  const fetchScore = async () => {
    try {
      const response = await fetch('/api/score')
      const data = await response.json()
      if (data.success) {
        setScore(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch score:', error)
    }
  }

  const updateScore = async (team: 'A' | 'B', points: number) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/score/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ team, points }),
      })
      const data = await response.json()
      if (data.success) {
        setScore(data.data)
      }
    } catch (error) {
      console.error('Failed to update score:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const resetScore = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/score', {
        method: 'POST',
      })
      const data = await response.json()
      if (data.success) {
        setScore(data.data)
      }
    } catch (error) {
      console.error('Failed to reset score:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!score) {
    return (
      <div className="bg-white rounded-lg card-shadow border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg card-shadow border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">🏀 Basketball Scoreboard</h2>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm text-gray-600">
            {isConnected ? 'Live' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Scoreboard */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Team A */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Team A</h3>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
            <div className="text-6xl font-bold text-blue-600 mb-4">{score.teamA}</div>
            <div className="space-y-2">
              <button
                onClick={() => updateScore('A', 1)}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                +1
              </button>
              <button
                onClick={() => updateScore('A', 2)}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                +2
              </button>
              <button
                onClick={() => updateScore('A', 3)}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                +3
              </button>
            </div>
          </div>
        </div>

        {/* Team B */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Team B</h3>
          <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-6">
            <div className="text-6xl font-bold text-orange-600 mb-4">{score.teamB}</div>
            <div className="space-y-2">
              <button
                onClick={() => updateScore('B', 1)}
                disabled={isLoading}
                className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors"
              >
                +1
              </button>
              <button
                onClick={() => updateScore('B', 2)}
                disabled={isLoading}
                className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors"
              >
                +2
              </button>
              <button
                onClick={() => updateScore('B', 3)}
                disabled={isLoading}
                className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled-opacity-50 transition-colors"
              >
                +3
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={resetScore}
          disabled={isLoading}
          className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
        >
          Reset Score
        </button>
        <button
          onClick={fetchScore}
          disabled={isLoading}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Last Updated */}
      <div className="text-center mt-4 text-sm text-gray-500">
        Last updated: {new Date(score.updatedAt).toLocaleTimeString()}
      </div>
    </div>
  )
}
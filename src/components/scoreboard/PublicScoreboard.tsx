'use client'

import { useState, useEffect } from 'react'
import { io, Socket } from 'socket.io-client'
import { Activity } from 'lucide-react'

interface Score {
  id: string
  teamA: number
  teamB: number
  updatedAt: string
}

export default function PublicScoreboard() {
  const [score, setScore] = useState<Score | null>(null)
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

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

  if (!score) {
    return (
      <div className="bg-[var(--surface)] rounded-lg card-shadow border border-[var(--border)] p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-[var(--pale-dogwood-200)] rounded mb-4"></div>
          <div className="h-32 bg-[var(--pale-dogwood-200)] rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg card-shadow border border-[var(--border)] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
          <Activity className="w-6 h-6 text-[var(--primary)]" />
          Live Basketball Scoreboard
        </h2>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-[var(--success)]' : 'bg-[var(--error)]'}`}></div>
          <span className="text-sm text-[var(--text-secondary)]">
            {isConnected ? 'Live' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Scoreboard Display */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Team A */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-[var(--text-secondary)] mb-2">Team A</h3>
          <div className="bg-[var(--surface)] border-2 border-[var(--primary)] rounded-lg p-6">
            <div className="text-6xl font-bold text-[var(--primary)]">{score.teamA}</div>
          </div>
        </div>

        {/* Team B */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-[var(--text-secondary)] mb-2">Team B</h3>
          <div className="bg-[var(--surface)] border-2 border-[var(--secondary)] rounded-lg p-6">
            <div className="text-6xl font-bold text-[var(--secondary)]">{score.teamB}</div>
          </div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="text-center text-sm text-[var(--text-muted)]">
        Last updated: {new Date(score.updatedAt).toLocaleTimeString()}
      </div>
    </div>
  )
}
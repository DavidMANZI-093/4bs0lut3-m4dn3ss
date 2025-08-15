import { Server as SocketIOServer } from 'socket.io'
import { Server as HTTPServer } from 'http'
import { prisma } from './prisma'
import { sendMessageSchema } from './validations'
import type { SocketEvents } from '@/types'

export function initializeSocket(httpServer: HTTPServer) {
  const io = new SocketIOServer<SocketEvents>(httpServer, {
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? process.env.NEXTAUTH_URL 
        : "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  })

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`)

    // Handle user joining chat
    socket.on('user:join', (username) => {
      console.log(`${username} joined the chat`)
      socket.broadcast.emit('message:broadcast', {
        id: `system-${Date.now()}`,
        sender: 'System',
        content: `${username} joined the chat`,
        createdAt: new Date()
      })
    })

    // Handle user leaving chat
    socket.on('user:leave', (username) => {
      console.log(`${username} left the chat`)
      socket.broadcast.emit('message:broadcast', {
        id: `system-${Date.now()}`,
        sender: 'System',
        content: `${username} left the chat`,
        createdAt: new Date()
      })
    })

    // Handle chat messages
    socket.on('message:send', async (messageData) => {
      try {
        const validation = sendMessageSchema.safeParse(messageData)
        if (!validation.success) {
          console.error('Invalid message format:', validation.error)
          return
        }

        // Save message to database
        const message = await prisma.message.create({
          data: validation.data
        })

        // Broadcast to all connected clients
        io.emit('message:broadcast', message)
        console.log(`Message from ${message.sender}: ${message.content}`)
      } catch (error) {
        console.error('Error handling message:', error)
      }
    })

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`)
    })
  })

  return io
}

// Helper function to broadcast score updates
export async function broadcastScoreUpdate(io: SocketIOServer, score: any) {
  io.emit('score:update', score)
  console.log(`Score update broadcasted: Team A: ${score.teamA}, Team B: ${score.teamB}`)
}

// Helper function to broadcast score reset
export async function broadcastScoreReset(io: SocketIOServer, score: any) {
  io.emit('score:reset', score)
  console.log(`Score reset broadcasted: 0-0`)
}
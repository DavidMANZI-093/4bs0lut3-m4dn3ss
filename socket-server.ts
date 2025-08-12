import { createServer } from 'http'
import { initializeSocket } from './src/lib/socket'

const PORT = process.env.SOCKET_PORT || 3001

// Create HTTP server for Socket.IO
const httpServer = createServer()

// Initialize Socket.IO
const io = initializeSocket(httpServer)

httpServer.listen(PORT, () => {
  console.log(`🚀 Socket.IO server running on port ${PORT}`)
  console.log(`🔗 Connect to: http://localhost:${PORT}`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully')
  httpServer.close(() => {
    console.log('✅ Socket.IO server closed')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully')
  httpServer.close(() => {
    console.log('✅ Socket.IO server closed')
    process.exit(0)
  })
})
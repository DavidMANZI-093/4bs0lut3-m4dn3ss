import { createServer } from 'http'
import { initializeSocket } from './src/lib/socket'

const PORT = process.env.SOCKET_PORT || 3001

// Create HTTP server for Socket.IO
const httpServer = createServer()

// Initialize Socket.IO with live stream features
const io = initializeSocket(httpServer)

// Track live stream stats
let viewerCount = 0
let messageCount = 0

io.on('connection', (socket) => {
  viewerCount++
  console.log(`New viewer joined! Total viewers: ${viewerCount}`)

  // Broadcast viewer count update to all clients
  io.emit('viewer-count', viewerCount)

  // Send current stats to new user
  socket.emit('stats', { viewerCount, messageCount })

  socket.on('disconnect', () => {
    viewerCount--
    console.log(`Viewer left. Total viewers: ${viewerCount}`)
    io.emit('viewer-count', viewerCount)
  })

  // Listen for new messages to update count
  socket.on('new-message', () => {
    messageCount++
    io.emit('message-count', messageCount)
  })
})

httpServer.listen(PORT, () => {
  console.log(`Live Stream Socket.IO server running on port ${PORT}`)
  console.log(`Connect to: http://localhost:${PORT}`)
  console.log(`Ready for live stream chat with flying messages!`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully')
  httpServer.close(() => {
    console.log('Socket.IO server closed')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully')
  httpServer.close(() => {
    console.log('Socket.IO server closed')
    process.exit(0)
  })
})
'use client'

import { useState, useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

interface Message {
  id: string
  sender: string
  content: string
  createdAt: string
}

export default function LiveChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [username, setUsername] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const [isJoined, setIsJoined] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Fetch initial messages
    fetchMessages()

    // Connect to WebSocket
    const socketInstance = io('http://localhost:3001')
    setSocket(socketInstance)

    socketInstance.on('connect', () => {
      setIsConnected(true)
      console.log('Connected to chat')
    })

    socketInstance.on('disconnect', () => {
      setIsConnected(false)
      console.log('Disconnected from chat')
    })

    socketInstance.on('message:broadcast', (message: Message) => {
      setMessages(prev => [...prev, message])
    })

    return () => {
      if (isJoined && username) {
        socketInstance.emit('user:leave', username)
      }
      socketInstance.disconnect()
    }
  }, [])

  const fetchMessages = async () => {
    try {
      // We'll need to create this endpoint
      const response = await fetch('/api/messages')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setMessages(data.data)
        }
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    }
  }

  const joinChat = () => {
    if (username.trim() && socket) {
      setIsJoined(true)
      socket.emit('user:join', username.trim())
    }
  }

  const leaveChat = () => {
    if (socket && username) {
      socket.emit('user:leave', username)
      setIsJoined(false)
      setUsername('')
    }
  }

  const sendMessage = () => {
    if (newMessage.trim() && socket && username) {
      socket.emit('message:send', {
        sender: username,
        content: newMessage.trim()
      })
      setNewMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (isJoined) {
        sendMessage()
      } else {
        joinChat()
      }
    }
  }

  return (
    <div className="bg-white rounded-lg card-shadow border border-gray-200 p-6 h-96 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">📺 Live Game Stream Chat</h2>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm text-gray-600">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {!isJoined ? (
        /* Join Form */
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Join the Chat</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={50}
              />
              <button
                onClick={joinChat}
                disabled={!username.trim() || !isConnected}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                Join Chat
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-3 bg-gray-50 rounded-lg p-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === username ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === username
                        ? 'bg-blue-600 text-white'
                        : message.sender === 'System'
                        ? 'bg-gray-200 text-gray-700 text-sm italic'
                        : 'bg-white border border-gray-200'
                    }`}
                  >
                    {message.sender !== username && message.sender !== 'System' && (
                      <div className="text-xs font-semibold text-gray-600 mb-1">
                        {message.sender}
                      </div>
                    )}
                    <div className="break-words">{message.content}</div>
                    <div className={`text-xs mt-1 ${
                      message.sender === username ? 'text-blue-200' : 'text-gray-500'
                    }`}>
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={500}
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim() || !isConnected}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              Send
            </button>
            <button
              onClick={leaveChat}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Leave
            </button>
          </div>
        </>
      )}
    </div>
  )
}
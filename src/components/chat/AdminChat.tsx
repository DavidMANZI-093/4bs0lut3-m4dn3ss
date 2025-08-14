'use client'

import { useState, useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

interface Message {
  id: string
  sender: string
  content: string
  createdAt: string
}

interface ChatUser {
  id: string
  username: string
  joinedAt: string
  isActive: boolean
}

export default function AdminChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [users, setUsers] = useState<ChatUser[]>([])
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [showUsers, setShowUsers] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Fetch initial messages and users
    fetchMessages()
    fetchUsers()

    // Connect to WebSocket
    const socketInstance = io('http://localhost:3001')
    setSocket(socketInstance)

    socketInstance.on('connect', () => {
      setIsConnected(true)
      console.log('Connected to chat admin')
    })

    socketInstance.on('disconnect', () => {
      setIsConnected(false)
      console.log('Disconnected from chat admin')
    })

    socketInstance.on('message:broadcast', (message: Message) => {
      setMessages(prev => [...prev, message])
    })

    socketInstance.on('user:joined', (user: ChatUser) => {
      setUsers(prev => [...prev, user])
    })

    socketInstance.on('user:left', (userId: string) => {
      setUsers(prev => prev.filter(u => u.id !== userId))
    })

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  const fetchMessages = async () => {
    try {
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

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/chat/users')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setUsers(data.data)
        }
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
  }

  const deleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return

    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (data.success) {
        setMessages(prev => prev.filter(m => m.id !== messageId))
        setSelectedMessage(null)
        // Emit to socket to remove from all clients
        if (socket) {
          socket.emit('message:delete', messageId)
        }
      }
    } catch (error) {
      console.error('Failed to delete message:', error)
    }
  }

  const moderateUser = async (username: string, action: 'warn' | 'mute' | 'ban') => {
    if (!confirm(`Are you sure you want to ${action} user ${username}?`)) return

    try {
      const response = await fetch('/api/chat/moderation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, action }),
      })
      const data = await response.json()
      if (data.success) {
        // Emit to socket to notify all clients
        if (socket) {
          socket.emit('user:moderated', { username, action })
        }
        await fetchUsers()
      }
    } catch (error) {
      console.error('Failed to moderate user:', error)
    }
  }

  const clearChat = async () => {
    if (!confirm('Are you sure you want to clear all chat messages? This cannot be undone.')) return

    try {
      const response = await fetch('/api/messages', {
        method: 'DELETE',
      })
      const data = await response.json()
      if (data.success) {
        setMessages([])
        // Emit to socket to clear for all clients
        if (socket) {
          socket.emit('chat:clear')
        }
      }
    } catch (error) {
      console.error('Failed to clear chat:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">💬 Chat Moderation Admin</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-600">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <button
            onClick={() => setShowUsers(!showUsers)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showUsers ? 'Hide Users' : 'Show Users'} ({users.length})
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{messages.length}</div>
          <div className="text-sm text-blue-700">Total Messages</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{users.filter(u => u.isActive).length}</div>
          <div className="text-sm text-green-700">Active Users</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {messages.filter(m => {
              const messageTime = new Date(m.createdAt)
              const hourAgo = new Date()
              hourAgo.setHours(hourAgo.getHours() - 1)
              return messageTime > hourAgo
            }).length}
          </div>
          <div className="text-sm text-yellow-700">Messages (Last Hour)</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Messages */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg card-shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Chat Messages</h3>
              <button
                onClick={clearChat}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
              >
                Clear All
              </button>
            </div>
            
            <div className="h-96 overflow-y-auto space-y-3 bg-gray-50 rounded-lg p-4">
              {!messages || messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No messages in chat.
                </div>
              ) : (
                (messages || []).map((message) => (
                  <div
                    key={message.id}
                    onClick={() => setSelectedMessage(message)}
                    className="bg-white border border-gray-200 rounded-lg p-3 cursor-pointer hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-semibold text-gray-900">{message.sender}</div>
                      <div className="text-xs text-gray-500">
                        {formatDate(message.createdAt)}
                      </div>
                    </div>
                    <div className="text-gray-700 break-words">{message.content}</div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* Users Panel */}
        <div className={`${showUsers ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white rounded-lg card-shadow border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Users</h3>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {users.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No active users.
                </div>
              ) : (
                users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{user.username}</div>
                      <div className="text-xs text-gray-500">
                        Joined: {formatDate(user.joinedAt)}
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => moderateUser(user.username, 'warn')}
                        className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs hover:bg-yellow-200 transition-colors"
                      >
                        Warn
                      </button>
                      <button
                        onClick={() => moderateUser(user.username, 'mute')}
                        className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs hover:bg-orange-200 transition-colors"
                      >
                        Mute
                      </button>
                      <button
                        onClick={() => moderateUser(user.username, 'ban')}
                        className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs hover:bg-red-200 transition-colors"
                      >
                        Ban
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Message Details Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Message Details</h3>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-sm font-medium text-gray-700">Sender:</div>
                <div className="text-gray-900">{selectedMessage.sender}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700">Message:</div>
                <div className="text-gray-900 break-words">{selectedMessage.content}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700">Sent:</div>
                <div className="text-gray-900">{formatDate(selectedMessage.createdAt)}</div>
              </div>
              <div className="flex space-x-3 pt-3">
                <button
                  onClick={() => deleteMessage(selectedMessage.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Message
                </button>
                <button
                  onClick={() => moderateUser(selectedMessage.sender, 'warn')}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Warn User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
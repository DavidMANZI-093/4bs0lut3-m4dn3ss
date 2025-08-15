'use client'

import { useState, useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { MessageCircle, X } from 'lucide-react'

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
        <h2 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
          <MessageCircle className="w-6 h-6" />
          Chat Moderation Admin
        </h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-[var(--success)]' : 'bg-[var(--error)]'}`}></div>
            <span className="text-sm text-[var(--text-secondary)]">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <button
            onClick={() => setShowUsers(!showUsers)}
            className="bg-[var(--primary)] text-white px-4 py-2 rounded-lg hover:bg-[var(--primary-hover)] transition-colors"
          >
            {showUsers ? 'Hide Users' : 'Show Users'} ({users.length})
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[var(--space-cadet-900)] border border-[var(--space-cadet-700)] rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-[var(--primary)]">{messages.length}</div>
          <div className="text-sm text-[var(--text-secondary)]">Total Messages</div>
        </div>
        <div className="bg-[var(--isabelline-700)] border border-[var(--pale-dogwood-300)] rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-[var(--success)]">{users.filter(u => u.isActive).length}</div>
          <div className="text-sm text-[var(--text-secondary)]">Active Users</div>
        </div>
        <div className="bg-[var(--pale-dogwood-900)] border border-[var(--pale-dogwood-600)] rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-[var(--warning)]">
            {messages.filter(m => {
              const messageTime = new Date(m.createdAt)
              const hourAgo = new Date()
              hourAgo.setHours(hourAgo.getHours() - 1)
              return messageTime > hourAgo
            }).length}
          </div>
          <div className="text-sm text-[var(--text-secondary)]">Messages (Last Hour)</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Messages */}
        <div className="lg:col-span-2">
          <div className="bg-[var(--surface)] rounded-lg card-shadow border border-[var(--border)] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">Chat Messages</h3>
              <button
                onClick={clearChat}
                className="bg-[var(--error)] text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
              >
                Clear All
              </button>
            </div>
            
            <div className="h-96 overflow-y-auto space-y-3 bg-[var(--background)] rounded-lg p-4">
              {!messages || messages.length === 0 ? (
                <div className="text-center text-[var(--text-muted)] py-8">
                  No messages in chat.
                </div>
              ) : (
                (messages || []).map((message) => (
                  <div
                    key={message.id}
                    onClick={() => setSelectedMessage(message)}
                    className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-3 cursor-pointer hover:border-[var(--primary)] transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-semibold text-[var(--text-primary)]">{message.sender}</div>
                      <div className="text-xs text-[var(--text-muted)]">
                        {formatDate(message.createdAt)}
                      </div>
                    </div>
                    <div className="text-[var(--text-secondary)] break-words">{message.content}</div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* Users Panel */}
        <div className={`${showUsers ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-[var(--surface)] rounded-lg card-shadow border border-[var(--border)] p-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Active Users</h3>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {users.length === 0 ? (
                <div className="text-center text-[var(--text-muted)] py-8">
                  No active users.
                </div>
              ) : (
                users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-[var(--background)] rounded-lg">
                    <div>
                      <div className="font-medium text-[var(--text-primary)]">{user.username}</div>
                      <div className="text-xs text-[var(--text-muted)]">
                        Joined: {formatDate(user.joinedAt)}
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => moderateUser(user.username, 'warn')}
                        className="bg-[var(--pale-dogwood-900)] text-[var(--warning)] px-2 py-1 rounded text-xs hover:bg-[var(--pale-dogwood-800)] transition-colors"
                      >
                        Warn
                      </button>
                      <button
                        onClick={() => moderateUser(user.username, 'mute')}
                        className="bg-[var(--rose-quartz-900)] text-[var(--warning)] px-2 py-1 rounded text-xs hover:bg-[var(--rose-quartz-800)] transition-colors"
                      >
                        Mute
                      </button>
                      <button
                        onClick={() => moderateUser(user.username, 'ban')}
                        className="bg-[var(--rose-quartz-900)] text-[var(--error)] px-2 py-1 rounded text-xs hover:bg-[var(--rose-quartz-800)] transition-colors"
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
                className="text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-sm font-medium text-[var(--text-secondary)]">Sender:</div>
                <div className="text-[var(--text-primary)]">{selectedMessage.sender}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-[var(--text-secondary)]">Message:</div>
                <div className="text-[var(--text-primary)] break-words">{selectedMessage.content}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-[var(--text-secondary)]">Sent:</div>
                <div className="text-[var(--text-primary)]">{formatDate(selectedMessage.createdAt)}</div>
              </div>
              <div className="flex space-x-3 pt-3">
                <button
                  onClick={() => deleteMessage(selectedMessage.id)}
                  className="bg-[var(--error)] text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Message
                </button>
                <button
                  onClick={() => moderateUser(selectedMessage.sender, 'warn')}
                  className="bg-[var(--warning)] text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
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
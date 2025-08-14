'use client';

import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import ProtectedRoute from '@/components/ProtectedRoute';
import UserProfile from '@/components/UserProfile';

interface Message {
  id: string;
  sender: string;
  content: string;
  createdAt: string;
  isDeleted?: boolean;
}

interface ChatUser {
  username: string;
  joinedAt: string;
  messageCount: number;
  isMuted?: boolean;
  isBanned?: boolean;
}

export default function AdminChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [activeTab, setActiveTab] = useState<'messages' | 'users'>('messages');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
    fetchChatUsers();
    
    // Connect to WebSocket for live monitoring
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      newSocket.emit('admin-join');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('message:broadcast', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('user-joined', (data: { username: string }) => {
      fetchChatUsers();
    });

    newSocket.on('user-left', (data: { username: string }) => {
      fetchChatUsers();
    });

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/messages');
      if (response.ok) {
        const result = await response.json();
        const messagesArray = result.data || [];
        setMessages(messagesArray);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const fetchChatUsers = async () => {
    try {
      const response = await fetch('/api/chat/users');
      if (response.ok) {
        const result = await response.json();
        const usersArray = result.data || [];
        setUsers(usersArray);
      }
    } catch (error) {
      console.error('Failed to fetch chat users:', error);
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId 
              ? { ...msg, isDeleted: true, content: '[Message deleted by moderator]' }
              : msg
          )
        );
        setSelectedMessage(null);
        
        // Notify via WebSocket
        socket?.emit('message-deleted', { messageId });
      }
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  const muteUser = async (username: string) => {
    if (!confirm(`Are you sure you want to mute ${username}?`)) return;

    try {
      const response = await fetch('/api/chat/moderation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'mute',
          username,
        }),
      });

      if (response.ok) {
        fetchChatUsers();
        setSelectedUser(null);
        
        // Notify via WebSocket
        socket?.emit('user-muted', { username });
      }
    } catch (error) {
      console.error('Failed to mute user:', error);
    }
  };

  const banUser = async (username: string) => {
    if (!confirm(`Are you sure you want to ban ${username}? This will remove them from the chat.`)) return;

    try {
      const response = await fetch('/api/chat/moderation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ban',
          username,
        }),
      });

      if (response.ok) {
        fetchChatUsers();
        setSelectedUser(null);
        
        // Notify via WebSocket
        socket?.emit('user-banned', { username });
      }
    } catch (error) {
      console.error('Failed to ban user:', error);
    }
  };

  const clearChat = async () => {
    if (!confirm('Are you sure you want to clear all chat messages? This cannot be undone.')) return;

    try {
      const response = await fetch('/api/messages', {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessages([]);
        
        // Notify via WebSocket
        socket?.emit('chat-cleared');
      }
    } catch (error) {
      console.error('Failed to clear chat:', error);
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
                  💬 Chat Moderation
                </h1>
                <div className="ml-4 flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  <span className="text-sm text-gray-600">
                    {isConnected ? 'Live Monitoring' : 'Disconnected'}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <a 
                  href="/chat" 
                  target="_blank"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  View Public Chat →
                </a>
                <UserProfile />
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-2xl font-bold text-gray-900">{messages.length}</div>
                <div className="text-sm text-gray-600">Total Messages</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-2xl font-bold text-gray-900">{users.length}</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.isMuted).length}
                </div>
                <div className="text-sm text-gray-600">Muted Users</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-2xl font-bold text-gray-900">
                  {messages.filter(m => m.isDeleted).length}
                </div>
                <div className="text-sm text-gray-600">Deleted Messages</div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Moderation Tools</h2>
                <button
                  onClick={clearChat}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  Clear All Messages
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-6">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('messages')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'messages'
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Messages ({messages.length})
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'users'
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Users ({users.length})
                </button>
              </nav>
            </div>

            {activeTab === 'messages' && (
              <div className="bg-white rounded-lg shadow-lg">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Chat Messages</h3>
                </div>
                <div className="p-4 overflow-y-auto" style={{ maxHeight: '600px' }}>
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-3 rounded-lg cursor-pointer hover:bg-gray-50 ${
                          message.isDeleted ? 'bg-red-50 border border-red-200' : 'bg-gray-50'
                        }`}
                        onClick={() => setSelectedMessage(message)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-semibold text-gray-900">
                            {message.sender}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(message.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <div className={`text-gray-700 ${message.isDeleted ? 'italic text-red-600' : ''}`}>
                          {message.content}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Chat Users</h3>
                </div>
                {users.length === 0 ? (
                  <div className="p-6 text-center">
                    <div className="text-4xl mb-4">👥</div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No Active Users</h4>
                    <p className="text-gray-600">Users will appear here when they join the chat</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <div
                        key={user.username}
                        className="p-6 hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedUser(user)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="text-lg font-medium text-gray-900">
                                {user.username}
                              </h4>
                              {user.isMuted && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  MUTED
                                </span>
                              )}
                              {user.isBanned && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  BANNED
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600">
                              {user.messageCount} messages • Joined: {new Date(user.joinedAt).toLocaleString()}
                            </div>
                          </div>
                          <div className="ml-4">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>

        {/* Message Details Modal */}
        {selectedMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Message Details
                  </h2>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mb-6">
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-gray-900">
                        {selectedMessage.sender}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(selectedMessage.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div className={`text-gray-700 ${selectedMessage.isDeleted ? 'italic text-red-600' : ''}`}>
                      {selectedMessage.content}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Message Information</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>ID: {selectedMessage.id}</div>
                      <div>Status: {selectedMessage.isDeleted ? 'Deleted' : 'Active'}</div>
                      <div>Length: {selectedMessage.content.length} characters</div>
                    </div>
                  </div>

                  {!selectedMessage.isDeleted && (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => deleteMessage(selectedMessage.id)}
                        className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                      >
                        Delete Message
                      </button>
                      <button
                        onClick={() => setSelectedMessage(null)}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Details Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    User Management
                  </h2>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mb-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {selectedUser.username}
                    </h3>
                    {selectedUser.isMuted && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        MUTED
                      </span>
                    )}
                    {selectedUser.isBanned && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                        BANNED
                      </span>
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">User Information</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Messages sent: {selectedUser.messageCount}</div>
                      <div>Joined: {new Date(selectedUser.joinedAt).toLocaleString()}</div>
                      <div>Status: {selectedUser.isBanned ? 'Banned' : selectedUser.isMuted ? 'Muted' : 'Active'}</div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    {!selectedUser.isMuted && !selectedUser.isBanned && (
                      <button
                        onClick={() => muteUser(selectedUser.username)}
                        className="px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
                      >
                        Mute User
                      </button>
                    )}
                    {!selectedUser.isBanned && (
                      <button
                        onClick={() => banUser(selectedUser.username)}
                        className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                      >
                        Ban User
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedUser(null)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
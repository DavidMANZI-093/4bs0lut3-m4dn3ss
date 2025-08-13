'use client';

import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface Message {
  id: string;
  sender: string;
  content: string;
  createdAt: string;
}

export default function PublicChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [hasJoined, setHasJoined] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    if (hasJoined && username) {
      // Connect to WebSocket for live chat
      const newSocket = io('http://localhost:3001');
      setSocket(newSocket);

      newSocket.on('connect', () => {
        setIsConnected(true);
        newSocket.emit('join-chat', { username });
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
      });

      newSocket.on('new-message', (message: Message) => {
        setMessages(prev => [...prev, message]);
      });

      newSocket.on('user-joined', (data: { username: string }) => {
        const systemMessage: Message = {
          id: `system-${Date.now()}`,
          sender: 'System',
          content: `${data.username} joined the chat`,
          createdAt: new Date().toISOString()
        };
        setMessages(prev => [...prev, systemMessage]);
      });

      newSocket.on('user-left', (data: { username: string }) => {
        const systemMessage: Message = {
          id: `system-${Date.now()}`,
          sender: 'System',
          content: `${data.username} left the chat`,
          createdAt: new Date().toISOString()
        };
        setMessages(prev => [...prev, systemMessage]);
      });

      return () => {
        newSocket.emit('leave-chat', { username });
        newSocket.close();
      };
    }
  }, [hasJoined, username]);

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

  const sendMessage = async () => {
    if (!newMessage.trim() || !username.trim()) return;

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: username,
          content: newMessage.trim(),
        }),
      });

      if (response.ok) {
        setNewMessage('');
        // Message will be added via WebSocket
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const joinChat = () => {
    if (username.trim()) {
      setHasJoined(true);
    }
  };

  if (!hasJoined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              💬 Live Chat
            </h1>
            <p className="text-gray-600">
              Join the conversation with other 4bs0lut3-m4dn3ss fans!
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose a username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && joinChat()}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter your username"
                maxLength={20}
              />
            </div>
            
            <button
              onClick={joinChat}
              disabled={!username.trim()}
              className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Join Chat
            </button>
          </div>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Please be respectful and follow community guidelines</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                💬 Live Chat
              </h1>
              <p className="text-sm text-gray-600">
                Welcome, {username}!
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span className="text-sm text-gray-600">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <button
                onClick={() => {
                  setHasJoined(false);
                  setUsername('');
                }}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Leave Chat
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-lg h-full flex flex-col">
          <div className="flex-1 p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === username ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === 'System'
                        ? 'bg-gray-100 text-gray-600 text-center text-sm'
                        : message.sender === username
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    {message.sender !== 'System' && message.sender !== username && (
                      <div className="text-xs font-semibold mb-1">
                        {message.sender}
                      </div>
                    )}
                    <div className="break-words">{message.content}</div>
                    <div className={`text-xs mt-1 ${
                      message.sender === username ? 'text-orange-200' : 'text-gray-500'
                    }`}>
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Type your message..."
                maxLength={500}
                disabled={!isConnected}
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim() || !isConnected}
                className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Send
              </button>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Press Enter to send • {newMessage.length}/500 characters
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
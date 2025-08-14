'use client';

import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface Message {
  id: string;
  sender: string;
  content: string;
  createdAt: string;
}

interface FlyingMessage extends Message {
  x: number;
  y: number;
  speed: number;
  color: string;
}

export default function LiveStreamChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [flyingMessages, setFlyingMessages] = useState<FlyingMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [hasJoined, setHasJoined] = useState(false);
  const [showFlyingMessages, setShowFlyingMessages] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const flyingContainerRef = useRef<HTMLDivElement>(null);

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
        newSocket.emit('user:join', username);
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
      });

      newSocket.on('message:broadcast', (message: Message) => {
        setMessages(prev => [...prev, message]);
        addFlyingMessage(message);
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
        newSocket.emit('user:leave', username);
        newSocket.close();
      };
    }
  }, [hasJoined, username]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Flying messages animation
  useEffect(() => {
    const interval = setInterval(() => {
      setFlyingMessages(prev => 
        prev.map(msg => ({
          ...msg,
          x: msg.x - msg.speed
        })).filter(msg => msg.x > -300) // Remove messages that have flown off screen
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Add new flying message when a message is received
  const addFlyingMessage = (message: Message) => {
    if (!showFlyingMessages) return;
    
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', 
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ];
    
    const flyingMsg: FlyingMessage = {
      ...message,
      x: window.innerWidth,
      y: Math.random() * 300 + 100, // Random Y position
      speed: Math.random() * 3 + 2, // Random speed between 2-5
      color: colors[Math.floor(Math.random() * colors.length)]
    };
    
    setFlyingMessages(prev => [...prev, flyingMsg]);
    
    // Remove after 10 seconds
    setTimeout(() => {
      setFlyingMessages(prev => prev.filter(m => m.id !== flyingMsg.id));
    }, 10000);
  };

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
    if (!newMessage.trim() || !username.trim() || !socket) return;

    try {
      // Send message via socket for real-time delivery
      socket.emit('message:send', {
        sender: username,
        content: newMessage.trim(),
      });

      setNewMessage('');
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="bg-black/80 backdrop-blur-sm rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 border border-orange-500/30">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              🔴 LIVE STREAM
            </h1>
            <p className="text-orange-300">
              Join the live game chat with other 4bs0lut3-m4dn3ss fans!
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-orange-300 mb-2">
                Choose your fan name
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && joinChat()}
                className="w-full px-3 py-2 bg-gray-800 border border-orange-500/50 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400"
                placeholder="Enter your fan name"
                maxLength={20}
              />
            </div>
            
            <button
              onClick={joinChat}
              disabled={!username.trim()}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 px-4 rounded-md hover:from-orange-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold"
            >
              🚀 JOIN LIVE STREAM
            </button>
          </div>
          
          <div className="mt-6 text-center text-sm text-gray-400">
            <p>🏀 Be respectful and cheer for the team!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Flying Messages Overlay */}
      <div 
        ref={flyingContainerRef}
        className="fixed inset-0 pointer-events-none z-20"
        style={{ zIndex: 20 }}
      >
        {flyingMessages.map((msg) => (
          <div
            key={msg.id}
            className="absolute whitespace-nowrap text-lg font-bold animate-pulse"
            style={{
              left: `${msg.x}px`,
              top: `${msg.y}px`,
              color: msg.color,
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
              transform: 'translateY(-50%)',
            }}
          >
            <span className="bg-black/60 px-2 py-1 rounded-full">
              {msg.sender}: {msg.content}
            </span>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex h-screen">
        {/* Video Stream Section */}
        <div className="flex-1 relative">
          {/* Live Stream Header */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-white font-bold">LIVE</span>
                </div>
                <h1 className="text-xl font-bold text-white">
                  🏀 4bs0lut3-m4dn3ss vs Lakers
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowFlyingMessages(!showFlyingMessages)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    showFlyingMessages 
                      ? 'bg-orange-600 text-white' 
                      : 'bg-gray-600 text-gray-300'
                  }`}
                >
                  {showFlyingMessages ? '💬 Flying ON' : '💬 Flying OFF'}
                </button>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  <span className="text-white text-sm">
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* YouTube Video Player */}
          <div className="w-full h-full bg-gradient-to-br from-orange-900 via-red-900 to-black flex items-center justify-center">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/LPDnemFoqVk?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1"
              title="4bs0lut3-m4dn3ss Live Game Stream"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
            
            {/* Live indicator overlay */}
            <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
              LIVE
            </div>
            
            {/* Game info overlay */}
            <div className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg">
              <div className="text-sm font-semibold">🏀 4bs0lut3-m4dn3ss vs Lakers</div>
              <div className="text-xs text-orange-300">Championship Game • Q4 02:45</div>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-4">
                <span className="text-sm">👥 {messages.length} fans watching</span>
                <span className="text-sm">💬 {messages.length} messages</span>
              </div>
              <button
                onClick={() => {
                  setHasJoined(false);
                  setUsername('');
                }}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Leave Stream
              </button>
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        <div className="w-80 bg-gray-900 border-l border-gray-700 flex flex-col">
          {/* Chat Header */}
          <div className="bg-gray-800 p-4 border-b border-gray-700">
            <h3 className="text-white font-bold">Live Chat</h3>
            <p className="text-gray-400 text-sm">Welcome, {username}!</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: 'calc(100vh - 140px)' }}>
            {messages.map((message) => (
              <div key={message.id} className="text-sm">
                {message.sender === 'System' ? (
                  <div className="text-center text-gray-500 italic">
                    {message.content}
                  </div>
                ) : (
                  <div className={`${message.sender === username ? 'text-orange-400' : 'text-white'}`}>
                    <span className="font-semibold">{message.sender}:</span>
                    <span className="ml-2">{message.content}</span>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400"
                placeholder="Chat with fans..."
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
              {newMessage.length}/500 • Press Enter to send
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
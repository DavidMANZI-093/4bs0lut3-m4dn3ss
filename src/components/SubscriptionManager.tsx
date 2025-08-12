'use client'

import { useState, useEffect } from 'react'

interface Subscriber {
  id: string
  name: string
  email: string
  createdAt: string
}

export default function SubscriptionManager() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [newSubscriber, setNewSubscriber] = useState({
    name: '',
    email: ''
  })

  useEffect(() => {
    fetchSubscribers()
  }, [])

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [message])

  const fetchSubscribers = async () => {
    try {
      const response = await fetch('/api/subscribers')
      const data = await response.json()
      if (data.success) {
        setSubscribers(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch subscribers:', error)
    }
  }

  const subscribe = async () => {
    if (!newSubscriber.name.trim() || !newSubscriber.email.trim()) {
      setMessage({ type: 'error', text: 'Please fill in all fields' })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSubscriber),
      })
      const data = await response.json()
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Successfully subscribed!' })
        setNewSubscriber({ name: '', email: '' })
        await fetchSubscribers()
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to subscribe' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to subscribe' })
      console.error('Failed to subscribe:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      subscribe()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">⭐ Fan Membership</h2>
        <p className="text-gray-600">Join premium fan membership for exclusive benefits and perks</p>
      </div>

      {/* Subscription Form */}
      <div className="bg-white rounded-lg card-shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Join Premium Fan Membership</h3>
        
        {/* Message */}
        {message && (
          <div className={`mb-4 p-3 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-100 border border-green-300 text-green-700'
              : 'bg-red-100 border border-red-300 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={newSubscriber.name}
              onChange={(e) => setNewSubscriber({ ...newSubscriber, name: e.target.value })}
              onKeyPress={handleKeyPress}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your name"
              maxLength={100}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={newSubscriber.email}
              onChange={(e) => setNewSubscriber({ ...newSubscriber, email: e.target.value })}
              onKeyPress={handleKeyPress}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                newSubscriber.email && !validateEmail(newSubscriber.email)
                  ? 'border-red-300'
                  : 'border-gray-300'
              }`}
              placeholder="Enter your email"
            />
            {newSubscriber.email && !validateEmail(newSubscriber.email) && (
              <p className="text-red-600 text-sm mt-1">Please enter a valid email address</p>
            )}
          </div>
        </div>
        
        <div className="mt-4">
          <button
            onClick={subscribe}
            disabled={isLoading || !newSubscriber.name.trim() || !validateEmail(newSubscriber.email)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </div>
      </div>

      {/* Subscribers List */}
      <div className="bg-white rounded-lg card-shadow border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Subscribers</h3>
          <div className="text-sm text-gray-600">
            Total: {subscribers.length}
          </div>
        </div>

        {subscribers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No subscribers yet. Be the first to subscribe!
          </div>
        ) : (
          <div className="space-y-3">
            {subscribers.map((subscriber) => (
              <div
                key={subscriber.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      {subscriber.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{subscriber.name}</div>
                    <div className="text-sm text-gray-600">{subscriber.email}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Joined {formatDate(subscriber.createdAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{subscribers.length}</div>
          <div className="text-sm text-blue-700">Total Subscribers</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {subscribers.filter(s => {
              const joinDate = new Date(s.createdAt)
              const weekAgo = new Date()
              weekAgo.setDate(weekAgo.getDate() - 7)
              return joinDate > weekAgo
            }).length}
          </div>
          <div className="text-sm text-green-700">This Week</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {new Set(subscribers.map(s => s.email.split('@')[1])).size}
          </div>
          <div className="text-sm text-purple-700">Unique Domains</div>
        </div>
      </div>
    </div>
  )
}
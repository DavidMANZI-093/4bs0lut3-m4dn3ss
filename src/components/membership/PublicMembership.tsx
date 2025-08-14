'use client'

import { useState, useEffect } from 'react'

interface MembershipTier {
  id: string
  name: string
  price: number
  duration: number
  benefits: string[]
  isActive: boolean
}

interface Member {
  id: string
  email: string
  tierName: string
  purchaseDate: string
  expiryDate: string
  paymentStatus: string
}

export default function PublicMembership() {
  const [tiers, setTiers] = useState<MembershipTier[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [selectedTier, setSelectedTier] = useState<MembershipTier | null>(null)
  const [membershipForm, setMembershipForm] = useState({
    name: '',
    email: '',
    tierId: ''
  })

  useEffect(() => {
    fetchTiers()
  }, [])

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [message])

  const fetchTiers = async () => {
    try {
      const response = await fetch('/api/membership/tiers')
      const data = await response.json()
      if (data.success) {
        setTiers(data.data.filter((tier: MembershipTier) => tier.isActive))
      }
    } catch (error) {
      console.error('Failed to fetch membership tiers:', error)
    }
  }

  const purchaseMembership = async () => {
    if (!membershipForm.name.trim() || !membershipForm.email.trim() || !membershipForm.tierId) {
      setMessage({ type: 'error', text: 'Please fill in all fields' })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/membership/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(membershipForm),
      })
      const data = await response.json()
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Membership purchased successfully!' })
        setMembershipForm({ name: '', email: '', tierId: '' })
        setSelectedTier(null)
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to purchase membership' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to purchase membership' })
      console.error('Failed to purchase membership:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const getTierColor = (tierName: string) => {
    switch (tierName.toLowerCase()) {
      case 'bronze':
        return 'bg-orange-100 border-orange-300 text-orange-800'
      case 'silver':
        return 'bg-gray-100 border-gray-300 text-gray-800'
      case 'gold':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800'
      default:
        return 'bg-blue-100 border-blue-300 text-blue-800'
    }
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">⭐ Fan Membership</h2>
        <p className="text-gray-600">Join premium fan membership for exclusive benefits and perks</p>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-3 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-100 border border-green-300 text-green-700'
            : 'bg-red-100 border border-red-300 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Membership Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className={`bg-white rounded-lg card-shadow border-2 p-6 cursor-pointer transition-all hover:shadow-lg ${
              selectedTier?.id === tier.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
            }`}
            onClick={() => {
              setSelectedTier(tier)
              setMembershipForm({ ...membershipForm, tierId: tier.id })
            }}
          >
            <div className="text-center">
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 ${getTierColor(tier.name)}`}>
                {tier.name}
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {formatPrice(tier.price)}
              </div>
              <div className="text-sm text-gray-600 mb-4">
                per {tier.duration} month{tier.duration > 1 ? 's' : ''}
              </div>
              <div className="space-y-2 text-left">
                {tier.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    {benefit}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Purchase Form */}
      {selectedTier && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            Purchase {selectedTier.name} Membership
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={membershipForm.name}
                onChange={(e) => setMembershipForm({ ...membershipForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your full name"
                maxLength={100}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={membershipForm.email}
                onChange={(e) => setMembershipForm({ ...membershipForm, email: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  membershipForm.email && !validateEmail(membershipForm.email)
                    ? 'border-red-300'
                    : 'border-gray-300'
                }`}
                placeholder="Enter your email address"
              />
              {membershipForm.email && !validateEmail(membershipForm.email) && (
                <p className="text-red-600 text-sm mt-1">Please enter a valid email address</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-blue-900">
              Total: {formatPrice(selectedTier.price)}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setSelectedTier(null)
                  setMembershipForm({ name: '', email: '', tierId: '' })
                }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={purchaseMembership}
                disabled={isLoading || !membershipForm.name.trim() || !validateEmail(membershipForm.email)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Processing...' : 'Purchase Membership'}
              </button>
            </div>
          </div>
        </div>
      )}

      {tiers.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No membership tiers available at the moment.
        </div>
      )}
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { Star, Check } from 'lucide-react'

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
        return 'bg-[var(--pale-dogwood-900)] border-[var(--pale-dogwood-600)] text-[var(--warning)]'
      case 'silver':
        return 'bg-[var(--pale-dogwood-900)] border-[var(--pale-dogwood-300)] text-[var(--text-secondary)]'
      case 'gold':
        return 'bg-[var(--pale-dogwood-900)] border-[var(--pale-dogwood-600)] text-[var(--warning)]'
      default:
        return 'bg-[var(--space-cadet-900)] border-[var(--space-cadet-700)] text-[var(--primary)]'
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
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2">
          <Star className="w-6 h-6" />
          Fan Membership
        </h2>
        <p className="text-[var(--text-secondary)]">Join premium fan membership for exclusive benefits and perks</p>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-3 rounded-lg ${
          message.type === 'success' 
            ? 'bg-[var(--isabelline-700)] border border-[var(--pale-dogwood-300)] text-[var(--success)]'
            : 'bg-[var(--rose-quartz-900)] border border-[var(--rose-quartz-700)] text-[var(--error)]'
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
              selectedTier?.id === tier.id ? 'border-[var(--primary)] ring-2 ring-[var(--space-cadet-800)]' : 'border-[var(--border)]'
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
              <div className="text-3xl font-bold text-[var(--text-primary)] mb-2">
                {formatPrice(tier.price)}
              </div>
              <div className="text-sm text-[var(--text-secondary)] mb-4">
                per {tier.duration} month{tier.duration > 1 ? 's' : ''}
              </div>
              <div className="space-y-2 text-left">
                {tier.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center text-sm text-[var(--text-secondary)]">
                    <Check className="w-4 h-4 text-[var(--success)] mr-2" />
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
        <div className="bg-[var(--space-cadet-900)] border-2 border-[var(--space-cadet-700)] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[var(--primary)] mb-4">
            Purchase {selectedTier.name} Membership
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Full Name</label>
              <input
                type="text"
                value={membershipForm.name}
                onChange={(e) => setMembershipForm({ ...membershipForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                placeholder="Enter your full name"
                maxLength={100}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Email Address</label>
              <input
                type="email"
                value={membershipForm.email}
                onChange={(e) => setMembershipForm({ ...membershipForm, email: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent ${
                  membershipForm.email && !validateEmail(membershipForm.email)
                    ? 'border-[var(--error)]'
                    : 'border-[var(--border)]'
                }`}
                placeholder="Enter your email address"
              />
              {membershipForm.email && !validateEmail(membershipForm.email) && (
                <p className="text-[var(--error)] text-sm mt-1">Please enter a valid email address</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-[var(--primary)]">
              Total: {formatPrice(selectedTier.price)}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setSelectedTier(null)
                  setMembershipForm({ name: '', email: '', tierId: '' })
                }}
                className="bg-[var(--pale-dogwood-300)] text-[var(--text-secondary)] px-4 py-2 rounded-lg hover:bg-[var(--pale-dogwood-400)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={purchaseMembership}
                disabled={isLoading || !membershipForm.name.trim() || !validateEmail(membershipForm.email)}
                className="bg-[var(--primary)] text-white px-6 py-2 rounded-lg hover:bg-[var(--primary-hover)] disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Processing...' : 'Purchase Membership'}
              </button>
            </div>
          </div>
        </div>
      )}

      {tiers.length === 0 && (
        <div className="text-center py-8 text-[var(--text-muted)]">
          No membership tiers available at the moment.
        </div>
      )}
    </div>
  )
}
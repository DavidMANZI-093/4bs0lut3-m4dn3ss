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

export default function AdminMembership() {
  const [tiers, setTiers] = useState<MembershipTier[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showCreateTierForm, setShowCreateTierForm] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'EXPIRED'>('ALL')

  // Form state for creating tiers
  const [newTier, setNewTier] = useState({
    name: '',
    price: 0,
    duration: 1,
    benefits: [''],
    isActive: true
  })

  useEffect(() => {
    fetchTiers()
    fetchMembers()
  }, [])

  const fetchTiers = async () => {
    try {
      const response = await fetch('/api/membership/tiers')
      const data = await response.json()
      if (data.success) {
        setTiers(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch membership tiers:', error)
    }
  }

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/membership/members')
      const data = await response.json()
      if (data.success) {
        setMembers(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch members:', error)
    }
  }

  const createTier = async () => {
    if (!newTier.name.trim() || newTier.price <= 0 || newTier.duration <= 0) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/membership/tiers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newTier,
          benefits: newTier.benefits.filter(b => b.trim())
        }),
      })
      const data = await response.json()
      if (data.success) {
        await fetchTiers()
        setNewTier({ name: '', price: 0, duration: 1, benefits: [''], isActive: true })
        setShowCreateTierForm(false)
      }
    } catch (error) {
      console.error('Failed to create tier:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleTierStatus = async (tierId: string, isActive: boolean) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/membership/tiers/${tierId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive }),
      })
      const data = await response.json()
      if (data.success) {
        await fetchTiers()
      }
    } catch (error) {
      console.error('Failed to update tier:', error)
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'expired':
        return 'bg-red-100 text-red-800'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const addBenefit = () => {
    setNewTier({ ...newTier, benefits: [...newTier.benefits, ''] })
  }

  const updateBenefit = (index: number, value: string) => {
    const updatedBenefits = [...newTier.benefits]
    updatedBenefits[index] = value
    setNewTier({ ...newTier, benefits: updatedBenefits })
  }

  const removeBenefit = (index: number) => {
    const updatedBenefits = newTier.benefits.filter((_, i) => i !== index)
    setNewTier({ ...newTier, benefits: updatedBenefits })
  }

  const filteredMembers = members.filter(member => {
    if (filter === 'ALL') return true
    const isExpired = new Date(member.expiryDate) < new Date()
    if (filter === 'ACTIVE') return !isExpired && member.paymentStatus === 'active'
    if (filter === 'EXPIRED') return isExpired || member.paymentStatus !== 'active'
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">⭐ Membership Management Admin</h2>
        <button
          onClick={() => setShowCreateTierForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Create Tier
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{tiers.length}</div>
          <div className="text-sm text-blue-700">Total Tiers</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{members.length}</div>
          <div className="text-sm text-green-700">Total Members</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {members.filter(m => new Date(m.expiryDate) > new Date() && m.paymentStatus === 'active').length}
          </div>
          <div className="text-sm text-yellow-700">Active Members</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {formatPrice(members.reduce((sum, m) => {
              const tier = tiers.find(t => t.name === m.tierName)
              return sum + (tier?.price || 0)
            }, 0))}
          </div>
          <div className="text-sm text-purple-700">Total Revenue</div>
        </div>
      </div>

      {/* Create Tier Modal */}
      {showCreateTierForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Create Membership Tier</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tier Name</label>
                <input
                  type="text"
                  value={newTier.name}
                  onChange={(e) => setNewTier({ ...newTier, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Bronze, Silver, Gold"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newTier.price}
                    onChange={(e) => setNewTier({ ...newTier, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (months)</label>
                  <input
                    type="number"
                    min="1"
                    value={newTier.duration}
                    onChange={(e) => setNewTier({ ...newTier, duration: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="1"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Benefits</label>
                {newTier.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={benefit}
                      onChange={(e) => updateBenefit(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter benefit"
                    />
                    {newTier.benefits.length > 1 && (
                      <button
                        onClick={() => removeBenefit(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addBenefit}
                  className="text-green-600 hover:text-green-800 text-sm"
                >
                  + Add Benefit
                </button>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={newTier.isActive}
                  onChange={(e) => setNewTier({ ...newTier, isActive: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">Active (visible to users)</label>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={createTier}
                  disabled={isLoading || !newTier.name.trim() || newTier.price <= 0}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  Create Tier
                </button>
                <button
                  onClick={() => setShowCreateTierForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Membership Tiers */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Membership Tiers</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tiers.map((tier) => (
            <div key={tier.id} className="bg-white rounded-lg card-shadow border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getTierColor(tier.name)}`}>
                  {tier.name}
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${tier.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {tier.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    onClick={() => toggleTierStatus(tier.id, !tier.isActive)}
                    disabled={isLoading}
                    className={`px-2 py-1 rounded text-xs transition-colors ${
                      tier.isActive 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    } disabled:opacity-50`}
                  >
                    {tier.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
              <div className="text-xl font-bold text-gray-900 mb-1">
                {formatPrice(tier.price)}
              </div>
              <div className="text-sm text-gray-600 mb-3">
                per {tier.duration} month{tier.duration > 1 ? 's' : ''}
              </div>
              <div className="space-y-1">
                {tier.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center text-xs text-gray-700">
                    <span className="text-green-500 mr-1">✓</span>
                    {benefit}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Members */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Members</h3>
          <div className="flex space-x-2">
            {(['ALL', 'ACTIVE', 'EXPIRED'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredMembers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No members found for the selected filter.
            </div>
          ) : (
            filteredMembers.map((member) => (
              <div key={member.id} className="bg-white p-4 rounded-lg card-shadow border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="font-medium text-gray-900">{member.email}</div>
                      <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getTierColor(member.tierName)}`}>
                        {member.tierName}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.paymentStatus)}`}>
                        {member.paymentStatus}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Purchased: {formatDate(member.purchaseDate)} • Expires: {formatDate(member.expiryDate)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
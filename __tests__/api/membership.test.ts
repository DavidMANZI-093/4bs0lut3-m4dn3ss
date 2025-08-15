import { describe, it, expect } from '@jest/globals'

describe('Membership API', () => {
  const baseUrl = 'http://localhost:3000'

  it('should get all membership tiers', async () => {
    const response = await fetch(`${baseUrl}/api/membership/tiers`)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(Array.isArray(data.data)).toBe(true)
    expect(data.data.length).toBeGreaterThan(0)
    
    // Check tier structure
    const tier = data.data[0]
    expect(tier.name).toBeDefined()
    expect(tier.price).toBeDefined()
    expect(tier.duration).toBeDefined()
    expect(tier.description).toBeDefined()
    expect(Array.isArray(tier.benefits)).toBe(true)
    expect(typeof tier.isActive).toBe('boolean')
  })

  it('should get a specific membership tier', async () => {
    // First get all tiers to get an ID
    const tiersResponse = await fetch(`${baseUrl}/api/membership/tiers`)
    const tiersData = await tiersResponse.json()
    const tierId = tiersData.data[0].id

    const response = await fetch(`${baseUrl}/api/membership/tiers/${tierId}`)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.id).toBe(tierId)
    expect(data.data.name).toBeDefined()
    expect(data.data.price).toBeDefined()
  })

  it('should get all members', async () => {
    const response = await fetch(`${baseUrl}/api/membership/members`)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(Array.isArray(data.data)).toBe(true)
    
    if (data.data.length > 0) {
      const member = data.data[0]
      expect(member.email).toBeDefined()
      expect(member.tierName).toBeDefined()
      expect(member.status).toBeDefined()
      expect(member.paymentStatus).toBeDefined()
      expect(Array.isArray(member.benefits)).toBe(true)
    }
  })

  it('should handle membership purchase', async () => {
    // First get a tier to purchase
    const tiersResponse = await fetch(`${baseUrl}/api/membership/tiers`)
    const tiersData = await tiersResponse.json()
    const tier = tiersData.data[0]

    const purchaseData = {
      tierId: tier.id,
      email: 'newmember@example.com'
    }

    const response = await fetch(`${baseUrl}/api/membership/purchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(purchaseData),
    })
    
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.message).toBe('Membership purchase completed successfully')
    expect(data.data.tierId).toBe(purchaseData.tierId)
    expect(data.data.tierName).toBe(tier.name)
    expect(data.data.price).toBe(tier.price)
    expect(data.data.paymentUrl).toBeDefined()
  })

  it('should validate required fields for membership purchase', async () => {
    const response = await fetch(`${baseUrl}/api/membership/purchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })
    
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Tier ID is required')
  })
})
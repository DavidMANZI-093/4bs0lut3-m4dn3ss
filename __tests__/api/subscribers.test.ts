import { describe, it, expect } from '@jest/globals'

describe('Subscribers API', () => {
  const baseUrl = 'http://localhost:3000'

  it('should get all subscribers', async () => {
    const response = await fetch(`${baseUrl}/api/subscribers`)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(Array.isArray(data.data)).toBe(true)
    
    if (data.data.length > 0) {
      const subscriber = data.data[0]
      expect(subscriber.name).toBeDefined()
      expect(subscriber.email).toBeDefined()
      expect(subscriber.createdAt).toBeDefined()
    }
  })

  it('should create a new subscription', async () => {
    const subscriptionData = {
      name: 'Test Subscriber',
      email: `testsubscriber${Date.now()}@example.com` // Use unique email
    }

    const response = await fetch(`${baseUrl}/api/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscriptionData),
    })
    
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.name).toBe(subscriptionData.name)
    expect(data.data.email).toBe(subscriptionData.email)
    expect(data.data.createdAt).toBeDefined()
  })

  it('should validate subscription data', async () => {
    const response = await fetch(`${baseUrl}/api/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })
    
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error).toContain('Validation error')
  })

  it('should handle duplicate email subscription', async () => {
    // First create a subscription
    const subscriptionData = {
      name: 'First Subscriber',
      email: `duplicate${Date.now()}@example.com`
    }

    await fetch(`${baseUrl}/api/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscriptionData),
    })

    // Try to create the same subscription again
    const response = await fetch(`${baseUrl}/api/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscriptionData),
    })
    
    const data = await response.json()
    
    expect(response.status).toBe(409)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Email already subscribed')
  })
})
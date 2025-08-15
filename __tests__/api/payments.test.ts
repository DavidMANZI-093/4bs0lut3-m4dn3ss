import { describe, it, expect, beforeAll } from '@jest/globals'

describe('Payment System API', () => {
  const baseUrl = 'http://localhost:3000'
  let authCookie: string

  beforeAll(async () => {
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@4bs0lut3-m4dn3ss.com',
        password: 'admin123'
      }),
    })
    authCookie = loginResponse.headers.get('set-cookie') || ''
  }, 15000)

  describe('Payment Processing', () => {
    it('should handle membership payment flow', async () => {
      // Get a membership tier
      const tiersResponse = await fetch(`${baseUrl}/api/membership/tiers`)
      const tiersData = await tiersResponse.json()
      const tier = tiersData.data[0]

      // Initiate purchase
      const purchaseResponse = await fetch(`${baseUrl}/api/membership/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': authCookie,
        },
        body: JSON.stringify({
          tierId: tier.id,
          email: 'testpayment@example.com'
        }),
      })

      const purchaseData = await purchaseResponse.json()
      
      expect(purchaseResponse.status).toBe(200)
      expect(purchaseData.success).toBe(true)
      expect(purchaseData.data.paymentUrl).toBeDefined()
      expect(purchaseData.data.price).toBe(tier.price)
    })

    it('should validate payment data integrity', async () => {
      const response = await fetch(`${baseUrl}/api/membership/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': authCookie,
        },
        body: JSON.stringify({
          tierId: 'invalid-id',
          email: 'invalid-email'
        }),
      })

      expect([400, 404]).toContain(response.status)
    })
  })

  describe('Cart Payment Integration', () => {
    it('should calculate cart totals correctly', async () => {
      const cartResponse = await fetch(`${baseUrl}/api/cart`)
      const cartData = await cartResponse.json()
      
      expect(cartResponse.status).toBe(200)
      expect(cartData.success).toBe(true)
      
      if (cartData.data.items.length > 0) {
        let calculatedTotal = 0
        cartData.data.items.forEach((item: any) => {
          calculatedTotal += item.product.price * item.quantity
        })
        
        expect(Math.abs(cartData.data.total - calculatedTotal)).toBeLessThan(0.01)
      }
    })

    it('should handle inventory validation during checkout', async () => {
      // Get products to test inventory
      const productsResponse = await fetch(`${baseUrl}/api/products`)
      const productsData = await productsResponse.json()
      
      expect(productsResponse.status).toBe(200)
      expect(productsData.data.length).toBeGreaterThan(0)
      
      const product = productsData.data[0]
      expect(typeof product.inventory).toBe('number')
      expect(product.inventory).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Payment Security', () => {
    it('should not expose sensitive payment data', async () => {
      const cartResponse = await fetch(`${baseUrl}/api/cart`)
      const cartData = await cartResponse.json()
      
      // Verify no sensitive payment info is exposed
      expect(cartData.cardNumber).toBeUndefined()
      expect(cartData.cvv).toBeUndefined()
      expect(cartData.paymentMethod).toBeUndefined()
    })

    it('should validate payment amounts', async () => {
      const tiersResponse = await fetch(`${baseUrl}/api/membership/tiers`)
      const tiersData = await tiersResponse.json()
      
      tiersData.data.forEach((tier: any) => {
        expect(tier.price).toBeGreaterThan(0)
        expect(typeof tier.price).toBe('number')
      })
    })
  })
})
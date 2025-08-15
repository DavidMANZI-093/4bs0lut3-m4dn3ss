import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'

describe('System Integration Tests', () => {
  const baseUrl = 'http://localhost:3000'
  let adminCookie: string
  let devCookie: string

  beforeAll(async () => {
    // Setup authentication for both roles
    const adminLogin = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@4bs0lut3-m4dn3ss.com',
        password: 'admin123'
      }),
    })
    adminCookie = adminLogin.headers.get('set-cookie') || ''

    const devLogin = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'dev@4bs0lut3-m4dn3ss.com',
        password: 'dev123'
      }),
    })
    devCookie = devLogin.headers.get('set-cookie') || ''
  }, 15000)

  describe('Complete User Journey - Membership Purchase', () => {
    it('should complete full membership purchase flow', async () => {
      // 1. Get available membership tiers
      const tiersResponse = await fetch(`${baseUrl}/api/membership/tiers`)
      const tiersData = await tiersResponse.json()
      
      expect(tiersResponse.status).toBe(200)
      expect(tiersData.data.length).toBeGreaterThan(0)
      
      const tier = tiersData.data[0]
      
      // 2. Initiate purchase
      const purchaseResponse = await fetch(`${baseUrl}/api/membership/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': adminCookie,
        },
        body: JSON.stringify({
          tierId: tier.id,
          email: 'integration-test@example.com'
        }),
      })
      
      const purchaseData = await purchaseResponse.json()
      expect(purchaseResponse.status).toBe(200)
      expect(purchaseData.success).toBe(true)
      
      // 3. Verify member was created
      const membersResponse = await fetch(`${baseUrl}/api/membership/members`, {
        headers: { 'Cookie': adminCookie },
      })
      
      const membersData = await membersResponse.json()
      expect(membersResponse.status).toBe(200)
      
      const newMember = membersData.data.find((m: any) => 
        m.email === 'integration-test@example.com'
      )
      expect(newMember).toBeDefined()
      expect(newMember.tierName).toBe(tier.name)
    }, 15000)
  })

  describe('Complete Admin Journey - Content Management', () => {
    it('should complete full content management flow', async () => {
      // 1. Create a product
      const productData = {
        name: 'Integration Test Jersey',
        price: 49.99,
        description: 'Test product for integration',
        imageUrl: 'https://example.com/jersey.jpg',
        inventory: 100
      }
      
      const createResponse = await fetch(`${baseUrl}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': adminCookie,
        },
        body: JSON.stringify(productData),
      })
      
      const createData = await createResponse.json()
      expect(createResponse.status).toBe(200)
      expect(createData.success).toBe(true)
      
      const productId = createData.data.id
      
      // 2. Update the product
      const updateResponse = await fetch(`${baseUrl}/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': adminCookie,
        },
        body: JSON.stringify({
          ...productData,
          price: 59.99
        }),
      })
      
      expect(updateResponse.status).toBe(200)
      
      // 3. Verify product appears in public listing
      const publicResponse = await fetch(`${baseUrl}/api/products`)
      const publicData = await publicResponse.json()
      
      const product = publicData.data.find((p: any) => p.id === productId)
      expect(product).toBeDefined()
      expect(product.price).toBe(59.99)
      
      // 4. Add to cart
      const cartResponse = await fetch(`${baseUrl}/api/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: productId,
          quantity: 2
        }),
      })
      
      expect(cartResponse.status).toBe(200)
      
      // 5. Verify cart contents
      const cartCheckResponse = await fetch(`${baseUrl}/api/cart`)
      const cartData = await cartCheckResponse.json()
      
      const cartItem = cartData.data.items.find((item: any) => 
        item.product.id === productId
      )
      expect(cartItem).toBeDefined()
      expect(cartItem.quantity).toBe(2)
      
      // 6. Clean up - delete product
      await fetch(`${baseUrl}/api/products/${productId}`, {
        method: 'DELETE',
        headers: { 'Cookie': adminCookie },
      })
    }, 15000)
  })

  describe('Live Stream Management Flow', () => {
    it('should complete live stream management cycle', async () => {
      // 1. Create live stream
      const streamData = {
        youtubeUrl: 'https://youtu.be/integrationTest',
        title: 'Integration Test Stream',
        description: 'Test stream for integration testing',
        isActive: true
      }
      
      const createResponse = await fetch(`${baseUrl}/api/livestream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': adminCookie,
        },
        body: JSON.stringify(streamData),
      })
      
      const createData = await createResponse.json()
      expect(createResponse.status).toBe(200)
      expect(createData.success).toBe(true)
      
      // 2. Verify public can see active stream
      const publicResponse = await fetch(`${baseUrl}/api/livestream`)
      const publicData = await publicResponse.json()
      
      expect(publicResponse.status).toBe(200)
      expect(publicData.stream).toBeDefined()
      expect(publicData.stream.title).toBe(streamData.title)
      expect(publicData.stream.isActive).toBe(true)
      
      // 3. Deactivate stream
      const deactivateResponse = await fetch(`${baseUrl}/api/livestream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': adminCookie,
        },
        body: JSON.stringify({
          ...streamData,
          isActive: false
        }),
      })
      
      expect(deactivateResponse.status).toBe(200)
      
      // 4. Verify stream is deactivated
      const checkResponse = await fetch(`${baseUrl}/api/livestream`)
      const checkData = await checkResponse.json()
      
      expect(checkData.stream?.isActive).toBe(false)
    }, 15000)
  })

  describe('System Health and Performance', () => {
    it('should handle concurrent requests', async () => {
      const requests = Array.from({ length: 10 }, () => 
        fetch(`${baseUrl}/api/products`)
      )
      
      const responses = await Promise.all(requests)
      
      responses.forEach(response => {
        expect(response.status).toBe(200)
      })
    }, 15000)

    it('should maintain data consistency across operations', async () => {
      // Get initial counts
      const initialProducts = await fetch(`${baseUrl}/api/products`)
      const initialData = await initialProducts.json()
      const initialCount = initialData.data.length
      
      // Create product
      const createResponse = await fetch(`${baseUrl}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': adminCookie,
        },
        body: JSON.stringify({
          name: 'Consistency Test Product',
          price: 29.99,
          inventory: 50
        }),
      })
      
      const createData = await createResponse.json()
      const productId = createData.data.id
      
      // Verify count increased
      const afterCreate = await fetch(`${baseUrl}/api/products`)
      const afterCreateData = await afterCreate.json()
      expect(afterCreateData.data.length).toBe(initialCount + 1)
      
      // Delete product
      await fetch(`${baseUrl}/api/products/${productId}`, {
        method: 'DELETE',
        headers: { 'Cookie': adminCookie },
      })
      
      // Verify count returned to original
      const afterDelete = await fetch(`${baseUrl}/api/products`)
      const afterDeleteData = await afterDelete.json()
      expect(afterDeleteData.data.length).toBe(initialCount)
    }, 15000)
  })
})
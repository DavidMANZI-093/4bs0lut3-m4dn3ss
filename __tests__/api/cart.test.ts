import { describe, it, expect } from '@jest/globals'

describe('Cart API', () => {
  const baseUrl = 'http://localhost:3000'

  it('should get cart items', async () => {
    const response = await fetch(`${baseUrl}/api/cart`)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(Array.isArray(data.data.items)).toBe(true)
    expect(typeof data.data.total).toBe('number')
    
    if (data.data.items.length > 0) {
      const item = data.data.items[0]
      expect(item.id).toBeDefined()
      expect(item.quantity).toBeDefined()
      expect(item.product).toBeDefined()
      expect(item.product.name).toBeDefined()
      expect(item.product.price).toBeDefined()
    }
  })

  it('should add item to cart', async () => {
    // First get a product to add (use a different product than what's in seed data)
    const productsResponse = await fetch(`${baseUrl}/api/products`)
    const productsData = await productsResponse.json()
    const product = productsData.data.find((p: any) => p.name === 'Team Logo Water Bottle') || productsData.data[5]

    const cartData = {
      productId: product.id,
      quantity: 2
    }

    const response = await fetch(`${baseUrl}/api/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cartData),
    })
    
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.productId).toBe(cartData.productId)
    expect(data.data.quantity).toBeGreaterThanOrEqual(cartData.quantity)
    expect(data.message).toBe('Product added to cart successfully')
  })

  it('should validate cart item data', async () => {
    const response = await fetch(`${baseUrl}/api/cart/add`, {
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

  it('should update cart item quantity', async () => {
    // First get cart items
    const cartResponse = await fetch(`${baseUrl}/api/cart`)
    const cartData = await cartResponse.json()
    
    if (cartData.data.items.length > 0) {
      const item = cartData.data.items[0]
      const newQuantity = item.quantity + 1

      const response = await fetch(`${baseUrl}/api/cart/items/${item.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity }),
      })
      
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.quantity).toBe(newQuantity)
    }
  })

  it('should delete cart item', async () => {
    // First get cart items
    const cartResponse = await fetch(`${baseUrl}/api/cart`)
    const cartData = await cartResponse.json()
    
    if (cartData.data.items.length > 0) {
      const item = cartData.data.items[0]

      const response = await fetch(`${baseUrl}/api/cart/items/${item.id}`, {
        method: 'DELETE',
      })
      
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBe('Cart item removed successfully')
    }
  })
})
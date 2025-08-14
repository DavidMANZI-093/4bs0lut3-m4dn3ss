import { describe, it, expect } from '@jest/globals'

describe('Products API', () => {
  const baseUrl = 'http://localhost:3000'

  it('should get all products', async () => {
    const response = await fetch(`${baseUrl}/api/products`)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(Array.isArray(data.data)).toBe(true)
    expect(data.data.length).toBeGreaterThan(0)
    
    // Check product structure with enhanced fields
    const product = data.data[0]
    expect(product.name).toBeDefined()
    expect(product.price).toBeDefined()
    expect(product.description).toBeDefined()
    expect(typeof product.inventory).toBe('number')
    expect(typeof product.isActive).toBe('boolean')
    expect(product.createdAt).toBeDefined()
    expect(product.updatedAt).toBeDefined()
  })

  it('should get a specific product', async () => {
    // First get all products to get an ID
    const productsResponse = await fetch(`${baseUrl}/api/products`)
    const productsData = await productsResponse.json()
    const productId = productsData.data[0].id

    const response = await fetch(`${baseUrl}/api/products/${productId}`)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.id).toBe(productId)
    expect(data.data.name).toBeDefined()
    expect(data.data.price).toBeDefined()
    expect(typeof data.data.inventory).toBe('number')
  })

  it('should handle product not found', async () => {
    const response = await fetch(`${baseUrl}/api/products/nonexistent-id`)
    const data = await response.json()
    
    expect(response.status).toBe(404)
    expect(data.success).toBe(false)
    expect(data.error).toContain('Product not found')
  })

  it('should filter active products only', async () => {
    const response = await fetch(`${baseUrl}/api/products?active=true`)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(Array.isArray(data.data)).toBe(true)
    
    // All returned products should be active
    data.data.forEach((product: any) => {
      expect(product.isActive).toBe(true)
    })
  })
})
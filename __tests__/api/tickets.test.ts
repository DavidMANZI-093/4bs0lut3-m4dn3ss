import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'

// Basic API tests
describe('Tickets API', () => {
  const baseUrl = 'http://localhost:3000'

  it('should get all tickets', async () => {
    const response = await fetch(`${baseUrl}/api/tickets`)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(Array.isArray(data.data)).toBe(true)
    expect(data.data.length).toBeGreaterThan(0)
  })

  it('should create a new ticket', async () => {
    const ticketData = {
      title: 'Test Ticket',
      description: 'This is a test ticket'
    }

    const response = await fetch(`${baseUrl}/api/tickets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ticketData),
    })
    
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.title).toBe(ticketData.title)
    expect(data.data.description).toBe(ticketData.description)
    expect(data.data.status).toBe('OPEN')
  })

  it('should validate required fields', async () => {
    const response = await fetch(`${baseUrl}/api/tickets`, {
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
})
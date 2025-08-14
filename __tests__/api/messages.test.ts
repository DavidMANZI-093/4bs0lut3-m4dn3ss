import { describe, it, expect } from '@jest/globals'

describe('Messages API', () => {
  const baseUrl = 'http://localhost:3000'

  it('should get all messages', async () => {
    const response = await fetch(`${baseUrl}/api/messages`)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(Array.isArray(data.data)).toBe(true)
    
    if (data.data.length > 0) {
      const message = data.data[0]
      expect(message.sender).toBeDefined()
      expect(message.content).toBeDefined()
      expect(message.createdAt).toBeDefined()
    }
  })

  it('should create a new message', async () => {
    const messageData = {
      sender: 'TestUser',
      content: 'This is a test message'
    }

    const response = await fetch(`${baseUrl}/api/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageData),
    })
    
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.sender).toBe(messageData.sender)
    expect(data.data.content).toBe(messageData.content)
    expect(data.data.createdAt).toBeDefined()
  })

  it('should validate message data', async () => {
    const response = await fetch(`${baseUrl}/api/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })
    
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Sender and content are required')
  })

  it('should get a specific message', async () => {
    // First get all messages to get an ID
    const messagesResponse = await fetch(`${baseUrl}/api/messages`)
    const messagesData = await messagesResponse.json()
    
    if (messagesData.data.length > 0) {
      const messageId = messagesData.data[0].id

      const response = await fetch(`${baseUrl}/api/messages/${messageId}`)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.id).toBe(messageId)
      expect(data.data.sender).toBeDefined()
      expect(data.data.content).toBeDefined()
    }
  })

  it('should handle message not found', async () => {
    const response = await fetch(`${baseUrl}/api/messages/nonexistent-id`)
    const data = await response.json()
    
    expect(response.status).toBe(404)
    expect(data.success).toBe(false)
    expect(data.error).toContain('Message not found')
  })
})
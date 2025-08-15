import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'

describe('Live Stream API', () => {
  const baseUrl = 'http://localhost:3000'
  let authCookie: string

  beforeAll(async () => {
    // Login as admin to get auth cookie for protected routes
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@4bs0lut3-m4dn3ss.com',
        password: 'admin123'
      }),
    })
    
    authCookie = loginResponse.headers.get('set-cookie') || ''
  })

  it('should get current live stream (public)', async () => {
    const response = await fetch(`${baseUrl}/api/livestream`)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    
    if (data.stream) {
      expect(data.stream.youtubeUrl).toBeDefined()
      expect(typeof data.stream.isActive).toBe('boolean')
      expect(data.stream.title).toBeDefined()
      expect(data.stream.createdAt).toBeDefined()
      expect(data.stream.updatedAt).toBeDefined()
    }
  })

  it('should create/update live stream (admin only)', async () => {
    const streamData = {
      youtubeUrl: 'https://youtu.be/testVideoId',
      title: 'Test Live Stream',
      description: 'Test stream description',
      isActive: true
    }

    const response = await fetch(`${baseUrl}/api/livestream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': authCookie,
      },
      body: JSON.stringify(streamData),
    })
    
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.stream.youtubeUrl).toBe(streamData.youtubeUrl)
    expect(data.stream.title).toBe(streamData.title)
    expect(data.stream.description).toBe(streamData.description)
    expect(data.stream.isActive).toBe(streamData.isActive)
  })

  it('should validate YouTube URL format', async () => {
    const streamData = {
      youtubeUrl: 'invalid-url',
      title: 'Test Stream',
      isActive: true
    }

    const response = await fetch(`${baseUrl}/api/livestream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': authCookie,
      },
      body: JSON.stringify(streamData),
    })
    
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Invalid YouTube URL')
  })

  it('should deactivate previous streams when creating new one', async () => {
    // Create first stream
    await fetch(`${baseUrl}/api/livestream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': authCookie,
      },
      body: JSON.stringify({
        youtubeUrl: 'https://youtu.be/firstStream',
        title: 'First Stream',
        isActive: true
      }),
    })

    // Create second stream
    const response = await fetch(`${baseUrl}/api/livestream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': authCookie,
      },
      body: JSON.stringify({
        youtubeUrl: 'https://youtu.be/secondStream',
        title: 'Second Stream',
        isActive: true
      }),
    })

    const data = await response.json()
    expect(response.status).toBe(200)
    expect(data.success).toBe(true)

    // Verify only the latest stream is active
    const currentResponse = await fetch(`${baseUrl}/api/livestream`)
    const currentData = await currentResponse.json()
    
    expect(currentData.stream.title).toBe('Second Stream')
    expect(currentData.stream.isActive).toBe(true)
  })
})
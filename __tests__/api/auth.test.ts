import { describe, it, expect } from '@jest/globals'

describe('Authentication API', () => {
  const baseUrl = 'http://localhost:3000'

  it('should login with valid credentials', async () => {
    const loginData = {
      email: 'admin@4bs0lut3-m4dn3ss.com',
      password: 'admin123'
    }

    const response = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    })
    
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.user).toBeDefined()
    expect(data.user.email).toBe(loginData.email)
    expect(data.user.role).toBeDefined()
    expect(data.message).toBe('Login successful')
  })

  it('should reject invalid credentials', async () => {
    const loginData = {
      email: 'admin@4bs0lut3-m4dn3ss.com',
      password: 'wrongpassword'
    }

    const response = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    })
    
    const data = await response.json()
    
    expect(response.status).toBe(401)
    expect(data.error).toBe('INVALID_CREDENTIALS')
    expect(data.message).toBe('Invalid email or password')
  })

  it('should validate session', async () => {
    // First login to get a session cookie
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
    
    const loginData = await loginResponse.json()
    const cookies = loginResponse.headers.get('set-cookie')

    // Validate the session using the cookie
    const sessionResponse = await fetch(`${baseUrl}/api/auth/session`, {
      headers: {
        'Cookie': cookies || '',
      },
    })
    
    const sessionData = await sessionResponse.json()
    
    expect(sessionResponse.status).toBe(200)
    expect(sessionData.success).toBe(true)
    expect(sessionData.user).toBeDefined()
    expect(sessionData.user.email).toBe('admin@4bs0lut3-m4dn3ss.com')
  })

  it('should logout successfully', async () => {
    // First login to get a session cookie
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
    
    const loginData = await loginResponse.json()
    const cookies = loginResponse.headers.get('set-cookie')

    // Logout using the cookie
    const logoutResponse = await fetch(`${baseUrl}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Cookie': cookies || '',
      },
    })
    
    const logoutData = await logoutResponse.json()
    
    expect(logoutResponse.status).toBe(200)
    expect(logoutData.success).toBe(true)
    expect(logoutData.message).toBe('Logout successful')
  })
})
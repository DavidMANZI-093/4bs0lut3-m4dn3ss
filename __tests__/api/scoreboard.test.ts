import { describe, it, expect } from '@jest/globals'

describe('Scoreboard API', () => {
  const baseUrl = 'http://localhost:3000'

  it('should get current score', async () => {
    const response = await fetch(`${baseUrl}/api/score`)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data).toBeDefined()
    expect(typeof data.data.teamA).toBe('number')
    expect(typeof data.data.teamB).toBe('number')
    expect(data.data.updatedAt).toBeDefined()
  })

  it('should update score', async () => {
    // Update score by adding points to team A
    const scoreData = {
      team: 'A',
      points: 2
    }

    const response = await fetch(`${baseUrl}/api/score/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scoreData),
    })
    
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.teamA).toBeGreaterThan(0)
    expect(data.message).toBe('Team A score updated')
  })

  it('should validate score update data', async () => {
    const scoreData = {
      team: 'C', // Invalid team
      points: 'invalid' // Invalid points
    }

    const response = await fetch(`${baseUrl}/api/score/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scoreData),
    })
    
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error).toContain('Validation error')
  })

  it('should handle missing score data', async () => {
    const response = await fetch(`${baseUrl}/api/score/update`, {
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
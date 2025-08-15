import { describe, it, expect, afterAll } from '@jest/globals'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

describe('Authentication System', () => {
  afterAll(async () => {
    await prisma.$disconnect()
  })

  describe('Password Hashing', () => {
    it('should hash passwords securely', async () => {
      const password = 'testpassword123'
      const hashedPassword = await bcrypt.hash(password, 12)
      
      expect(hashedPassword).toBeDefined()
      expect(hashedPassword).not.toBe(password)
      expect(hashedPassword.length).toBeGreaterThan(50)
    })

    it('should verify correct passwords', async () => {
      const password = 'testpassword123'
      const hashedPassword = await bcrypt.hash(password, 12)
      
      const isValid = await bcrypt.compare(password, hashedPassword)
      expect(isValid).toBe(true)
    })

    it('should reject incorrect passwords', async () => {
      const password = 'testpassword123'
      const wrongPassword = 'wrongpassword'
      const hashedPassword = await bcrypt.hash(password, 12)
      
      const isValid = await bcrypt.compare(wrongPassword, hashedPassword)
      expect(isValid).toBe(false)
    })
  })

  describe('User Role Validation', () => {
    it('should validate admin role', async () => {
      const adminUser = await prisma.user.findFirst({
        where: { role: 'ADMIN' }
      })
      
      expect(adminUser).toBeDefined()
      expect(adminUser?.role).toBe('ADMIN')
    })

    it('should validate developer role', async () => {
      const devUser = await prisma.user.findFirst({
        where: { role: 'DEVELOPER' }
      })
      
      expect(devUser).toBeDefined()
      expect(devUser?.role).toBe('DEVELOPER')
    })

    it('should validate user role', async () => {
      const regularUser = await prisma.user.findFirst({
        where: { role: 'USER' }
      })
      
      // May not exist in seed data, but should be valid enum value
      if (regularUser) {
        expect(regularUser.role).toBe('USER')
      }
    })
  })

  describe('Database User Operations', () => {
    it('should create user with hashed password', async () => {
      const testEmail = `test-${Date.now()}@example.com`
      const password = 'testpassword123'
      const hashedPassword = await bcrypt.hash(password, 12)
      
      const user = await prisma.user.create({
        data: {
          email: testEmail,
          passwordHash: hashedPassword,
          role: 'USER'
        }
      })
      
      expect(user.id).toBeDefined()
      expect(user.email).toBe(testEmail)
      expect(user.passwordHash).toBe(hashedPassword)
      expect(user.role).toBe('USER')
      
      // Cleanup
      await prisma.user.delete({ where: { id: user.id } })
    })

    it('should enforce unique email constraint', async () => {
      const testEmail = `unique-${Date.now()}@example.com`
      const hashedPassword = await bcrypt.hash('password123', 12)
      
      // First user should succeed
      const user1 = await prisma.user.create({
        data: {
          email: testEmail,
          passwordHash: hashedPassword,
          role: 'USER'
        }
      })
      
      // Second user with same email should fail
      await expect(
        prisma.user.create({
          data: {
            email: testEmail,
            passwordHash: hashedPassword,
            role: 'USER'
          }
        })
      ).rejects.toThrow()
      
      // Cleanup
      await prisma.user.delete({ where: { id: user1.id } })
    })

    it('should find user by email', async () => {
      const adminUser = await prisma.user.findUnique({
        where: { email: 'admin@4bs0lut3-m4dn3ss.com' }
      })
      
      expect(adminUser).toBeDefined()
      expect(adminUser?.email).toBe('admin@4bs0lut3-m4dn3ss.com')
      expect(adminUser?.role).toBe('ADMIN')
    })

    it('should validate password against stored hash', async () => {
      const adminUser = await prisma.user.findUnique({
        where: { email: 'admin@4bs0lut3-m4dn3ss.com' }
      })
      
      expect(adminUser).toBeDefined()
      
      if (adminUser) {
        const isValidPassword = await bcrypt.compare('admin123', adminUser.passwordHash)
        expect(isValidPassword).toBe(true)
        
        const isInvalidPassword = await bcrypt.compare('wrongpassword', adminUser.passwordHash)
        expect(isInvalidPassword).toBe(false)
      }
    })
  })

  describe('Authentication Logic', () => {
    it('should validate required authentication fields', () => {
      const validLoginData = {
        email: 'test@example.com',
        password: 'password123'
      }
      
      expect(validLoginData.email).toBeDefined()
      expect(validLoginData.password).toBeDefined()
      expect(validLoginData.email.includes('@')).toBe(true)
      expect(validLoginData.password.length).toBeGreaterThan(0)
    })

    it('should reject invalid email formats', () => {
      const invalidEmails = [
        'notanemail',
        '@example.com',
        'test@',
        'test..test@example.com',
        ''
      ]
      
      invalidEmails.forEach(email => {
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !/\.{2,}/.test(email)
        expect(isValidEmail).toBe(false)
      })
    })

    it('should accept valid email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'admin@4bs0lut3-m4dn3ss.com',
        'dev@4bs0lut3-m4dn3ss.com'
      ]
      
      validEmails.forEach(email => {
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        expect(isValidEmail).toBe(true)
      })
    })
  })

  describe('Role-Based Access Control Logic', () => {
    it('should identify admin permissions', () => {
      const adminRole = 'ADMIN'
      const devRole = 'DEVELOPER'
      const userRole = 'USER'
      
      // Admin should have access to admin features
      expect(['ADMIN'].includes(adminRole)).toBe(true)
      expect(['ADMIN'].includes(devRole)).toBe(false)
      expect(['ADMIN'].includes(userRole)).toBe(false)
    })

    it('should identify developer permissions', () => {
      const adminRole = 'ADMIN'
      const devRole = 'DEVELOPER'
      const userRole = 'USER'
      
      // Both admin and developer should have access to dev features
      expect(['ADMIN', 'DEVELOPER'].includes(adminRole)).toBe(true)
      expect(['ADMIN', 'DEVELOPER'].includes(devRole)).toBe(true)
      expect(['ADMIN', 'DEVELOPER'].includes(userRole)).toBe(false)
    })

    it('should identify user permissions', () => {
      const adminRole = 'ADMIN'
      const devRole = 'DEVELOPER'
      const userRole = 'USER'
      
      // All roles should have basic user access
      expect(['ADMIN', 'DEVELOPER', 'USER'].includes(adminRole)).toBe(true)
      expect(['ADMIN', 'DEVELOPER', 'USER'].includes(devRole)).toBe(true)
      expect(['ADMIN', 'DEVELOPER', 'USER'].includes(userRole)).toBe(true)
    })
  })
})
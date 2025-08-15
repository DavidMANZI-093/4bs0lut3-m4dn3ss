import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface UserSession {
  id: string;
  email: string;
  role: 'ADMIN' | 'DEVELOPER' | 'USER';
  createdAt: Date;
  expiresAt: Date;
  lastActivity: Date;
}

export class AuthService {
  private static readonly SALT_ROUNDS = 12;
  private static readonly SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours in milliseconds

  /**
   * Hash a password using bcrypt
   */
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Verify a password against its hash
   */
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate a secure session token
   */
  static generateSessionToken(): string {
    return randomBytes(32).toString('hex');
  }

  /**
   * Create a new user session
   */
  static async createSession(
    userId: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<UserSession> {
    const token = this.generateSessionToken();
    const expiresAt = new Date(Date.now() + this.SESSION_DURATION);

    const session = await prisma.session.create({
      data: {
        userId,
        token,
        expiresAt,
        ipAddress,
        userAgent,
      },
      include: {
        user: true,
      },
    });

    return {
      id: session.id,
      email: session.user.email,
      role: session.user.role,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
      lastActivity: session.lastActivity,
    };
  }

  /**
   * Validate a session token and return user session
   */
  static async validateSession(token: string): Promise<UserSession | null> {
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!session || !session.user.isActive) {
      return null;
    }

    // Check if session has expired
    if (session.expiresAt < new Date()) {
      await this.destroySession(token);
      return null;
    }

    // Update last activity
    await prisma.session.update({
      where: { id: session.id },
      data: { lastActivity: new Date() },
    });

    return {
      id: session.id,
      email: session.user.email,
      role: session.user.role,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
      lastActivity: new Date(),
    };
  }

  /**
   * Refresh a session (extend expiry time)
   */
  static async refreshSession(token: string): Promise<UserSession | null> {
    const session = await this.validateSession(token);
    if (!session) {
      return null;
    }

    const newExpiresAt = new Date(Date.now() + this.SESSION_DURATION);
    
    await prisma.session.update({
      where: { token },
      data: { 
        expiresAt: newExpiresAt,
        lastActivity: new Date(),
      },
    });

    return {
      ...session,
      expiresAt: newExpiresAt,
      lastActivity: new Date(),
    };
  }

  /**
   * Destroy a session (logout)
   */
  static async destroySession(token: string): Promise<void> {
    await prisma.session.delete({
      where: { token },
    }).catch(() => {
      // Session might not exist, ignore error
    });
  }

  /**
   * Destroy all sessions for a user
   */
  static async destroyAllUserSessions(userId: string): Promise<void> {
    await prisma.session.deleteMany({
      where: { userId },
    });
  }

  /**
   * Clean up expired sessions
   */
  static async cleanupExpiredSessions(): Promise<void> {
    await prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }

  /**
   * Authenticate user with email and password
   */
  static async authenticateUser(
    email: string,
    password: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<{ user: UserSession; token: string } | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.isActive) {
      return null;
    }

    const isValidPassword = await this.verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      return null;
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Create session
    const session = await this.createSession(user.id, ipAddress, userAgent);
    const token = await prisma.session.findUnique({
      where: { id: session.id },
      select: { token: true },
    });

    return {
      user: session,
      token: token!.token,
    };
  }

  /**
   * Create a new user (for seeding/admin creation)
   */
  static async createUser(
    email: string,
    password: string,
    role: 'ADMIN' | 'DEVELOPER' = 'ADMIN'
  ): Promise<string> {
    const passwordHash = await this.hashPassword(password);
    
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role,
      },
    });

    return user.id;
  }
}
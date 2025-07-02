import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import type { Request, Response, NextFunction } from 'express';
import { storage } from './storage';

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable must be set");
}

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '7d';
const SALT_ROUNDS = 12;

export interface AuthUser {
  id: number;
  email: string;
  role: string;
  isEmailVerified: boolean;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

// JWT Token utilities
export function generateToken(user: AuthUser): string {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role,
      isEmailVerified: user.isEmailVerified 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      isEmailVerified: decoded.isEmailVerified
    };
  } catch (error) {
    return null;
  }
}

// Password utilities
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Token generation for email verification and password reset
export function generateRandomToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Middleware functions
export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  const user = verifyToken(token);
  if (!user) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }

  req.user = user;
  next();
}

export function requireEmailVerification(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user?.isEmailVerified) {
    return res.status(403).json({ 
      message: 'Email verification required',
      code: 'EMAIL_NOT_VERIFIED'
    });
  }
  next();
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}

// Combined middleware for admin routes
export const adminAuth = [authenticateToken, requireEmailVerification, requireAdmin];

// Optional authentication (doesn't require login)
export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    const user = verifyToken(token);
    if (user) {
      req.user = user;
    }
  }
  
  next();
}

// Initialize default admin user
export async function initializeDefaultAdmin() {
  try {
    const adminEmail = 'jusperkato@gmail.com';
    const adminPassword = 'magala@123';
    
    // Check if admin already exists
    const existingAdmin = await storage.getUserByEmail(adminEmail);
    if (existingAdmin) {
      console.log('Default admin user already exists');
      return;
    }

    // Create default admin user
    const hashedPassword = await hashPassword(adminPassword);
    const adminUser = await storage.createUser({
      email: adminEmail,
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isEmailVerified: true,
      username: 'admin'
    });

    console.log('Default admin user created:', adminEmail);
  } catch (error) {
    console.error('Error creating default admin user:', error);
  }
}
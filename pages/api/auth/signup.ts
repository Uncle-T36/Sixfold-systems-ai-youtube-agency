/**
 * User Signup API
 * Creates new user accounts with email/password
 */

import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

interface SignupResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  error?: string;
}

// In production, this would be a database
// For now, we store in memory (resets on server restart)
// Users are also stored in localStorage on client side
const registeredUsers: Map<string, {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  createdAt: string;
}> = new Map();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SignupResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  const { email, password, name }: SignupRequest = req.body;

  // Validation
  if (!email || !password || !name) {
    return res.status(400).json({
      success: false,
      error: 'Email, password, and name are required'
    });
  }

  if (!email.includes('@')) {
    return res.status(400).json({
      success: false,
      error: 'Invalid email format'
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      error: 'Password must be at least 6 characters'
    });
  }

  try {
    // Check if email already exists
    if (registeredUsers.has(email.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: 'Email already registered. Please login instead.'
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const user = {
      id: userId,
      email: email.toLowerCase(),
      passwordHash,
      name,
      createdAt: new Date().toISOString(),
    };

    // Save user (in production, save to database)
    registeredUsers.set(email.toLowerCase(), user);

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET || 'demo_secret_key_change_in_production',
      { expiresIn: '30d' }
    );

    console.log(`✅ New user registered: ${email}`);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      }
    });

  } catch (error: any) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create account. Please try again.'
    });
  }
}

// Helper to get user (for other endpoints)
export function getRegisteredUser(email: string) {
  return registeredUsers.get(email.toLowerCase());
}

// Helper to verify password
export async function verifyPassword(email: string, password: string): Promise<boolean> {
  const user = registeredUsers.get(email.toLowerCase());
  if (!user) return false;
  return bcrypt.compare(password, user.passwordHash);
}

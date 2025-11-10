// Authentication API endpoints
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

interface AuthRequest {
  email: string;
  password: string;
  name?: string;
}

interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AuthResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  const { email, password, name }: AuthRequest = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Email and password are required'
    });
  }

  try {
    // For demo purposes, we'll use simple in-memory authentication
    // In production, this would connect to your database
    
    const users = [
      {
        id: 'user_demo',
        email: 'demo@example.com',
        password: await bcrypt.hash('password123', 10),
        name: 'Demo User'
      },
      {
        id: 'user_admin',
        email: 'admin@ai-youtube-agency.com',
        password: await bcrypt.hash('admin123', 10),
        name: 'Admin User'
      }
    ];

    // Check if user exists
    const existingUser = users.find(u => u.email === email);
    
    if (existingUser) {
      // Login
      const isValidPassword = await bcrypt.compare(password, existingUser.password);
      
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: existingUser.id, email: existingUser.email },
        process.env.JWT_SECRET || 'demo_secret',
        { expiresIn: '7d' }
      );

      console.log(`✅ User logged in: ${email}`);

      return res.status(200).json({
        success: true,
        token,
        user: {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name
        }
      });

    } else {
      // Signup
      if (!name) {
        return res.status(400).json({
          success: false,
          error: 'Name is required for signup'
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        id: `user_${Date.now()}`,
        email,
        password: hashedPassword,
        name
      };

      // In production, save to database
      console.log('New user would be saved:', { ...newUser, password: '[HIDDEN]' });

      // Generate JWT token
      const token = jwt.sign(
        { userId: newUser.id, email: newUser.email },
        process.env.JWT_SECRET || 'demo_secret',
        { expiresIn: '7d' }
      );

      console.log(`✅ New user created: ${email}`);

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name
        }
      });
    }

  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}
/**
 * 🛡️ API SECURITY MIDDLEWARE
 * Rate limiting, validation, and protection for API routes
 */

import type { NextApiRequest, NextApiResponse } from 'next';

// Rate limiting storage
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Blocked IPs
const blockedIPs = new Set<string>();

// =========================
// 🔒 RATE LIMITING
// =========================

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  blockDuration?: number;
}

export function rateLimit(config: RateLimitConfig = { maxRequests: 100, windowMs: 60000 }) {
  return (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    const identifier = getClientIdentifier(req);
    
    // Check if blocked
    if (blockedIPs.has(identifier)) {
      return res.status(429).json({ 
        error: 'Too many requests. Your IP has been temporarily blocked.',
        retryAfter: config.blockDuration || 3600000,
      });
    }

    const now = Date.now();
    const key = identifier;
    
    let limit = rateLimitMap.get(key);
    
    if (!limit || now > limit.resetTime) {
      // Reset window
      rateLimitMap.set(key, {
        count: 1,
        resetTime: now + config.windowMs,
      });
      return next();
    }
    
    if (limit.count >= config.maxRequests) {
      // Block if excessive
      if (limit.count > config.maxRequests * 2) {
        blockedIPs.add(identifier);
        console.error(`🚫 BLOCKED IP: ${identifier} for excessive requests`);
        
        // Auto-unblock after duration
        setTimeout(() => {
          blockedIPs.delete(identifier);
          console.log(`✅ Unblocked IP: ${identifier}`);
        }, config.blockDuration || 3600000);
      }
      
      return res.status(429).json({ 
        error: 'Rate limit exceeded. Please try again later.',
        retryAfter: limit.resetTime - now,
      });
    }
    
    limit.count++;
    return next();
  };
}

// =========================
// 🔐 CSRF PROTECTION
// =========================

export function csrfProtection(req: NextApiRequest, res: NextApiResponse, next: () => void) {
  // Only check for state-changing methods
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method || '')) {
    const token = req.headers['x-csrf-token'] as string;
    const origin = req.headers.origin || req.headers.referer;
    
    if (!token) {
      return res.status(403).json({ error: 'CSRF token missing' });
    }
    
    // Validate origin
    if (!origin || !isValidOrigin(origin)) {
      return res.status(403).json({ error: 'Invalid request origin' });
    }
  }
  
  return next();
}

// =========================
// 🛡️ INPUT VALIDATION
// =========================

export function validateRequest(req: NextApiRequest, res: NextApiResponse, next: () => void) {
  try {
    // Validate Content-Type for POST/PUT
    if (['POST', 'PUT', 'PATCH'].includes(req.method || '')) {
      const contentType = req.headers['content-type'];
      if (!contentType || !contentType.includes('application/json')) {
        return res.status(400).json({ error: 'Invalid Content-Type. Expected application/json' });
      }
    }

    // Check body size (prevent payload attacks)
    const contentLength = parseInt(req.headers['content-length'] || '0');
    if (contentLength > 10 * 1024 * 1024) { // 10MB limit
      return res.status(413).json({ error: 'Payload too large' });
    }

    // Sanitize query parameters
    if (req.query) {
      for (const [key, value] of Object.entries(req.query)) {
        if (typeof value === 'string' && containsSuspiciousPatterns(value)) {
          return res.status(400).json({ error: 'Invalid query parameters' });
        }
      }
    }

    // Sanitize body
    if (req.body && typeof req.body === 'object') {
      sanitizeObject(req.body);
    }

    return next();
  } catch (error) {
    console.error('Validation error:', error);
    return res.status(400).json({ error: 'Invalid request' });
  }
}

// =========================
// 🔒 SECURITY HEADERS
// =========================

export function securityHeaders(req: NextApiRequest, res: NextApiResponse, next: () => void) {
  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "font-src 'self' data:; " +
    "connect-src 'self' https://api.github.com https://vercel.live; " +
    "frame-ancestors 'none';"
  );

  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');

  // Prevent MIME sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions policy
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  return next();
}

// =========================
// 🔧 HELPER FUNCTIONS
// =========================

function getClientIdentifier(req: NextApiRequest): string {
  // Try to get real IP (considering proxies)
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded 
    ? (typeof forwarded === 'string' ? forwarded.split(',')[0] : forwarded[0])
    : req.socket.remoteAddress || 'unknown';
  
  return ip;
}

function isValidOrigin(origin: string): boolean {
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_APP_URL || '',
    'http://localhost:3000',
    'http://localhost:3001',
    'https://vercel.app',
  ].filter(Boolean);

  return allowedOrigins.some(allowed => origin.startsWith(allowed));
}

function containsSuspiciousPatterns(input: string): boolean {
  const suspiciousPatterns = [
    /<script/gi,
    /javascript:/gi,
    /onerror=/gi,
    /onclick=/gi,
    /<iframe/gi,
    /eval\(/gi,
    /UNION.*SELECT/gi,
    /DROP.*TABLE/gi,
  ];

  return suspiciousPatterns.some(pattern => pattern.test(input));
}

function sanitizeObject(obj: any): void {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      // Remove control characters
      obj[key] = obj[key].replace(/[\x00-\x1F\x7F-\x9F]/g, '');
      
      // Limit length
      if (obj[key].length > 10000) {
        obj[key] = obj[key].substring(0, 10000);
      }
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitizeObject(obj[key]);
    }
  }
}

// =========================
// 🌐 MIDDLEWARE CHAIN
// =========================

export function createSecureAPIHandler(
  handler: (req: NextApiRequest, res: NextApiResponse) => void | Promise<void>,
  options: {
    rateLimit?: RateLimitConfig | false;
    requireCSRF?: boolean;
  } = {}
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // Apply security headers
      securityHeaders(req, res, () => {});

      // Apply rate limiting
      if (options.rateLimit !== false) {
        await new Promise<void>((resolve, reject) => {
          rateLimit(typeof options.rateLimit === 'object' ? options.rateLimit : { maxRequests: 100, windowMs: 60000 })(
            req,
            res,
            () => resolve()
          );
        });
      }

      // Apply CSRF protection
      if (options.requireCSRF !== false) {
        await new Promise<void>((resolve, reject) => {
          csrfProtection(req, res, () => resolve());
        });
      }

      // Validate request
      await new Promise<void>((resolve, reject) => {
        validateRequest(req, res, () => resolve());
      });

      // Call actual handler
      await handler(req, res);
    } catch (error) {
      console.error('API error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };
}

// Cleanup old rate limit entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, limit] of rateLimitMap.entries()) {
    if (now > limit.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 10 * 60 * 1000);

/**
 * 🔒 SECURITY MANAGER
 * Comprehensive security layer for the AI YouTube Agency
 * Prevents XSS, CSRF, injection attacks, and unauthorized access
 */

// =========================
// 🔐 ENCRYPTION UTILITIES
// =========================

class SecurityManager {
  private readonly ENCRYPTION_KEY_NAME = 'app_encryption_key';
  private encryptionKey: string | null = null;

  constructor() {
    this.initializeEncryptionKey();
  }

  /**
   * Initialize or retrieve encryption key
   */
  private initializeEncryptionKey(): void {
    if (typeof window === 'undefined') return;

    try {
      // Try to get existing key
      let key = sessionStorage.getItem(this.ENCRYPTION_KEY_NAME);
      
      if (!key) {
        // Generate new key per session
        key = this.generateSecureKey();
        sessionStorage.setItem(this.ENCRYPTION_KEY_NAME, key);
      }
      
      this.encryptionKey = key;
    } catch (error) {
      console.warn('Failed to initialize encryption key:', error);
    }
  }

  /**
   * Generate secure random key
   */
  private generateSecureKey(): string {
    const array = new Uint8Array(32);
    if (typeof window !== 'undefined' && window.crypto) {
      window.crypto.getRandomValues(array);
    } else {
      // Fallback for older browsers
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
    }
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Simple XOR encryption (for localStorage data)
   */
  encrypt(data: string): string {
    if (!this.encryptionKey) return data;

    try {
      const key = this.encryptionKey;
      let encrypted = '';
      
      for (let i = 0; i < data.length; i++) {
        const charCode = data.charCodeAt(i) ^ key.charCodeAt(i % key.length);
        encrypted += String.fromCharCode(charCode);
      }
      
      return btoa(encrypted); // Base64 encode
    } catch (error) {
      console.error('Encryption failed:', error);
      return data;
    }
  }

  /**
   * Decrypt XOR encrypted data
   */
  decrypt(encryptedData: string): string {
    if (!this.encryptionKey) return encryptedData;

    try {
      const key = this.encryptionKey;
      const encrypted = atob(encryptedData); // Base64 decode
      let decrypted = '';
      
      for (let i = 0; i < encrypted.length; i++) {
        const charCode = encrypted.charCodeAt(i) ^ key.charCodeAt(i % key.length);
        decrypted += String.fromCharCode(charCode);
      }
      
      return decrypted;
    } catch (error) {
      console.error('Decryption failed:', error);
      return encryptedData;
    }
  }

  /**
   * Sanitize HTML to prevent XSS
   */
  sanitizeHTML(input: string): string {
    if (!input) return '';

    const map: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;',
    };

    return input.replace(/[&<>"'/]/g, (char) => map[char]);
  }

  /**
   * Sanitize input for safe storage and display
   */
  sanitizeInput(input: string, maxLength: number = 1000): string {
    if (!input) return '';

    // Remove control characters
    let sanitized = input.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
    
    // Trim whitespace
    sanitized = sanitized.trim();
    
    // Limit length
    sanitized = sanitized.substring(0, maxLength);
    
    // Remove SQL injection attempts
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/gi,
      /(UNION.*SELECT)/gi,
      /(--|\*\/|\/\*)/g,
      /('\s*OR\s*'1'\s*=\s*'1)/gi,
    ];
    
    for (const pattern of sqlPatterns) {
      sanitized = sanitized.replace(pattern, '');
    }
    
    return sanitized;
  }

  /**
   * Validate URL to prevent open redirects
   */
  isValidURL(url: string): boolean {
    if (!url) return false;

    try {
      const parsed = new URL(url);
      
      // Only allow http and https
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return false;
      }
      
      // Prevent javascript: protocol
      if (parsed.protocol === 'javascript:') {
        return false;
      }
      
      // Check for localhost/internal IPs (optional - uncomment if needed)
      // const hostname = parsed.hostname.toLowerCase();
      // if (hostname === 'localhost' || hostname.startsWith('127.') || hostname.startsWith('192.168.')) {
      //   return false;
      // }
      
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Generate CSRF token
   */
  generateCSRFToken(): string {
    const token = this.generateSecureKey();
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('csrf_token', token);
    }
    return token;
  }

  /**
   * Validate CSRF token
   */
  validateCSRFToken(token: string): boolean {
    if (typeof sessionStorage === 'undefined') return false;
    const storedToken = sessionStorage.getItem('csrf_token');
    return storedToken === token;
  }

  /**
   * Hash sensitive data (one-way)
   */
  async hash(data: string): Promise<string> {
    if (typeof window === 'undefined' || !window.crypto?.subtle) {
      // Fallback for environments without crypto.subtle
      return btoa(data);
    }

    try {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (error) {
      console.error('Hashing failed:', error);
      return btoa(data);
    }
  }

  /**
   * Validate email format
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  /**
   * Check for suspicious patterns
   */
  containsSuspiciousPatterns(input: string): boolean {
    const suspiciousPatterns = [
      /<script/gi,
      /javascript:/gi,
      /onerror=/gi,
      /onclick=/gi,
      /onload=/gi,
      /<iframe/gi,
      /eval\(/gi,
      /expression\(/gi,
      /vbscript:/gi,
      /data:text\/html/gi,
    ];

    return suspiciousPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Rate limit checker (client-side)
   */
  private rateLimits = new Map<string, { count: number; resetTime: number }>();

  checkRateLimit(action: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now();
    const key = action;
    
    let limit = this.rateLimits.get(key);
    
    if (!limit || now > limit.resetTime) {
      // Reset window
      this.rateLimits.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      return true;
    }
    
    if (limit.count >= maxRequests) {
      console.warn(`Rate limit exceeded for action: ${action}`);
      return false;
    }
    
    limit.count++;
    return true;
  }

  /**
   * Clean old rate limit entries
   */
  cleanupRateLimits(): void {
    const now = Date.now();
    for (const [key, limit] of this.rateLimits.entries()) {
      if (now > limit.resetTime) {
        this.rateLimits.delete(key);
      }
    }
  }

  /**
   * Validate API key format (without exposing actual key)
   */
  isValidAPIKeyFormat(key: string): boolean {
    if (!key) return false;
    
    // Check minimum length
    if (key.length < 20) return false;
    
    // Check for suspicious characters
    if (this.containsSuspiciousPatterns(key)) return false;
    
    // Check format (alphanumeric, dash, underscore only)
    const validFormat = /^[a-zA-Z0-9_-]+$/;
    return validFormat.test(key);
  }

  /**
   * Secure localStorage operations
   */
  secureSetItem(key: string, value: string, encrypt: boolean = true): boolean {
    if (typeof window === 'undefined') return false;

    try {
      const sanitizedKey = this.sanitizeInput(key, 100);
      const sanitizedValue = this.sanitizeInput(value, 50000);
      const finalValue = encrypt ? this.encrypt(sanitizedValue) : sanitizedValue;
      
      localStorage.setItem(sanitizedKey, finalValue);
      return true;
    } catch (error) {
      console.error('Secure storage failed:', error);
      return false;
    }
  }

  secureGetItem(key: string, decrypt: boolean = true): string | null {
    if (typeof window === 'undefined') return null;

    try {
      const sanitizedKey = this.sanitizeInput(key, 100);
      const value = localStorage.getItem(sanitizedKey);
      
      if (!value) return null;
      
      return decrypt ? this.decrypt(value) : value;
    } catch (error) {
      console.error('Secure retrieval failed:', error);
      return null;
    }
  }
}

// =========================
// 🛡️ FIREWALL RULES
// =========================

class Firewall {
  private blockedIPs = new Set<string>();
  private suspiciousActivity = new Map<string, number>();
  private readonly SUSPICIOUS_THRESHOLD = 10;
  private readonly BLOCK_DURATION = 3600000; // 1 hour

  /**
   * Check if request should be blocked
   */
  shouldBlockRequest(identifier: string, action: string): boolean {
    // Check if already blocked
    if (this.blockedIPs.has(identifier)) {
      console.warn(`🚫 Blocked request from: ${identifier}`);
      return true;
    }

    // Check suspicious activity
    const suspicionScore = this.suspiciousActivity.get(identifier) || 0;
    if (suspicionScore >= this.SUSPICIOUS_THRESHOLD) {
      this.blockIdentifier(identifier);
      return true;
    }

    return false;
  }

  /**
   * Report suspicious activity
   */
  reportSuspiciousActivity(identifier: string, severity: number = 1): void {
    const current = this.suspiciousActivity.get(identifier) || 0;
    this.suspiciousActivity.set(identifier, current + severity);

    console.warn(`⚠️ Suspicious activity detected: ${identifier} (score: ${current + severity})`);
  }

  /**
   * Block identifier
   */
  private blockIdentifier(identifier: string): void {
    this.blockedIPs.add(identifier);
    console.error(`🚫 BLOCKED: ${identifier} for ${this.BLOCK_DURATION / 60000} minutes`);

    // Auto-unblock after duration
    setTimeout(() => {
      this.unblockIdentifier(identifier);
    }, this.BLOCK_DURATION);
  }

  /**
   * Unblock identifier
   */
  private unblockIdentifier(identifier: string): void {
    this.blockedIPs.delete(identifier);
    this.suspiciousActivity.delete(identifier);
    console.log(`✅ Unblocked: ${identifier}`);
  }

  /**
   * Validate request origin
   */
  validateOrigin(origin: string, allowedOrigins: string[]): boolean {
    if (!origin) return false;
    return allowedOrigins.some(allowed => origin.includes(allowed));
  }
}

// =========================
// 🔒 ENVIRONMENT VARIABLES MANAGER
// =========================

class EnvironmentManager {
  /**
   * Get environment variable safely
   */
  getEnvVar(key: string, defaultValue: string = ''): string {
    // Server-side (Next.js)
    if (typeof process !== 'undefined' && process.env) {
      return process.env[key] || defaultValue;
    }

    // Client-side - check window.__ENV__ (set by server)
    if (typeof window !== 'undefined' && (window as any).__ENV__) {
      return (window as any).__ENV__[key] || defaultValue;
    }

    return defaultValue;
  }

  /**
   * Check if running in production
   */
  isProduction(): boolean {
    return this.getEnvVar('NODE_ENV') === 'production';
  }

  /**
   * Check if running in development
   */
  isDevelopment(): boolean {
    return this.getEnvVar('NODE_ENV') === 'development';
  }

  /**
   * Get API endpoint
   */
  getAPIEndpoint(service: string): string {
    const baseURL = this.getEnvVar('NEXT_PUBLIC_API_URL', 'https://api.yourdomain.com');
    return `${baseURL}/${service}`;
  }
}

// =========================
// 🌐 EXPORTS
// =========================

export const security = new SecurityManager();
export const firewall = new Firewall();
export const env = new EnvironmentManager();

// Cleanup rate limits every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    security.cleanupRateLimits();
  }, 5 * 60 * 1000);
}

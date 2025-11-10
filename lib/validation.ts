import type { NextApiRequest, NextApiResponse } from 'next';

export interface ValidationRule {
  field: string;
  type: 'string' | 'number' | 'array' | 'object' | 'boolean';
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  customValidation?: (value: any) => boolean;
  errorMessage?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate request data against rules
 */
export function validateRequest(
  data: any,
  rules: ValidationRule[]
): ValidationResult {
  const errors: string[] = [];

  for (const rule of rules) {
    const value = data[rule.field];

    // Check required
    if (rule.required && (value === undefined || value === null || value === '')) {
      errors.push(rule.errorMessage || `${rule.field} is required`);
      continue;
    }

    // Skip validation if not required and no value
    if (!rule.required && (value === undefined || value === null)) {
      continue;
    }

    // Type validation
    const actualType = Array.isArray(value) ? 'array' : typeof value;
    if (actualType !== rule.type) {
      errors.push(`${rule.field} must be a ${rule.type}`);
      continue;
    }

    // String validations
    if (rule.type === 'string') {
      if (rule.minLength && value.length < rule.minLength) {
        errors.push(`${rule.field} must be at least ${rule.minLength} characters`);
      }
      if (rule.maxLength && value.length > rule.maxLength) {
        errors.push(`${rule.field} must not exceed ${rule.maxLength} characters`);
      }
      if (rule.pattern && !rule.pattern.test(value)) {
        errors.push(rule.errorMessage || `${rule.field} format is invalid`);
      }
    }

    // Number validations
    if (rule.type === 'number') {
      if (rule.min !== undefined && value < rule.min) {
        errors.push(`${rule.field} must be at least ${rule.min}`);
      }
      if (rule.max !== undefined && value > rule.max) {
        errors.push(`${rule.field} must not exceed ${rule.max}`);
      }
    }

    // Array validations
    if (rule.type === 'array') {
      if (rule.minLength && value.length < rule.minLength) {
        errors.push(`${rule.field} must have at least ${rule.minLength} items`);
      }
      if (rule.maxLength && value.length > rule.maxLength) {
        errors.push(`${rule.field} must not exceed ${rule.maxLength} items`);
      }
    }

    // Custom validation
    if (rule.customValidation && !rule.customValidation(value)) {
      errors.push(rule.errorMessage || `${rule.field} validation failed`);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Middleware to validate API requests
 */
export function withValidation(
  rules: ValidationRule[],
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const validation = validateRequest(req.body, rules);

      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: validation.errors
        });
      }

      return await handler(req, res);
    } catch (error) {
      console.error('Validation middleware error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
}

/**
 * Sanitize string input to prevent XSS
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitize object recursively
 */
export function sanitizeObject(obj: any): any {
  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }
  
  if (obj && typeof obj === 'object') {
    const sanitized: any = {};
    for (const key in obj) {
      sanitized[key] = sanitizeObject(obj[key]);
    }
    return sanitized;
  }
  
  return obj;
}

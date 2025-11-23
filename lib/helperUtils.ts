/**
 * Retry utility with exponential backoff
 */

export interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  onRetry?: (error: Error, attempt: number) => void;
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffMultiplier = 2,
    onRetry,
  } = options;

  let lastError: Error;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxRetries - 1) {
        break; // Don't wait after last attempt
      }

      const delay = Math.min(
        initialDelay * Math.pow(backoffMultiplier, attempt),
        maxDelay
      );

      if (onRetry) {
        onRetry(lastError, attempt + 1);
      }

      console.warn(
        `Attempt ${attempt + 1}/${maxRetries} failed, retrying in ${delay}ms:`,
        lastError.message
      );

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw new Error(
    `Failed after ${maxRetries} attempts: ${lastError!.message}`
  );
}

/**
 * Deduplicate concurrent requests by key
 */
class RequestDeduplicator {
  private pendingRequests = new Map<string, Promise<any>>();

  async deduplicate<T>(key: string, fn: () => Promise<T>): Promise<T> {
    // Check if same request is already in flight
    if (this.pendingRequests.has(key)) {
      console.log(`♻️ Deduplicating request: ${key}`);
      return this.pendingRequests.get(key) as Promise<T>;
    }

    // Start new request
    const promise = fn().finally(() => {
      this.pendingRequests.delete(key);
    });

    this.pendingRequests.set(key, promise);
    return promise;
  }

  clear(key?: string) {
    if (key) {
      this.pendingRequests.delete(key);
    } else {
      this.pendingRequests.clear();
    }
  }
}

export const requestDeduplicator = new RequestDeduplicator();

/**
 * Validate and sanitize channel data
 */
export interface ChannelValidationResult {
  valid: boolean;
  errors: string[];
  sanitizedData?: any;
}

export function validateChannelData(data: any): ChannelValidationResult {
  const errors: string[] = [];
  const sanitized = { ...data };

  // ID validation
  if (!data.id || typeof data.id !== 'string' || data.id.length < 10) {
    errors.push('Invalid channel ID (must be string with 10+ characters)');
  }

  // Name validation
  if (!data.name || typeof data.name !== 'string') {
    errors.push('Channel name is required');
  } else {
    if (data.name.length < 3) {
      errors.push('Channel name too short (minimum 3 characters)');
    }
    if (data.name.length > 100) {
      errors.push('Channel name too long (maximum 100 characters)');
    }
    // Sanitize special characters
    sanitized.name = data.name.replace(/[<>"']/g, '');
  }

  // Description validation
  if (data.description) {
    if (typeof data.description !== 'string') {
      errors.push('Description must be a string');
    } else if (data.description.length > 5000) {
      errors.push('Description too long (maximum 5000 characters)');
    } else {
      // Sanitize
      sanitized.description = data.description.replace(/[<>"']/g, '');
    }
  }

  // Keywords validation
  if (data.keywords) {
    if (typeof data.keywords === 'string') {
      // Convert to array if string
      sanitized.keywords = data.keywords;
    } else if (!Array.isArray(data.keywords)) {
      errors.push('Keywords must be a string or array');
    }
  }

  // CPM validation
  if (data.cpm !== undefined) {
    if (typeof data.cpm !== 'number' || data.cpm < 0 || data.cpm > 100) {
      errors.push('CPM must be a number between 0 and 100');
    }
  }

  // Status validation
  if (data.status && !['active', 'inactive', 'pending'].includes(data.status)) {
    errors.push('Status must be active, inactive, or pending');
  }

  return {
    valid: errors.length === 0,
    errors,
    sanitizedData: errors.length === 0 ? sanitized : undefined,
  };
}

/**
 * Check for duplicate channel IDs
 */
export function checkDuplicateChannel(channelId: string, storageKey: string = 'youtube_channels'): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
    return existing.some((ch: any) => ch.id === channelId);
  } catch (error) {
    console.error('Failed to check for duplicate channel:', error);
    return false;
  }
}

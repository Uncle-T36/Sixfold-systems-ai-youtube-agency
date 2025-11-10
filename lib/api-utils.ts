/**
 * Robust API Utilities with Retry Logic and Error Recovery
 * Ensures the app never crashes from API failures
 */

interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  retryOn?: number[];
}

const defaultRetryOptions: Required<RetryOptions> = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
  retryOn: [408, 429, 500, 502, 503, 504]
};

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Calculate exponential backoff delay
 */
function getRetryDelay(attempt: number, options: Required<RetryOptions>): number {
  const delay = Math.min(
    options.baseDelay * Math.pow(options.backoffMultiplier, attempt),
    options.maxDelay
  );
  // Add jitter to prevent thundering herd
  return delay + Math.random() * 1000;
}

/**
 * Fetch with automatic retry and exponential backoff
 */
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retryOptions: RetryOptions = {}
): Promise<Response> {
  const opts = { ...defaultRetryOptions, ...retryOptions };
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        signal: options.signal || AbortSignal.timeout(30000) // 30s timeout
      });

      // If response is ok or not retryable, return it
      if (response.ok || !opts.retryOn.includes(response.status)) {
        return response;
      }

      // Store response for potential retry
      lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);

      // Don't retry on last attempt
      if (attempt === opts.maxRetries) {
        throw lastError;
      }

      const delay = getRetryDelay(attempt, opts);
      console.warn(`Request failed (attempt ${attempt + 1}/${opts.maxRetries + 1}). Retrying in ${Math.round(delay)}ms...`);
      await sleep(delay);

    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry on last attempt or non-retryable errors
      if (attempt === opts.maxRetries || error instanceof TypeError && error.message.includes('aborted')) {
        throw lastError;
      }

      const delay = getRetryDelay(attempt, opts);
      console.warn(`Request error (attempt ${attempt + 1}/${opts.maxRetries + 1}). Retrying in ${Math.round(delay)}ms...`, error);
      await sleep(delay);
    }
  }

  throw lastError || new Error('Request failed after all retries');
}

/**
 * Safe API call wrapper with error handling
 */
export async function safeApiCall<T>(
  apiCall: () => Promise<T>,
  fallbackValue: T,
  errorMessage = 'API call failed'
): Promise<T> {
  try {
    return await apiCall();
  } catch (error) {
    console.error(errorMessage, error);
    return fallbackValue;
  }
}

/**
 * Rate limiter for API calls
 */
class RateLimiter {
  private queue: Array<() => void> = [];
  private activeRequests = 0;
  private lastRequestTime = 0;

  constructor(
    private maxConcurrent: number = 5,
    private minInterval: number = 100 // ms between requests
  ) {}

  async acquire(): Promise<void> {
    while (this.activeRequests >= this.maxConcurrent) {
      await new Promise(resolve => this.queue.push(resolve as () => void));
    }

    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.minInterval) {
      await sleep(this.minInterval - timeSinceLastRequest);
    }

    this.activeRequests++;
    this.lastRequestTime = Date.now();
  }

  release(): void {
    this.activeRequests--;
    const next = this.queue.shift();
    if (next) next();
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    await this.acquire();
    try {
      return await fn();
    } finally {
      this.release();
    }
  }
}

// Global rate limiters for different services
export const groqLimiter = new RateLimiter(3, 500);
export const youtubeLimiter = new RateLimiter(5, 200);
export const generalLimiter = new RateLimiter(10, 100);

/**
 * Circuit breaker pattern to prevent cascading failures
 */
class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  constructor(
    private threshold: number = 5,
    private timeout: number = 60000 // 1 minute
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'half-open';
      } else {
        throw new Error('Circuit breaker is OPEN. Service temporarily unavailable.');
      }
    }

    try {
      const result = await fn();
      
      if (this.state === 'half-open') {
        this.state = 'closed';
        this.failures = 0;
      }
      
      return result;
    } catch (error) {
      this.failures++;
      this.lastFailureTime = Date.now();

      if (this.failures >= this.threshold) {
        this.state = 'open';
        console.error(`Circuit breaker opened after ${this.failures} failures`);
      }

      throw error;
    }
  }

  getState(): string {
    return this.state;
  }

  reset(): void {
    this.failures = 0;
    this.state = 'closed';
  }
}

export const groqCircuitBreaker = new CircuitBreaker(5, 60000);
export const youtubeCircuitBreaker = new CircuitBreaker(3, 120000);

/**
 * Validate request inputs to prevent crashes
 */
export function validateRequiredFields(
  data: Record<string, any>,
  requiredFields: string[]
): { valid: boolean; missing: string[] } {
  const missing = requiredFields.filter(field => {
    const value = data[field];
    return value === undefined || value === null || value === '';
  });

  return {
    valid: missing.length === 0,
    missing
  };
}

/**
 * Safe JSON parse with fallback
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

/**
 * Memory-safe array chunking
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Graceful degradation for optional features
 */
export async function tryFeature<T>(
  feature: () => Promise<T>,
  featureName: string
): Promise<T | null> {
  try {
    return await feature();
  } catch (error) {
    console.warn(`Optional feature "${featureName}" failed, continuing without it:`, error);
    return null;
  }
}

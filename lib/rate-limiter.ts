// API Rate Limiter and Concurrency Controller
// Prevents OOM by limiting concurrent operations

interface RateLimitConfig {
  maxConcurrent: number;
  minDelay: number; // ms between requests
  maxRetries: number;
}

class ConcurrencyController {
  private queue: Array<() => Promise<any>> = [];
  private running: number = 0;
  private maxConcurrent: number;
  private minDelay: number;
  private lastExecution: number = 0;

  constructor(maxConcurrent: number = 3, minDelay: number = 1000) {
    this.maxConcurrent = maxConcurrent;
    this.minDelay = minDelay;
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          // Enforce minimum delay between requests
          const now = Date.now();
          const timeSinceLastExecution = now - this.lastExecution;
          if (timeSinceLastExecution < this.minDelay) {
            await new Promise(r => setTimeout(r, this.minDelay - timeSinceLastExecution));
          }
          
          this.running++;
          const result = await fn();
          this.lastExecution = Date.now();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          this.running--;
          this.processQueue();
        }
      });
      
      this.processQueue();
    });
  }

  private processQueue() {
    while (this.running < this.maxConcurrent && this.queue.length > 0) {
      const task = this.queue.shift();
      if (task) task();
    }
  }

  getStats() {
    return {
      running: this.running,
      queued: this.queue.length,
      maxConcurrent: this.maxConcurrent
    };
  }
}

// Global rate limiters for different APIs
export const apiLimiters = {
  youtube: new ConcurrencyController(3, 1000), // 3 concurrent, 1s delay
  unsplash: new ConcurrencyController(2, 2000), // 2 concurrent, 2s delay
  pexels: new ConcurrencyController(2, 1500), // 2 concurrent, 1.5s delay
  copilot: new ConcurrencyController(2, 2000), // 2 concurrent, 2s delay
  videoGeneration: new ConcurrencyController(1, 5000), // 1 at a time, 5s delay
};

// Wrapper for API calls with automatic rate limiting
export async function rateLimitedApiCall<T>(
  apiName: keyof typeof apiLimiters,
  fn: () => Promise<T>,
  retries: number = 3
): Promise<T> {
  const limiter = apiLimiters[apiName];
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await limiter.execute(fn);
    } catch (error) {
      if (attempt === retries) throw error;
      
      // Exponential backoff
      const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
      console.log(`⏸️  Retry ${attempt}/${retries} for ${apiName} after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error(`Failed after ${retries} retries`);
}

// Get stats for all limiters
export function getAllLimiterStats() {
  return Object.entries(apiLimiters).map(([name, limiter]) => ({
    api: name,
    ...limiter.getStats()
  }));
}

export default ConcurrencyController;
// Memory Management Utility
// Prevents OOM errors by monitoring and controlling memory usage

class MemoryManager {
  private maxMemoryMB: number;
  private checkInterval: NodeJS.Timeout | null = null;
  private warningThreshold: number = 0.8; // 80%
  private criticalThreshold: number = 0.9; // 90%

  constructor(maxMemoryMB: number = 4096) {
    this.maxMemoryMB = maxMemoryMB;
  }

  // Get current memory usage
  getMemoryUsage(): {
    usedMB: number;
    totalMB: number;
    percentUsed: number;
    heapUsed: number;
    heapTotal: number;
    rss: number;
  } {
    const usage = process.memoryUsage();
    const usedMB = Math.round(usage.heapUsed / 1024 / 1024);
    const totalMB = Math.round(usage.heapTotal / 1024 / 1024);
    const percentUsed = (usedMB / this.maxMemoryMB) * 100;

    return {
      usedMB,
      totalMB,
      percentUsed: Math.round(percentUsed * 100) / 100,
      heapUsed: usage.heapUsed,
      heapTotal: usage.heapTotal,
      rss: usage.rss
    };
  }

  // Check if we have enough memory for an operation
  canAllocate(estimatedMB: number): boolean {
    const current = this.getMemoryUsage();
    const projectedUsage = (current.usedMB + estimatedMB) / this.maxMemoryMB;
    return projectedUsage < this.criticalThreshold;
  }

  // Force garbage collection if available
  async forceGC(): Promise<void> {
    if (global.gc) {
      global.gc();
      console.log('🧹 Garbage collection triggered');
      
      // Wait a bit for GC to complete
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  // Clear memory by releasing large objects
  async clearMemory(): Promise<void> {
    await this.forceGC();
    
    // Log memory state
    const usage = this.getMemoryUsage();
    console.log(`💾 Memory after cleanup: ${usage.usedMB}MB / ${this.maxMemoryMB}MB (${usage.percentUsed}%)`);
  }

  // Start monitoring memory usage
  startMonitoring(intervalMs: number = 30000): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    this.checkInterval = setInterval(() => {
      const usage = this.getMemoryUsage();
      
      if (usage.percentUsed >= this.criticalThreshold * 100) {
        console.error(`🚨 CRITICAL: Memory usage at ${usage.percentUsed}% (${usage.usedMB}MB)`);
        this.forceGC();
      } else if (usage.percentUsed >= this.warningThreshold * 100) {
        console.warn(`⚠️  WARNING: Memory usage at ${usage.percentUsed}% (${usage.usedMB}MB)`);
      }
    }, intervalMs);

    console.log(`👁️  Memory monitoring started (checking every ${intervalMs}ms)`);
  }

  // Stop monitoring
  stopMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
      console.log('🛑 Memory monitoring stopped');
    }
  }

  // Process items in batches to avoid memory spikes
  async processBatch<T, R>(
    items: T[],
    processor: (item: T) => Promise<R>,
    batchSize: number = 3,
    delayMs: number = 1000
  ): Promise<R[]> {
    const results: R[] = [];
    
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      
      // Check memory before processing batch
      if (!this.canAllocate(100)) { // Assume 100MB per batch
        console.log('⏸️  Pausing for memory cleanup...');
        await this.clearMemory();
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      console.log(`📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(items.length / batchSize)}`);
      
      // Process batch in parallel
      const batchResults = await Promise.all(
        batch.map(item => processor(item))
      );
      
      results.push(...batchResults);
      
      // Clear memory between batches
      if (i + batchSize < items.length) {
        await this.clearMemory();
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
    
    return results;
  }

  // Stream processor for large data
  async streamProcess<T, R>(
    items: T[],
    processor: (item: T) => Promise<R>,
    concurrency: number = 2
  ): Promise<R[]> {
    const results: R[] = [];
    const queue = [...items];
    const inProgress = new Set<Promise<R>>();

    while (queue.length > 0 || inProgress.size > 0) {
      // Check memory health
      const usage = this.getMemoryUsage();
      if (usage.percentUsed > this.warningThreshold * 100) {
        console.log('⏸️  Memory high, pausing processing...');
        await this.clearMemory();
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }

      // Fill up to concurrency limit
      while (queue.length > 0 && inProgress.size < concurrency) {
        const item = queue.shift()!;
        const promise = processor(item)
          .then(result => {
            inProgress.delete(promise);
            return result;
          })
          .catch(error => {
            inProgress.delete(promise);
            throw error;
          });
        
        inProgress.add(promise);
      }

      // Wait for one to complete
      if (inProgress.size > 0) {
        const result = await Promise.race(inProgress);
        results.push(result);
      }
    }

    return results;
  }

  // Get memory statistics
  getStats(): string {
    const usage = this.getMemoryUsage();
    return `
📊 Memory Statistics:
   Used: ${usage.usedMB}MB / ${this.maxMemoryMB}MB
   Percentage: ${usage.percentUsed}%
   Heap: ${Math.round(usage.heapUsed / 1024 / 1024)}MB / ${Math.round(usage.heapTotal / 1024 / 1024)}MB
   RSS: ${Math.round(usage.rss / 1024 / 1024)}MB
   Status: ${usage.percentUsed < 70 ? '✅ Healthy' : usage.percentUsed < 85 ? '⚠️  Warning' : '🚨 Critical'}
    `.trim();
  }
}

// Singleton instance
let memoryManagerInstance: MemoryManager | null = null;

export function getMemoryManager(): MemoryManager {
  if (!memoryManagerInstance) {
    memoryManagerInstance = new MemoryManager();
    memoryManagerInstance.startMonitoring();
  }
  return memoryManagerInstance;
}

// Export for direct use
export default MemoryManager;
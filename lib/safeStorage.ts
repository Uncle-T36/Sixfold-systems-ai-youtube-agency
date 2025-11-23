/**
 * Safe localStorage wrapper with SSR protection and quota management
 */

class SafeStorageManager {
  private locks = new Map<string, Promise<void>>();
  private readonly MAX_SIZE = 4.5 * 1024 * 1024; // 4.5MB safe limit

  /**
   * Check if we're in a browser environment
   */
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  /**
   * Get current localStorage usage in bytes
   */
  getCurrentSize(): number {
    if (!this.isBrowser()) return 0;
    
    let total = 0;
    try {
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length + key.length;
        }
      }
    } catch (error) {
      console.warn('Failed to calculate storage size:', error);
    }
    return total;
  }

  /**
   * Get remaining storage space in bytes
   */
  getRemainingSpace(): number {
    return this.MAX_SIZE - this.getCurrentSize();
  }

  /**
   * Check if data can be stored
   */
  canStore(data: string): boolean {
    return data.length < this.getRemainingSpace();
  }

  /**
   * Clean up old/unnecessary data
   */
  cleanup(): void {
    if (!this.isBrowser()) return;

    try {
      // Remove old notifications (>30 days)
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      const filtered = notifications.filter((n: any) => {
        if (!n.timestamp) return false;
        const age = Date.now() - new Date(n.timestamp).getTime();
        return age < 30 * 24 * 60 * 60 * 1000; // 30 days
      });
      localStorage.setItem('notifications', JSON.stringify(filtered));

      // Remove old activity feed (keep last 100)
      const activities = JSON.parse(localStorage.getItem('activity_feed') || '[]');
      const recentActivities = activities.slice(0, 100);
      localStorage.setItem('activity_feed', JSON.stringify(recentActivities));

      // Remove cache entries
      for (let key in localStorage) {
        if (key.startsWith('cache_') || key.startsWith('temp_')) {
          localStorage.removeItem(key);
        }
      }

      console.log('✅ Storage cleanup complete');
    } catch (error) {
      console.warn('Storage cleanup failed:', error);
    }
  }

  /**
   * Acquire lock for a key
   */
  private async acquireLock(key: string): Promise<() => void> {
    // Wait for existing lock
    while (this.locks.has(key)) {
      await this.locks.get(key);
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    // Create new lock
    let releaseFn: () => void;
    const lockPromise = new Promise<void>(resolve => {
      releaseFn = resolve;
    });

    this.locks.set(key, lockPromise);

    // Auto-release after 5 seconds to prevent deadlock
    setTimeout(() => {
      if (this.locks.get(key) === lockPromise) {
        this.locks.delete(key);
        releaseFn();
      }
    }, 5000);

    return () => {
      this.locks.delete(key);
      releaseFn();
    };
  }

  /**
   * Safely get item from localStorage
   */
  async getItem(key: string): Promise<string | null> {
    if (!this.isBrowser()) {
      console.warn(`getItem called in SSR context for key: ${key}`);
      return null;
    }

    const release = await this.acquireLock(key);
    try {
      return localStorage.getItem(key);
    } finally {
      release();
    }
  }

  /**
   * Safely set item in localStorage with quota management
   */
  async setItem(key: string, value: string): Promise<boolean> {
    if (!this.isBrowser()) {
      console.warn(`setItem called in SSR context for key: ${key}`);
      return false;
    }

    // Check quota
    if (!this.canStore(value)) {
      console.warn('Storage quota low, cleaning up...');
      this.cleanup();

      // Try again after cleanup
      if (!this.canStore(value)) {
        console.error('Storage quota exceeded even after cleanup');
        alert('⚠️ Storage full! Please export your data and clear old entries.');
        return false;
      }
    }

    const release = await this.acquireLock(key);
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error: any) {
      if (error.name === 'QuotaExceededError') {
        console.warn('QuotaExceededError, attempting cleanup...');
        this.cleanup();
        
        try {
          localStorage.setItem(key, value);
          return true;
        } catch (e) {
          console.error('Failed to store data even after cleanup:', e);
          alert('⚠️ Storage quota exceeded. Please export and clear old data.');
          return false;
        }
      }
      console.error('Failed to set localStorage item:', error);
      return false;
    } finally {
      release();
    }
  }

  /**
   * Safely remove item from localStorage
   */
  async removeItem(key: string): Promise<void> {
    if (!this.isBrowser()) return;

    const release = await this.acquireLock(key);
    try {
      localStorage.removeItem(key);
    } finally {
      release();
    }
  }

  /**
   * Synchronous version for compatibility (with SSR check)
   */
  getItemSync(key: string): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(key);
  }

  /**
   * Synchronous version for compatibility (with SSR check)
   */
  setItemSync(key: string, value: string): boolean {
    if (!this.isBrowser()) return false;
    
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error: any) {
      if (error.name === 'QuotaExceededError') {
        this.cleanup();
        try {
          localStorage.setItem(key, value);
          return true;
        } catch (e) {
          console.error('Storage quota exceeded:', e);
          return false;
        }
      }
      console.error('Failed to set localStorage item:', error);
      return false;
    }
  }
}

export const safeStorage = new SafeStorageManager();

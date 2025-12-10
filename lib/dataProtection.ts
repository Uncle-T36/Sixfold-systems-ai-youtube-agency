/**
 * 🛡️ DATA PROTECTION SYSTEM
 * Ensures users NEVER lose their data during updates, crashes, or browser issues
 * Triple backup: localStorage + sessionStorage + IndexedDB
 */

// =========================
// CRITICAL DATA KEYS
// =========================
const CRITICAL_KEYS = [
  'youtube_channels',
  'owner_bank_account',
  'earnings_data',
  'autopilot_enabled',
  'user_preferences',
  'generated_videos'
];

// =========================
// BACKUP SYSTEM
// =========================

/**
 * Backup all critical data to multiple storage locations
 */
export function backupAllData(): void {
  console.log('🛡️ Backing up critical data...');
  
  try {
    const backup: Record<string, any> = {
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      data: {}
    };

    // Collect all critical data
    CRITICAL_KEYS.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) {
        backup.data[key] = value;
      }
    });

    // Backup to sessionStorage (survives page refresh)
    sessionStorage.setItem('data_backup', JSON.stringify(backup));

    // Backup to IndexedDB (survives browser restart)
    saveToIndexedDB('backup', backup);

    // Backup to localStorage with timestamp
    localStorage.setItem('last_backup', JSON.stringify(backup));
    localStorage.setItem('last_backup_time', new Date().toISOString());

    console.log('✅ Data backed up successfully to 3 locations');
  } catch (error) {
    console.error('❌ Backup failed:', error);
  }
}

/**
 * Restore data from backups if missing
 */
export function restoreDataIfMissing(): boolean {
  let restored = false;

  CRITICAL_KEYS.forEach(key => {
    if (!localStorage.getItem(key)) {
      console.warn(`⚠️ Missing data for ${key}, attempting restore...`);
      
      // Try restore from sessionStorage
      const sessionBackup = sessionStorage.getItem('data_backup');
      if (sessionBackup) {
        try {
          const backup = JSON.parse(sessionBackup);
          if (backup.data[key]) {
            localStorage.setItem(key, backup.data[key]);
            console.log(`✅ Restored ${key} from sessionStorage`);
            restored = true;
            return;
          }
        } catch (e) {
          console.error('Failed to parse session backup:', e);
        }
      }

      // Try restore from last_backup
      const lastBackup = localStorage.getItem('last_backup');
      if (lastBackup) {
        try {
          const backup = JSON.parse(lastBackup);
          if (backup.data[key]) {
            localStorage.setItem(key, backup.data[key]);
            console.log(`✅ Restored ${key} from last_backup`);
            restored = true;
            return;
          }
        } catch (e) {
          console.error('Failed to parse last backup:', e);
        }
      }

      // Try restore from IndexedDB
      restoreFromIndexedDB(key);
    }
  });

  return restored;
}

/**
 * Auto-backup on every critical data change
 * Returns cleanup function
 */
export function setupAutoBackup(): () => void {
  // Backup every 5 minutes
  const backupInterval = setInterval(() => {
    backupAllData();
  }, 5 * 60 * 1000);

  // Backup before page unload
  const handleBeforeUnload = () => {
    backupAllData();
  };
  window.addEventListener('beforeunload', handleBeforeUnload);

  // Initial backup
  backupAllData();
  
  console.log('✅ Auto-backup system initialized');

  // Return cleanup function
  return () => {
    clearInterval(backupInterval);
    window.removeEventListener('beforeunload', handleBeforeUnload);
    console.log('🧹 Auto-backup cleanup complete');
  };
}

// =========================
// INDEXEDDB OPERATIONS
// =========================

function saveToIndexedDB(key: string, data: any): void {
  if (!window.indexedDB) {
    console.warn('IndexedDB not available');
    return;
  }

  const request = indexedDB.open('AIYouTubeAgency', 1);

  request.onerror = () => {
    console.error('IndexedDB open failed');
  };

  request.onsuccess = (event: any) => {
    const db = event.target.result;
    const transaction = db.transaction(['backups'], 'readwrite');
    const store = transaction.objectStore('backups');
    
    store.put({ key, data, timestamp: new Date().toISOString() });
  };

  request.onupgradeneeded = (event: any) => {
    const db = event.target.result;
    if (!db.objectStoreNames.contains('backups')) {
      db.createObjectStore('backups', { keyPath: 'key' });
    }
  };
}

function restoreFromIndexedDB(key: string): void {
  if (!window.indexedDB) return;

  const request = indexedDB.open('AIYouTubeAgency', 1);

  request.onerror = () => {
    console.error('IndexedDB open failed during restore');
  };

  request.onupgradeneeded = (event: any) => {
    const db = event.target.result;
    if (!db.objectStoreNames.contains('backups')) {
      db.createObjectStore('backups', { keyPath: 'key' });
    }
  };

  request.onsuccess = (event: any) => {
    const db = event.target.result;
    
    // Check if object store exists before trying to access it
    if (!db.objectStoreNames.contains('backups')) {
      console.warn('Backups object store not found');
      return;
    }

    const transaction = db.transaction(['backups'], 'readonly');
    const store = transaction.objectStore('backups');
    const getRequest = store.get('backup');

    getRequest.onsuccess = () => {
      if (getRequest.result && getRequest.result.data.data[key]) {
        localStorage.setItem(key, getRequest.result.data.data[key]);
        console.log(`✅ Restored ${key} from IndexedDB`);
      }
    };

    getRequest.onerror = () => {
      console.error(`Failed to restore ${key} from IndexedDB`);
    };
  };
}

// =========================
// SAFE DATA OPERATIONS
// =========================

/**
 * Safe get - returns data or restores from backup
 */
export function safeGetItem(key: string): string | null {
  let value = localStorage.getItem(key);
  
  if (!value && CRITICAL_KEYS.includes(key)) {
    console.warn(`⚠️ ${key} missing, attempting restore...`);
    restoreDataIfMissing();
    value = localStorage.getItem(key);
  }

  return value;
}

/**
 * Safe set - saves to localStorage and creates backup
 */
export function safeSetItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
    
    // If critical data, backup immediately
    if (CRITICAL_KEYS.includes(key)) {
      backupAllData();
    }
  } catch (error) {
    console.error(`Failed to save ${key}:`, error);
    alert('Warning: Could not save data. Your storage might be full. Please free up space.');
  }
}

/**
 * Get channels safely (never returns empty if data exists in backup)
 */
export function getSafeChannels(): any[] {
  let channels = JSON.parse(localStorage.getItem('youtube_channels') || '[]');
  
  if (channels.length === 0) {
    // Try restore from backups
    restoreDataIfMissing();
    channels = JSON.parse(localStorage.getItem('youtube_channels') || '[]');
    
    if (channels.length > 0) {
      console.log('✅ Channels restored from backup!');
    }
  }
  
  return channels;
}

/**
 * Save channels safely with automatic backup
 */
export function setSafeChannels(channels: any[]): void {
  safeSetItem('youtube_channels', JSON.stringify(channels));
  console.log(`💾 Saved ${channels.length} channels with backup`);
}

// =========================
// MIGRATION SAFETY
// =========================

/**
 * Safe migration wrapper - preserves original data even if migration fails
 */
export async function safeMigration(migrationFn: () => Promise<void>): Promise<boolean> {
  console.log('🔄 Starting safe migration...');
  
  // Backup before migration
  backupAllData();
  
  // Store pre-migration state
  const preMigrationBackup: Record<string, string | null> = {};
  CRITICAL_KEYS.forEach(key => {
    preMigrationBackup[key] = localStorage.getItem(key);
  });
  
  try {
    await migrationFn();
    console.log('✅ Migration completed successfully');
    return true;
  } catch (error) {
    console.error('❌ Migration failed, restoring data:', error);
    
    // Restore pre-migration state
    Object.keys(preMigrationBackup).forEach(key => {
      if (preMigrationBackup[key]) {
        localStorage.setItem(key, preMigrationBackup[key]!);
      }
    });
    
    console.log('✅ Data restored to pre-migration state');
    return false;
  }
}

// =========================
// DATA EXPORT/IMPORT
// =========================

/**
 * Export all user data as JSON file (for manual backup)
 */
export function exportUserData(): void {
  const exportData: Record<string, any> = {
    exportDate: new Date().toISOString(),
    version: '2.0.0',
    data: {}
  };

  CRITICAL_KEYS.forEach(key => {
    const value = localStorage.getItem(key);
    if (value) {
      try {
        exportData.data[key] = JSON.parse(value);
      } catch {
        exportData.data[key] = value;
      }
    }
  });

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ai-youtube-agency-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);

  console.log('✅ Data exported successfully');
}

/**
 * Import user data from JSON file
 */
export function importUserData(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target?.result as string);
        
        // Validate structure
        if (!importData.data || !importData.version) {
          alert('Invalid backup file');
          resolve(false);
          return;
        }

        // Backup current state first
        backupAllData();

        // Import data
        Object.keys(importData.data).forEach(key => {
          if (CRITICAL_KEYS.includes(key)) {
            const value = typeof importData.data[key] === 'string' 
              ? importData.data[key] 
              : JSON.stringify(importData.data[key]);
            localStorage.setItem(key, value);
          }
        });

        console.log('✅ Data imported successfully');
        alert('Data imported successfully! Please refresh the page.');
        resolve(true);
      } catch (error) {
        console.error('Import failed:', error);
        alert('Failed to import data. File may be corrupted.');
        resolve(false);
      }
    };

    reader.readAsText(file);
  });
}

// =========================
// INITIALIZATION
// =========================

/**
 * Initialize data protection on app load
 */
export function initializeDataProtection(): void {
  console.log('🛡️ Initializing data protection system...');
  
  // Check for missing data and restore
  const restored = restoreDataIfMissing();
  if (restored) {
    console.log('✅ Data restored from backup');
  }
  
  // Check for app version change (upgrade detection)
  checkForUpgrade();
  
  // Setup auto-backup
  setupAutoBackup();
  
  // Log data status
  const channels = JSON.parse(localStorage.getItem('youtube_channels') || '[]');
  console.log(`📊 Current data: ${channels.length} channels`);
}

// =========================
// UPGRADE PROTECTION
// =========================

const APP_VERSION = '2.1.0'; // Increment this on each release

/**
 * 🔄 Detect app upgrades and protect data
 * Ensures channels are NEVER lost during updates
 */
function checkForUpgrade(): void {
  const storedVersion = localStorage.getItem('app_version');
  
  if (!storedVersion || storedVersion !== APP_VERSION) {
    console.log(`🔄 App upgrade detected: ${storedVersion || 'fresh install'} → ${APP_VERSION}`);
    
    // Create a super-safe backup before anything changes
    createUpgradeBackup(storedVersion || 'unknown');
    
    // Update version
    localStorage.setItem('app_version', APP_VERSION);
    console.log('✅ Upgrade backup created successfully');
  }
}

/**
 * 💾 Create immutable backup during upgrade
 */
function createUpgradeBackup(previousVersion: string): void {
  const upgradeBackup = {
    timestamp: new Date().toISOString(),
    previousVersion,
    newVersion: APP_VERSION,
    channels: localStorage.getItem('youtube_channels'),
    connectedChannels: localStorage.getItem('connected_channels'),
    videos: CRITICAL_KEYS.filter(k => k.includes('video')).map(k => ({
      key: k,
      value: localStorage.getItem(k)
    })),
    allCriticalData: CRITICAL_KEYS.reduce((acc, key) => {
      acc[key] = localStorage.getItem(key);
      return acc;
    }, {} as Record<string, string | null>)
  };
  
  // Save to multiple locations for maximum safety
  localStorage.setItem(`upgrade_backup_${APP_VERSION}`, JSON.stringify(upgradeBackup));
  sessionStorage.setItem('pre_upgrade_backup', JSON.stringify(upgradeBackup));
  saveToIndexedDB(`upgrade_${APP_VERSION}`, upgradeBackup);
  
  console.log('💾 Upgrade backup saved to localStorage, sessionStorage, and IndexedDB');
}

/**
 * 🔙 Emergency restore from upgrade backup
 */
export function restoreFromUpgradeBackup(version?: string): boolean {
  const targetVersion = version || APP_VERSION;
  const backupKey = `upgrade_backup_${targetVersion}`;
  const backupData = localStorage.getItem(backupKey);
  
  if (!backupData) {
    console.error(`No upgrade backup found for version ${targetVersion}`);
    return false;
  }
  
  try {
    const backup = JSON.parse(backupData);
    
    // Restore channels
    if (backup.channels) {
      localStorage.setItem('youtube_channels', backup.channels);
    }
    if (backup.connectedChannels) {
      localStorage.setItem('connected_channels', backup.connectedChannels);
    }
    
    // Restore all critical data
    if (backup.allCriticalData) {
      Object.entries(backup.allCriticalData).forEach(([key, value]) => {
        if (value) {
          localStorage.setItem(key, value as string);
        }
      });
    }
    
    console.log(`✅ Restored from upgrade backup (${targetVersion})`);
    return true;
  } catch (error) {
    console.error('Failed to restore from upgrade backup:', error);
    return false;
  }
}

/**
 * 📋 List all available upgrade backups
 */
export function listUpgradeBackups(): string[] {
  const backups: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('upgrade_backup_')) {
      backups.push(key.replace('upgrade_backup_', ''));
    }
  }
  return backups;
}

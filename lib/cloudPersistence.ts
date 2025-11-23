/**
 * 🌐 CLOUD DATA PERSISTENCE
 * Syncs localStorage data across all Vercel deployments
 * Uses GitHub Gist as free cloud storage (no database needed!)
 */

interface CloudBackup {
  timestamp: string;
  version: string;
  deploymentUrl: string;
  data: Record<string, any>;
}

// 🔑 Your GitHub Personal Access Token (create at: https://github.com/settings/tokens)
// Permissions needed: gist (create/edit gists)
const GITHUB_TOKEN = typeof window !== 'undefined' ? localStorage.getItem('github_backup_token') : null;
const GIST_ID = typeof window !== 'undefined' ? localStorage.getItem('gist_backup_id') : null;

// Critical data to sync across deployments
const CRITICAL_DATA_KEYS = [
  'youtube_channels',
  'series_channels',
  'generated_videos',
  'owner_bank_account',
  'earnings_data',
  'autopilot_enabled',
  'user_preferences',
  'system_settings',
  'owner_password',
  'owner_authenticated',
  'admin_authenticated',
  'scraped_real_stories'
];

/**
 * 💾 SAVE TO CLOUD - Upload data to GitHub Gist
 */
export async function saveToCloud(): Promise<boolean> {
  if (!GITHUB_TOKEN) {
    console.warn('⚠️ No GitHub token set. Data will only be stored locally.');
    return false;
  }

  try {
    // Collect all critical data
    const backup: CloudBackup = {
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      deploymentUrl: window.location.origin,
      data: {}
    };

    CRITICAL_DATA_KEYS.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) {
        backup.data[key] = value;
      }
    });

    const gistData = {
      description: 'SixFold Systems - AI YouTube Agency Data Backup',
      public: false,
      files: {
        'backup.json': {
          content: JSON.stringify(backup, null, 2)
        }
      }
    };

    let response;
    
    if (GIST_ID) {
      // Update existing gist
      response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(gistData)
      });
    } else {
      // Create new gist
      response = await fetch('https://api.github.com/gists', {
        method: 'POST',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(gistData)
      });
    }

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const result = await response.json();
    
    // Save gist ID for future updates
    if (!GIST_ID && result.id) {
      localStorage.setItem('gist_backup_id', result.id);
    }

    console.log('✅ Data saved to cloud successfully!');
    console.log(`📍 Backup URL: ${result.html_url}`);
    
    return true;
  } catch (error) {
    console.error('❌ Cloud save failed:', error);
    return false;
  }
}

/**
 * 📥 LOAD FROM CLOUD - Download data from GitHub Gist
 */
export async function loadFromCloud(): Promise<boolean> {
  if (!GITHUB_TOKEN || !GIST_ID) {
    console.warn('⚠️ No backup found in cloud. Using local data.');
    return false;
  }

  try {
    const response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const gist = await response.json();
    const backupContent = gist.files['backup.json']?.content;

    if (!backupContent) {
      throw new Error('No backup data found in gist');
    }

    const backup: CloudBackup = JSON.parse(backupContent);

    // Restore all data
    Object.entries(backup.data).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });

    console.log('✅ Data restored from cloud successfully!');
    console.log(`📅 Backup from: ${new Date(backup.timestamp).toLocaleString()}`);
    console.log(`🌐 Original deployment: ${backup.deploymentUrl}`);

    return true;
  } catch (error) {
    console.error('❌ Cloud load failed:', error);
    return false;
  }
}

/**
 * 🔄 AUTO-SYNC - Automatically save to cloud on data changes
 * Returns cleanup function
 */
export function enableAutoSync(): (() => void) | void {
  if (!GITHUB_TOKEN) {
    console.warn('⚠️ Cloud sync disabled. Set GitHub token to enable.');
    return;
  }

  // Save to cloud every 5 minutes
  const syncInterval = setInterval(() => {
    saveToCloud();
  }, 5 * 60 * 1000);

  // Save to cloud before page unload
  const handleBeforeUnload = () => {
    saveToCloud();
  };
  window.addEventListener('beforeunload', handleBeforeUnload);

  // Save to cloud when visibility changes (tab switch)
  const handleVisibilityChange = () => {
    if (document.hidden) {
      saveToCloud();
    }
  };
  document.addEventListener('visibilitychange', handleVisibilityChange);

  console.log('✅ Auto-sync enabled - Data will be saved to cloud automatically');

  // Return cleanup function
  return () => {
    clearInterval(syncInterval);
    window.removeEventListener('beforeunload', handleBeforeUnload);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    console.log('🧹 Cloud persistence cleanup complete');
  };
}

/**
 * 🔧 SETUP CLOUD BACKUP - Initialize with GitHub token
 */
export function setupCloudBackup(githubToken: string): boolean {
  try {
    localStorage.setItem('github_backup_token', githubToken);
    console.log('✅ GitHub token saved. Cloud backup is now active!');
    console.log('💡 Your data will sync automatically across all deployments.');
    return true;
  } catch (error) {
    console.error('❌ Failed to setup cloud backup:', error);
    return false;
  }
}

/**
 * 📊 CHECK BACKUP STATUS
 */
export function getBackupStatus(): {
  hasToken: boolean;
  hasGist: boolean;
  lastSync?: string;
  autoSyncEnabled: boolean;
} {
  return {
    hasToken: !!GITHUB_TOKEN,
    hasGist: !!GIST_ID,
    lastSync: localStorage.getItem('last_cloud_sync') || undefined,
    autoSyncEnabled: !!GITHUB_TOKEN
  };
}

/**
 * 🔄 SMART MIGRATION - Auto-detect and restore from cloud on new deployment
 */
export async function smartMigration(): Promise<void> {
  const currentUrl = window.location.origin;
  const lastUrl = localStorage.getItem('last_deployment_url');

  // Check if this is a new deployment
  if (lastUrl && lastUrl !== currentUrl) {
    console.log('🔄 New deployment detected!');
    console.log(`📍 Previous: ${lastUrl}`);
    console.log(`📍 Current: ${currentUrl}`);
    
    // Check if we have local data
    const hasLocalData = localStorage.getItem('youtube_channels');
    
    if (!hasLocalData) {
      console.log('⚠️ No local data found. Attempting cloud restore...');
      
      const restored = await loadFromCloud();
      
      if (restored) {
        alert('✅ DATA RESTORED!\n\nYour channels and settings have been automatically restored from cloud backup!');
      } else {
        console.warn('⚠️ No cloud backup available. This might be your first deployment.');
      }
    }
  }

  // Save current deployment URL
  localStorage.setItem('last_deployment_url', currentUrl);
}

/**
 * 💾 EXPORT DATA - Download as JSON file (manual backup)
 */
export function exportDataToFile(): void {
  const backup: CloudBackup = {
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    deploymentUrl: window.location.origin,
    data: {}
  };

  CRITICAL_DATA_KEYS.forEach(key => {
    const value = localStorage.getItem(key);
    if (value) {
      backup.data[key] = value;
    }
  });

  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sixfold-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  console.log('✅ Data exported to file successfully!');
}

/**
 * 📥 IMPORT DATA - Upload from JSON file (manual restore)
 */
export function importDataFromFile(file: File): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const backup: CloudBackup = JSON.parse(e.target?.result as string);
        
        // Validate backup format
        if (!backup.data || !backup.timestamp) {
          throw new Error('Invalid backup file format');
        }

        // Restore all data
        Object.entries(backup.data).forEach(([key, value]) => {
          localStorage.setItem(key, value);
        });

        console.log('✅ Data imported successfully!');
        resolve(true);
      } catch (error) {
        console.error('❌ Import failed:', error);
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}

/**
 * 🚀 INITIALIZE - Run on app startup
 */
export async function initializeCloudPersistence(): Promise<void> {
  console.log('🌐 Initializing cloud persistence...');
  
  // Run smart migration
  await smartMigration();
  
  // Enable auto-sync if token is present
  if (GITHUB_TOKEN) {
    enableAutoSync();
  }
  
  console.log('✅ Cloud persistence initialized');
}

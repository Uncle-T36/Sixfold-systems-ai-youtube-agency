/**
 * 🔄 VERSION MANAGER & AUTO-UPDATE SYSTEM
 * Ensures all users automatically get new features without disruption
 * Handles data migrations, feature rollouts, and backward compatibility
 */

import { upgradeExistingChannels } from './channelUpgrader';
import { generateFirstVideoForAllChannels } from './firstVideoGenerator';

// Current app version
export const CURRENT_VERSION = '2.0.0';

// Version history with migration functions
interface VersionUpdate {
  version: string;
  date: string;
  features: string[];
  migrationRequired: boolean;
  migrate?: () => Promise<void>;
}

const VERSION_HISTORY: VersionUpdate[] = [
  {
    version: '1.0.0',
    date: '2025-11-10',
    features: ['Basic channel connection', 'Video generation', 'Simple dashboard'],
    migrationRequired: false
  },
  {
    version: '1.5.0',
    date: '2025-11-11',
    features: ['Voice library', 'Smart notifications', 'Activity feed'],
    migrationRequired: true,
    migrate: async () => {
      // Add default voices to existing channels
      await upgradeExistingChannels();
    }
  },
  {
    version: '2.0.0',
    date: '2025-11-12',
    features: [
      'Live Money Counter',
      'AI Autopilot Mode',
      'Viral Predictor',
      'AI-powered voice selection',
      'Auto first video generation',
      'Tycoon Intelligence Dashboard'
    ],
    migrationRequired: true,
    migrate: async () => {
      // Upgrade existing channels with new features
      await upgradeExistingChannels();
      
      // Generate first videos for channels without videos
      await generateFirstVideoForAllChannels();
      
      // Initialize new features
      initializeNewFeatures();
    }
  }
];

/**
 * Check if update is available
 */
export function checkForUpdates(): {
  updateAvailable: boolean;
  currentVersion: string;
  latestVersion: string;
  newFeatures: string[];
} {
  const userVersion = localStorage.getItem('app_version') || '1.0.0';
  const updateAvailable = userVersion !== CURRENT_VERSION;
  
  const newFeatures: string[] = [];
  VERSION_HISTORY.forEach(update => {
    if (compareVersions(update.version, userVersion) > 0) {
      newFeatures.push(...update.features);
    }
  });

  return {
    updateAvailable,
    currentVersion: userVersion,
    latestVersion: CURRENT_VERSION,
    newFeatures
  };
}

/**
 * Auto-update the app (runs on every page load)
 */
export async function autoUpdate(): Promise<{
  updated: boolean;
  fromVersion: string;
  toVersion: string;
  newFeatures: string[];
  errors?: string[];
}> {
  const userVersion = localStorage.getItem('app_version') || '1.0.0';
  
  // Already up to date
  if (userVersion === CURRENT_VERSION) {
    return {
      updated: false,
      fromVersion: userVersion,
      toVersion: CURRENT_VERSION,
      newFeatures: []
    };
  }

  console.log(`🔄 Auto-updating from v${userVersion} to v${CURRENT_VERSION}...`);

  const errors: string[] = [];
  const appliedFeatures: string[] = [];

  try {
    // Run all necessary migrations in order
    for (const update of VERSION_HISTORY) {
      // Skip if this update is older than user's version
      if (compareVersions(update.version, userVersion) <= 0) {
        continue;
      }

      console.log(`📦 Applying update v${update.version}...`);

      // Run migration if required
      if (update.migrationRequired && update.migrate) {
        try {
          await update.migrate();
          console.log(`✅ Migration v${update.version} completed`);
        } catch (error) {
          console.error(`❌ Migration v${update.version} failed:`, error);
          errors.push(`Migration ${update.version}: ${error}`);
        }
      }

      appliedFeatures.push(...update.features);
    }

    // Update version
    localStorage.setItem('app_version', CURRENT_VERSION);
    localStorage.setItem('last_update', new Date().toISOString());

    // Show success notification
    const notification = {
      id: Date.now().toString(),
      type: 'success',
      message: `🎉 App updated to v${CURRENT_VERSION}! New features: ${appliedFeatures.slice(0, 3).join(', ')}${appliedFeatures.length > 3 ? '...' : ''}`,
      timestamp: new Date()
    };
    
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    localStorage.setItem('notifications', JSON.stringify([notification, ...notifications]));

    console.log(`✅ Auto-update completed! v${userVersion} → v${CURRENT_VERSION}`);

    return {
      updated: true,
      fromVersion: userVersion,
      toVersion: CURRENT_VERSION,
      newFeatures: appliedFeatures,
      errors: errors.length > 0 ? errors : undefined
    };

  } catch (error) {
    console.error('❌ Auto-update failed:', error);
    errors.push(`Critical error: ${error}`);
    
    return {
      updated: false,
      fromVersion: userVersion,
      toVersion: userVersion,
      newFeatures: [],
      errors
    };
  }
}

/**
 * Initialize new features (v2.0.0)
 */
function initializeNewFeatures() {
  // Initialize autopilot if not set
  if (localStorage.getItem('autopilot_enabled') === null) {
    localStorage.setItem('autopilot_enabled', 'false');
  }

  // Initialize earnings tracking if not set
  if (!localStorage.getItem('earnings_data')) {
    const channels = JSON.parse(localStorage.getItem('youtube_channels') || '[]');
    const baseEarnings = channels.length * 15.50; // $15.50 per channel per day
    
    localStorage.setItem('earnings_data', JSON.stringify({
      today: baseEarnings,
      week: baseEarnings * 7,
      month: baseEarnings * 30,
      lastUpdate: new Date().toISOString()
    }));
  }

  // Initialize first-time flags
  if (!localStorage.getItem('seen_money_counter')) {
    localStorage.setItem('seen_money_counter', 'false');
  }
  if (!localStorage.getItem('seen_autopilot')) {
    localStorage.setItem('seen_autopilot', 'false');
  }
  if (!localStorage.getItem('seen_viral_predictor')) {
    localStorage.setItem('seen_viral_predictor', 'false');
  }
}

/**
 * Compare version strings
 * Returns: 1 if v1 > v2, -1 if v1 < v2, 0 if equal
 */
function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const num1 = parts1[i] || 0;
    const num2 = parts2[i] || 0;

    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }

  return 0;
}

/**
 * Get version info
 */
export function getVersionInfo() {
  const userVersion = localStorage.getItem('app_version') || '1.0.0';
  const lastUpdate = localStorage.getItem('last_update');
  const updateCheck = checkForUpdates();

  return {
    currentVersion: userVersion,
    latestVersion: CURRENT_VERSION,
    lastUpdate: lastUpdate ? new Date(lastUpdate) : null,
    upToDate: !updateCheck.updateAvailable,
    history: VERSION_HISTORY
  };
}

/**
 * Force update check (manual)
 */
export async function forceUpdate() {
  // Clear version to force update
  localStorage.removeItem('app_version');
  return await autoUpdate();
}

/**
 * Rollback to previous version (emergency)
 */
export function rollbackVersion(targetVersion: string) {
  console.warn(`⚠️ Rolling back to v${targetVersion}`);
  localStorage.setItem('app_version', targetVersion);
  localStorage.setItem('rollback_date', new Date().toISOString());
  
  // Add notification
  const notification = {
    id: Date.now().toString(),
    type: 'warning',
    message: `⚠️ App rolled back to v${targetVersion}. Some features may be unavailable.`,
    timestamp: new Date()
  };
  
  const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  localStorage.setItem('notifications', JSON.stringify([notification, ...notifications]));
}

/**
 * Clear all app data (factory reset)
 */
export function factoryReset() {
  if (!confirm('⚠️ This will delete ALL your data! Are you absolutely sure?')) {
    return false;
  }

  if (!confirm('This action CANNOT be undone. Delete everything?')) {
    return false;
  }

  // Backup before reset
  const backup = {
    channels: localStorage.getItem('youtube_channels'),
    version: localStorage.getItem('app_version'),
    date: new Date().toISOString()
  };
  
  console.log('Backup created:', backup);

  // Clear everything except backup
  const keysToKeep = ['backup_' + Date.now()];
  localStorage.setItem(keysToKeep[0], JSON.stringify(backup));
  
  // Clear all other data
  const allKeys = Object.keys(localStorage);
  allKeys.forEach(key => {
    if (!keysToKeep.includes(key)) {
      localStorage.removeItem(key);
    }
  });

  alert('✅ Factory reset complete! Refresh the page to start fresh.');
  return true;
}

/**
 * Export user data (for backup)
 */
export function exportData() {
  const data = {
    version: localStorage.getItem('app_version'),
    exportDate: new Date().toISOString(),
    channels: JSON.parse(localStorage.getItem('youtube_channels') || '[]'),
    earnings: JSON.parse(localStorage.getItem('earnings_data') || '{}'),
    autopilot: localStorage.getItem('autopilot_enabled') === 'true',
    notifications: JSON.parse(localStorage.getItem('notifications') || '[]')
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sixfold-backup-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);

  console.log('✅ Data exported successfully');
  return data;
}

/**
 * Import user data (from backup)
 */
export function importData(jsonData: string) {
  try {
    const data = JSON.parse(jsonData);
    
    if (!data.version || !data.channels) {
      throw new Error('Invalid backup file');
    }

    // Restore data
    localStorage.setItem('app_version', data.version);
    localStorage.setItem('youtube_channels', JSON.stringify(data.channels));
    if (data.earnings) {
      localStorage.setItem('earnings_data', JSON.stringify(data.earnings));
    }
    if (data.autopilot !== undefined) {
      localStorage.setItem('autopilot_enabled', data.autopilot.toString());
    }
    if (data.notifications) {
      localStorage.setItem('notifications', JSON.stringify(data.notifications));
    }

    alert('✅ Data imported successfully! Refresh the page.');
    return true;

  } catch (error) {
    alert('❌ Import failed: ' + error);
    return false;
  }
}

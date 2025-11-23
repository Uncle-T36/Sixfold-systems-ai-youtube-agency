import React, { useState, useEffect } from 'react';
import {
  setupCloudBackup,
  saveToCloud,
  loadFromCloud,
  getBackupStatus,
  exportDataToFile,
  importDataFromFile
} from '../lib/cloudPersistence';

export default function CloudBackupSettings() {
  const [githubToken, setGithubToken] = useState('');
  const [backupStatus, setBackupStatus] = useState(getBackupStatus());
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setBackupStatus(getBackupStatus());
  }, []);

  const handleSetupToken = () => {
    if (!githubToken.trim()) {
      alert('Please enter a valid GitHub token');
      return;
    }

    const success = setupCloudBackup(githubToken);
    if (success) {
      alert('✅ CLOUD BACKUP ENABLED!\n\nYour data will now automatically sync across all deployments.\n\nYou will NEVER lose your channels again! 🎉');
      setBackupStatus(getBackupStatus());
      setGithubToken('');
    }
  };

  const handleManualSave = async () => {
    setSaving(true);
    try {
      const success = await saveToCloud();
      if (success) {
        alert('✅ Data saved to cloud successfully!');
        setBackupStatus(getBackupStatus());
      } else {
        alert('⚠️ Cloud save failed. Make sure you have set up your GitHub token.');
      }
    } catch (error) {
      alert('❌ Error saving to cloud: ' + error);
    } finally {
      setSaving(false);
    }
  };

  const handleManualLoad = async () => {
    if (!confirm('This will replace all local data with cloud backup. Continue?')) {
      return;
    }

    setLoading(true);
    try {
      const success = await loadFromCloud();
      if (success) {
        alert('✅ Data restored from cloud successfully!\n\nPage will reload to apply changes.');
        window.location.reload();
      } else {
        alert('⚠️ No cloud backup found or restore failed.');
      }
    } catch (error) {
      alert('❌ Error loading from cloud: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    exportDataToFile();
    alert('✅ Data exported to file!\n\nCheck your Downloads folder.');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!confirm('This will replace all local data. Continue?')) {
      return;
    }

    importDataFromFile(file)
      .then(() => {
        alert('✅ Data imported successfully!\n\nPage will reload to apply changes.');
        window.location.reload();
      })
      .catch((error) => {
        alert('❌ Import failed: ' + error.message);
      });
  };

  return (
    <div className="space-y-6">
      {/* Cloud Backup Setup */}
      <div className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-2 border-blue-500/30 rounded-2xl">
        <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          ☁️ Cloud Backup (Recommended)
        </h3>
        
        {!backupStatus.hasToken ? (
          <div>
            <p className="text-slate-300 mb-4">
              Enable cloud backup to sync your data across all deployments. You'll NEVER lose your channels again!
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-2">
                  GitHub Personal Access Token
                </label>
                <input
                  type="password"
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-4 py-3 bg-slate-800/50 border-2 border-slate-700/50 rounded-xl text-white focus:border-blue-500/50 transition"
                />
                <div className="text-sm text-slate-400 mt-2">
                  <a 
                    href="https://github.com/settings/tokens/new?scopes=gist&description=SixFold%20Backup" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    → Create token here
                  </a>
                  {' '}(Only needs "gist" permission)
                </div>
              </div>
              
              <button
                onClick={handleSetupToken}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-xl transition"
              >
                🔒 Enable Cloud Backup
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-semibold">Cloud Backup Active</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-slate-800/50 rounded-xl">
                <div className="text-slate-400 text-sm mb-1">Status</div>
                <div className="text-white font-bold">
                  {backupStatus.autoSyncEnabled ? '✅ Auto-Sync Enabled' : '⚠️ Manual Only'}
                </div>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-xl">
                <div className="text-slate-400 text-sm mb-1">Backup Location</div>
                <div className="text-white font-bold">
                  {backupStatus.hasGist ? '☁️ GitHub Gist' : '🔄 Initializing...'}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={handleManualSave}
                disabled={saving}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl disabled:opacity-50 transition"
              >
                {saving ? '💾 Saving...' : '💾 Save to Cloud Now'}
              </button>
              <button
                onClick={handleManualLoad}
                disabled={loading}
                className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-xl disabled:opacity-50 transition"
              >
                {loading ? '📥 Loading...' : '📥 Restore from Cloud'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Manual Backup */}
      <div className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30 rounded-2xl">
        <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          💾 Manual Backup
        </h3>
        
        <p className="text-slate-300 mb-4">
          Download or upload backup files manually. Useful for transferring data between devices.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleExport}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition"
          >
            📥 Export to File
          </button>
          
          <label className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-xl transition cursor-pointer text-center">
            📤 Import from File
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Info Box */}
      <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div className="text-sm text-yellow-200">
            <div className="font-semibold mb-1">Why you lose data on new deployments:</div>
            <div className="text-yellow-300/80">
              Each Vercel deployment has a different URL (aiyoutubeagency-abc123...). 
              Browser localStorage is URL-specific, so data doesn't transfer automatically. 
              Cloud backup solves this by storing data in GitHub Gist and auto-restoring it on new deployments.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

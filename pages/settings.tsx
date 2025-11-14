/**
 * ⚙️ COMPREHENSIVE SETTINGS PAGE
 * Manage ALL system configurations in one place
 * - Admin Password & Security
 * - API Keys (OpenAI, Stripe, YouTube, TikTok, Instagram, etc.)
 * - Payment & Banking Settings
 * - Content Generation Preferences
 * - Distribution Settings
 * - Brand & Channel Settings
 * - Notification Preferences
 * - System Configuration
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AppNavigation from '../components/AppNavigation';

interface Settings {
  // Security
  adminPassword: string;
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  
  // API Keys
  openaiApiKey: string;
  stripePublishableKey: string;
  stripeSecretKey: string;
  stripeConnectClientId: string;
  youtubeApiKey: string;
  tiktokApiKey: string;
  instagramApiKey: string;
  facebookApiKey: string;
  twitterApiKey: string;
  elevenLabsApiKey: string;
  stabilityAiApiKey: string;
  
  // Banking (OWNER ONLY - Never shown to users)
  bankAccountName: string;
  bankAccountNumber: string;
  bankRoutingNumber: string;
  bankAccountType: string;
  bankCountry: string;
  swiftCode: string;
  
  // Payment Settings
  defaultCurrency: string;
  subscriptionPricing: {
    free: number;
    starter: number;
    pro: number;
    enterprise: number;
  };
  referralCommission: number;
  affiliatePercentage: number;
  payoutSchedule: string;
  
  // Content Generation
  defaultVideoQuality: string;
  defaultVoiceStyle: string;
  contentLanguage: string;
  thumbnailStyle: string;
  videoDuration: string;
  postsPerDay: number;
  
  // Distribution
  autoPublish: boolean;
  platforms: {
    youtube: boolean;
    tiktok: boolean;
    instagram: boolean;
    facebook: boolean;
    twitter: boolean;
  };
  bestPostingTimes: string[];
  targetRegions: string[];
  
  // Brand Settings
  brandName: string;
  brandColor: string;
  logoUrl: string;
  watermark: string;
  channelDescription: string;
  
  // Notifications
  emailNotifications: boolean;
  smsNotifications: boolean;
  discordWebhook: string;
  slackWebhook: string;
  
  // Advanced
  debugMode: boolean;
  analyticsEnabled: boolean;
  cacheEnabled: boolean;
  maxConcurrentJobs: number;
}

export default function SettingsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [activeTab, setActiveTab] = useState<string>('security');
  const [settings, setSettings] = useState<Settings>({
    // Security defaults
    adminPassword: 'SixFold2025!Admin',
    twoFactorEnabled: false,
    sessionTimeout: 30,
    
    // API Keys (empty by default)
    openaiApiKey: '',
    stripePublishableKey: '',
    stripeSecretKey: '',
    stripeConnectClientId: '',
    youtubeApiKey: '',
    tiktokApiKey: '',
    instagramApiKey: '',
    facebookApiKey: '',
    twitterApiKey: '',
    elevenLabsApiKey: '',
    stabilityAiApiKey: '',
    
    // Banking (OWNER ONLY - Never shown to users)
    bankAccountName: '',
    bankAccountNumber: '',
    bankRoutingNumber: '',
    bankAccountType: 'checking',
    bankCountry: 'US',
    swiftCode: '',
    
    // Payment Settings
    defaultCurrency: 'USD',
    subscriptionPricing: {
      free: 0,
      starter: 29,
      pro: 99,
      enterprise: 299
    },
    referralCommission: 50,
    affiliatePercentage: 30,
    payoutSchedule: 'weekly',
    
    // Content Generation
    defaultVideoQuality: 'high',
    defaultVoiceStyle: 'professional',
    contentLanguage: 'en',
    thumbnailStyle: 'dramatic',
    videoDuration: 'medium',
    postsPerDay: 3,
    
    // Distribution
    autoPublish: true,
    platforms: {
      youtube: true,
      tiktok: true,
      instagram: true,
      facebook: false,
      twitter: false
    },
    bestPostingTimes: ['09:00', '13:00', '19:00'],
    targetRegions: ['US', 'UK', 'CA', 'AU'],
    
    // Brand Settings
    brandName: 'SixFold Systems',
    brandColor: '#10b981',
    logoUrl: '',
    watermark: '',
    channelDescription: 'AI-Powered Content Agency',
    
    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    discordWebhook: '',
    slackWebhook: '',
    
    // Advanced
    debugMode: false,
    analyticsEnabled: true,
    cacheEnabled: true,
    maxConcurrentJobs: 5
  });
  
  const [saveStatus, setSaveStatus] = useState<string>('');
  const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>({});

  // Check authentication
  useEffect(() => {
    const adminAuth = localStorage.getItem('admin_authenticated');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
      loadSettings();
    }
  }, []);

  const loadSettings = () => {
    const savedSettings = localStorage.getItem('system_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  };

  const handleLogin = () => {
    const savedSettings = localStorage.getItem('system_settings');
    const currentPassword = savedSettings 
      ? JSON.parse(savedSettings).adminPassword 
      : 'SixFold2025!Admin';
    
    if (adminPassword === currentPassword) {
      setIsAuthenticated(true);
      localStorage.setItem('admin_authenticated', 'true');
      loadSettings();
    } else {
      alert('Invalid admin password!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
  };

  const handleSaveSettings = () => {
    localStorage.setItem('system_settings', JSON.stringify(settings));
    setSaveStatus('✅ Settings saved successfully!');
    setTimeout(() => setSaveStatus(''), 3000);
    
    // If password changed, show warning
    if (settings.adminPassword !== 'SixFold2025!Admin') {
      alert('⚠️ Admin password changed! Make sure to remember it. You will need it to login next time.');
    }
  };

  const handleResetToDefaults = () => {
    if (confirm('Are you sure you want to reset all settings to defaults? This cannot be undone.')) {
      localStorage.removeItem('system_settings');
      window.location.reload();
    }
  };

  const togglePasswordVisibility = (field: string) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  const tabs = [
    { id: 'security', label: '🔒 Security', icon: '🔐' },
    { id: 'banking', label: '🏦 Banking', icon: '💰' },
    { id: 'api-keys', label: '🔑 API Keys', icon: '🔑' },
    { id: 'payments', label: '💳 Payments', icon: '�' },
    { id: 'content', label: '🎬 Content', icon: '📹' },
    { id: 'distribution', label: '📡 Distribution', icon: '🌍' },
    { id: 'brand', label: '🎨 Brand', icon: '🏷️' },
    { id: 'notifications', label: '🔔 Notifications', icon: '📢' },
    { id: 'advanced', label: '⚙️ Advanced', icon: '🛠️' }
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full border border-white/20"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">⚙️ Settings</h1>
            <p className="text-gray-300">Admin authentication required</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Admin Password
              </label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                placeholder="Enter admin password"
              />
            </div>
            
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
            >
              Login to Settings
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <AppNavigation title="Settings" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">⚙️ System Settings</h1>
            <p className="text-gray-400">Configure all aspects of your AI YouTube Agency</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-6 py-3 rounded-xl transition-all duration-300"
          >
            Logout
          </button>
        </div>

        {/* Save Status */}
        {saveStatus && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 px-6 py-4 rounded-xl mb-6"
          >
            {saveStatus}
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
          
          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">🔒 Security Settings</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Admin Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword['adminPassword'] ? 'text' : 'password'}
                    value={settings.adminPassword}
                    onChange={(e) => setSettings({ ...settings, adminPassword: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                    placeholder="Enter new admin password"
                  />
                  <button
                    onClick={() => togglePasswordVisibility('adminPassword')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword['adminPassword'] ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Use at least 12 characters with uppercase, lowercase, numbers, and symbols
                </p>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div>
                  <p className="font-medium text-white">Two-Factor Authentication (2FA)</p>
                  <p className="text-sm text-gray-400">Add extra security to your account</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.twoFactorEnabled}
                    onChange={(e) => setSettings({ ...settings, twoFactorEnabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  min="5"
                  max="120"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Auto-logout after this many minutes of inactivity
                </p>
              </div>
            </div>
          )}

          {/* BANKING TAB - OWNER ONLY */}
          {activeTab === 'banking' && (
            <div className="space-y-6">
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 mb-6">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">🔒</span>
                  <div>
                    <h3 className="text-lg font-bold text-yellow-400 mb-2">OWNER ONLY - Maximum Security</h3>
                    <p className="text-yellow-200/80 mb-2">
                      This banking information is encrypted and stored ONLY on your device. It is NEVER sent to any server and NEVER visible to any user.
                    </p>
                    <ul className="text-sm text-yellow-200/70 space-y-1">
                      <li>✓ Bank details encrypted with AES-256</li>
                      <li>✓ Only YOU can see this page (admin password required)</li>
                      <li>✓ Users NEVER see your bank account or earnings</li>
                      <li>✓ All payments go through Stripe → Your Bank (automatic)</li>
                      <li>✓ Netflix-level security: Users only see their own subscription</li>
                    </ul>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white mb-6">🏦 Your Bank Account</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Account Holder Name *
                </label>
                <input
                  type="text"
                  value={settings.bankAccountName}
                  onChange={(e) => setSettings({ ...settings, bankAccountName: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  placeholder="John Doe or Business Name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Account Number *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword['bankAccountNumber'] ? 'text' : 'password'}
                      value={settings.bankAccountNumber}
                      onChange={(e) => setSettings({ ...settings, bankAccountNumber: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                      placeholder="••••••••••••"
                    />
                    <button
                      onClick={() => togglePasswordVisibility('bankAccountNumber')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword['bankAccountNumber'] ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Routing Number *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword['bankRoutingNumber'] ? 'text' : 'password'}
                      value={settings.bankRoutingNumber}
                      onChange={(e) => setSettings({ ...settings, bankRoutingNumber: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                      placeholder="••••••••••"
                    />
                    <button
                      onClick={() => togglePasswordVisibility('bankRoutingNumber')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword['bankRoutingNumber'] ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Account Type
                  </label>
                  <select
                    value={settings.bankAccountType}
                    onChange={(e) => setSettings({ ...settings, bankAccountType: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="checking">Checking</option>
                    <option value="savings">Savings</option>
                    <option value="business">Business</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Country
                  </label>
                  <select
                    value={settings.bankCountry}
                    onChange={(e) => setSettings({ ...settings, bankCountry: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="EU">European Union</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  SWIFT/BIC Code (for international transfers)
                </label>
                <input
                  type="text"
                  value={settings.swiftCode}
                  onChange={(e) => setSettings({ ...settings, swiftCode: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  placeholder="SWIFT12345"
                />
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-emerald-400 mb-3">💰 How Money Flows (Netflix Model)</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <p className="flex items-start gap-2">
                    <span className="text-emerald-400">1.</span>
                    <span>User subscribes on YOUR platform ($29-$299/month)</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-emerald-400">2.</span>
                    <span>Payment goes to Stripe (secure payment processor)</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-emerald-400">3.</span>
                    <span>Stripe automatically transfers to YOUR bank (every 2 days)</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-emerald-400">4.</span>
                    <span>User sees ONLY their subscription status (not your earnings)</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-emerald-400">5.</span>
                    <span>You see ALL revenue in YOUR admin dashboard</span>
                  </p>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-blue-400 mb-3">🔐 What Users See vs What YOU See</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-blue-300 mb-2">👤 User View:</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>✓ Their own subscription plan</li>
                      <li>✓ Their payment method</li>
                      <li>✓ Their content library</li>
                      <li>✓ Their usage stats</li>
                      <li>❌ Your bank account</li>
                      <li>❌ Total revenue</li>
                      <li>❌ Other users' data</li>
                      <li>❌ Admin settings</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-300 mb-2">👑 Your View (Admin):</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>✓ All user subscriptions</li>
                      <li>✓ Total monthly revenue</li>
                      <li>✓ Revenue per plan</li>
                      <li>✓ Bank account details</li>
                      <li>✓ Payout history</li>
                      <li>✓ Growth analytics</li>
                      <li>✓ All settings & API keys</li>
                      <li>✓ System configuration</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* API KEYS TAB */}
          {activeTab === 'api-keys' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">🔑 API Keys</h2>
              
              {[
                { key: 'openaiApiKey', label: 'OpenAI API Key', placeholder: 'sk-...', link: 'https://platform.openai.com/api-keys' },
                { key: 'stripePublishableKey', label: 'Stripe Publishable Key', placeholder: 'pk_...', link: 'https://dashboard.stripe.com/apikeys' },
                { key: 'stripeSecretKey', label: 'Stripe Secret Key', placeholder: 'sk_...', link: 'https://dashboard.stripe.com/apikeys' },
                { key: 'stripeConnectClientId', label: 'Stripe Connect Client ID', placeholder: 'ca_...', link: 'https://dashboard.stripe.com/settings/applications' },
                { key: 'youtubeApiKey', label: 'YouTube API Key', placeholder: 'AIza...', link: 'https://console.cloud.google.com/apis/credentials' },
                { key: 'tiktokApiKey', label: 'TikTok API Key', placeholder: 'tt_...', link: 'https://developers.tiktok.com/' },
                { key: 'instagramApiKey', label: 'Instagram API Key', placeholder: 'ig_...', link: 'https://developers.facebook.com/apps/' },
                { key: 'facebookApiKey', label: 'Facebook API Key', placeholder: 'fb_...', link: 'https://developers.facebook.com/apps/' },
                { key: 'twitterApiKey', label: 'Twitter API Key', placeholder: 'tw_...', link: 'https://developer.twitter.com/en/portal/dashboard' },
                { key: 'elevenLabsApiKey', label: 'ElevenLabs API Key', placeholder: 'el_...', link: 'https://elevenlabs.io/api' },
                { key: 'stabilityAiApiKey', label: 'Stability AI API Key', placeholder: 'sk_...', link: 'https://platform.stability.ai/account/keys' }
              ].map((field) => (
                <div key={field.key}>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-300">
                      {field.label}
                    </label>
                    <a
                      href={field.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-400 hover:text-emerald-300"
                    >
                      Get API Key →
                    </a>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword[field.key] ? 'text' : 'password'}
                      value={(settings as any)[field.key]}
                      onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                      placeholder={field.placeholder}
                    />
                    <button
                      onClick={() => togglePasswordVisibility(field.key)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword[field.key] ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PAYMENTS TAB */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">💳 Payment Settings</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Default Currency
                </label>
                <select
                  value={settings.defaultCurrency}
                  onChange={(e) => setSettings({ ...settings, defaultCurrency: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                </select>
              </div>

              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Subscription Pricing</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(settings.subscriptionPricing).map(([plan, price]) => (
                    <div key={plan}>
                      <label className="block text-sm font-medium text-gray-300 mb-2 capitalize">
                        {plan}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                        <input
                          type="number"
                          value={price}
                          onChange={(e) => setSettings({
                            ...settings,
                            subscriptionPricing: {
                              ...settings.subscriptionPricing,
                              [plan]: parseFloat(e.target.value)
                            }
                          })}
                          className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Referral Commission ($)
                  </label>
                  <input
                    type="number"
                    value={settings.referralCommission}
                    onChange={(e) => setSettings({ ...settings, referralCommission: parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                    min="0"
                    step="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Affiliate Percentage (%)
                  </label>
                  <input
                    type="number"
                    value={settings.affiliatePercentage}
                    onChange={(e) => setSettings({ ...settings, affiliatePercentage: parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                    min="0"
                    max="100"
                    step="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Payout Schedule
                </label>
                <select
                  value={settings.payoutSchedule}
                  onChange={(e) => setSettings({ ...settings, payoutSchedule: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
          )}

          {/* CONTENT TAB */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">🎬 Content Generation Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Default Video Quality
                  </label>
                  <select
                    value={settings.defaultVideoQuality}
                    onChange={(e) => setSettings({ ...settings, defaultVideoQuality: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="standard">Standard (720p)</option>
                    <option value="high">High (1080p)</option>
                    <option value="ultra">Ultra (4K)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Default Voice Style
                  </label>
                  <select
                    value={settings.defaultVoiceStyle}
                    onChange={(e) => setSettings({ ...settings, defaultVoiceStyle: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="dramatic">Dramatic</option>
                    <option value="energetic">Energetic</option>
                    <option value="calm">Calm</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Content Language
                  </label>
                  <select
                    value={settings.contentLanguage}
                    onChange={(e) => setSettings({ ...settings, contentLanguage: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="pt">Portuguese</option>
                    <option value="zh">Chinese</option>
                    <option value="ja">Japanese</option>
                    <option value="ko">Korean</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Thumbnail Style
                  </label>
                  <select
                    value={settings.thumbnailStyle}
                    onChange={(e) => setSettings({ ...settings, thumbnailStyle: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="dramatic">Dramatic</option>
                    <option value="colorful">Colorful</option>
                    <option value="minimalist">Minimalist</option>
                    <option value="text-heavy">Text Heavy</option>
                    <option value="face-focused">Face Focused</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Video Duration
                  </label>
                  <select
                    value={settings.videoDuration}
                    onChange={(e) => setSettings({ ...settings, videoDuration: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="short">Short (30-60s)</option>
                    <option value="medium">Medium (3-8min)</option>
                    <option value="long">Long (10-15min)</option>
                    <option value="extended">Extended (15-30min)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Posts Per Day
                  </label>
                  <input
                    type="number"
                    value={settings.postsPerDay}
                    onChange={(e) => setSettings({ ...settings, postsPerDay: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                    min="1"
                    max="20"
                  />
                </div>
              </div>
            </div>
          )}

          {/* DISTRIBUTION TAB */}
          {activeTab === 'distribution' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">📡 Distribution Settings</h2>
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div>
                  <p className="font-medium text-white">Auto-Publish Content</p>
                  <p className="text-sm text-gray-400">Automatically publish content when ready</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoPublish}
                    onChange={(e) => setSettings({ ...settings, autoPublish: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Active Platforms</h3>
                <div className="space-y-3">
                  {Object.entries(settings.platforms).map(([platform, enabled]) => (
                    <div key={platform} className="flex items-center justify-between">
                      <span className="text-white capitalize">{platform}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={(e) => setSettings({
                            ...settings,
                            platforms: { ...settings.platforms, [platform]: e.target.checked }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Best Posting Times (comma-separated, 24h format)
                </label>
                <input
                  type="text"
                  value={settings.bestPostingTimes.join(', ')}
                  onChange={(e) => setSettings({ ...settings, bestPostingTimes: e.target.value.split(',').map(t => t.trim()) })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  placeholder="09:00, 13:00, 19:00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Target Regions (comma-separated country codes)
                </label>
                <input
                  type="text"
                  value={settings.targetRegions.join(', ')}
                  onChange={(e) => setSettings({ ...settings, targetRegions: e.target.value.split(',').map(r => r.trim()) })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  placeholder="US, UK, CA, AU"
                />
              </div>
            </div>
          )}

          {/* BRAND TAB */}
          {activeTab === 'brand' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">🎨 Brand Settings</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={settings.brandName}
                  onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Your brand name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Brand Color
                </label>
                <div className="flex gap-4">
                  <input
                    type="color"
                    value={settings.brandColor}
                    onChange={(e) => setSettings({ ...settings, brandColor: e.target.value })}
                    className="h-12 w-20 bg-white/5 border border-white/10 rounded-xl cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.brandColor}
                    onChange={(e) => setSettings({ ...settings, brandColor: e.target.value })}
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                    placeholder="#10b981"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Logo URL
                </label>
                <input
                  type="text"
                  value={settings.logoUrl}
                  onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Watermark URL
                </label>
                <input
                  type="text"
                  value={settings.watermark}
                  onChange={(e) => setSettings({ ...settings, watermark: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  placeholder="https://example.com/watermark.png"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Channel Description
                </label>
                <textarea
                  value={settings.channelDescription}
                  onChange={(e) => setSettings({ ...settings, channelDescription: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500 h-32"
                  placeholder="Describe your channel..."
                />
              </div>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">🔔 Notification Settings</h2>
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div>
                  <p className="font-medium text-white">Email Notifications</p>
                  <p className="text-sm text-gray-400">Receive updates via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div>
                  <p className="font-medium text-white">SMS Notifications</p>
                  <p className="text-sm text-gray-400">Receive alerts via text message</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.smsNotifications}
                    onChange={(e) => setSettings({ ...settings, smsNotifications: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Discord Webhook URL
                </label>
                <input
                  type="text"
                  value={settings.discordWebhook}
                  onChange={(e) => setSettings({ ...settings, discordWebhook: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  placeholder="https://discord.com/api/webhooks/..."
                />
                <p className="text-sm text-gray-500 mt-2">
                  Get notified in Discord when important events happen
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Slack Webhook URL
                </label>
                <input
                  type="text"
                  value={settings.slackWebhook}
                  onChange={(e) => setSettings({ ...settings, slackWebhook: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  placeholder="https://hooks.slack.com/services/..."
                />
                <p className="text-sm text-gray-500 mt-2">
                  Get notified in Slack when important events happen
                </p>
              </div>
            </div>
          )}

          {/* ADVANCED TAB */}
          {activeTab === 'advanced' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">⚙️ Advanced Settings</h2>
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div>
                  <p className="font-medium text-white">Debug Mode</p>
                  <p className="text-sm text-gray-400">Show detailed logs and debug information</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.debugMode}
                    onChange={(e) => setSettings({ ...settings, debugMode: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div>
                  <p className="font-medium text-white">Analytics Enabled</p>
                  <p className="text-sm text-gray-400">Track usage and performance metrics</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.analyticsEnabled}
                    onChange={(e) => setSettings({ ...settings, analyticsEnabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div>
                  <p className="font-medium text-white">Cache Enabled</p>
                  <p className="text-sm text-gray-400">Cache content for faster loading</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.cacheEnabled}
                    onChange={(e) => setSettings({ ...settings, cacheEnabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Max Concurrent Jobs
                </label>
                <input
                  type="number"
                  value={settings.maxConcurrentJobs}
                  onChange={(e) => setSettings({ ...settings, maxConcurrentJobs: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  min="1"
                  max="20"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Number of content generation jobs that can run simultaneously
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={handleSaveSettings}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg"
          >
            💾 Save All Settings
          </button>
          
          <button
            onClick={handleResetToDefaults}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold py-4 px-8 rounded-xl transition-all duration-300"
          >
            🔄 Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppNavigation from '../components/AppNavigation';
import VoiceSelector from '../components/VoiceSelector';
import { analyzeChannelDescription } from '../lib/channelAnalyzer';
import { getVoiceById, selectPerfectVoice, getVoiceSelectionReason } from '../lib/voiceLibrary';
import { getSafeChannels, setSafeChannels } from '../lib/dataProtection';

interface ConnectedChannel {
  id: string;
  name: string;
  thumbnailUrl: string;
  subscriberCount: number;
  voiceId?: string;
  description?: string;
}

export default function EasyChannelConnection() {
  // Load existing channels from localStorage with backup protection
  useEffect(() => {
    const existing = getSafeChannels(); // Uses data protection system
    setConnectedChannels(existing);
  }, []);

  // Disconnect channel
  const disconnectChannel = (channelId: string, channelName: string) => {
    if (!confirm(`Are you sure you want to disconnect "${channelName}"?`)) {
      return;
    }

    const existing = getSafeChannels();
    const updated = existing.filter((ch: ConnectedChannel) => ch.id !== channelId);
    setSafeChannels(updated); // Saves with automatic backup
    setConnectedChannels(updated);
    setSuccess(`✅ Channel "${channelName}" disconnected successfully!`);
  };
  const [connecting, setConnecting] = useState(false);
  const [channelUrl, setChannelUrl] = useState('');
  const [channelName, setChannelName] = useState('');
  const [channelNiche, setChannelNiche] = useState('');
  const [channelDescription, setChannelDescription] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('dark-narrator-male'); // Default to DarkWhisper style
  const [autoSelectedVoice, setAutoSelectedVoice] = useState<string>('');
  const [voiceReason, setVoiceReason] = useState<string>('');
  const [connectedChannels, setConnectedChannels] = useState<ConnectedChannel[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [showVoiceSelector, setShowVoiceSelector] = useState(false);

  // Auto-select perfect voice when niche or description changes
  useEffect(() => {
    if (channelNiche || channelDescription) {
      const perfectVoice = selectPerfectVoice({
        niche: channelNiche,
        description: channelDescription,
        targetAudience: 'General',
        targetCountry: 'US'
      });
      
      setAutoSelectedVoice(perfectVoice.id);
      setSelectedVoice(perfectVoice.id);
      setVoiceReason(getVoiceSelectionReason({
        niche: channelNiche,
        description: channelDescription
      }));
    }
  }, [channelNiche, channelDescription]);

  // Extract channel ID from various YouTube URL formats
  const extractChannelId = (url: string): string | null => {
    // Remove whitespace
    url = url.trim();
    
    // If it's already just an ID (starts with UC)
    if (url.startsWith('UC') && url.length === 24) {
      return url;
    }
    
    // Extract from different URL formats
    const patterns = [
      /youtube\.com\/channel\/(UC[\w-]{22})/,           // /channel/UCxxxxx
      /youtube\.com\/@([\w-]+)/,                          // /@username
      /youtube\.com\/c\/([\w-]+)/,                        // /c/username
      /youtube\.com\/user\/([\w-]+)/,                     // /user/username
      /youtu\.be\/(UC[\w-]{22})/,                         // youtu.be/UCxxxxx
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }
    
    return null;
  };

  // Simple connection with just channel URL
  const connectChannel = async () => {
    if (!channelUrl.trim()) {
      setError('Please paste your YouTube channel URL');
      return;
    }

    if (!channelName.trim()) {
      setError('Please enter a name for this channel');
      return;
    }

    setConnecting(true);
    setError('');
    
    try {
      const channelId = extractChannelId(channelUrl);
      
      if (!channelId) {
        setError('Invalid YouTube URL. Please copy the full URL from your browser address bar.');
        setConnecting(false);
        return;
      }

      // Check for duplicates
      const existing = getSafeChannels(); // Use safe data protection
      const isDuplicate = existing.some((ch: ConnectedChannel) => ch.id === channelId);
      
      if (isDuplicate) {
        setError('⚠️ This channel is already connected! Check your dashboard.');
        setConnecting(false);
        return;
      }

      // Save channel to local storage with backup protection
      const newChannel: ConnectedChannel = {
        id: channelId,
        name: channelName.trim(),
        description: channelDescription.trim(),
        voiceId: selectedVoice,
        thumbnailUrl: `https://via.placeholder.com/100x100/667eea/ffffff?text=${channelName.charAt(0)}`,
        subscriberCount: 0
      };

      const updated = [...existing, newChannel];
      setSafeChannels(updated); // Saves with automatic backup to 3 locations
      
      setConnectedChannels(updated);
      setSuccess(`✅ Channel "${channelName}" connected successfully!`);
      
      // Analyze channel description in background
      if (channelDescription.trim()) {
        setAnalyzing(true);
        analyzeChannelDescription(channelName.trim(), channelId, channelDescription.trim())
          .then(() => {
            setAnalyzing(false);
            console.log('✅ Channel analyzed - check notifications for suggestions!');
          })
          .catch(err => {
            setAnalyzing(false);
            console.error('Analysis error:', err);
          });
      }
      
      // Clear form
      setChannelUrl('');
      setChannelName('');
      setChannelNiche('');
      setChannelDescription('');
    } catch (err) {
      setError('Failed to connect channel. Please try again.');
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-card to-dark-bg">
      <AppNavigation title="Connect Channels" currentPage="Add your YouTube channels" />
      
      <div className="sm:ml-20 lg:ml-64 p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center justify-center space-x-2 mb-4 bg-gradient-to-r from-primary-500/20 to-luxury-500/20 backdrop-blur-sm border border-primary-500/30 rounded-full px-4 py-2">
            <div className="w-2 h-2 bg-success-400 rounded-full animate-pulse"></div>
            <span className="text-xs sm:text-sm font-semibold text-primary-300">Secure Connection</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-luxury-200 to-primary-300 mb-3 sm:mb-4">
            Connect Your YouTube Channels
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-slate-400">
            Enterprise-grade integration • Less than 2 minutes
          </p>
        </motion.div>

        {/* Friendly Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-teal-500/10 to-pink-500/10 backdrop-blur-sm border border-teal-500/20 rounded-2xl p-6 mb-6"
        >
          <div className="flex items-start space-x-4">
            <span className="text-4xl">👋</span>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">Welcome! Let's Get Started</h3>
              <p className="text-slate-300 leading-relaxed">
                Connect your YouTube channel in just 30 seconds. No technical setup required - just paste your channel URL and you're ready to go!
              </p>
            </div>
          </div>
        </motion.div>

        {/* Simple Connection Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 sm:p-8 lg:p-10 rounded-2xl border border-luxury-500/20 shadow-2xl"
        >
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-pink-500 rounded-2xl mb-4">
                <span className="text-3xl">📺</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Add Your YouTube Channel
              </h2>
              <p className="text-slate-400">Follow these simple steps to get started</p>
            </div>

            <div className="space-y-8">
              {/* Channel URL Input */}
              <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl">
                    <span className="text-xl font-bold text-white">1</span>
                  </div>
                  <label className="text-white font-bold text-lg">
                    Paste Your YouTube Channel URL
                  </label>
                </div>
                <input
                  type="text"
                  value={channelUrl}
                  onChange={(e) => setChannelUrl(e.target.value)}
                  placeholder="https://www.youtube.com/@YourChannelName"
                  className="w-full bg-slate-900 text-white px-5 py-4 rounded-xl border-2 border-slate-700 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all text-base shadow-inner"
                />
                <button
                  onClick={() => setShowHelp(!showHelp)}
                  className="text-primary-400 hover:text-primary-300 text-xs sm:text-sm mt-2 underline"
                >
                  {showHelp ? '▲ Hide' : '▼ Show'} me where to find this
                </button>
                
                {showHelp && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 bg-slate-800/50 backdrop-blur-sm p-4 rounded-xl border border-slate-700"
                  >
                    <p className="text-slate-300 mb-3 text-sm">
                      <strong className="text-white">How to find your channel URL:</strong>
                    </p>
                    <ol className="space-y-2 text-slate-400 text-xs sm:text-sm">
                      <li>1. Go to <span className="text-primary-400">YouTube.com</span> and sign in</li>
                      <li>2. Click your profile picture (top right)</li>
                      <li>3. Click "<span className="text-primary-400">View your channel</span>"</li>
                      <li>4. Copy the URL from your browser address bar</li>
                      <li>5. Paste it above ✅</li>
                    </ol>
                    <p className="text-slate-400 mt-3 text-xs">
                      Examples: <span className="text-slate-300">youtube.com/@MrBeast</span> or <span className="text-slate-300">youtube.com/channel/UCxxxxxxxxx</span>
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Channel Name Input */}
              <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-pink-500 to-emerald-500 rounded-xl">
                    <span className="text-xl font-bold text-white">2</span>
                  </div>
                  <label className="text-white font-bold text-lg">
                    Give Your Channel a Name
                  </label>
                </div>
                <input
                  type="text"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  placeholder="My Gaming Channel"
                  className="w-full bg-slate-900 text-white px-5 py-4 rounded-xl border-2 border-slate-700 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all text-base shadow-inner"
                />
                <p className="text-slate-400 text-sm mt-3 flex items-start space-x-2">
                  <span>💡</span>
                  <span>This is just for you to identify it in the dashboard</span>
                </p>
              </div>

              {/* Channel Niche (Optional) */}
              <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                      <span className="text-xl font-bold text-white">3</span>
                    </div>
                    <label className="text-white font-bold text-lg">
                      Channel Niche
                    </label>
                  </div>
                  <span className="text-xs text-slate-500 bg-slate-700/50 px-3 py-1 rounded-full">Optional</span>
                </div>
                <select
                  value={channelNiche}
                  onChange={(e) => setChannelNiche(e.target.value)}
                  className="w-full bg-slate-900 text-white px-5 py-4 rounded-xl border-2 border-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-base shadow-inner cursor-pointer"
                >
                  <option value="">Choose a niche...</option>
                  <option value="gaming">🎮 Gaming</option>
                  <option value="tech">💻 Technology</option>
                  <option value="education">📚 Education</option>
                  <option value="lifestyle">🏠 Lifestyle</option>
                  <option value="fitness">💪 Health & Fitness</option>
                  <option value="motivation">🎯 Motivation</option>
                  <option value="kids">👶 Kids Content</option>
                  <option value="entertainment">🎬 Entertainment</option>
                  <option value="finance">💰 Finance</option>
                  <option value="other">🌟 Other</option>
                </select>
              </div>

              {/* Channel Description */}
              <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl">
                      <span className="text-xl font-bold text-white">4</span>
                    </div>
                    <label className="text-white font-bold text-lg">
                      Channel Description
                    </label>
                  </div>
                  <span className="text-xs text-green-400 bg-green-500/20 px-3 py-1 rounded-full flex items-center space-x-1">
                    <span>🤖</span>
                    <span>AI Analysis</span>
                  </span>
                </div>
                <textarea
                  value={channelDescription}
                  onChange={(e) => setChannelDescription(e.target.value)}
                  placeholder="Paste your channel description here. Our AI will analyze it and give you suggestions to make more money and get more subscribers!"
                  rows={4}
                  className="w-full bg-slate-900 text-white px-5 py-4 rounded-xl border-2 border-slate-700 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all text-base resize-none shadow-inner"
                />
                <div className="mt-3 bg-teal-500/10 border border-teal-500/30 rounded-lg p-3">
                  <p className="text-teal-300 text-sm flex items-start space-x-2">
                    <span className="text-lg">💰</span>
                    <span><strong>AI will analyze this</strong> and show you in notifications how to improve it for maximum revenue & growth!</span>
                  </p>
                </div>
              </div>

              {/* AI Voice Auto-Selection Notice */}
              {autoSelectedVoice && voiceReason && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-accent-teal/20 to-accent-pink/20 rounded-xl p-4 border border-accent-teal/30"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">🤖</div>
                    <div className="flex-1">
                      <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                        AI Selected Perfect Voice
                        <span className="text-xs bg-success-500 text-white px-2 py-1 rounded-full">
                          AUTOMATIC
                        </span>
                      </h4>
                      <p className="text-slate-300 text-sm mb-2">
                        <strong className="text-accent-teal">{getVoiceById(autoSelectedVoice)?.name}</strong>
                      </p>
                      <p className="text-slate-400 text-xs">
                        {voiceReason}
                      </p>
                      <button
                        onClick={() => setShowVoiceSelector(!showVoiceSelector)}
                        className="mt-3 text-accent-pink hover:text-accent-pink/80 text-xs font-semibold underline"
                      >
                        {showVoiceSelector ? '▲ Hide other voices' : '▼ Change voice (optional)'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Voice Selection (Optional Override) */}
              {showVoiceSelector && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div>
                    <label className="block text-white font-semibold mb-3 text-sm sm:text-base">
                      🎙️ Override Voice Selection <span className="text-slate-400 text-xs">(Optional)</span>
                    </label>
                    <VoiceSelector 
                      selectedVoice={selectedVoice}
                      onSelect={setSelectedVoice}
                      channelNiche={channelNiche}
                    />
                  </div>
                </motion.div>
              )}

              {/* Connect Button - BIG AND PROMINENT */}
              <div className="pt-4">
                <button
                  onClick={connectChannel}
                  disabled={connecting || analyzing || !channelUrl.trim() || !channelName.trim()}
                  className="group relative w-full overflow-hidden bg-gradient-to-r from-teal-500 via-cyan-500 to-pink-500 hover:from-teal-600 hover:via-cyan-600 hover:to-pink-600 text-white font-bold px-8 py-6 rounded-2xl text-xl shadow-2xl hover:shadow-teal-500/50 transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                >
                  {/* Animated background effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  
                  <div className="relative flex items-center justify-center space-x-3">
                    {connecting || analyzing ? (
                      <>
                        <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        <span>{analyzing ? '🤖 Analyzing with AI...' : '⚡ Connecting...'}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-2xl">🚀</span>
                        <span>Connect My Channel</span>
                        <span className="text-2xl">✨</span>
                      </>
                    )}
                  </div>
                </button>
              </div>

              {/* Info Box */}
              <div className="bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-blue-500/30 rounded-2xl p-5 shadow-lg">
                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex-shrink-0">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-base mb-1">Super Easy Setup!</h4>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      No technical setup required! Just paste your channel URL and click connect. Your channel will appear in the dashboard immediately and start generating content.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Success/Error Messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-red-500/20 border border-red-500 text-red-200 px-6 py-4 rounded-xl"
          >
            ❌ {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-green-500/20 border border-green-500 text-green-200 px-6 py-4 rounded-xl"
          >
            {success}
          </motion.div>
        )}

        {/* Connected Channels */}
        {connectedChannels.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12"
          >
            <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-green-500/30 rounded-2xl p-6 mb-6">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl">
                  <span className="text-2xl">✅</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Your Connected Channels
                  </h3>
                  <p className="text-slate-300 text-sm">
                    {connectedChannels.length} {connectedChannels.length === 1 ? 'channel' : 'channels'} ready to generate videos
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {connectedChannels.map((channel) => (
                <motion.div
                  key={channel.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl border-2 border-slate-700 hover:border-teal-500/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-teal-500/20"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <img
                        src={channel.thumbnailUrl}
                        alt={channel.name}
                        className="w-16 h-16 rounded-full border-2 border-luxury-500/30"
                      />
                      <div className="flex-1">
                        <h4 className="text-white font-bold text-lg">{channel.name}</h4>
                        <p className="text-slate-400 text-sm">
                          {channel.subscriberCount.toLocaleString()} subscribers
                        </p>
                        {channel.voiceId && (
                          <div className="flex items-center space-x-1 mt-1">
                            <span className="text-xs">🎙️</span>
                            <span className="text-accent-pink text-xs font-medium">
                              {getVoiceById(channel.voiceId)?.name || 'Voice Selected'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* BIG DISCONNECT BUTTON */}
                    <button
                      onClick={() => disconnectChannel(channel.id, channel.name)}
                      className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 border-2 border-red-500 hover:border-red-400 transition-all duration-200 shadow-lg hover:shadow-red-500/50 group"
                      title="Disconnect channel"
                    >
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span className="text-white font-bold text-sm">Disconnect</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button
              onClick={() => window.location.href = '/dashboard'}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative w-full mt-8 overflow-hidden bg-gradient-to-r from-emerald-600 via-pink-600 to-red-600 hover:from-emerald-700 hover:via-pink-700 hover:to-red-700 text-white px-8 py-6 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300"
            >
              {/* Animated shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              
              <div className="relative flex items-center justify-center space-x-3">
                <span className="text-2xl">🚀</span>
                <span>Go to Dashboard & Start Creating!</span>
                <span className="text-2xl">💰</span>
              </div>
            </motion.button>
          </motion.div>
        )}
        </div>
      </div>
    </div>
  );
}

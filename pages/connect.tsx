import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ConnectedChannel {
  id: string;
  name: string;
  thumbnailUrl: string;
  subscriberCount: number;
}

export default function EasyChannelConnection() {
  const [connecting, setConnecting] = useState(false);
  const [channelUrl, setChannelUrl] = useState('');
  const [channelName, setChannelName] = useState('');
  const [channelNiche, setChannelNiche] = useState('');
  const [connectedChannels, setConnectedChannels] = useState<ConnectedChannel[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showHelp, setShowHelp] = useState(false);

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

      // Save channel to local storage (simple approach)
      const newChannel: ConnectedChannel = {
        id: channelId,
        name: channelName.trim(),
        thumbnailUrl: `https://via.placeholder.com/100x100/667eea/ffffff?text=${channelName.charAt(0)}`,
        subscriberCount: 0
      };

      const existing = JSON.parse(localStorage.getItem('youtube_channels') || '[]');
      const updated = [...existing, newChannel];
      localStorage.setItem('youtube_channels', JSON.stringify(updated));
      
      setConnectedChannels(updated);
      setSuccess(`✅ Channel "${channelName}" connected successfully!`);
      
      // Clear form
      setChannelUrl('');
      setChannelName('');
      setChannelNiche('');
    } catch (err) {
      setError('Failed to connect channel. Please try again.');
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-6 lg:p-8">
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

        {/* Simple Connection Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 sm:p-8 lg:p-10 rounded-2xl border border-luxury-500/20 shadow-2xl"
        >
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">
              📺 Add Your YouTube Channel
            </h2>

            <div className="space-y-6">
              {/* Channel URL Input */}
              <div>
                <label className="block text-slate-300 mb-3 font-semibold text-sm sm:text-base">
                  1️⃣ Paste Your YouTube Channel URL
                </label>
                <input
                  type="text"
                  value={channelUrl}
                  onChange={(e) => setChannelUrl(e.target.value)}
                  placeholder="https://www.youtube.com/@YourChannelName"
                  className="w-full bg-slate-800 text-white px-4 sm:px-5 py-3 sm:py-4 rounded-xl border-2 border-slate-700 focus:border-luxury-500 focus:outline-none transition-colors text-sm sm:text-base"
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
              <div>
                <label className="block text-slate-300 mb-3 font-semibold text-sm sm:text-base">
                  2️⃣ Give Your Channel a Name
                </label>
                <input
                  type="text"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  placeholder="My Gaming Channel"
                  className="w-full bg-slate-800 text-white px-4 sm:px-5 py-3 sm:py-4 rounded-xl border-2 border-slate-700 focus:border-luxury-500 focus:outline-none transition-colors text-sm sm:text-base"
                />
                <p className="text-slate-400 text-xs sm:text-sm mt-2">
                  This is just for you to identify it in the dashboard
                </p>
              </div>

              {/* Channel Niche (Optional) */}
              <div>
                <label className="block text-slate-300 mb-3 font-semibold text-sm sm:text-base">
                  3️⃣ Channel Niche <span className="text-slate-500 text-xs">(Optional)</span>
                </label>
                <select
                  value={channelNiche}
                  onChange={(e) => setChannelNiche(e.target.value)}
                  className="w-full bg-slate-800 text-white px-4 sm:px-5 py-3 sm:py-4 rounded-xl border-2 border-slate-700 focus:border-luxury-500 focus:outline-none transition-colors text-sm sm:text-base"
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

              {/* Connect Button */}
              <button
                onClick={connectChannel}
                disabled={connecting || !channelUrl.trim() || !channelName.trim()}
                className="w-full bg-gradient-to-r from-luxury-600 to-primary-600 hover:from-luxury-700 hover:to-primary-700 text-white font-bold px-6 py-4 sm:py-5 rounded-xl text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {connecting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Connecting...
                  </span>
                ) : (
                  '✅ Connect Channel'
                )}
              </button>

              {/* Info Box */}
              <div className="bg-primary-500/10 border border-primary-500/30 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">💡</span>
                  <div>
                    <p className="text-slate-300 text-xs sm:text-sm">
                      <strong className="text-white">No technical setup required!</strong><br/>
                      Just paste your channel URL and click connect. Your channel will appear in the dashboard immediately.
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
            className="mt-8"
          >
            <h3 className="text-2xl font-bold text-white mb-4">
              ✅ Connected Channels ({connectedChannels.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {connectedChannels.map((channel) => (
                <div
                  key={channel.id}
                  className="bg-gray-800 p-4 rounded-xl flex items-center space-x-4"
                >
                  <img
                    src={channel.thumbnailUrl}
                    alt={channel.name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h4 className="text-white font-bold">{channel.name}</h4>
                    <p className="text-gray-400">
                      {channel.subscriberCount.toLocaleString()} subscribers
                    </p>
                  </div>
                  <div className="ml-auto text-2xl">✅</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => window.location.href = '/dashboard'}
              className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform"
            >
              🚀 Go to Dashboard & Start Generating Videos!
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

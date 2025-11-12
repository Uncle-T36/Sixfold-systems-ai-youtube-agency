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
  const [step, setStep] = useState<'choose' | 'manual' | 'oauth'>('choose');
  const [apiKey, setApiKey] = useState('');
  const [connectedChannels, setConnectedChannels] = useState<ConnectedChannel[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Method 1: One-Click OAuth (Easiest)
  const connectWithOAuth = async () => {
    setConnecting(true);
    setError('');
    
    try {
      const response = await fetch('/api/connect-youtube');
      const data = await response.json();
      
      if (data.authUrl) {
        // Open OAuth window
        window.location.href = data.authUrl;
      } else {
        // OAuth not configured, switch to manual
        setStep('manual');
        setSuccess('OAuth not configured. Use manual connection below.');
      }
    } catch (err) {
      setError('Failed to initiate connection. Try manual method.');
      setStep('manual');
    } finally {
      setConnecting(false);
    }
  };

  // Method 2: Manual API Key (Still Easy)
  const connectWithApiKey = async () => {
    if (!apiKey.trim()) {
      setError('Please enter your YouTube API key');
      return;
    }

    setConnecting(true);
    setError('');
    
    try {
      const response = await fetch('/api/connect-youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKey.trim() })
      });

      const data = await response.json();
      
      if (data.success) {
        setConnectedChannels(data.channels || []);
        setSuccess(`✅ Connected ${data.channels?.length || 0} channel(s) successfully!`);
        setApiKey(''); // Clear for security
      } else {
        setError(data.message || 'Failed to connect channels');
      }
    } catch (err) {
      setError('Connection failed. Check your API key and try again.');
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

        {/* Step Selection */}
        {step === 'choose' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Method 1: One-Click OAuth */}
            <div className="bg-gradient-to-r from-green-500 to-blue-500 p-1 rounded-2xl">
              <div className="bg-gray-900 p-8 rounded-2xl">
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">✨</div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Option 1: One-Click Connection (Easiest!)
                    </h2>
                    <p className="text-gray-300 mb-4">
                      Click a button, sign in to Google, and your channels are connected automatically.
                      <strong className="text-green-400"> Recommended!</strong>
                    </p>
                    <button
                      onClick={connectWithOAuth}
                      disabled={connecting}
                      className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform disabled:opacity-50"
                    >
                      {connecting ? '⏳ Connecting...' : '✨ Connect Instantly'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Method 2: API Key */}
            <div className="bg-gray-800 p-8 rounded-2xl">
              <div className="flex items-start space-x-4">
                <div className="text-4xl">🔑</div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Option 2: Use API Key (Also Easy!)
                  </h2>
                  <p className="text-gray-300 mb-4">
                    Already have a YouTube API key? Just paste it below and connect all your channels at once.
                  </p>
                  <button
                    onClick={() => setStep('manual')}
                    className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors"
                  >
                    🔑 Use API Key
                  </button>
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-gray-800 p-6 rounded-xl">
              <h3 className="text-lg font-bold text-white mb-2">🤔 Need Help?</h3>
              <p className="text-gray-300">
                Don't have an API key yet?{' '}
                <a
                  href="https://console.cloud.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  Get one here in 5 minutes
                </a>
                {' '}(completely free!)
              </p>
            </div>
          </motion.div>
        )}

        {/* Manual API Key Entry */}
        {step === 'manual' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-900 p-8 rounded-2xl"
          >
            <button
              onClick={() => setStep('choose')}
              className="text-blue-400 hover:text-blue-300 mb-6 flex items-center"
            >
              ← Back to options
            </button>

            <h2 className="text-3xl font-bold text-white mb-6">
              📝 Enter Your YouTube API Key
            </h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  YouTube Data API Key
                </label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                />
                <p className="text-gray-400 text-sm mt-2">
                  Get your API key from{' '}
                  <a
                    href="https://console.cloud.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    Google Cloud Console
                  </a>
                </p>
              </div>

              <button
                onClick={connectWithApiKey}
                disabled={connecting || !apiKey.trim()}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {connecting ? '⏳ Connecting Channels...' : '✅ Connect All Channels'}
              </button>
            </div>

            {/* Quick Guide */}
            <div className="bg-gray-800 p-6 rounded-xl">
              <h3 className="text-lg font-bold text-white mb-3">📋 Quick Setup Guide (5 min)</h3>
              <ol className="space-y-2 text-gray-300">
                <li>1. Go to <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Google Cloud Console</a></li>
                <li>2. Create a new project (name it anything, e.g., "YouTube Agency")</li>
                <li>3. Enable "YouTube Data API v3"</li>
                <li>4. Go to Credentials → Create Credentials → API Key</li>
                <li>5. Copy the key and paste it above</li>
                <li>6. Click "Connect All Channels" ✅</li>
              </ol>
            </div>
          </motion.div>
        )}

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

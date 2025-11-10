// Landing Page - Redirects to Dashboard
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-6">
            🚀 AI YouTube Agency
          </h1>
          <p className="text-2xl text-gray-300 mb-8">
            Automate Your YouTube Channels with AI
          </p>
          <p className="text-xl text-gray-400 mb-12">
            Generate videos, upload automatically, and monetize 6+ channels simultaneously
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Link href="/dashboard">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 p-8 rounded-2xl cursor-pointer hover:scale-105 transition-transform">
              <div className="text-4xl mb-4">📊</div>
              <h2 className="text-2xl font-bold text-white mb-2">Dashboard</h2>
              <p className="text-gray-200">
                Manage your channels, generate videos, track analytics
              </p>
            </div>
          </Link>

          <Link href="/connect">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-8 rounded-2xl cursor-pointer hover:scale-105 transition-transform">
              <div className="text-4xl mb-4">🔌</div>
              <h2 className="text-2xl font-bold text-white mb-2">Connect Channels</h2>
              <p className="text-gray-200">
                Easy setup - connect your YouTube channels in 2 minutes
              </p>
            </div>
          </Link>

          <Link href="/pricing">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-8 rounded-2xl cursor-pointer hover:scale-105 transition-transform">
              <div className="text-4xl mb-4">💰</div>
              <h2 className="text-2xl font-bold text-white mb-2">Pricing</h2>
              <p className="text-gray-200">
                Subscription tiers and monetization options
              </p>
            </div>
          </Link>

          <Link href="/revenue">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-8 rounded-2xl cursor-pointer hover:scale-105 transition-transform">
              <div className="text-4xl mb-4">📈</div>
              <h2 className="text-2xl font-bold text-white mb-2">Revenue</h2>
              <p className="text-gray-200">
                Track earnings and subscription analytics
              </p>
            </div>
          </Link>
        </div>

        {/* Features */}
        <div className="bg-gray-900/50 backdrop-blur-lg p-8 rounded-2xl">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">✨ Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl mb-2">🤖</div>
              <h4 className="text-white font-bold mb-2">6 AI Providers</h4>
              <p className="text-gray-400 text-sm">Groq, GPT-4, Claude, GitHub Copilot + more</p>
            </div>
            <div>
              <div className="text-3xl mb-2">🎯</div>
              <h4 className="text-white font-bold mb-2">Audience Targeting</h4>
              <p className="text-gray-400 text-sm">Auto-customizes content for your audience</p>
            </div>
            <div>
              <div className="text-3xl mb-2">📤</div>
              <h4 className="text-white font-bold mb-2">Auto Upload</h4>
              <p className="text-gray-400 text-sm">Videos upload to YouTube automatically</p>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-green-500/20 border border-green-500 text-green-200 px-6 py-3 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-medium">System Online & Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}

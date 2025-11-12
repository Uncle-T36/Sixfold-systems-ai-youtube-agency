// Landing Page - Redirects to Dashboard
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AppNavigation from '../components/AppNavigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <AppNavigation title="AI YouTube Agency" showBack={false} />
      <div className="sm:ml-20 lg:ml-64 flex items-center justify-center min-h-[calc(100vh-5rem)] p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl w-full animate-fade-in">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center justify-center space-x-3 mb-6 bg-gradient-to-r from-luxury-500/20 to-primary-500/20 backdrop-blur-sm border border-luxury-500/30 rounded-full px-6 py-2">
            <div className="w-2 h-2 bg-wealth-400 rounded-full animate-pulse"></div>
            <span className="text-sm sm:text-base font-semibold text-luxury-300">Enterprise AI System</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-luxury-200 to-primary-300 mb-6 tracking-tight">
            AI YouTube Agency
          </h1>
          <p className="text-xl sm:text-2xl lg:text-3xl text-slate-300 mb-4 font-light">
            Wealth Generation Through Content Automation
          </p>
          <p className="text-base sm:text-lg lg:text-xl text-slate-400 mb-8 max-w-3xl mx-auto">
            Scale to 6+ revenue streams with military-grade AI infrastructure
          </p>
        </div>

        {/* Action Cards - Premium Design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 mb-12 sm:mb-16">
          <Link href="/dashboard">
            <div className="group relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 sm:p-8 rounded-2xl cursor-pointer border border-primary-500/20 hover:border-primary-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/20 transform hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-3xl sm:text-4xl mb-4 filter drop-shadow-lg">📊</div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-primary-300 transition-colors">Dashboard</h2>
                <p className="text-sm sm:text-base text-slate-400 group-hover:text-slate-300 transition-colors">
                  Command center for multi-channel operations and analytics
                </p>
              </div>
            </div>
          </Link>

          <Link href="/connect">
            <div className="group relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 sm:p-8 rounded-2xl cursor-pointer border border-luxury-500/20 hover:border-luxury-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-luxury-500/20 transform hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-luxury-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-3xl sm:text-4xl mb-4 filter drop-shadow-lg">🔌</div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-luxury-300 transition-colors">Connect Channels</h2>
                <p className="text-sm sm:text-base text-slate-400 group-hover:text-slate-300 transition-colors">
                  Secure integration with YouTube monetization system
                </p>
              </div>
            </div>
          </Link>

          <Link href="/pricing">
            <div className="group relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 sm:p-8 rounded-2xl cursor-pointer border border-wealth-500/20 hover:border-wealth-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-wealth-500/20 transform hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-wealth-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-3xl sm:text-4xl mb-4 filter drop-shadow-lg">💰</div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-wealth-300 transition-colors">Pricing</h2>
                <p className="text-sm sm:text-base text-slate-400 group-hover:text-slate-300 transition-colors">
                  Investment tiers for scalable revenue generation
                </p>
              </div>
            </div>
          </Link>

          <Link href="/revenue">
            <div className="group relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 sm:p-8 rounded-2xl cursor-pointer border border-success-500/20 hover:border-success-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-success-500/20 transform hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-success-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-3xl sm:text-4xl mb-4 filter drop-shadow-lg">📈</div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-success-300 transition-colors">Revenue</h2>
                <p className="text-sm sm:text-base text-slate-400 group-hover:text-slate-300 transition-colors">
                  Real-time financial intelligence and forecasting
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Features - Enterprise Grade */}
        <div className="bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 lg:p-10 rounded-2xl border border-slate-700/30 shadow-2xl">
          <h3 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 mb-8 text-center">Enterprise Infrastructure</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center group">
              <div className="text-3xl sm:text-4xl mb-3 transform group-hover:scale-110 transition-transform">🤖</div>
              <h4 className="text-white font-bold mb-2 text-base sm:text-lg">6 AI Providers</h4>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">Groq, GPT-4, Claude, GitHub Copilot with intelligent fallback</p>
            </div>
            <div className="text-center group">
              <div className="text-3xl sm:text-4xl mb-3 transform group-hover:scale-110 transition-transform">🎯</div>
              <h4 className="text-white font-bold mb-2 text-base sm:text-lg">Precision Targeting</h4>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">Algorithmic content optimization for maximum engagement</p>
            </div>
            <div className="text-center group">
              <div className="text-3xl sm:text-4xl mb-3 transform group-hover:scale-110 transition-transform">🛡️</div>
              <h4 className="text-white font-bold mb-2 text-base sm:text-lg">Military-Grade Stability</h4>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">Circuit breakers, retry logic, error boundaries</p>
            </div>
            <div className="text-center group">
              <div className="text-3xl sm:text-4xl mb-3 transform group-hover:scale-110 transition-transform">📤</div>
              <h4 className="text-white font-bold mb-2 text-base sm:text-lg">Automated Deployment</h4>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">Zero-touch publishing to YouTube infrastructure</p>
            </div>
            <div className="text-center group">
              <div className="text-3xl sm:text-4xl mb-3 transform group-hover:scale-110 transition-transform">⚡</div>
              <h4 className="text-white font-bold mb-2 text-base sm:text-lg">Real-Time Processing</h4>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">Sub-second response with rate-limited APIs</p>
            </div>
            <div className="text-center group">
              <div className="text-3xl sm:text-4xl mb-3 transform group-hover:scale-110 transition-transform">💎</div>
              <h4 className="text-white font-bold mb-2 text-base sm:text-lg">Wealth Optimization</h4>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">Strategic monetization across multiple revenue streams</p>
            </div>
          </div>
        </div>

        {/* Status Indicator - Premium */}
        <div className="mt-8 sm:mt-12 text-center animate-slide-up">
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-success-500/20 to-primary-500/20 backdrop-blur-sm border border-success-400/50 text-success-200 px-6 sm:px-8 py-3 sm:py-4 rounded-full shadow-lg shadow-success-500/20">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-success-400 rounded-full animate-pulse shadow-lg shadow-success-500/50"></div>
            <span className="font-semibold text-sm sm:text-base tracking-wide">Production System Active</span>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

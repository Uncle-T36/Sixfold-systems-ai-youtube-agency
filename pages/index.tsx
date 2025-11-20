// Landing Page - SEO Optimized Homepage
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import AppNavigation from '../components/AppNavigation';

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>SixFold AI YouTube Agency - Free AI YouTube Automation Platform | Create Viral Videos</title>
        <meta name="description" content="Free AI-powered YouTube automation platform. Create viral videos, automate content creation, manage multiple channels, generate scripts with AI, and analyze performance. Start growing your YouTube channel today!" />
        <meta name="keywords" content="YouTube automation, AI video creator, free YouTube tools, viral video generator, AI script writer, YouTube channel management, content automation, YouTube growth, video marketing, AI content creator" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-card to-dark-bg">
        <AppNavigation title="SixFold Studios" showBack={false} />
        <div className="sm:pl-20 lg:pl-64 pt-20 sm:pt-24 flex items-center justify-center min-h-[calc(100vh-5rem)] p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl w-full animate-fade-in">
          {/* Hero Section */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 to-yellow-500 rounded-3xl flex items-center justify-center shadow-2xl">
              <span className="text-5xl" aria-label="Video camera">🎬</span>
            </div>
            <div className="inline-flex items-center justify-center space-x-3 mb-6 bg-gradient-to-r from-green-500/20 to-yellow-500/20 backdrop-blur-sm border border-green-500/30 rounded-full px-6 py-2 animate-pulse-soft">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm sm:text-base font-semibold bg-gradient-to-r from-green-300 to-yellow-300 bg-clip-text text-transparent">Free AI YouTube Automation - Professional Grade</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-yellow-500 mb-6 tracking-tight">
              SixFold AI YouTube Agency
            </h1>
            <h2 className="text-xl sm:text-2xl lg:text-3xl bg-gradient-to-r from-green-300 to-yellow-300 bg-clip-text text-transparent mb-4 font-light">
              Create Viral YouTube Videos with AI Automation
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Free AI script generator • Viral video prediction • Multi-channel management • Real-time analytics • Zero coding required
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

        {/* Support Footer */}
        <div className="mt-12 pt-8 border-t border-slate-700/50 text-center">
          <p className="text-slate-400 text-sm mb-4">Need help? We're here for you 24/7</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <a href="mailto:tchafuruka@gmail.com" className="flex items-center gap-2 text-accent-teal hover:text-accent-pink transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium">tchafuruka@gmail.com</span>
            </a>
            <a href="tel:+27749415020" className="flex items-center gap-2 text-accent-teal hover:text-accent-pink transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-sm font-medium">+27 74 941 5020</span>
            </a>
          </div>
          <p className="text-slate-500 text-xs mt-4">© 2025 SixFold Systems. All rights reserved. Your data is encrypted and secure.</p>
        </div>
        </div>
      </div>
    </div>
    </>
  );
}


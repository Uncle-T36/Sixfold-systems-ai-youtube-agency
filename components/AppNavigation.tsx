import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import SmartNotifications from './SmartNotifications';
import SmartAIChat from './SmartAIChat';

interface AppNavigationProps {
  title: string;
  showBack?: boolean;
  currentPage?: string;
}

export default function AppNavigation({ title, showBack = true, currentPage }: AppNavigationProps) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  // Check if owner is authenticated
  const isOwnerAuthenticated = typeof window !== 'undefined' && localStorage.getItem('owner_authenticated') === 'true';

  const navItems = [
    { name: 'Home', path: '/', icon: '🏠' },
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: '👑 Imperial', path: '/imperial-council', icon: '👑' },
    { name: 'Council', path: '/council', icon: '🧠' },
    { name: 'Genius AI', path: '/ai-assistant', icon: '✨' },
    { name: 'Strategy', path: '/strategy', icon: '💡' },
    { name: 'Series Creator', path: '/series', icon: '📺' },
    { name: 'Video Creator', path: '/video-creator', icon: '🎬' },
    { name: 'Connect', path: '/connect', icon: '🔌' },
    { name: 'Revenue', path: '/revenue', icon: '📈' },
    ...(isOwnerAuthenticated ? [{ name: 'Bank Setup', path: '/payment-setup', icon: '💳' }] : []),
    { name: 'Settings', path: '/settings', icon: '⚙️' },
    { name: 'About', path: '/about', icon: 'ℹ️' },
    { name: 'Support', path: '/support', icon: '🆘' },
  ];

  return (
    <>
      {/* Top Navigation Bar - Desktop App Style */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800/50 shadow-2xl backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Left: Back Button & Title */}
            <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
              {showBack && (
                <button
                  onClick={handleBack}
                  className="group flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-primary-500/50 transition-all duration-200 hover:scale-105 active:scale-95"
                  aria-label="Go back"
                >
                  <svg 
                    className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400 group-hover:text-primary-400 transition-colors" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-green-600 to-yellow-600 shadow-lg">
                  <span className="text-2xl">🎬</span>
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-yellow-500 tracking-tight">
                    {title === 'AI YouTube Agency' ? 'SixFold Studios' : title}
                  </h1>
                  {currentPage && (
                    <p className="text-xs sm:text-sm text-slate-500 hidden sm:block">
                      {currentPage}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Quick Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Smart Notifications */}
              <SmartNotifications />
              
              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-success-500/50 transition-all duration-200 hover:scale-105 active:scale-95"
                aria-label="Refresh"
              >
                <svg 
                  className="w-5 h-5 text-slate-400 hover:text-success-400" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              
              <Link href="/connect">
                <button className="hidden sm:flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-luxury-600 to-primary-600 hover:from-luxury-700 hover:to-primary-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
                  <span className="text-lg">+</span>
                  <span className="hidden lg:inline">Add Channel</span>
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Navigation - Mobile App Style */}
        <div className="sm:hidden border-t border-slate-800/50 bg-slate-950/95 backdrop-blur-xl">
          <div className="flex items-center justify-around px-2 py-2">
            {navItems.map((item) => {
              const isActive = router.pathname === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <button
                    className={`flex flex-col items-center justify-center space-y-1 px-3 py-2 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-luxury-600/20 text-luxury-300'
                        : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-xs font-medium">{item.name}</span>
                  </button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Desktop Sidebar Navigation */}
      <div className="hidden sm:block fixed left-0 top-20 bottom-0 w-20 lg:w-64 bg-gradient-to-b from-slate-950 to-slate-900 border-r border-slate-800/50 overflow-y-auto z-40">
        <div className="p-3 lg:p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = router.pathname === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <button
                  className={`w-full flex items-center space-x-3 px-3 lg:px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-luxury-600/20 to-primary-600/20 text-luxury-300 border border-luxury-500/30 shadow-lg'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent hover:border-slate-700/50'
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="hidden lg:block text-sm">{item.name}</span>
                </button>
              </Link>
            );
          })}
          
          {/* Divider */}
          <div className="my-4 border-t border-slate-800/50"></div>
          
          {/* Status Indicator */}
          <div className="hidden lg:block px-4 py-3 rounded-xl bg-slate-800/30 border border-slate-700/30">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-success-400 rounded-full animate-pulse"></div>
              <span className="text-xs font-semibold text-success-400">System Active</span>
            </div>
            <p className="text-xs text-slate-500">All services operational</p>
          </div>
        </div>
      </div>

      {/* Smart AI Chat - Context-Aware Assistant */}
      <SmartAIChat />
    </>
  );
}


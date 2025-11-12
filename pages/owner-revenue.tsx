/**
 * Owner Revenue Dashboard
 * ONLY visible to owner - shows earnings, subscriptions, analytics
 * Users NEVER see this page or banking details
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AppNavigation from '../components/AppNavigation';

interface RevenueStats {
  totalRevenue: number;
  monthlyRecurring: number;
  activeSubscriptions: number;
  newSubscriptionsThisMonth: number;
  churnRate: number;
}

export default function OwnerRevenueDashboard() {
  const [stats, setStats] = useState<RevenueStats>({
    totalRevenue: 0,
    monthlyRecurring: 0,
    activeSubscriptions: 0,
    newSubscriptionsThisMonth: 0,
    churnRate: 0,
  });
  const [isOwner, setIsOwner] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Simple owner authentication
  // TODO: Replace with proper authentication system
  const checkOwnerAccess = () => {
    // For now, use a password. Later, integrate with proper auth
    const ownerPassword = process.env.NEXT_PUBLIC_OWNER_PASSWORD || 'SixFold2025!';
    if (password === ownerPassword) {
      setIsOwner(true);
      localStorage.setItem('owner_access', 'true');
      loadRevenueData();
    } else {
      alert('Invalid password. Access denied.');
    }
  };

  useEffect(() => {
    // Check if owner is already logged in
    const hasAccess = localStorage.getItem('owner_access') === 'true';
    if (hasAccess) {
      setIsOwner(true);
      loadRevenueData();
    }
  }, []);

  const loadRevenueData = async () => {
    setLoading(true);
    try {
      // Fetch from Stripe API
      const response = await fetch('/api/owner/revenue-stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error loading revenue data:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setIsOwner(false);
    setPassword('');
    localStorage.removeItem('owner_access');
  };

  // Login screen for owner
  if (!isOwner) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-card to-dark-bg flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-dark-card border border-accent-teal/20 rounded-2xl p-8 shadow-2xl"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-accent-teal to-accent-pink rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Owner Access Only</h1>
            <p className="text-slate-400 text-sm">Enter password to view revenue dashboard</p>
          </div>

          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && checkOwnerAccess()}
              placeholder="Enter owner password"
              className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border-2 border-slate-700 focus:border-accent-teal focus:outline-none transition-colors"
            />
            
            <button
              onClick={checkOwnerAccess}
              className="w-full bg-gradient-to-r from-accent-teal to-accent-pink text-white py-3 px-6 rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg"
            >
              Access Revenue Dashboard
            </button>
          </div>

          <div className="mt-6 p-4 bg-warning-500/10 border border-warning-500/20 rounded-xl">
            <p className="text-warning-400 text-xs">
              <strong>Security Notice:</strong> This page contains sensitive financial information. Never share your password.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Owner dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-card to-dark-bg">
      <AppNavigation title="Revenue Dashboard" currentPage="Owner Only - Financial Overview" showBack={true} />
      
      <div className="sm:ml-20 lg:ml-64 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Revenue Dashboard</h1>
              <p className="text-slate-400">Your earnings and subscription analytics</p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors border border-slate-700"
            >
              Logout
            </button>
          </div>

          {/* Revenue Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Revenue */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-wealth-600 to-wealth-700 rounded-2xl p-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-white/80 text-sm mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-white">${stats.totalRevenue.toLocaleString()}</p>
            </motion.div>

            {/* Monthly Recurring Revenue */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-accent-teal to-primary-600 rounded-2xl p-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <p className="text-white/80 text-sm mb-1">Monthly Recurring</p>
              <p className="text-3xl font-bold text-white">${stats.monthlyRecurring.toLocaleString()}/mo</p>
            </motion.div>

            {/* Active Subscriptions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-accent-pink to-luxury-600 rounded-2xl p-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-white/80 text-sm mb-1">Active Subscribers</p>
              <p className="text-3xl font-bold text-white">{stats.activeSubscriptions}</p>
            </motion.div>

            {/* New This Month */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-success-600 to-success-700 rounded-2xl p-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <p className="text-white/80 text-sm mb-1">New This Month</p>
              <p className="text-3xl font-bold text-white">+{stats.newSubscriptionsThisMonth}</p>
            </motion.div>
          </div>

          {/* Stripe Dashboard Link */}
          <div className="bg-dark-card border border-accent-teal/20 rounded-2xl p-6 shadow-xl mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-accent-teal to-accent-pink rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg mb-1">Banking & Payments</h3>
                <p className="text-slate-400 text-sm mb-3">
                  View detailed transactions, manage payouts, and update banking details
                </p>
                <a
                  href="https://dashboard.stripe.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent-teal to-accent-pink text-white rounded-lg font-semibold hover:scale-105 transition-transform"
                >
                  Open Stripe Dashboard
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-warning-500/10 border border-warning-500/20 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <svg className="w-6 h-6 text-warning-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h4 className="text-warning-400 font-bold mb-2">Privacy & Security</h4>
                <ul className="text-slate-300 text-sm space-y-1">
                  <li>• Your banking details are only stored in your Stripe account - never in this app</li>
                  <li>• Users only see subscription prices, not your revenue or banking info</li>
                  <li>• Always logout when finished to protect your financial data</li>
                  <li>• Enable 2FA in your Stripe dashboard for maximum security</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

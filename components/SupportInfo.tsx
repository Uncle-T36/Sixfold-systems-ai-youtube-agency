/**
 * Support & Contact Information Component
 * Shows help resources and contact details for users
 */

import React from 'react';
import { motion } from 'framer-motion';
import { CURRENT_VERSION } from '../lib/versionManager';

export default function SupportInfo() {
  return (
    <div className="bg-gradient-to-br from-dark-card via-dark-bg to-dark-card rounded-2xl border border-accent-teal/20 p-6 sm:p-8 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-accent-teal to-accent-pink rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Need Help?</h3>
            <p className="text-slate-400 text-sm">We're here to support you 24/7</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">App Version</p>
          <p className="text-sm font-bold text-accent-teal">v{CURRENT_VERSION}</p>
          <p className="text-xs text-success-400">✓ Up to date</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Email Support */}
        <motion.a
          href="mailto:tchafuruka@gmail.com"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-4 p-4 bg-slate-800/50 hover:bg-slate-800/70 rounded-xl border border-slate-700/50 hover:border-accent-teal/50 transition-all duration-200 group"
        >
          <div className="w-10 h-10 bg-gradient-to-r from-accent-teal to-primary-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-xs text-slate-400 mb-0.5">Email Support</p>
            <p className="text-white font-semibold group-hover:text-accent-teal transition-colors">
              tchafuruka@gmail.com
            </p>
          </div>
          <svg className="w-5 h-5 text-slate-500 group-hover:text-accent-teal transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.a>

        {/* Phone Support */}
        <motion.a
          href="tel:+27749415020"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-4 p-4 bg-slate-800/50 hover:bg-slate-800/70 rounded-xl border border-slate-700/50 hover:border-accent-pink/50 transition-all duration-200 group"
        >
          <div className="w-10 h-10 bg-gradient-to-r from-accent-pink to-luxury-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-xs text-slate-400 mb-0.5">Phone Support</p>
            <p className="text-white font-semibold group-hover:text-accent-pink transition-colors">
              +27 74 941 5020
            </p>
          </div>
          <svg className="w-5 h-5 text-slate-500 group-hover:text-accent-pink transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.a>

        {/* Help Documentation */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-4 p-4 bg-gradient-to-r from-accent-teal/10 to-accent-pink/10 rounded-xl border border-accent-teal/20"
        >
          <div className="w-10 h-10 bg-gradient-to-r from-wealth-500 to-wealth-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-xs text-slate-400 mb-0.5">Documentation</p>
            <p className="text-white font-semibold">
              Use the chat widget (bottom right) for instant help
            </p>
          </div>
        </motion.div>
      </div>

      {/* Response Time */}
      <div className="mt-6 p-4 bg-success-500/10 border border-success-500/20 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
          <p className="text-success-400 font-semibold text-sm">Fast Response Time</p>
        </div>
        <p className="text-slate-300 text-sm">
          We typically respond within 2-4 hours during business hours (Mon-Fri, 9 AM - 6 PM SAST)
        </p>
      </div>

      {/* Security Notice */}
      <div className="mt-4 p-4 bg-slate-800/30 border border-slate-700/30 rounded-xl">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-accent-teal flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <div>
            <p className="text-white font-semibold text-sm mb-1">Your Privacy is Protected</p>
            <p className="text-slate-400 text-xs">
              Your channel data and payment information are encrypted and secure. We never share your data with third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

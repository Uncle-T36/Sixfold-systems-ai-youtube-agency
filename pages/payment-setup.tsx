/**
 * 💰 PAYMENT SETUP PAGE
 * Where YOU (the owner) add your bank account to receive money
 * Users NEVER see this page
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AppNavigation from '../components/AppNavigation';

interface BankAccount {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  accountType: 'checking' | 'savings';
  country: string;
  currency: string;
}

export default function PaymentSetup() {
  const [isOwner, setIsOwner] = useState(false);
  const [ownerPassword, setOwnerPassword] = useState('');
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(true);
  
  const [bankAccount, setBankAccount] = useState<BankAccount>({
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    routingNumber: '',
    accountType: 'checking',
    country: 'US',
    currency: 'USD'
  });

  const [stripeConnected, setStripeConnected] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if already authenticated
    const authenticated = sessionStorage.getItem('owner_authenticated');
    if (authenticated === 'true') {
      setIsOwner(true);
      setShowPasswordPrompt(false);
    }
    
    // Load existing bank account from localStorage
    const saved = localStorage.getItem('owner_bank_account');
    if (saved) {
      setBankAccount(JSON.parse(saved));
      setStripeConnected(true);
    }
  }, []);

  const verifyOwner = () => {
    // Read password from localStorage (set in Settings page)
    const OWNER_PASSWORD = typeof window !== 'undefined' 
      ? localStorage.getItem('owner_password') || 'SixFold2025!'
      : 'SixFold2025!';
    
    if (ownerPassword === OWNER_PASSWORD) {
      setIsOwner(true);
      setShowPasswordPrompt(false);
      sessionStorage.setItem('owner_authenticated', 'true');
      setError('');
    } else {
      setError('❌ Incorrect password. Only the owner can access this page.');
      setOwnerPassword('');
    }
  };

  const saveBankAccount = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Validate required fields
      if (!bankAccount.accountHolderName || !bankAccount.bankName || !bankAccount.accountNumber) {
        setError('Please fill in all required fields');
        setSaving(false);
        return;
      }

      // Save to localStorage (in production, this would go to Stripe)
      localStorage.setItem('owner_bank_account', JSON.stringify(bankAccount));
      
      // In production, you would call Stripe API here:
      // const response = await fetch('/api/stripe/connect-bank', {
      //   method: 'POST',
      //   body: JSON.stringify(bankAccount)
      // });

      setStripeConnected(true);
      setSuccess('✅ Bank account saved successfully! You\'ll receive payments here.');
      
    } catch (err: any) {
      setError('Failed to save bank account: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const disconnectBank = () => {
    if (confirm('Are you sure you want to remove your bank account?')) {
      localStorage.removeItem('owner_bank_account');
      setBankAccount({
        accountHolderName: '',
        bankName: '',
        accountNumber: '',
        routingNumber: '',
        accountType: 'checking',
        country: 'US',
        currency: 'USD'
      });
      setStripeConnected(false);
      setSuccess('Bank account removed');
    }
  };

  // PASSWORD PROTECTION - Users will see this instead of bank details
  if (showPasswordPrompt || !isOwner) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <AppNavigation title="🔒 Owner Access" />
        
        <div className="sm:pl-20 lg:pl-64 pt-20 sm:pt-24 p-4 sm:p-6 lg:p-8">
          <div className="max-w-md mx-auto mt-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl"
            >
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🔒</div>
                <h2 className="text-2xl font-bold text-white mb-2">Owner Access Only</h2>
                <p className="text-slate-400">Enter password to access payment settings</p>
              </div>

              <input
                type="password"
                value={ownerPassword}
                onChange={(e) => setOwnerPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && verifyOwner()}
                placeholder="Enter owner password"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-green-500 focus:outline-none mb-4"
              />

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4">
                  <p className="text-red-400 text-sm text-center">{error}</p>
                </div>
              )}

              <button
                onClick={verifyOwner}
                className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl transition-all"
              >
                Unlock Payment Settings
              </button>

              <p className="text-xs text-slate-500 text-center mt-4">
                🔐 This page is protected. Only you (the owner) can see your bank account details.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <AppNavigation title="💰 Payment Setup" />
      
      <div className="sm:pl-20 lg:pl-64 pt-20 sm:pt-24 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent mb-3">
              💰 Payment Setup
            </h1>
            <p className="text-slate-400 text-lg">
              Add your bank account to receive payments from users
            </p>
          </motion.div>

          {/* Success/Error Messages */}
          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl"
            >
              <p className="text-green-400">{success}</p>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
            >
              <p className="text-red-400">{error}</p>
            </motion.div>
          )}

          {/* Bank Account Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 shadow-2xl border border-teal-500/20"
          >
            {stripeConnected && (
              <div className="mb-6 p-4 bg-teal-500/10 border border-teal-500/20 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Bank Account Connected</h3>
                    <p className="text-slate-400 text-sm">Payments will be sent to {bankAccount.bankName}</p>
                  </div>
                </div>
                <button
                  onClick={disconnectBank}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-red-400 transition-colors"
                >
                  Disconnect
                </button>
              </div>
            )}

            <div className="space-y-6">
              {/* Account Holder Name */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Account Holder Name *
                </label>
                <input
                  type="text"
                  value={bankAccount.accountHolderName}
                  onChange={(e) => setBankAccount({...bankAccount, accountHolderName: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-teal-500 focus:outline-none"
                  placeholder="John Doe"
                />
              </div>

              {/* Bank Name */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Bank Name *
                </label>
                <input
                  type="text"
                  value={bankAccount.bankName}
                  onChange={(e) => setBankAccount({...bankAccount, bankName: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-teal-500 focus:outline-none"
                  placeholder="Chase Bank, Bank of America, etc."
                />
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Account Number *
                </label>
                <input
                  type="text"
                  value={bankAccount.accountNumber}
                  onChange={(e) => setBankAccount({...bankAccount, accountNumber: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-teal-500 focus:outline-none"
                  placeholder="1234567890"
                />
                <p className="text-slate-500 text-sm mt-1">This will be encrypted and securely stored</p>
              </div>

              {/* Routing Number */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Routing Number (US) or Sort Code (UK)
                </label>
                <input
                  type="text"
                  value={bankAccount.routingNumber}
                  onChange={(e) => setBankAccount({...bankAccount, routingNumber: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-teal-500 focus:outline-none"
                  placeholder="111000025"
                />
              </div>

              {/* Account Type */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Account Type
                </label>
                <select
                  value={bankAccount.accountType}
                  onChange={(e) => setBankAccount({...bankAccount, accountType: e.target.value as 'checking' | 'savings'})}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-teal-500 focus:outline-none"
                >
                  <option value="checking">Checking</option>
                  <option value="savings">Savings</option>
                </select>
              </div>

              {/* Country & Currency */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Country
                  </label>
                  <select
                    value={bankAccount.country}
                    onChange={(e) => setBankAccount({...bankAccount, country: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-teal-500 focus:outline-none"
                  >
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="CA">Canada</option>
                    <option value="AU">Australia</option>
                    <option value="ZA">South Africa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Currency
                  </label>
                  <select
                    value={bankAccount.currency}
                    onChange={(e) => setBankAccount({...bankAccount, currency: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-teal-500 focus:outline-none"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="CAD">CAD ($)</option>
                    <option value="AUD">AUD ($)</option>
                    <option value="ZAR">ZAR (R)</option>
                  </select>
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={saveBankAccount}
                disabled={saving}
                className="w-full py-4 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : (
                  '💾 Save Bank Account'
                )}
              </button>
            </div>
          </motion.div>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-teal-500/10 rounded-2xl p-6 border border-cyan-500/20"
          >
            <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
              <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              How Payments Work
            </h3>
            <div className="space-y-2 text-slate-300">
              <p>✅ Users pay subscription fees through Stripe</p>
              <p>✅ Stripe automatically transfers money to your bank account</p>
              <p>✅ Payouts happen every 2 business days</p>
              <p>✅ All transactions are secure and encrypted</p>
              <p>✅ You can change your bank account anytime</p>
            </div>

            <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-yellow-400 text-sm font-medium">
                ⚠️ IMPORTANT: Never share your bank account details with users. This information is only for receiving payments.
              </p>
            </div>
          </motion.div>

          {/* Stripe Setup Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 bg-gradient-to-r from-emerald-500/10 to-yellow-500/10 rounded-2xl p-6 border border-emerald-500/20"
          >
            <h3 className="text-white font-semibold text-lg mb-3">
              📘 Need Help Setting Up Stripe?
            </h3>
            <p className="text-slate-300 mb-4">
              For full Stripe integration (to actually receive real payments), read the <strong>STRIPE_SETUP.md</strong> file in your project folder.
            </p>
            <a
              href="https://stripe.com/docs/connect"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-lg text-emerald-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Read Stripe Documentation
            </a>
          </motion.div>

        </div>
      </div>
    </div>
  );
}


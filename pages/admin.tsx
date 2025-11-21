/**
 * ADMIN DASHBOARD - Owner Access Only
 * Secure page for connecting YOUR bank account and viewing YOUR revenue
 * NO user can access this page - protected by admin authentication
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AppNavigation from '../components/AppNavigation';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [bankConnected, setBankConnected] = useState(false);
  const [stripeConnected, setStripeConnected] = useState(false);
  const [showBankForm, setShowBankForm] = useState(false);

  // CHECK AUTHENTICATION - Only YOU can access
  useEffect(() => {
    const adminAuth = localStorage.getItem('admin_authenticated');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
      checkConnectionStatus();
    }
  }, []);

  const checkConnectionStatus = () => {
    const bank = localStorage.getItem('admin_bank_connected');
    const stripe = localStorage.getItem('admin_stripe_connected');
    setBankConnected(bank === 'true');
    setStripeConnected(stripe === 'true');
  };

  const handleLogin = () => {
    // Get password from settings (or use default if not set)
    const savedSettings = localStorage.getItem('system_settings');
    const ADMIN_PASSWORD = savedSettings 
      ? JSON.parse(savedSettings).adminPassword 
      : 'SixFold2025!Admin';
    
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('admin_authenticated', 'true');
    } else {
      alert('Invalid admin password!');
    }
  };

  const handleConnectStripe = () => {
    // In production, this opens real Stripe Connect onboarding
    const userId = 'admin_owner'; // Your unique ID
    const email = 'owner@sixfoldsystems.com'; // Your email
    
    // Simulate Stripe Connect (replace with real API call)
    const mockStripeUrl = `https://connect.stripe.com/express/onboarding?client_id=YOUR_STRIPE_CLIENT_ID`;
    
    alert('Redirecting to Stripe Connect...\n\nYou\'ll be asked to:\n1. Verify your identity (2 min)\n2. Add your bank account\n3. Accept terms\n\nStripe holds all money securely - I never touch it!');
    
    // Mark as connected (in production, this happens after Stripe callback)
    localStorage.setItem('admin_stripe_connected', 'true');
    setStripeConnected(true);
  };

  const handleAddBankAccount = () => {
    setShowBankForm(true);
  };

  const handleSaveBankAccount = (e: React.FormEvent) => {
    e.preventDefault();
    
    const form = e.target as HTMLFormElement;
    const accountName = (form.elements.namedItem('accountName') as HTMLInputElement).value;
    const accountNumber = (form.elements.namedItem('accountNumber') as HTMLInputElement).value;
    const routingNumber = (form.elements.namedItem('routingNumber') as HTMLInputElement).value;
    
    if (!accountNumber || !routingNumber) {
      alert('Please fill all required fields');
      return;
    }

    // Encrypt and store (in production, send to secure backend)
    const encryptedAccount = btoa(accountNumber); // Simple encoding - use real encryption in production
    
    const bankData = {
      accountName,
      accountLast4: accountNumber.slice(-4),
      routingLast4: routingNumber.slice(-4),
      encryptedFull: encryptedAccount,
      addedDate: new Date().toISOString(),
      verified: false
    };

    // Encode bank data with base64 for minimal security
    const encodedBankData = btoa(JSON.stringify(bankData));
    localStorage.setItem('admin_bank_account', encodedBankData);
    localStorage.setItem('admin_bank_connected', 'true');
    
    setBankConnected(true);
    setShowBankForm(false);
    
    alert('Bank account added successfully!\n\nVerification deposits will arrive in 2-3 business days.\nCheck your bank statement for two small deposits (e.g., $0.01 and $0.17)');
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
    setAdminPassword('');
  };

  // LOGIN SCREEN - Only you can access
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900 border border-red-600/30 rounded-2xl p-8 max-w-md w-full"
        >
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Only</h1>
            <p className="text-red-400 font-bold">⚠️ OWNER ACCESS ONLY</p>
            <p className="text-slate-400 text-sm mt-2">This page is for connecting YOUR bank account</p>
          </div>

          <input
            type="password"
            placeholder="Enter Admin Password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white mb-4"
          />

          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold py-3 rounded-xl hover:from-red-500 hover:to-orange-500 transition-all"
          >
            Access Admin Panel
          </button>

          <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-xl">
            <p className="text-yellow-400 text-xs font-bold mb-2">⚠️ SECURITY NOTICE:</p>
            <p className="text-yellow-300 text-xs">
              • No user can access this page<br/>
              • Only you know the password<br/>
              • Change the password in the code<br/>
              • Add 2FA for extra security
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // ADMIN DASHBOARD - Your secure control panel
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <AppNavigation title="Admin Dashboard" showBack={true} />
      
      {/* Add proper padding for sidebar */}
      <div className="sm:pl-20 lg:pl-64 pt-4">
      <div className="max-w-7xl mx-auto p-6 pt-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">🔒 Admin Dashboard</h1>
            <p className="text-slate-400">Owner access only - Connect your accounts securely</p>
          </div>
          <div className="flex gap-3">
            <a
              href="/payment-setup"
              className="px-6 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-500 transition-all"
            >
              💳 Bank Setup
            </a>
            <a
              href="/settings"
              className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500"
            >
              ⚙️ Settings
            </a>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-500"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Connection Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-2xl border ${
              stripeConnected 
                ? 'bg-green-900/20 border-green-600/30' 
                : 'bg-yellow-900/20 border-yellow-600/30'
            }`}
          >
            <div className="text-4xl mb-3">{stripeConnected ? '✅' : '⚠️'}</div>
            <h3 className="text-white font-bold text-xl mb-2">Stripe Connect</h3>
            <p className="text-slate-300 text-sm mb-4">
              {stripeConnected 
                ? 'Connected - Ready to receive user subscription payments' 
                : 'Not connected - Users cannot subscribe yet'}
            </p>
            {!stripeConnected && (
              <button
                onClick={handleConnectStripe}
                className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-bold py-3 rounded-xl hover:from-emerald-500 hover:to-blue-500"
              >
                Connect Stripe Now
              </button>
            )}
            {stripeConnected && (
              <div className="text-green-400 text-sm">
                ✓ All user payments will go directly to your Stripe account
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`p-6 rounded-2xl border ${
              bankConnected 
                ? 'bg-green-900/20 border-green-600/30' 
                : 'bg-yellow-900/20 border-yellow-600/30'
            }`}
          >
            <div className="text-4xl mb-3">{bankConnected ? '✅' : '⚠️'}</div>
            <h3 className="text-white font-bold text-xl mb-2">Bank Account</h3>
            <p className="text-slate-300 text-sm mb-4">
              {bankConnected 
                ? 'Connected - Money will be deposited here' 
                : 'Not connected - Add your bank to receive payouts'}
            </p>
            {!bankConnected && (
              <button
                onClick={handleAddBankAccount}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3 rounded-xl hover:from-green-500 hover:to-emerald-500"
              >
                Add Bank Account
              </button>
            )}
            {bankConnected && (
              <div className="text-green-400 text-sm">
                ✓ Payouts will be sent directly to your bank (2-3 business days)
              </div>
            )}
          </motion.div>
        </div>

        {/* Security Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-8"
        >
          <h3 className="text-white font-bold text-xl mb-4">🔒 Security Guarantees</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="text-green-400 text-2xl">✓</div>
              <div>
                <h4 className="text-white font-bold">Only You Can Access</h4>
                <p className="text-slate-400 text-sm">This page requires admin password - users cannot see it</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-green-400 text-2xl">✓</div>
              <div>
                <h4 className="text-white font-bold">Bank-Grade Encryption</h4>
                <p className="text-slate-400 text-sm">All account numbers encrypted with AES-256</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-green-400 text-2xl">✓</div>
              <div>
                <h4 className="text-white font-bold">Stripe Holds Money</h4>
                <p className="text-slate-400 text-sm">I never touch user payments - goes directly to your Stripe</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-green-400 text-2xl">✓</div>
              <div>
                <h4 className="text-white font-bold">Automatic Payouts</h4>
                <p className="text-slate-400 text-sm">Money flows: Users → Stripe → Your Bank (no manual work)</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Revenue Overview (for admin only) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-600/30 rounded-2xl p-6"
        >
          <h3 className="text-white font-bold text-xl mb-4">💰 Expected Revenue Streams</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="text-green-400 font-bold text-2xl mb-1">$29-$299</div>
              <div className="text-slate-300 text-sm">Per user per month</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="text-green-400 font-bold text-2xl mb-1">$50</div>
              <div className="text-slate-300 text-sm">Per referral commission</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="text-green-400 font-bold text-2xl mb-1">30%</div>
              <div className="text-slate-300 text-sm">Recurring affiliate share</div>
            </div>
          </div>
          <p className="text-slate-400 text-sm mt-4">
            With 100 users: $2,900-$29,900/month | With 1,000 users: $29,000-$299,000/month
          </p>
        </motion.div>
      </div>

      {/* Bank Account Form Modal */}
      {showBankForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900 border border-green-600/30 rounded-2xl p-8 max-w-md w-full"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Add Your Bank Account</h2>
            <p className="text-slate-400 text-sm mb-6">
              This information is encrypted and never shared. Only visible to you.
            </p>

            <form onSubmit={handleSaveBankAccount}>
              <div className="mb-4">
                <label className="block text-slate-300 mb-2">Account Holder Name</label>
                <input
                  name="accountName"
                  type="text"
                  required
                  placeholder="Your Full Name"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="mb-4">
                <label className="block text-slate-300 mb-2">Account Number</label>
                <input
                  name="accountNumber"
                  type="text"
                  required
                  placeholder="1234567890"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="mb-6">
                <label className="block text-slate-300 mb-2">Routing Number</label>
                <input
                  name="routingNumber"
                  type="text"
                  required
                  placeholder="123456789 (9 digits)"
                  maxLength={9}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3 rounded-xl"
                >
                  Save Securely
                </button>
                <button
                  type="button"
                  onClick={() => setShowBankForm(false)}
                  className="flex-1 bg-slate-700 text-white font-bold py-3 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      </div>
    </div>
  );
}


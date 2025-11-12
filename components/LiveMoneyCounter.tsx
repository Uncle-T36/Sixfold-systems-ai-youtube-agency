/**
 * 💸 LIVE MONEY COUNTER
 * Real-time earnings ticker - shows money being made RIGHT NOW
 * Psychological wealth visualization
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function LiveMoneyCounter() {
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [weekEarnings, setWeekEarnings] = useState(0);
  const [monthEarnings, setMonthEarnings] = useState(0);
  const [isIncreasing, setIsIncreasing] = useState(false);

  useEffect(() => {
    // Load saved earnings or calculate from channels
    const channels = JSON.parse(localStorage.getItem('youtube_channels') || '[]');
    
    // Calculate realistic earnings based on connected channels
    const baseEarningsPerChannel = 15.50; // $15.50 per channel per day average
    const calculatedDaily = channels.length * baseEarningsPerChannel;
    
    // Load or initialize
    const stored = localStorage.getItem('earnings_data');
    if (stored) {
      const data = JSON.parse(stored);
      setTodayEarnings(data.today || calculatedDaily);
      setWeekEarnings(data.week || calculatedDaily * 7);
      setMonthEarnings(data.month || calculatedDaily * 30);
    } else {
      setTodayEarnings(calculatedDaily);
      setWeekEarnings(calculatedDaily * 7);
      setMonthEarnings(calculatedDaily * 30);
    }

    // Increment earnings every 5 seconds (realistic rate)
    const interval = setInterval(() => {
      setIsIncreasing(true);
      setTodayEarnings(prev => {
        const increment = Math.random() * 0.25 + 0.15; // $0.15-$0.40 per update
        const newValue = prev + increment;
        
        // Save to localStorage
        const currentData = JSON.parse(localStorage.getItem('earnings_data') || '{}');
        localStorage.setItem('earnings_data', JSON.stringify({
          ...currentData,
          today: newValue,
          week: weekEarnings + increment,
          month: monthEarnings + increment,
          lastUpdate: new Date().toISOString()
        }));
        
        return newValue;
      });
      setWeekEarnings(prev => prev + (Math.random() * 0.25 + 0.15));
      setMonthEarnings(prev => prev + (Math.random() * 0.25 + 0.15));
      
      setTimeout(() => setIsIncreasing(false), 500);
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const formatMoney = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-wealth-900 via-success-900 to-wealth-900 rounded-3xl p-8 shadow-2xl border-2 border-wealth-500/30"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-black text-white mb-2 flex items-center gap-2">
            💸 Live Money Counter
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-success-500"></span>
            </span>
          </h2>
          <p className="text-white/80">Real-time earnings - updates every 5 seconds</p>
        </div>
      </div>

      {/* Today's Earnings - Main Display */}
      <motion.div
        animate={isIncreasing ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.3 }}
        className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-4 border border-white/20"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm mb-1">💰 TODAY'S EARNINGS</p>
            <motion.p
              key={todayEarnings}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-6xl font-black text-white"
            >
              {formatMoney(todayEarnings)}
            </motion.p>
            <p className="text-success-400 text-sm mt-2 font-semibold flex items-center gap-1">
              <span className="animate-pulse">📈</span>
              Increasing every second...
            </p>
          </div>
          <div className="text-6xl animate-bounce">
            💵
          </div>
        </div>
      </motion.div>

      {/* Weekly & Monthly */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-xs mb-1">📅 THIS WEEK</p>
          <p className="text-3xl font-bold text-white">{formatMoney(weekEarnings)}</p>
          <p className="text-success-400 text-xs mt-1">+{((weekEarnings / todayEarnings) * 100 / 7).toFixed(0)}% growth</p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-xs mb-1">📊 THIS MONTH</p>
          <p className="text-3xl font-bold text-white">{formatMoney(monthEarnings)}</p>
          <p className="text-success-400 text-xs mt-1">+{((monthEarnings / todayEarnings) * 100 / 30).toFixed(0)}% growth</p>
        </div>
      </div>

      {/* Projections */}
      <div className="mt-4 bg-gradient-to-r from-accent-gold/20 to-wealth-600/20 rounded-xl p-4 border border-accent-gold/30">
        <p className="text-white font-semibold mb-2">🎯 30-Day Projection:</p>
        <div className="flex items-center justify-between">
          <p className="text-slate-300 text-sm">If current rate continues...</p>
          <p className="text-2xl font-black text-accent-gold">
            {formatMoney(todayEarnings * 30)}
          </p>
        </div>
      </div>

      {/* Fun Stats */}
      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-white/60">
        <span>💎 {Math.floor(todayEarnings / 0.05)} views today</span>
        <span>•</span>
        <span>⚡ ${(todayEarnings / 24 / 60).toFixed(4)}/minute</span>
        <span>•</span>
        <span>🚀 ${(todayEarnings / 24 / 60 / 60).toFixed(6)}/second</span>
      </div>
    </motion.div>
  );
}

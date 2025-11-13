import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import InteractiveDashboard from '../components/InteractiveDashboard';
import AppNavigation from '../components/AppNavigation';
import ActivityFeed from '../components/ActivityFeed';
import WealthAutopilot from '../components/WealthAutopilot';
import SupportInfo from '../components/SupportInfo';
import TycoonIntelligence from '../components/TycoonIntelligence';
import LiveMoneyCounter from '../components/LiveMoneyCounter';
import AutopilotMode from '../components/AutopilotMode';
import ViralPredictor from '../components/ViralPredictor';
import InfrastructureStatus from '../components/InfrastructureStatus';
import AISuggestionsDashboard from '../components/AISuggestionsDashboard';
import QuickActionsPanel from '../components/QuickActionsPanel';
import SystemHealthOverview from '../components/SystemHealthOverview';
import RevenueOptimizationEngine from '../components/RevenueOptimizationEngine';
import CompetitorSpyEngine from '../components/CompetitorSpyEngine';
import AICommandCenter from '../components/AICommandCenter';
import RevenueAnalyticsIntelligence from '../components/RevenueAnalyticsIntelligence';
import { generateFirstVideoForAllChannels } from '../lib/firstVideoGenerator';
import { autoUpdate, getVersionInfo, CURRENT_VERSION } from '../lib/versionManager';

export default function Dashboard() {
  const [showUpdateNotice, setShowUpdateNotice] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [updateResult, setUpdateResult] = useState<any>(null);

  useEffect(() => {
    // 🔄 AUTO-UPDATE SYSTEM - Runs on every dashboard load
    const runAutoUpdate = async () => {
      console.log('🔄 Checking for updates...');
      
      setUpdating(true);
      const result = await autoUpdate();
      
      if (result.updated) {
        console.log(`✅ Updated from v${result.fromVersion} to v${result.toVersion}`);
        setUpdateResult(result);
        setShowUpdateNotice(true);
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
          setShowUpdateNotice(false);
        }, 5000);
      } else {
        console.log('✅ App is up to date (v' + CURRENT_VERSION + ')');
      }
      
      setUpdating(false);
      
      // After update, generate first videos if needed
      const channels = JSON.parse(localStorage.getItem('youtube_channels') || '[]');
      if (channels.length > 0) {
        let needsGeneration = false;
        for (const channel of channels) {
          const videos = JSON.parse(localStorage.getItem(`videos_${channel.id}`) || '[]');
          if (videos.length === 0) {
            needsGeneration = true;
            break;
          }
        }
        
        if (needsGeneration) {
          console.log('🎬 Auto-generating first videos for all channels...');
          await generateFirstVideoForAllChannels();
        }
      }
    };
    
    runAutoUpdate();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-card to-dark-bg">
      <AppNavigation title="Dashboard" currentPage="AI Tycoon Command Center" showBack={false} />
      <div className="sm:ml-20 lg:ml-64">
        <div className="container mx-auto px-4 py-8">
          {/* 🔄 AUTO-UPDATE NOTIFICATION */}
          <AnimatePresence>
            {showUpdateNotice && updateResult && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="mb-6 bg-gradient-to-r from-accent-teal via-accent-pink to-primary rounded-2xl p-6 shadow-2xl border-2 border-accent-teal/30"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-success-500 to-accent-teal flex items-center justify-center shadow-lg">
                      <span className="text-2xl">🎉</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">
                        Updated to v{updateResult.toVersion}!
                      </h3>
                      <span className="px-3 py-1 bg-success-500/20 text-success-400 text-xs font-bold rounded-full border border-success-500/30">
                        AUTOMATIC
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm mb-3">
                      Your app was automatically upgraded from v{updateResult.fromVersion}. 
                      <span className="text-white font-semibold"> No action needed!</span>
                    </p>
                    {updateResult.newFeatures && updateResult.newFeatures.length > 0 && (
                      <div className="bg-dark-bg/50 rounded-lg p-3 backdrop-blur-sm">
                        <p className="text-xs text-gray-400 mb-2 font-semibold">NEW FEATURES:</p>
                        <ul className="space-y-1">
                          {updateResult.newFeatures.slice(0, 4).map((feature: string, idx: number) => (
                            <li key={idx} className="text-sm text-accent-teal flex items-center gap-2">
                              <span className="text-success-400">✓</span>
                              {feature}
                            </li>
                          ))}
                          {updateResult.newFeatures.length > 4 && (
                            <li className="text-sm text-gray-400 italic">
                              + {updateResult.newFeatures.length - 4} more features...
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                    {updateResult.errors && updateResult.errors.length > 0 && (
                      <div className="mt-2 text-xs text-warning-400">
                        ⚠️ Some features may need manual configuration
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setShowUpdateNotice(false)}
                    className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            )}

            {updating && !showUpdateNotice && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mb-6 bg-dark-card/80 backdrop-blur-sm rounded-xl p-4 border border-accent-teal/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-accent-teal border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-gray-300">Checking for updates...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI Command Center - Ask questions, give instructions */}
          <div className="mb-6">
            <AICommandCenter />
          </div>

          {/* System Health Overview - Complete status at a glance */}
          <div className="mb-6">
            <SystemHealthOverview />
          </div>

          {/* Quick Actions - What needs attention NOW */}
          <div className="mb-6">
            <QuickActionsPanel />
          </div>

          {/* Live Money Counter - Most important! */}
          <div className="mb-6">
            <LiveMoneyCounter />
          </div>

          {/* Revenue Analytics & Intelligence - What's making money + regional opportunities */}
          <div className="mb-8">
            <RevenueAnalyticsIntelligence />
          </div>

          {/* AI Suggestions Dashboard - Shows ALL recommendations */}
          <div className="mb-6">
            <AISuggestionsDashboard />
          </div>

          {/* AI Autopilot Mode */}
          <div className="mb-6">
            <AutopilotMode />
          </div>

          {/* Viral Predictor */}
          <div className="mb-6">
            <ViralPredictor />
          </div>

          {/* Netflix-Level Infrastructure Status */}
          <div className="mb-8">
            <InfrastructureStatus />
          </div>

          {/* Revenue Optimization Engine - Money-making opportunities */}
          <div className="mb-8">
            <RevenueOptimizationEngine />
          </div>

          {/* Competitor Spy Engine - Steal winning strategies */}
          <div className="mb-8">
            <CompetitorSpyEngine />
          </div>

          {/* AI Business Tycoon Intelligence - What AI is doing 24/7 */}
          <div className="mb-8">
            <TycoonIntelligence />
          </div>

          <div className="mb-6">
            <WealthAutopilot />
          </div>
          <div className="mb-6">
            <ActivityFeed />
          </div>
          <InteractiveDashboard />
          
          {/* Support Info */}
          <div className="mt-8">
            <SupportInfo />
          </div>
        </div>
      </div>
    </div>
  );
}
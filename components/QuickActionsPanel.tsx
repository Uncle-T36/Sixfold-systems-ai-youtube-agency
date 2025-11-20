/**
 * ⚡ QUICK ACTIONS PANEL
 * Shows what's missing or needs immediate attention
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Action {
  id: string;
  icon: string;
  title: string;
  description: string;
  action: string;
  link: string;
  completed: boolean;
  urgent: boolean;
}

export default function QuickActionsPanel() {
  const [actions, setActions] = useState<Action[]>([]);

  useEffect(() => {
    checkActions();
  }, []);

  const checkActions = () => {
    const actionsList: Action[] = [];

    // Check for connected channels
    const channels = JSON.parse(localStorage.getItem('youtube_channels') || '[]');
    if (channels.length === 0) {
      actionsList.push({
        id: 'connect-channel',
        icon: '🔌',
        title: 'Connect Your First Channel',
        description: 'Start by connecting your YouTube channel to begin generating videos',
        action: 'Connect Channel',
        link: '/connect',
        completed: false,
        urgent: true
      });
    }

    // Bank account setup removed - owner-only feature (access via /admin page)

    // Check for videos
    let hasVideos = false;
    channels.forEach((channel: any) => {
      const videos = JSON.parse(localStorage.getItem(`videos_${channel.id}`) || '[]');
      if (videos.length > 0) hasVideos = true;
    });

    if (channels.length > 0 && !hasVideos) {
      actionsList.push({
        id: 'generate-video',
        icon: '🎬',
        title: 'Generate Your First Video',
        description: 'Create AI-powered videos to start earning revenue',
        action: 'Generate Video',
        link: '/dashboard',
        completed: false,
        urgent: true
      });
    }

    // Check for autopilot
    const autopilotEnabled = localStorage.getItem('autopilot_enabled') === 'true';
    if (channels.length > 0 && !autopilotEnabled) {
      actionsList.push({
        id: 'enable-autopilot',
        icon: '🤖',
        title: 'Enable Autopilot Mode',
        description: 'Let AI handle everything 24/7 - video generation, optimization, and more',
        action: 'Enable Autopilot',
        link: '/dashboard',
        completed: false,
        urgent: false
      });
    }

    // Check for channel descriptions
    channels.forEach((channel: any) => {
      if (!channel.description || channel.description.length < 50) {
        actionsList.push({
          id: `add-description-${channel.id}`,
          icon: '✍️',
          title: `Add Description for ${channel.name}`,
          description: 'Get AI-powered suggestions to improve monetization and growth',
          action: 'Add Description',
          link: '/connect',
          completed: false,
          urgent: false
        });
      }
    });

    // Check for voice selection
    channels.forEach((channel: any) => {
      if (!channel.voiceId) {
        actionsList.push({
          id: `add-voice-${channel.id}`,
          icon: '🎙️',
          title: `Select Voice for ${channel.name}`,
          description: 'Choose the perfect AI voice for your videos',
          action: 'Select Voice',
          link: '/connect',
          completed: false,
          urgent: false
        });
      }
    });

    setActions(actionsList);
  };

  const urgentActions = actions.filter(a => a.urgent);
  const normalActions = actions.filter(a => !a.urgent);

  if (actions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-green-500/10 to-teal-500/10 border border-green-500/30 rounded-2xl p-6"
      >
        <div className="flex items-center space-x-4">
          <div className="text-5xl">✅</div>
          <div>
            <h3 className="text-xl font-bold text-white mb-1">All Set!</h3>
            <p className="text-green-300">Everything is configured and running smoothly</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Urgent Actions */}
      {urgentActions.length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-lg">🚨</span>
            <h3 className="text-lg font-bold text-white">Urgent Actions</h3>
            <span className="px-2 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-xs text-red-400 font-semibold">
              {urgentActions.length}
            </span>
          </div>
          <div className="space-y-3">
            {urgentActions.map((action) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border-2 border-red-500/30 rounded-xl p-4 hover:border-red-500/50 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="text-3xl">{action.icon}</div>
                    <div className="flex-1">
                      <h4 className="text-white font-bold mb-1">{action.title}</h4>
                      <p className="text-slate-300 text-sm mb-3">{action.description}</p>
                      <Link href={action.link}>
                        <button className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold rounded-lg text-sm shadow-lg hover:shadow-xl transition-all">
                          {action.action} →
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Normal Actions */}
      {normalActions.length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-lg">📋</span>
            <h3 className="text-lg font-bold text-white">Recommended Actions</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {normalActions.map((action) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-4 hover:border-teal-500/50 transition-all"
              >
                <div className="flex items-start space-x-3 mb-3">
                  <div className="text-2xl">{action.icon}</div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold text-sm mb-1">{action.title}</h4>
                    <p className="text-slate-400 text-xs">{action.description}</p>
                  </div>
                </div>
                <Link href={action.link}>
                  <button className="w-full px-3 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold rounded-lg text-xs transition-all">
                    {action.action}
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


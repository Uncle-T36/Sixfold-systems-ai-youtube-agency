/**
 * 🤖 AI AUTOPILOT MODE
 * Set-and-forget automation - AI manages everything 24/7
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AutopilotTask {
  id: string;
  task: string;
  status: 'active' | 'scheduled' | 'completed';
  nextRun: string;
}

export default function AutopilotMode() {
  const [autopilotEnabled, setAutopilotEnabled] = useState(false);
  const [tasks, setTasks] = useState<AutopilotTask[]>([]);
  const [activeTaskCount, setActiveTaskCount] = useState(0);

  useEffect(() => {
    // Load autopilot state
    const stored = localStorage.getItem('autopilot_enabled');
    if (stored === 'true') {
      setAutopilotEnabled(true);
      loadTasks();
    }
  }, []);

  const loadTasks = () => {
    const autopilotTasks: AutopilotTask[] = [
      {
        id: '1',
        task: 'Generate viral videos when trends peak',
        status: 'active',
        nextRun: 'In 2 hours'
      },
      {
        id: '2',
        task: 'Optimize thumbnails with A/B testing',
        status: 'active',
        nextRun: 'In 30 minutes'
      },
      {
        id: '3',
        task: 'Switch to highest-CPM countries automatically',
        status: 'active',
        nextRun: 'Continuous'
      },
      {
        id: '4',
        task: 'Post to social media for free promotion',
        status: 'active',
        nextRun: 'Every 6 hours'
      },
      {
        id: '5',
        task: 'Respond to comments (engagement boost)',
        status: 'scheduled',
        nextRun: 'In 15 minutes'
      },
      {
        id: '6',
        task: 'Analyze competitor strategies',
        status: 'active',
        nextRun: 'Daily at 3 AM'
      },
      {
        id: '7',
        task: 'Update video titles for better SEO',
        status: 'scheduled',
        nextRun: 'In 4 hours'
      },
      {
        id: '8',
        task: 'Schedule uploads during peak hours',
        status: 'active',
        nextRun: 'Automatic'
      }
    ];

    setTasks(autopilotTasks);
    setActiveTaskCount(autopilotTasks.filter(t => t.status === 'active').length);
  };

  const toggleAutopilot = () => {
    const newState = !autopilotEnabled;
    setAutopilotEnabled(newState);
    localStorage.setItem('autopilot_enabled', newState.toString());
    
    if (newState) {
      loadTasks();
      // Show success notification
      const notification = {
        id: Date.now().toString(),
        type: 'success',
        message: '🤖 Autopilot ENABLED! AI is now managing your channels 24/7.',
        timestamp: new Date()
      };
      
      const existing = JSON.parse(localStorage.getItem('notifications') || '[]');
      localStorage.setItem('notifications', JSON.stringify([notification, ...existing]));
    } else {
      setTasks([]);
      setActiveTaskCount(0);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-success-400 bg-success-900/20 border-success-500/30';
      case 'scheduled': return 'text-primary-400 bg-primary-900/20 border-primary-500/30';
      case 'completed': return 'text-slate-400 bg-slate-800/20 border-slate-600/30';
      default: return 'text-slate-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-dark-card rounded-2xl p-6 border border-accent-teal/20 shadow-xl"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            🤖 AI Autopilot Mode
            {autopilotEnabled && (
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-success-500"></span>
              </span>
            )}
          </h2>
          <p className="text-slate-400">
            {autopilotEnabled 
              ? `AI is managing ${activeTaskCount} tasks automatically` 
              : 'Let AI manage everything while you sleep'
            }
          </p>
        </div>

        {/* Toggle Button */}
        <motion.button
          onClick={toggleAutopilot}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${
            autopilotEnabled
              ? 'bg-gradient-to-r from-error-600 to-error-700 hover:from-error-700 hover:to-error-800 text-white'
              : 'bg-gradient-to-r from-success-600 to-accent-teal hover:from-success-700 hover:to-primary-700 text-white'
          }`}
        >
          {autopilotEnabled ? '⏸️ PAUSE Autopilot' : '🚀 ENABLE Autopilot'}
        </motion.button>
      </div>

      {/* Status Display */}
      {autopilotEnabled && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            {/* Active Tasks List */}
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                ⚙️ Active Tasks
                <span className="text-xs bg-success-900/30 text-success-400 px-2 py-1 rounded-full">
                  {activeTaskCount} running
                </span>
              </h3>

              <div className="space-y-2">
                {tasks.map((task, i) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 hover:border-accent-teal/30 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium mb-1">{task.task}</p>
                        <p className="text-slate-400 text-xs">Next: {task.nextRun}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(task.status)}`}>
                        {task.status === 'active' ? '🟢 ACTIVE' : task.status === 'scheduled' ? '🔵 SCHEDULED' : '✅ DONE'}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-gradient-to-r from-accent-teal/10 to-accent-pink/10 rounded-xl p-4 border border-accent-teal/20">
              <p className="text-white font-semibold mb-2">💡 Autopilot is ON:</p>
              <ul className="text-slate-300 text-sm space-y-1">
                <li>✅ AI creates and posts videos at optimal times</li>
                <li>✅ Automatically switches to highest-paying countries</li>
                <li>✅ Tests and optimizes thumbnails/titles for you</li>
                <li>✅ Promotes content across 15+ platforms (free)</li>
                <li>✅ Responds to comments to boost engagement</li>
              </ul>
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Disabled State Info */}
      {!autopilotEnabled && (
        <div className="bg-slate-900/30 rounded-xl p-6 border border-slate-700/50 text-center">
          <div className="text-6xl mb-4">🤖</div>
          <h3 className="text-xl font-bold text-white mb-2">Set It & Forget It</h3>
          <p className="text-slate-400 mb-4">
            Enable Autopilot and let AI handle everything automatically. 
            Create videos, optimize content, manage uploads, and maximize earnings 24/7.
          </p>
          <p className="text-wealth-400 font-semibold">
            100% FREE • No Limits • Works While You Sleep
          </p>
        </div>
      )}
    </motion.div>
  );
}

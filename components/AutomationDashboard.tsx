/**
 * AUTOMATION DASHBOARD
 * Real-time view of automated video production pipeline
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { automateFullVideoProduction, getAutomationTasks, type AutomationTask } from '../lib/automationEngine';

export default function AutomationDashboard() {
  const [tasks, setTasks] = useState<AutomationTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<AutomationTask | null>(null);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);

  useEffect(() => {
    // Load existing tasks
    setTasks(getAutomationTasks());

    // Listen for updates
    const handleUpdate = (event: any) => {
      setTasks(getAutomationTasks());
      if (selectedTask && event.detail.id === selectedTask.id) {
        setSelectedTask(event.detail);
      }
    };

    window.addEventListener('automation-update', handleUpdate);
    return () => window.removeEventListener('automation-update', handleUpdate);
  }, [selectedTask]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'processing': return 'text-yellow-400';
      case 'failed': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'processing': return '⏳';
      case 'failed': return '❌';
      default: return '⏸️';
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-slate-700/50 p-6">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">🤖 Automation Pipeline</h2>
          <p className="text-slate-400 text-sm">
            Script → Video → Analyze → Upload (Fully Automated)
          </p>
        </div>
        <button
          onClick={() => setShowNewTaskModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-semibold transition-all hover:scale-105"
        >
          + New Automation
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800/50 rounded-xl p-4">
          <div className="text-slate-400 text-sm mb-1">Total Tasks</div>
          <div className="text-2xl font-bold text-white">{tasks.length}</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4">
          <div className="text-slate-400 text-sm mb-1">Processing</div>
          <div className="text-2xl font-bold text-yellow-400">
            {tasks.filter(t => t.status === 'processing').length}
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4">
          <div className="text-slate-400 text-sm mb-1">Completed</div>
          <div className="text-2xl font-bold text-green-400">
            {tasks.filter(t => t.status === 'completed').length}
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4">
          <div className="text-slate-400 text-sm mb-1">Failed</div>
          <div className="text-2xl font-bold text-red-400">
            {tasks.filter(t => t.status === 'failed').length}
          </div>
        </div>
      </div>

      {/* Tasks List */}
      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🤖</div>
          <h3 className="text-xl font-bold text-white mb-2">No Automation Tasks Yet</h3>
          <p className="text-slate-400 mb-6">
            Create your first automated workflow to see the magic happen!
          </p>
          <button
            onClick={() => setShowNewTaskModal(true)}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:scale-105 transition-transform"
          >
            Start Automation
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map(task => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-green-500/50 transition-all cursor-pointer"
              onClick={() => setSelectedTask(task)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getStatusIcon(task.status)}</span>
                  <div>
                    <div className="text-white font-semibold">{task.channelName}</div>
                    <div className="text-xs text-slate-400">
                      {new Date(task.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className={`font-bold ${getStatusColor(task.status)}`}>
                  {task.status.toUpperCase()}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-2">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Step {task.currentStep + 1} of {task.steps.length}</span>
                  <span>{Math.round((task.currentStep / task.steps.length) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-full transition-all duration-500"
                    style={{ width: `${(task.currentStep / task.steps.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Current Step */}
              <div className="text-sm text-slate-300">
                {task.steps[task.currentStep]?.name}: {task.steps[task.currentStep]?.message}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Detailed Task View Modal */}
      <AnimatePresence>
        {selectedTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setSelectedTask(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {selectedTask.channelName}
                  </h3>
                  <div className={`text-sm font-semibold ${getStatusColor(selectedTask.status)}`}>
                    Status: {selectedTask.status.toUpperCase()}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* All Steps */}
              <div className="space-y-3">
                {selectedTask.steps.map((step, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border-2 ${
                      step.status === 'completed'
                        ? 'border-green-500/30 bg-green-500/10'
                        : step.status === 'processing'
                        ? 'border-yellow-500/30 bg-yellow-500/10'
                        : step.status === 'failed'
                        ? 'border-red-500/30 bg-red-500/10'
                        : 'border-slate-700 bg-slate-800/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{getStatusIcon(step.status)}</span>
                        <span className="font-semibold text-white">{step.name}</span>
                      </div>
                      <span className={`text-sm font-bold ${getStatusColor(step.status)}`}>
                        {step.progress}%
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    {step.status === 'processing' && (
                      <div className="mb-2">
                        <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-yellow-500 to-orange-500 h-full transition-all duration-300"
                            style={{ width: `${step.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="text-sm text-slate-400">{step.message}</div>
                  </div>
                ))}
              </div>

              {/* Result */}
              {selectedTask.status === 'completed' && selectedTask.result && (
                <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                  <div className="text-green-400 font-bold mb-2">✅ Automation Completed!</div>
                  <div className="text-sm text-slate-300 space-y-1">
                    <div>• Video ID: {selectedTask.result.videoId}</div>
                    <div>• SEO Score: {selectedTask.result.seoScore}/100</div>
                    <div>• Estimated Views: {selectedTask.result.estimatedViews?.toLocaleString()}</div>
                    {selectedTask.result.uploadUrl && (
                      <div>
                        • Upload URL: <a href={selectedTask.result.uploadUrl} target="_blank" rel="noopener noreferrer" className="text-green-400 underline">{selectedTask.result.uploadUrl}</a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


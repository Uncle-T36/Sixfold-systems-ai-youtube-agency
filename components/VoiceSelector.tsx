/**
 * Voice Selector Component
 * Let users choose from catchy AI voices including DarkWhisper style
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { voiceLibrary, Voice, getVoicesByStyle, getPopularVoices, recommendVoices } from '../lib/voiceLibrary';

interface VoiceSelectorProps {
  selectedVoice?: string;
  onSelect: (voiceId: string) => void;
  channelNiche?: string;
}

export default function VoiceSelector({ selectedVoice, onSelect, channelNiche }: VoiceSelectorProps) {
  const [filter, setFilter] = useState<'all' | 'popular' | 'dark' | 'recommended'>('popular');
  const [previewPlaying, setPreviewPlaying] = useState<string | null>(null);

  // Get filtered voices
  const getFilteredVoices = () => {
    switch (filter) {
      case 'popular':
        return getPopularVoices();
      case 'dark':
        return getVoicesByStyle('dark');
      case 'recommended':
        return channelNiche ? recommendVoices(channelNiche) : getPopularVoices();
      default:
        return voiceLibrary;
    }
  };

  const voices = getFilteredVoices();

  // Get voice style color
  const getStyleColor = (style: string) => {
    if (style.toLowerCase().includes('dark') || style.toLowerCase().includes('mystery')) {
      return 'from-emerald-600 to-emerald-800';
    }
    if (style.toLowerCase().includes('motivational') || style.toLowerCase().includes('energetic')) {
      return 'from-accent-pink to-luxury-600';
    }
    if (style.toLowerCase().includes('professional') || style.toLowerCase().includes('educational')) {
      return 'from-accent-teal to-primary-600';
    }
    return 'from-slate-600 to-slate-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Choose Your Voice</h3>
          <p className="text-slate-400 text-sm">Select the perfect voice for your content</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setFilter('popular')}
          className={`px-4 py-2 rounded-xl font-medium transition-all ${
            filter === 'popular'
              ? 'bg-gradient-to-r from-accent-teal to-accent-pink text-white shadow-lg'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          ⭐ Popular
        </button>
        <button
          onClick={() => setFilter('dark')}
          className={`px-4 py-2 rounded-xl font-medium transition-all ${
            filter === 'dark'
              ? 'bg-gradient-to-r from-emerald-600 to-emerald-800 text-white shadow-lg'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          🌙 DarkWhisper Style
        </button>
        {channelNiche && (
          <button
            onClick={() => setFilter('recommended')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              filter === 'recommended'
                ? 'bg-gradient-to-r from-wealth-500 to-wealth-600 text-white shadow-lg'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            💡 Recommended for {channelNiche}
          </button>
        )}
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl font-medium transition-all ${
            filter === 'all'
              ? 'bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-lg'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          📚 All Voices ({voiceLibrary.length})
        </button>
      </div>

      {/* Voice Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="wait">
          {voices.map((voice) => (
            <motion.div
              key={voice.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`relative p-5 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                selectedVoice === voice.id
                  ? 'bg-gradient-to-br from-accent-teal/20 to-accent-pink/20 border-accent-teal shadow-xl shadow-accent-teal/20'
                  : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
              }`}
              onClick={() => onSelect(voice.id)}
            >
              {/* Premium Badge */}
              {voice.premium && (
                <div className="absolute top-2 right-2 px-2 py-1 bg-gradient-to-r from-wealth-500 to-wealth-600 text-white text-xs font-bold rounded-full">
                  PRO
                </div>
              )}

              {/* Popular Badge */}
              {voice.popular && !voice.premium && (
                <div className="absolute top-2 right-2 px-2 py-1 bg-gradient-to-r from-accent-pink to-luxury-600 text-white text-xs font-bold rounded-full">
                  🔥 HOT
                </div>
              )}

              {/* Voice Info */}
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">
                    {voice.gender === 'male' ? '👨' : voice.gender === 'female' ? '👩' : '🎭'}
                  </span>
                  <h4 className="text-white font-bold text-lg">{voice.name}</h4>
                </div>
                
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getStyleColor(voice.style)} text-white mb-3`}>
                  {voice.style}
                </div>

                <p className="text-slate-300 text-sm mb-3 leading-relaxed">
                  {voice.description}
                </p>

                {/* Best For Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {voice.bestFor.slice(0, 3).map((use, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-md"
                    >
                      {use}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: Add voice preview functionality
                    setPreviewPlaying(voice.id);
                    setTimeout(() => setPreviewPlaying(null), 3000);
                  }}
                  className="flex-1 py-2 px-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                  {previewPlaying === voice.id ? 'Playing...' : 'Preview'}
                </button>
                
                {selectedVoice === voice.id ? (
                  <div className="flex items-center justify-center px-3 py-2 bg-gradient-to-r from-success-500 to-success-600 text-white rounded-lg text-sm font-bold">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(voice.id);
                    }}
                    className="px-3 py-2 bg-gradient-to-r from-accent-teal to-accent-pink hover:from-accent-pink hover:to-accent-teal text-white rounded-lg text-sm font-medium transition-all"
                  >
                    Select
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Info Card */}
      <div className="bg-gradient-to-r from-emerald-600/10 to-accent-pink/10 border border-emerald-500/20 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">🎙️</span>
          </div>
          <div>
            <h4 className="text-white font-bold text-lg mb-2">DarkWhisper Style Voices</h4>
            <p className="text-slate-300 text-sm mb-3">
              Looking for that deep, mysterious voice like DarkWhisper channel? Try our <strong className="text-emerald-400">"Dark Narrator"</strong> or <strong className="text-emerald-400">"Dark Whisper"</strong> voices. Perfect for horror stories, true crime, and mysterious content that keeps viewers hooked.
            </p>
            <div className="flex gap-3">
              <div className="flex items-center gap-2 text-success-400 text-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>High retention rate</span>
              </div>
              <div className="flex items-center gap-2 text-success-400 text-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Proven viral success</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Voice Summary */}
      {selectedVoice && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-accent-teal/20 to-accent-pink/20 border border-accent-teal/50 rounded-xl p-6"
        >
          {(() => {
            const voice = voiceLibrary.find(v => v.id === selectedVoice);
            if (!voice) return null;
            return (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-accent-teal to-accent-pink rounded-full flex items-center justify-center text-2xl">
                    {voice.gender === 'male' ? '👨' : '👩'}
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Selected Voice</p>
                    <p className="text-white font-bold text-lg">{voice.name}</p>
                    <p className="text-slate-300 text-sm">{voice.style}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-success-400 font-bold text-sm mb-1">✓ Ready to use</div>
                  <p className="text-slate-400 text-xs">Your videos will use this voice</p>
                </div>
              </div>
            );
          })()}
        </motion.div>
      )}
    </div>
  );
}


import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  STORY_CATEGORIES,
  SCRIPT_STYLES,
  discoverStories,
  generateScript,
  createSeriesChannel,
  generateSeriesBatch,
  Story,
  SeriesChannel
} from '../lib/storyEngine';

export default function SeriesChannelCreator() {
  const [step, setStep] = useState<'setup' | 'discover' | 'script' | 'preview'>('setup');
  const [seriesConfig, setSeriesConfig] = useState({
    name: '',
    genre: '',
    targetAudience: 'Adults 18-45',
    episodeLength: 15,
    uploadSchedule: 'weekly'
  });
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<keyof typeof SCRIPT_STYLES>('suspenseful');
  const [discoveredStories, setDiscoveredStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [generatedScript, setGeneratedScript] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [seriesChannel, setSeriesChannel] = useState<SeriesChannel | null>(null);
  const [batchEpisodes, setBatchEpisodes] = useState<any[]>([]);

  const handleCreateSeries = () => {
    if (!seriesConfig.name || !seriesConfig.genre) {
      alert('Please fill in series name and select a genre');
      return;
    }

    const channel = createSeriesChannel({
      ...seriesConfig,
      episodeLength: seriesConfig.episodeLength * 60
    });
    
    setSeriesChannel(channel);
    
    // Save to localStorage
    const channels = JSON.parse(localStorage.getItem('series_channels') || '[]');
    channels.push(channel);
    localStorage.setItem('series_channels', JSON.stringify(channels));
    
    setStep('discover');
  };

  const handleDiscoverStories = async () => {
    if (!selectedCategory) {
      alert('Please select a story category');
      return;
    }

    setIsLoading(true);
    try {
      const stories = await discoverStories(selectedCategory, undefined, undefined, 20);
      setDiscoveredStories(stories);
      setStep('discover');
    } catch (error) {
      console.error('Error discovering stories:', error);
      alert('Failed to discover stories. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateScript = async (story: Story) => {
    setSelectedStory(story);
    setIsLoading(true);
    
    try {
      const script = await generateScript(story, selectedStyle, 1, seriesChannel?.name);
      setGeneratedScript(script);
      setStep('preview');
    } catch (error) {
      console.error('Error generating script:', error);
      alert('Failed to generate script. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateBatch = async () => {
    if (!selectedCategory || !seriesChannel) {
      alert('Please set up your series first');
      return;
    }

    setIsLoading(true);
    try {
      const episodes = await generateSeriesBatch(
        selectedCategory,
        selectedStyle,
        10,
        seriesChannel.name
      );
      setBatchEpisodes(episodes);
      
      // Save to localStorage
      localStorage.setItem(`series_batch_${seriesChannel.id}`, JSON.stringify(episodes));
      
      alert(`✨ Generated ${episodes.length} episodes for your series!`);
    } catch (error) {
      console.error('Error generating batch:', error);
      alert('Failed to generate batch. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-yellow-500 bg-clip-text text-transparent mb-4">
            📺 Series Channel Creator
          </h1>
          <p className="text-slate-300 text-xl mb-6">
            Create viral story series with AI-powered scripts from hidden stories worldwide
          </p>
          
          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {['setup', 'discover', 'script', 'preview'].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step === s
                    ? 'bg-gradient-to-r from-green-500 to-yellow-500 text-white'
                    : s === 'setup' || (s === 'discover' && discoveredStories.length > 0) || (s === 'script' && selectedStory) || (s === 'preview' && generatedScript)
                    ? 'bg-green-500/30 text-green-400 border-2 border-green-500'
                    : 'bg-slate-800 text-slate-500 border-2 border-slate-700'
                }`}>
                  {i + 1}
                </div>
                <span className={`text-sm font-semibold ${
                  step === s ? 'text-white' : 'text-slate-500'
                }`}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </span>
                {i < 3 && <div className="w-8 h-0.5 bg-slate-700" />}
              </div>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Step 1: Setup Series */}
          {step === 'setup' && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-xl">
                <h2 className="text-3xl font-bold text-white mb-6">🎬 Setup Your Series Channel</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Series Name *</label>
                    <input
                      type="text"
                      value={seriesConfig.name}
                      onChange={(e) => setSeriesConfig({ ...seriesConfig, name: e.target.value })}
                      placeholder="e.g., Dark Mysteries Uncovered, True Crime Chronicles..."
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-green-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-4">Genre / Story Category *</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                      {Object.entries(STORY_CATEGORIES).map(([key, cat]) => (
                        <button
                          key={key}
                          onClick={() => {
                            setSeriesConfig({ ...seriesConfig, genre: cat.name });
                            setSelectedCategory(key);
                          }}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            selectedCategory === key
                              ? 'border-green-500 bg-green-500/20'
                              : 'border-slate-700 bg-slate-900/30 hover:border-slate-600'
                          }`}
                        >
                          <div className="text-3xl mb-2">{cat.icon}</div>
                          <div className="text-white font-semibold text-sm">{cat.name}</div>
                          <div className="text-green-400 text-xs mt-1">
                            {cat.viralPotential}% viral
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-slate-300 font-medium mb-2">Target Audience</label>
                      <select
                        value={seriesConfig.targetAudience}
                        onChange={(e) => setSeriesConfig({ ...seriesConfig, targetAudience: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:border-green-500 focus:outline-none"
                      >
                        <option value="Teens 13-17">Teens (13-17)</option>
                        <option value="Adults 18-45">Adults (18-45)</option>
                        <option value="All Ages">All Ages</option>
                        <option value="Mature 25+">Mature (25+)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-medium mb-2">
                        Episode Length: {seriesConfig.episodeLength} minutes
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="30"
                        value={seriesConfig.episodeLength}
                        onChange={(e) => setSeriesConfig({ ...seriesConfig, episodeLength: parseInt(e.target.value) })}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Upload Schedule</label>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { value: 'daily', label: '📅 Daily', desc: '7 per week' },
                        { value: 'twice-weekly', label: '🗓️ Twice Weekly', desc: '2 per week' },
                        { value: 'weekly', label: '📆 Weekly', desc: '1 per week' }
                      ].map((schedule) => (
                        <button
                          key={schedule.value}
                          onClick={() => setSeriesConfig({ ...seriesConfig, uploadSchedule: schedule.value })}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            seriesConfig.uploadSchedule === schedule.value
                              ? 'border-green-500 bg-green-500/20'
                              : 'border-slate-700 bg-slate-900/30'
                          }`}
                        >
                          <div className="text-xl mb-1">{schedule.label}</div>
                          <div className="text-slate-400 text-xs">{schedule.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleCreateSeries}
                    disabled={!seriesConfig.name || !seriesConfig.genre}
                    className="w-full px-8 py-4 bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-xl text-white font-bold text-lg shadow-lg transition-all"
                  >
                    Create Series & Discover Stories →
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Discover Stories */}
          {step === 'discover' && (
            <motion.div
              key="discover"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">🔍 Discovered Stories</h2>
                  <p className="text-slate-400">
                    Found {discoveredStories.length} stories • Click any story to generate script
                  </p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleGenerateBatch}
                    disabled={isLoading}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl text-white font-semibold shadow-lg transition-all"
                  >
                    ⚡ Generate 10 Episodes
                  </button>
                  <button
                    onClick={() => handleDiscoverStories()}
                    disabled={isLoading}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-xl text-white font-semibold shadow-lg transition-all"
                  >
                    🔄 Discover More
                  </button>
                </div>
              </div>

              {/* Script Style Selector */}
              <div className="mb-6 p-6 bg-slate-800/50 border border-slate-700 rounded-xl">
                <h3 className="text-white font-semibold mb-4">Writing Style</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(SCRIPT_STYLES).map(([key, style]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedStyle(key as any)}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        selectedStyle === key
                          ? 'border-green-500 bg-green-500/20'
                          : 'border-slate-700 bg-slate-900/30'
                      }`}
                    >
                      <div className="text-white font-semibold text-sm">{style.name}</div>
                      <div className="text-slate-400 text-xs">{style.tone}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Stories Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {discoveredStories.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <button
                      onClick={handleDiscoverStories}
                      disabled={isLoading}
                      className="px-8 py-4 bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 rounded-xl text-white font-bold text-lg shadow-lg"
                    >
                      {isLoading ? 'Discovering...' : '🔍 Discover Stories'}
                    </button>
                  </div>
                ) : (
                  discoveredStories.map((story) => (
                    <motion.div
                      key={story.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleGenerateScript(story)}
                      className="cursor-pointer bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-xl p-6 hover:border-green-500 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-xs font-semibold">
                          {story.category}
                        </span>
                        <div className="text-right">
                          <div className="text-yellow-400 font-bold text-sm">
                            {story.viralScore}% 🔥
                          </div>
                          <div className="text-slate-500 text-xs">{story.estimatedViews.toLocaleString()} views</div>
                        </div>
                      </div>

                      <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">{story.title}</h3>
                      
                      <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
                        <span>🌍 {story.country}</span>
                        <span>•</span>
                        <span>📅 {story.era}</span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {story.themes.slice(0, 3).map((theme, i) => (
                          <span key={i} className="px-2 py-1 bg-slate-800 rounded text-slate-400 text-xs">
                            {theme}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 text-xs">
                          ⏱️ {story.recommendedLength} min
                        </span>
                        <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-yellow-500 rounded-lg text-white text-sm font-semibold">
                          Generate Script →
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* Step 3: Preview Script */}
          {step === 'preview' && generatedScript && selectedStory && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="max-w-5xl mx-auto">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-3xl font-bold text-white">📝 Generated Script</h2>
                  <button
                    onClick={() => setStep('discover')}
                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-white font-semibold"
                  >
                    ← Back to Stories
                  </button>
                </div>

                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-2xl p-8">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{selectedStory.title}</h3>
                    <div className="flex items-center gap-4 text-slate-400">
                      <span>🌍 {selectedStory.country}</span>
                      <span>📅 {selectedStory.era}</span>
                      <span>⏱️ {selectedStory.recommendedLength} minutes</span>
                      <span className="text-green-400 font-semibold">
                        {selectedStory.viralScore}% Viral Score
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="p-4 bg-slate-900/50 rounded-xl">
                      <div className="text-slate-400 text-sm mb-1">Hook Time</div>
                      <div className="text-white font-bold">{generatedScript.hookTime}s</div>
                    </div>
                    <div className="p-4 bg-slate-900/50 rounded-xl">
                      <div className="text-slate-400 text-sm mb-1">Keywords</div>
                      <div className="text-white font-bold">{generatedScript.keywords.length} tags</div>
                    </div>
                    <div className="p-4 bg-slate-900/50 rounded-xl">
                      <div className="text-slate-400 text-sm mb-1">Cliffhanger</div>
                      <div className="text-green-400 font-bold">✓ Included</div>
                    </div>
                  </div>

                  <div className="bg-slate-900/50 rounded-xl p-6 mb-6">
                    <h4 className="text-white font-semibold mb-4">Full Script</h4>
                    <pre className="text-slate-300 whitespace-pre-wrap font-mono text-sm leading-relaxed max-h-[500px] overflow-y-auto">
                      {generatedScript.script}
                    </pre>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-white font-semibold mb-3">📋 Keywords</h4>
                      <div className="flex flex-wrap gap-2">
                        {generatedScript.keywords.map((kw: string, i: number) => (
                          <span key={i} className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-white font-semibold mb-3">🖼️ Thumbnail Ideas</h4>
                      <ul className="space-y-2">
                        {generatedScript.thumbnailSuggestions.map((thumb: string, i: number) => (
                          <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                            <span className="text-yellow-400">•</span>
                            {thumb}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 flex gap-4">
                    <button
                      onClick={() => {
                        // Save script
                        const scripts = JSON.parse(localStorage.getItem('generated_scripts') || '[]');
                        scripts.push({
                          id: `script-${Date.now()}`,
                          story: selectedStory,
                          script: generatedScript,
                          seriesId: seriesChannel?.id,
                          createdAt: new Date().toISOString()
                        });
                        localStorage.setItem('generated_scripts', JSON.stringify(scripts));
                        alert('✅ Script saved successfully!');
                      }}
                      className="flex-1 px-8 py-4 bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 rounded-xl text-white font-bold text-lg shadow-lg"
                    >
                      💾 Save Script
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generatedScript.script);
                        alert('📋 Script copied to clipboard!');
                      }}
                      className="px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-xl text-white font-semibold"
                    >
                      📋 Copy Script
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white font-semibold">Processing...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

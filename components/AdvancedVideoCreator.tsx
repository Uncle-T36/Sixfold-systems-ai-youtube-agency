import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  VIDEO_STYLES, 
  generateAdvancedVideo, 
  queueVideoRender,
  VideoStyle,
  AnimationConfig
} from '../lib/advancedVideoGenerator';

export default function AdvancedVideoCreator() {
  const [selectedStyle, setSelectedStyle] = useState<VideoStyle | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [formData, setFormData] = useState({
    title: '',
    script: '',
    niche: 'general',
    duration: 60
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedConfig, setGeneratedConfig] = useState<AnimationConfig | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const categories = ['all', 'animation', 'cartoon', 'motion-graphics', 'hybrid'];

  const filteredStyles = activeCategory === 'all' 
    ? VIDEO_STYLES 
    : VIDEO_STYLES.filter(style => style.category === activeCategory);

  const handleGenerate = async () => {
    if (!selectedStyle || !formData.title || !formData.script) {
      alert('Please fill in all fields and select a video style');
      return;
    }

    setIsGenerating(true);

    try {
      // Generate video configuration
      const config = await generateAdvancedVideo(formData, selectedStyle.id);
      setGeneratedConfig(config);
      setShowPreview(true);

      // Queue for rendering
      const jobId = await queueVideoRender(config, 'current-channel');
      
      // Save to localStorage
      const videos = JSON.parse(localStorage.getItem('generated_videos') || '[]');
      videos.push({
        id: jobId,
        channelId: 'current-channel',
        title: formData.title,
        style: selectedStyle.name,
        status: 'rendering',
        createdAt: new Date().toISOString(),
        config
      });
      localStorage.setItem('generated_videos', JSON.stringify(videos));

      alert(`✨ Video queued for rendering! Job ID: ${jobId}\n\nStyle: ${selectedStyle.name}\nEstimated time: ${selectedStyle.processingTime}`);
      
      // Reset form
      setFormData({ title: '', script: '', niche: 'general', duration: 60 });
      setSelectedStyle(null);
    } catch (error) {
      console.error('Generation error:', error);
      alert('Failed to generate video. Please try again.');
    } finally {
      setIsGenerating(false);
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
            🎬 Advanced Video Creator
          </h1>
          <p className="text-slate-300 text-xl">
            Create stunning animations, cartoons, and motion graphics with AI
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
              <span className="text-green-400 font-semibold">15+ Styles Available</span>
            </div>
            <div className="px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
              <span className="text-yellow-400 font-semibold">Professional Quality</span>
            </div>
            <div className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
              <span className="text-emerald-400 font-semibold">AI-Powered</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Video Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                📝 Video Details
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-2">Video Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter your video title..."
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-green-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-2">Script / Content</label>
                  <textarea
                    value={formData.script}
                    onChange={(e) => setFormData({ ...formData, script: e.target.value })}
                    placeholder="Enter your script or let AI generate one..."
                    rows={8}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-green-500 focus:outline-none transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-2">Niche</label>
                  <select
                    value={formData.niche}
                    onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:border-green-500 focus:outline-none transition-colors"
                  >
                    <option value="general">General</option>
                    <option value="tech">Technology</option>
                    <option value="education">Education</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="business">Business</option>
                    <option value="gaming">Gaming</option>
                    <option value="health">Health & Fitness</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-2">
                    Duration: {formData.duration} seconds
                  </label>
                  <input
                    type="range"
                    min="30"
                    max="300"
                    step="15"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>30s</span>
                    <span>5min</span>
                  </div>
                </div>

                {selectedStyle && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-green-500/10 to-yellow-500/10 border border-green-500/30 rounded-xl">
                    <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                      <span className="text-2xl">{selectedStyle.icon}</span>
                      {selectedStyle.name}
                    </h3>
                    <p className="text-slate-300 text-sm mb-3">{selectedStyle.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedStyle.features.map((feature, i) => (
                        <span key={i} className="px-2 py-1 bg-slate-800/50 border border-slate-700 rounded-lg text-xs text-slate-300">
                          {feature}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 text-xs text-slate-400">
                      ⏱️ Processing: {selectedStyle.processingTime}
                    </div>
                  </div>
                )}

                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !selectedStyle || !formData.title || !formData.script}
                  className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 disabled:transform-none"
                >
                  {isGenerating ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Generating...
                    </span>
                  ) : (
                    '✨ Generate Video'
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right Panel - Style Selection */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-xl">
              <h2 className="text-2xl font-bold text-white mb-6">🎨 Choose Your Style</h2>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                      activeCategory === category
                        ? 'bg-gradient-to-r from-green-500 to-yellow-500 text-white shadow-lg'
                        : 'bg-slate-800/50 border border-slate-700 text-slate-300 hover:border-green-500/50'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                  </button>
                ))}
              </div>

              {/* Style Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence mode="wait">
                  {filteredStyles.map((style, index) => (
                    <motion.div
                      key={style.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedStyle(style)}
                      className={`cursor-pointer p-5 rounded-xl border-2 transition-all transform hover:-translate-y-1 hover:shadow-xl ${
                        selectedStyle?.id === style.id
                          ? 'border-green-500 bg-gradient-to-br from-green-500/20 to-yellow-500/20 shadow-lg'
                          : 'border-slate-700 bg-slate-900/30 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-4xl">{style.icon}</div>
                        <div className="flex-1">
                          <h3 className="text-white font-bold text-lg mb-1">{style.name}</h3>
                          <p className="text-slate-400 text-sm mb-3">{style.description}</p>
                          
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                              style.quality === 'ultra' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                              style.quality === 'high' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                              'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                            }`}>
                              {style.quality.toUpperCase()}
                            </span>
                            <span className="text-xs text-slate-500">⏱️ {style.processingTime}</span>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {style.features.slice(0, 3).map((feature, i) => (
                              <span key={i} className="px-2 py-0.5 bg-slate-800 rounded text-xs text-slate-400">
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {selectedStyle?.id === style.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2"
                        >
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-6">
            <div className="text-4xl mb-4">🎭</div>
            <h3 className="text-white font-bold text-xl mb-2">Auto Character Generation</h3>
            <p className="text-slate-300">AI creates perfect characters for your niche automatically</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-2xl p-6">
            <div className="text-4xl mb-4">🎬</div>
            <h3 className="text-white font-bold text-xl mb-2">Smart Scene Breakdown</h3>
            <p className="text-slate-300">Intelligent script analysis creates perfect scene timing</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/30 rounded-2xl p-6">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-white font-bold text-xl mb-2">Professional Effects</h3>
            <p className="text-slate-300">Studio-quality transitions, particles, and animations</p>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(51, 65, 85, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #22c55e, #eab308);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #16a34a, #ca8a04);
        }
      `}</style>
    </div>
  );
}

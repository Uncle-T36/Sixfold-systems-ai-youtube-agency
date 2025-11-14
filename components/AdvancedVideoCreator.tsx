import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  VIDEO_STYLES, 
  generateAdvancedVideo, 
  queueVideoRender,
  VideoStyle,
  AnimationConfig
} from '../lib/advancedVideoGenerator';
import {
  createProfessionalVideo,
  assignVoicesToCharacters,
  QUALITY_PRESETS,
  SUBTITLE_STYLES,
  VOICE_LIBRARY,
  type VideoQualitySettings,
  type SubtitleConfig,
  type CharacterVoiceMapping
} from '../lib/professionalVideoProduction';

export default function AdvancedVideoCreator() {
  const [selectedStyle, setSelectedStyle] = useState<VideoStyle | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [formData, setFormData] = useState({
    title: '',
    script: '',
    niche: 'general',
    duration: 60
  });
  const [qualityPreset, setQualityPreset] = useState<string>('youtube_premium');
  const [subtitleStyle, setSubtitleStyle] = useState<string>('youtube');
  const [enableSubtitles, setEnableSubtitles] = useState(true);
  const [enableSpatialAudio, setEnableSpatialAudio] = useState(true);
  const [voiceMappings, setVoiceMappings] = useState<CharacterVoiceMapping[]>([]);
  const [showVoiceConfig, setShowVoiceConfig] = useState(false);
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
      // Extract characters from script (basic parsing)
      const characters = extractCharactersFromScript(formData.script);
      
      // Generate scenes from script
      const scenes = generateScenesFromScript(formData.script, formData.duration);
      
      // Create professional video with HD quality and voice mapping
      const renderJob = await createProfessionalVideo({
        title: formData.title,
        script: formData.script,
        characters,
        scenes,
        quality: qualityPreset === 'cinema_quality' ? 'ultra-hd' : 
                qualityPreset === 'youtube_premium' ? 'hd' : 'standard',
        enableSubtitles,
        enableSpatialAudio
      });
      
      setVoiceMappings(renderJob.voiceMappings);
      setShowVoiceConfig(true);

      // Also generate with old system for compatibility
      const config = await generateAdvancedVideo(formData, selectedStyle.id);
      setGeneratedConfig(config);

      // Queue for rendering
      const jobId = await queueVideoRender(config, 'current-channel');
      
      // Save to localStorage with professional settings
      const videos = JSON.parse(localStorage.getItem('generated_videos') || '[]');
      videos.push({
        id: jobId,
        channelId: 'current-channel',
        title: formData.title,
        style: selectedStyle.name,
        quality: QUALITY_PRESETS[qualityPreset as keyof typeof QUALITY_PRESETS],
        voiceMappings: renderJob.voiceMappings,
        subtitles: {
          enabled: enableSubtitles,
          style: subtitleStyle,
          ...SUBTITLE_STYLES[subtitleStyle as keyof typeof SUBTITLE_STYLES]
        },
        spatialAudio: enableSpatialAudio,
        status: 'rendering',
        createdAt: new Date().toISOString(),
        estimatedRenderTime: renderJob.estimatedRenderTime,
        config
      });
      localStorage.setItem('generated_videos', JSON.stringify(videos));

      const qualityName = QUALITY_PRESETS[qualityPreset as keyof typeof QUALITY_PRESETS].name;
      alert(`✨ Professional HD video queued!\n\nQuality: ${qualityName}\nVoices: ${renderJob.voiceMappings.length} unique character voices\nSubtitles: ${enableSubtitles ? 'Enabled with speaker labels' : 'Disabled'}\nSpatial Audio: ${enableSpatialAudio ? 'Enabled' : 'Disabled'}\nEstimated render time: ${renderJob.estimatedRenderTime} minutes\n\nJob ID: ${jobId}`);
      
      setShowPreview(true);
    } catch (error) {
      console.error('Generation error:', error);
      alert('Failed to generate video. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Extract characters from script (basic NLP)
  const extractCharactersFromScript = (script: string) => {
    const lines = script.split('\n');
    const characters: any[] = [];
    const characterNames = new Set<string>();

    lines.forEach(line => {
      // Look for dialogue patterns like "CHARACTER: dialogue" or "Character says:"
      const match = line.match(/^([A-Z][A-Za-z\s]+)[:]/);
      if (match) {
        const name = match[1].trim();
        if (!characterNames.has(name)) {
          characterNames.add(name);
          characters.push({
            id: `char_${characters.length}`,
            name,
            role: characters.length === 0 ? 'narrator' : 'character',
            gender: inferGender(name),
            age: 'adult',
            description: `Character from the story`
          });
        }
      }
    });

    // If no characters found, add a default narrator
    if (characters.length === 0) {
      characters.push({
        id: 'narrator',
        name: 'Narrator',
        role: 'narrator',
        gender: 'male',
        age: 'adult',
        description: 'Story narrator'
      });
    }

    return characters;
  };

  const inferGender = (name: string): 'male' | 'female' | 'neutral' => {
    const femaleNames = ['sarah', 'emma', 'lily', 'diana', 'maria', 'anna'];
    const maleNames = ['david', 'john', 'michael', 'james', 'robert', 'william'];
    const lowerName = name.toLowerCase();
    
    if (femaleNames.some(n => lowerName.includes(n))) return 'female';
    if (maleNames.some(n => lowerName.includes(n))) return 'male';
    return 'neutral';
  };

  const generateScenesFromScript = (script: string, duration: number) => {
    const paragraphs = script.split('\n\n').filter(p => p.trim());
    const sceneCount = Math.max(3, Math.min(paragraphs.length, 10));
    const sceneDuration = duration / sceneCount;

    return paragraphs.slice(0, sceneCount).map((paragraph, index) => ({
      id: `scene_${index}`,
      duration: sceneDuration,
      content: paragraph,
      timestamp: index * sceneDuration
    }));
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

                {/* Quality Settings */}
                <div className="pt-4 border-t border-slate-700">
                  <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    🎥 Quality Settings
                  </h3>
                  
                  <div className="mb-4">
                    <label className="block text-slate-300 font-medium mb-2">Video Quality</label>
                    <select
                      value={qualityPreset}
                      onChange={(e) => setQualityPreset(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:border-green-500 focus:outline-none transition-colors"
                    >
                      {Object.entries(QUALITY_PRESETS).map(([key, preset]) => (
                        <option key={key} value={key}>
                          {preset.name} - {preset.description}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-slate-400 mt-2">
                      {QUALITY_PRESETS[qualityPreset as keyof typeof QUALITY_PRESETS].resolution} @ {QUALITY_PRESETS[qualityPreset as keyof typeof QUALITY_PRESETS].fps}fps
                    </p>
                  </div>

                  <div className="mb-4">
                    <label className="block text-slate-300 font-medium mb-2">Subtitle Style</label>
                    <select
                      value={subtitleStyle}
                      onChange={(e) => setSubtitleStyle(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:border-green-500 focus:outline-none transition-colors"
                      disabled={!enableSubtitles}
                    >
                      {Object.entries(SUBTITLE_STYLES).map(([key, style]) => (
                        <option key={key} value={key}>
                          {style.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enableSubtitles}
                        onChange={(e) => setEnableSubtitles(e.target.checked)}
                        className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-green-500 focus:ring-2 focus:ring-green-500"
                      />
                      <div>
                        <span className="text-white font-medium">Enable Subtitles</span>
                        <p className="text-xs text-slate-400">Accurate captions with speaker labels</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enableSpatialAudio}
                        onChange={(e) => setEnableSpatialAudio(e.target.checked)}
                        className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-green-500 focus:ring-2 focus:ring-green-500"
                      />
                      <div>
                        <span className="text-white font-medium">Spatial Audio</span>
                        <p className="text-xs text-slate-400">3D audio positioning for immersive experience</p>
                      </div>
                    </label>
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
                              style.quality === 'ultra' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
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
            <div className="text-4xl mb-4">�</div>
            <h3 className="text-white font-bold text-xl mb-2">Character Voice Mapping</h3>
            <p className="text-slate-300">Each character gets a unique voice that stays consistent across all episodes</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-2xl p-6">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-white font-bold text-xl mb-2">Accurate Subtitles</h3>
            <p className="text-slate-300">AI-generated captions with speaker labels and word-level highlighting</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/30 rounded-2xl p-6">
            <div className="text-4xl mb-4">🎬</div>
            <h3 className="text-white font-bold text-xl mb-2">HD/4K Quality</h3>
            <p className="text-slate-300">Professional video quality up to 4K with HDR and spatial audio</p>
          </div>
        </motion.div>
      </div>

      {/* Voice Mapping Preview Modal */}
      <AnimatePresence>
        {showVoiceConfig && voiceMappings.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
            onClick={() => setShowVoiceConfig(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 rounded-2xl p-8 max-w-4xl max-h-[90vh] overflow-y-auto border border-green-600/30"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">🎤 Voice Mapping</h2>
                  <p className="text-slate-400">Each character has been assigned a unique voice</p>
                </div>
                <button
                  onClick={() => setShowVoiceConfig(false)}
                  className="text-slate-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                {voiceMappings.map((mapping, idx) => (
                  <div key={idx} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-white font-bold text-xl">{mapping.characterName}</h3>
                        <p className="text-slate-400 text-sm">{mapping.description}</p>
                      </div>
                      <span className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-sm font-bold">
                        {mapping.voiceConsistency}% Match
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      <div className="bg-slate-900/50 rounded-lg p-3">
                        <p className="text-slate-400 text-xs">Voice</p>
                        <p className="text-white font-bold text-sm">{mapping.voiceProfile.voiceName}</p>
                      </div>
                      <div className="bg-slate-900/50 rounded-lg p-3">
                        <p className="text-slate-400 text-xs">Gender</p>
                        <p className="text-white font-bold text-sm capitalize">{mapping.voiceProfile.gender}</p>
                      </div>
                      <div className="bg-slate-900/50 rounded-lg p-3">
                        <p className="text-slate-400 text-xs">Age</p>
                        <p className="text-white font-bold text-sm capitalize">{mapping.voiceProfile.age.replace('-', ' ')}</p>
                      </div>
                      <div className="bg-slate-900/50 rounded-lg p-3">
                        <p className="text-slate-400 text-xs">Accent</p>
                        <p className="text-white font-bold text-sm">{mapping.voiceProfile.accent}</p>
                      </div>
                    </div>

                    <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-3">
                      <p className="text-green-400 text-sm">
                        ✓ Voice will remain consistent across all episodes in this series
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-green-900/20 to-yellow-900/20 border border-green-600/30 rounded-xl">
                <h4 className="text-white font-bold mb-2">✨ Professional Features Enabled:</h4>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li>✓ {voiceMappings.length} unique character voices mapped</li>
                  <li>✓ HD/{QUALITY_PRESETS[qualityPreset as keyof typeof QUALITY_PRESETS].resolution} quality rendering</li>
                  <li>✓ {enableSubtitles ? 'Accurate subtitles with speaker labels' : 'Subtitles disabled'}</li>
                  <li>✓ {enableSpatialAudio ? '3D spatial audio enabled' : 'Stereo audio'}</li>
                  <li>✓ Professional audio mixing and compression</li>
                  <li>✓ Voice consistency tracking for series episodes</li>
                </ul>
              </div>

              <button
                onClick={() => setShowVoiceConfig(false)}
                className="w-full mt-6 bg-gradient-to-r from-green-600 to-yellow-600 hover:from-green-500 hover:to-yellow-500 text-white font-bold py-4 rounded-xl transition-all"
              >
                Continue →
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

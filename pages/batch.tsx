// Batch Generation Page - Generate 10-20 videos in ONE CLICK
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppNavigation from '../components/AppNavigation';
import { 
  generateBatch, 
  getAllBatchResults, 
  scheduleBatchVideos,
  getBatchStats,
  type BatchResult 
} from '../lib/batchGenerator';
import { exportAll, downloadExport } from '../lib/exportManager';
import { generateSeries, getAllSeries, getSeriesIdeas } from '../lib/seriesPlanner';

export default function BatchPage() {
  const [channels, setChannels] = useState<any[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string>('');
  const [videoCount, setVideoCount] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentBatch, setCurrentBatch] = useState<BatchResult | null>(null);
  const [allBatches, setAllBatches] = useState<BatchResult[]>([]);
  const [stats, setStats] = useState({ totalBatches: 0, totalVideos: 0, totalEstimatedViews: '0' });
  const [activeTab, setActiveTab] = useState<'batch' | 'series'>('batch');
  const [seriesTopic, setSeriesTopic] = useState('');
  const [seriesIdeas, setSeriesIdeas] = useState<string[]>([]);

  useEffect(() => {
    const savedChannels = JSON.parse(localStorage.getItem('youtube_channels') || '[]');
    setChannels(savedChannels);
    if (savedChannels.length > 0) {
      setSelectedChannel(savedChannels[0].id);
    }
    
    setAllBatches(getAllBatchResults());
    setStats(getBatchStats());
  }, []);

  useEffect(() => {
    if (selectedChannel) {
      const channel = channels.find(c => c.id === selectedChannel);
      if (channel) {
        setSeriesIdeas(getSeriesIdeas(channel.niche || 'tech'));
      }
    }
  }, [selectedChannel, channels]);

  const handleGenerateBatch = async () => {
    if (!selectedChannel) return;
    
    setIsGenerating(true);
    setProgress(0);
    
    const channel = channels.find(c => c.id === selectedChannel);
    const niche = channel?.niche || 'tech';
    
    // Simulate progress
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setProgress(i);
    }
    
    const result = generateBatch(
      selectedChannel,
      channel?.name || 'Channel',
      niche,
      videoCount
    );
    
    setCurrentBatch(result);
    setAllBatches(getAllBatchResults());
    setStats(getBatchStats());
    setIsGenerating(false);
  };

  const handleGenerateSeries = () => {
    if (!selectedChannel || !seriesTopic) return;
    
    const channel = channels.find(c => c.id === selectedChannel);
    const series = generateSeries(
      selectedChannel,
      channel?.niche || 'tech',
      seriesTopic
    );
    
    alert(`✅ Series "${series.name}" created with ${series.totalEpisodes} episodes!`);
    setSeriesTopic('');
  };

  const handleExport = (format: 'csv' | 'json' | 'markdown') => {
    const result = exportAll({ format });
    downloadExport(result);
  };

  const handleSchedule = (batchId: string) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1); // Start tomorrow
    scheduleBatchVideos(batchId, startDate, 24); // Every 24 hours
    setAllBatches(getAllBatchResults());
    alert('✅ Videos scheduled! One video per day starting tomorrow.');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <AppNavigation title="Batch Generator" showBack={true} />
      
      <div className="sm:pl-20 lg:pl-64 pt-20 sm:pt-24 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">⚡ Batch Generator</h1>
          <p className="text-gray-400">Generate 10-20 videos in ONE CLICK • Zero input needed</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-purple-900/30 rounded-xl p-4 border border-purple-500/30 text-center"
          >
            <div className="text-3xl font-bold">{stats.totalBatches}</div>
            <div className="text-gray-400 text-sm">Total Batches</div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-blue-900/30 rounded-xl p-4 border border-blue-500/30 text-center"
          >
            <div className="text-3xl font-bold">{stats.totalVideos}</div>
            <div className="text-gray-400 text-sm">Videos Generated</div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-green-900/30 rounded-xl p-4 border border-green-500/30 text-center"
          >
            <div className="text-3xl font-bold">{stats.totalEstimatedViews}</div>
            <div className="text-gray-400 text-sm">Est. Total Views</div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('batch')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'batch' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            ⚡ Batch Videos
          </button>
          <button
            onClick={() => setActiveTab('series')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'series' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            🔗 Series Planner
          </button>
        </div>

        {activeTab === 'batch' ? (
          <>
            {/* Generator Controls */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 mb-8"
            >
              <h2 className="text-xl font-bold mb-4">🎯 Generate Video Batch</h2>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Channel</label>
                  <select
                    value={selectedChannel}
                    onChange={(e) => setSelectedChannel(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                  >
                    <option value="">Select channel</option>
                    {channels.map(channel => (
                      <option key={channel.id} value={channel.id}>
                        {channel.name || channel.id} ({channel.niche || 'tech'})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Number of Videos</label>
                  <select
                    value={videoCount}
                    onChange={(e) => setVideoCount(Number(e.target.value))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                  >
                    <option value={5}>5 videos</option>
                    <option value={10}>10 videos</option>
                    <option value={15}>15 videos</option>
                    <option value={20}>20 videos</option>
                  </select>
                </div>
                
                <div className="flex items-end">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGenerateBatch}
                    disabled={isGenerating || !selectedChannel}
                    className={`w-full py-3 rounded-lg font-bold text-lg ${
                      isGenerating 
                        ? 'bg-gray-700 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500'
                    }`}
                  >
                    {isGenerating ? 'Generating...' : '⚡ GENERATE BATCH'}
                  </motion.button>
                </div>
              </div>

              {/* Progress */}
              <AnimatePresence>
                {isGenerating && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="bg-gray-800 rounded-full h-4 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                      />
                    </div>
                    <p className="text-center text-gray-400 mt-2">
                      Generating {videoCount} videos with AI... {progress}%
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Current Batch Result */}
            {currentBatch && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-xl p-6 border border-green-500/30 mb-8"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-green-400">✅ Batch Complete!</h2>
                    <p className="text-gray-400">
                      Generated {currentBatch.videosGenerated} videos for {currentBatch.channelName}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-400">{currentBatch.totalEstimatedViews}</div>
                    <div className="text-sm text-gray-400">Estimated Views</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  {currentBatch.videos.slice(0, 6).map((video, i) => (
                    <div key={video.id} className="bg-gray-800/50 rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-semibold text-sm truncate">{video.title}</div>
                          <div className="text-xs text-gray-400 mt-1">
                            Est. {video.estimatedViews} views • 🖼️ {video.thumbnailText}
                          </div>
                        </div>
                        <span className="text-green-400 text-xl">✓</span>
                      </div>
                    </div>
                  ))}
                </div>

                {currentBatch.videos.length > 6 && (
                  <p className="text-gray-400 text-sm text-center mb-4">
                    +{currentBatch.videos.length - 6} more videos generated
                  </p>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => handleSchedule(currentBatch.id)}
                    className="flex-1 bg-yellow-600 hover:bg-yellow-700 py-2 rounded-lg font-semibold"
                  >
                    📅 Schedule All (1/day)
                  </button>
                  <button
                    onClick={() => handleExport('csv')}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-semibold"
                  >
                    📥 Export CSV
                  </button>
                  <button
                    onClick={() => handleExport('json')}
                    className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg font-semibold"
                  >
                    JSON
                  </button>
                </div>
              </motion.div>
            )}

            {/* Previous Batches */}
            {allBatches.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gray-900/50 rounded-xl p-6 border border-gray-800"
              >
                <h2 className="text-xl font-bold mb-4">📦 Previous Batches</h2>
                <div className="space-y-3">
                  {allBatches.slice(-5).reverse().map(batch => (
                    <div key={batch.id} className="bg-gray-800/50 rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <div className="font-semibold">{batch.channelName}</div>
                        <div className="text-sm text-gray-400">
                          {batch.videosGenerated} videos • {new Date(batch.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-400 font-bold">{batch.totalEstimatedViews}</div>
                        <div className="text-xs text-gray-400">Est. Views</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        ) : (
          /* Series Planner Tab */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-900/50 rounded-xl p-6 border border-gray-800"
          >
            <h2 className="text-xl font-bold mb-4">🔗 Create Video Series</h2>
            <p className="text-gray-400 mb-6">
              Generate connected videos that viewers want to binge. Part 1, Part 2, Part 3...
            </p>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Channel</label>
                <select
                  value={selectedChannel}
                  onChange={(e) => setSelectedChannel(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                >
                  <option value="">Select channel</option>
                  {channels.map(channel => (
                    <option key={channel.id} value={channel.id}>
                      {channel.name || channel.id}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Series Topic</label>
                <input
                  type="text"
                  value={seriesTopic}
                  onChange={(e) => setSeriesTopic(e.target.value)}
                  placeholder="e.g., Python Programming"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                />
              </div>
            </div>

            {/* Series Ideas */}
            {seriesIdeas.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-2">Quick Ideas (click to use)</label>
                <div className="flex flex-wrap gap-2">
                  {seriesIdeas.map((idea, i) => (
                    <button
                      key={i}
                      onClick={() => setSeriesTopic(idea)}
                      className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm hover:bg-purple-500/30"
                    >
                      {idea}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerateSeries}
              disabled={!selectedChannel || !seriesTopic}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 py-3 rounded-lg font-bold text-lg disabled:opacity-50"
            >
              🔗 CREATE SERIES (5-7 Episodes)
            </motion.button>

            {/* Existing Series */}
            {getAllSeries().length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-bold mb-4">📚 Your Series</h3>
                <div className="space-y-3">
                  {getAllSeries().slice(-3).reverse().map(series => (
                    <div key={series.id} className="bg-gray-800/50 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold">{series.name}</div>
                          <div className="text-sm text-gray-400">
                            {series.totalEpisodes} episodes • {series.postingSchedule}
                          </div>
                        </div>
                        <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-sm">
                          {series.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* No channels warning */}
        {channels.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-yellow-900/30 rounded-xl p-6 border border-yellow-500/30 text-center"
          >
            <p className="text-yellow-400 mb-4">⚠️ No channels connected</p>
            <a 
              href="/connect" 
              className="bg-yellow-600 hover:bg-yellow-700 px-6 py-2 rounded-lg font-semibold inline-block"
            >
              Connect a Channel
            </a>
          </motion.div>
        )}
        </div>
      </div>
    </div>
  );
}

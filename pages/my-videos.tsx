import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppNavigation from '../components/AppNavigation';
import { getSafeChannels } from '../lib/dataProtection';
import { uploadVideoToYouTube, isChannelReadyForUpload } from '../lib/youtube-uploader';

interface Video {
  id: string;
  title: string;
  description?: string;
  script: string;
  category: string;
  status: string;
  priority: string;
  createdAt: string;
  estimatedViews?: number;
  estimatedRevenue?: string;
  estimatedWatchTime?: number;
  councilAnalysis?: any;
  approvedByCouncil?: boolean;
  uploadStatus?: 'pending' | 'uploading' | 'uploaded' | 'failed';
  uploadedAt?: string;
  youtubeUrl?: string;
  channelId?: string;
  channelName?: string;
  thumbnail?: string;
  tags?: string[];
}

interface Channel {
  id: string;
  name: string;
  subscriberCount: number;
  thumbnailUrl?: string;
}

export default function MyVideosPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'ready' | 'uploaded' | 'pending'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      setIsLoading(true);
      const loadedChannels = getSafeChannels();
      setChannels(loadedChannels);

      // Load all videos from multiple sources
      const allVideos: Video[] = [];
      const seenIds = new Set<string>();

      // Source 1: Load from Money Machine (all_generated_videos)
      try {
        const moneyMachineVideos = JSON.parse(localStorage.getItem('all_generated_videos') || '[]');
        moneyMachineVideos.forEach((video: any) => {
          if (!seenIds.has(video.id)) {
            seenIds.add(video.id);
            allVideos.push({
              ...video,
              status: video.status || 'ready',
              priority: video.priority || 'high',
              uploadStatus: video.uploadStatus || 'pending',
              script: video.script || '',
              category: video.category || 'general'
            });
          }
        });
      } catch (e) {
        console.log('No Money Machine videos found');
      }

      // Source 2: Load from generated_videos
      try {
        const generatedVideos = JSON.parse(localStorage.getItem('generated_videos') || '[]');
        generatedVideos.forEach((video: any) => {
          if (!seenIds.has(video.id)) {
            seenIds.add(video.id);
            allVideos.push({
              ...video,
              status: video.status || 'ready',
              priority: video.priority || 'medium',
              uploadStatus: video.uploadStatus || 'pending',
              script: video.script || '',
              category: video.category || 'general'
            });
          }
        });
      } catch (e) {
        console.log('No generated videos found');
      }

      // Source 3: Load from channel-specific storage
      loadedChannels.forEach((channel: Channel) => {
        const channelVideos = JSON.parse(localStorage.getItem(`videos_${channel.id}`) || '[]');
        channelVideos.forEach((video: Video) => {
          if (!seenIds.has(video.id)) {
            seenIds.add(video.id);
            allVideos.push({
              ...video,
              channelId: channel.id,
              channelName: channel.name,
              status: video.status || 'ready',
              priority: video.priority || 'medium',
              uploadStatus: video.uploadStatus || 'pending'
            } as any);
          }
        });
      });

      // Sort by creation date (newest first)
      allVideos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setVideos(allVideos);
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredVideos = videos.filter(video => {
    const channelMatch = selectedChannel === 'all' || (video as any).channelId === selectedChannel;
    const statusMatch = filter === 'all' || 
      (filter === 'ready' && video.status === 'ready') ||
      (filter === 'uploaded' && video.uploadStatus === 'uploaded') ||
      (filter === 'pending' && video.uploadStatus === 'pending');
    return channelMatch && statusMatch;
  });

  const handleUpload = async (video: Video) => {
    const channelId = (video as any).channelId;
    
    // Check if channel is ready for upload
    const uploadReady = isChannelReadyForUpload(channelId);
    if (!uploadReady.ready) {
      alert(`⚠️ Cannot upload: ${uploadReady.reason}\n\nPlease go to /connect and authenticate with YouTube OAuth first.`);
      return;
    }

    // Update video status to uploading
    setVideos(prev => prev.map(v => 
      v.id === video.id ? { ...v, uploadStatus: 'uploading' as const } : v
    ));

    try {
      // Get video data from localStorage (if it was generated with real video)
      const generatedVideos = JSON.parse(localStorage.getItem('generated_videos') || '[]');
      const generatedVideo = generatedVideos.find((v: any) => v.id === video.id);
      
      // For demo, we need the video base64 data. In a real app, this would be stored
      const videoBase64 = generatedVideo?.base64 || '';
      
      if (!videoBase64) {
        alert('⚠️ Video data not found. Please regenerate the video from Video Creator.');
        setVideos(prev => prev.map(v => 
          v.id === video.id ? { ...v, uploadStatus: 'pending' as const } : v
        ));
        return;
      }

      const result = await uploadVideoToYouTube(
        channelId,
        videoBase64,
        {
          title: video.title,
          description: video.script?.substring(0, 500) || video.description || 'Created with SixFold Studios',
          tags: video.tags || ['video', 'content'],
          privacyStatus: 'private',
        }
      );

      if (result.success) {
        // Update video in state
        setVideos(prev => prev.map(v => 
          v.id === video.id ? { 
            ...v, 
            uploadStatus: 'uploaded' as const,
            uploadedAt: new Date().toISOString(),
            youtubeUrl: result.url
          } : v
        ));

        // Update in localStorage
        const channelVideos = JSON.parse(localStorage.getItem(`videos_${channelId}`) || '[]');
        const updatedChannelVideos = channelVideos.map((v: Video) => 
          v.id === video.id ? { 
            ...v, 
            uploadStatus: 'uploaded',
            uploadedAt: new Date().toISOString(),
            youtubeUrl: result.url,
            youtubeId: result.videoId
          } : v
        );
        localStorage.setItem(`videos_${channelId}`, JSON.stringify(updatedChannelVideos));

        // Also update generated_videos
        const updatedGeneratedVideos = generatedVideos.map((v: any) => 
          v.id === video.id ? { 
            ...v, 
            status: 'uploaded',
            uploadStatus: 'uploaded',
            youtubeUrl: result.url,
            youtubeId: result.videoId
          } : v
        );
        localStorage.setItem('generated_videos', JSON.stringify(updatedGeneratedVideos));

        alert(`🎉 Video uploaded successfully!\n\n🔗 ${result.url}\n\n⚠️ Video is set to PRIVATE. Make it public in YouTube Studio.`);
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setVideos(prev => prev.map(v => 
        v.id === video.id ? { ...v, uploadStatus: 'failed' as const } : v
      ));
      alert(`❌ Upload failed: ${(error as Error).message}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'published': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'generating': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getUploadStatusColor = (status: string) => {
    switch (status) {
      case 'uploaded': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'uploading': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30 animate-pulse';
      case 'failed': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-card to-dark-bg">
        <AppNavigation title="My Videos" currentPage="View all your generated videos" />
        <div className="sm:pl-20 lg:pl-64 pt-20 sm:pt-24 p-4">
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-400">Loading your videos...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-card to-dark-bg">
      <AppNavigation title="My Videos" currentPage="View all your generated videos" />
      
      <div className="sm:pl-20 lg:pl-64 pt-20 sm:pt-24 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-white mb-2">🎬 My Videos</h1>
            <p className="text-slate-400">All your generated videos in one place. Upload to YouTube with one click!</p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <div className="text-3xl font-bold text-white">{videos.length}</div>
              <div className="text-slate-400 text-sm">Total Videos</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 border border-green-500/30">
              <div className="text-3xl font-bold text-green-400">
                {videos.filter(v => v.status === 'ready' && v.uploadStatus !== 'uploaded').length}
              </div>
              <div className="text-slate-400 text-sm">Ready to Upload</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 border border-blue-500/30">
              <div className="text-3xl font-bold text-blue-400">
                {videos.filter(v => v.uploadStatus === 'uploaded').length}
              </div>
              <div className="text-slate-400 text-sm">Uploaded</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 border border-purple-500/30">
              <div className="text-3xl font-bold text-purple-400">
                {videos.filter(v => v.approvedByCouncil).length}
              </div>
              <div className="text-slate-400 text-sm">Council Approved</div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            {/* Channel Filter */}
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:border-green-500 focus:outline-none"
            >
              <option value="all">All Channels</option>
              {channels.map(channel => (
                <option key={channel.id} value={channel.id}>{channel.name}</option>
              ))}
            </select>

            {/* Status Filter */}
            <div className="flex gap-2">
              {(['all', 'ready', 'uploaded', 'pending'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                    filter === status
                      ? 'bg-green-500 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Videos List */}
          {filteredVideos.length === 0 ? (
            <div className="text-center py-20 bg-slate-800/30 rounded-2xl border border-slate-700">
              <div className="text-6xl mb-4">🎥</div>
              <h3 className="text-2xl font-bold text-white mb-2">No Videos Found</h3>
              <p className="text-slate-400 mb-6">
                {videos.length === 0 
                  ? "You haven't generated any videos yet. Connect a channel to get started!"
                  : "No videos match your current filters."}
              </p>
              {videos.length === 0 && (
                <button
                  onClick={() => window.location.href = '/connect'}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:scale-105 transition-transform"
                >
                  Connect Channel
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {filteredVideos.map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 hover:border-green-500/50 transition-all"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1">
                        {/* Status Badges */}
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className="text-xs text-slate-500">
                            {(video as any).channelName}
                          </span>
                          <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getStatusColor(video.status)}`}>
                            {(video.status || 'ready').toUpperCase()}
                          </span>
                          <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getUploadStatusColor(video.uploadStatus || 'pending')}`}>
                            {video.uploadStatus === 'uploaded' ? '✅ UPLOADED' : 
                             video.uploadStatus === 'uploading' ? '⏳ UPLOADING...' : 
                             '📤 READY TO UPLOAD'}
                          </span>
                          {video.approvedByCouncil && (
                            <span className="px-3 py-1 rounded-lg text-xs font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                              👑 COUNCIL APPROVED
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold text-white mb-2">{video.title}</h3>

                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-3">
                          <span>🎯 {video.category || 'General'}</span>
                          <span>📅 {new Date(video.createdAt).toLocaleDateString()}</span>
                          {video.estimatedViews && (
                            <span className="text-blue-400">👁️ Est. {video.estimatedViews.toLocaleString()} views</span>
                          )}
                          {video.estimatedRevenue && (
                            <span className="text-green-400 font-bold">💰 {video.estimatedRevenue}</span>
                          )}
                          {video.councilAnalysis?.overallScore && (
                            <span>⭐ Score: {video.councilAnalysis.overallScore}/100</span>
                          )}
                        </div>

                        {/* Tags */}
                        {video.tags && video.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {video.tags.slice(0, 6).map((tag, i) => (
                              <span key={i} className="px-2 py-0.5 bg-slate-700 text-slate-300 rounded text-xs">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Script Preview */}
                        <details className="text-sm">
                          <summary className="cursor-pointer text-green-400 hover:text-green-300 font-semibold">
                            📜 View Script & Description
                          </summary>
                          <div className="mt-2 space-y-3">
                            {video.description && (
                              <div className="p-4 bg-slate-900/50 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-xs text-slate-500 font-bold">DESCRIPTION:</span>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(video.description || '');
                                      alert('✅ Description copied!');
                                    }}
                                    className="text-xs text-green-400 hover:text-green-300"
                                  >
                                    📋 Copy
                                  </button>
                                </div>
                                <pre className="whitespace-pre-wrap text-slate-300 text-xs max-h-32 overflow-y-auto">{video.description}</pre>
                              </div>
                            )}
                            <div className="p-4 bg-slate-900/50 rounded-lg">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-xs text-slate-500 font-bold">SCRIPT:</span>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(video.script || '');
                                    alert('✅ Script copied!');
                                  }}
                                  className="text-xs text-green-400 hover:text-green-300"
                                >
                                  📋 Copy
                                </button>
                              </div>
                              <pre className="whitespace-pre-wrap text-slate-300 text-xs max-h-48 overflow-y-auto">{video.script}</pre>
                            </div>
                          </div>
                        </details>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2 lg:min-w-[160px]">
                        {video.uploadStatus !== 'uploaded' && video.uploadStatus !== 'uploading' && (
                          <button
                            onClick={() => handleUpload(video)}
                            className="px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-bold transition-all hover:scale-105"
                          >
                            📤 Upload to YouTube
                          </button>
                        )}
                        {video.uploadStatus === 'uploading' && (
                          <button
                            disabled
                            className="px-4 py-3 bg-yellow-500/20 text-yellow-400 rounded-xl font-bold animate-pulse"
                          >
                            ⏳ Uploading...
                          </button>
                        )}
                        {video.uploadStatus === 'uploaded' && video.youtubeUrl && (
                          <a
                            href={video.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-3 bg-blue-500/20 text-blue-400 rounded-xl font-bold text-center hover:bg-blue-500/30 transition-all"
                          >
                            🔗 View on YouTube
                          </a>
                        )}
                        <button
                          onClick={() => {
                            localStorage.setItem('pending_video_creation', JSON.stringify({
                              ...video,
                              channelId: (video as any).channelId,
                              channelName: (video as any).channelName
                            }));
                            window.location.href = '/video-creator';
                          }}
                          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold transition-all text-sm"
                        >
                          ✏️ Edit Video
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

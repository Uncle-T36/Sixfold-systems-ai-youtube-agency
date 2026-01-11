import React, { useState, useCallback, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Film, 
  Download, 
  Upload, 
  Sparkles,
  Loader2,
  CheckCircle,
  AlertCircle,
  Video,
  Rocket,
  Send,
  Users
} from 'lucide-react';
import {
  generateLongFormVideo,
  downloadLongFormVideo,
  generateYouTubeDescription,
  LongFormVideoResult,
  GenerationProgress,
} from '../lib/longFormVideoGenerator';
import {
  generateAITitle,
  streamScriptGeneration,
  AIGeneratedScript,
  AIChapter,
} from '../lib/realTimeAI';
import {
  uploadToAllChannels,
  getAllConnectedChannels,
  getConnectionSummary,
  getAllChannels,
  UploadProgress,
  MultiChannelUploadJob,
  ConnectedChannel,
} from '../lib/autoMultiChannelUploader';

type VideoStyle = 'story' | 'documentary' | 'educational' | 'motivation' | 'horror' | 'comedy' | 'drama';

const STYLE_INFO: Record<VideoStyle, { name: string; icon: string }> = {
  story: { name: 'Story', icon: '📖' },
  documentary: { name: 'Documentary', icon: '🎬' },
  educational: { name: 'Educational', icon: '📚' },
  motivation: { name: 'Motivation', icon: '🔥' },
  horror: { name: 'Horror', icon: '👻' },
  comedy: { name: 'Comedy', icon: '😂' },
  drama: { name: 'Drama', icon: '🎭' },
};

const DURATION_OPTIONS = [
  { value: 45, label: '45 min' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hr' },
  { value: 120, label: '2 hours' },
];

type GenerationStage = 'idle' | 'generating-title' | 'generating-script' | 'rendering-video' | 'complete';

export default function LongFormCreator() {
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState<VideoStyle>('story');
  const [duration, setDuration] = useState(60);
  const [resolution] = useState<'1080p' | '1440p' | '4K'>('1080p');
  
  const [stage, setStage] = useState<GenerationStage>('idle');
  const [generatedTitle, setGeneratedTitle] = useState('');
  const [generatedScript, setGeneratedScript] = useState<AIGeneratedScript | null>(null);
  const [streamedChapters, setStreamedChapters] = useState<AIChapter[]>([]);
  const [generatedVideo, setGeneratedVideo] = useState<LongFormVideoResult | null>(null);
  const [videoProgress, setVideoProgress] = useState<GenerationProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showScript, setShowScript] = useState(true);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [uploadJob, setUploadJob] = useState<MultiChannelUploadJob | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]); // Selected channel IDs
  const [showChannelSelector, setShowChannelSelector] = useState(false);
  
  const abortRef = useRef(false);

  // Get connected channels info
  const connectionSummary = typeof window !== 'undefined' ? getConnectionSummary() : { connectedChannels: 0, channelNames: [] };
  const connectedChannels = typeof window !== 'undefined' ? getAllConnectedChannels() : [];

  // Toggle channel selection
  const toggleChannelSelection = (channelId: string) => {
    setSelectedChannels(prev => 
      prev.includes(channelId) 
        ? prev.filter(id => id !== channelId)
        : [...prev, channelId]
    );
  };

  // Select all channels
  const selectAllChannels = () => {
    setSelectedChannels(connectedChannels.map(ch => ch.id));
  };

  // Clear selection
  const clearChannelSelection = () => {
    setSelectedChannels([]);
  };

  const handleUploadToSelectedChannels = useCallback(async () => {
    if (!generatedVideo) return;
    
    if (selectedChannels.length === 0) {
      setError('Please select at least one channel to upload to.');
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(null);
    setUploadJob(null);
    setShowChannelSelector(false);
    
    try {
      // Upload only to selected channels
      const job = await uploadToAllChannels(
        generatedVideo.blob,
        {
          title: generatedVideo.title,
          description: generateYouTubeDescription(generatedVideo),
          tags: ['AI generated', 'long form', style, topic],
          privacyStatus: 'public',
        },
        (progress) => setUploadProgress(progress),
        selectedChannels // Pass specific channel IDs
      );
      
      setUploadJob(job);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  }, [generatedVideo, style, topic, selectedChannels]);

  const handleGenerate = useCallback(async () => {
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    abortRef.current = false;
    setError(null);
    setGeneratedTitle('');
    setGeneratedScript(null);
    setStreamedChapters([]);
    setGeneratedVideo(null);
    setShowScript(true);

    try {
      // STAGE 1: Generate Title
      setStage('generating-title');
      const title = await generateAITitle(topic, style);
      if (abortRef.current) return;
      setGeneratedTitle(title);

      // STAGE 2: Generate Script with Streaming
      setStage('generating-script');
      const chapters: AIChapter[] = [];
      
      for await (const chunk of streamScriptGeneration({ topic, style, duration })) {
        if (abortRef.current) return;
        
        if (chunk.type === 'chapter') {
          chapters.push(chunk.data);
          setStreamedChapters([...chapters]);
        } else if (chunk.type === 'complete') {
          setGeneratedScript(chunk.data);
        }
      }

      // STAGE 3: Render Video Immediately
      setStage('rendering-video');
      
      const video = await generateLongFormVideo(
        {
          title,
          topic,
          targetDuration: duration,
          style,
          voiceStyle: 'narrator',
          resolution,
          includeMusic: true,
          includeSubtitles: true,
          chapterMarkers: true,
        },
        (progress) => setVideoProgress(progress)
      );

      if (abortRef.current) return;
      
      setGeneratedVideo(video);
      setStage('complete');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
      setStage('idle');
    }
  }, [topic, style, duration, resolution]);

  const handleCancel = () => {
    abortRef.current = true;
    setStage('idle');
  };

  const handleReset = () => {
    setTopic('');
    setGeneratedTitle('');
    setGeneratedScript(null);
    setStreamedChapters([]);
    setGeneratedVideo(null);
    setVideoProgress(null);
    setStage('idle');
    setError(null);
  };

  const handleDownload = () => {
    if (generatedVideo) downloadLongFormVideo(generatedVideo);
  };

  const isGenerating = stage !== 'idle' && stage !== 'complete';

  return (
    <>
      <Head>
        <title>AI Long-Form Video Creator | SixFold Studios</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-dark-bg via-primary-900/20 to-dark-bg">
        <header className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/95 backdrop-blur-sm border-b border-dark-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <Link href="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <Film className="w-6 h-6 text-primary-400" />
                <span className="text-xl font-bold bg-gradient-to-r from-primary-400 via-azure-400 to-luxury-400 bg-clip-text text-transparent">AI Long-Form Creator</span>
              </div>
              {isGenerating && (
                <div className="flex items-center gap-2 text-luxury-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">{stage.replace(/-/g, ' ')}</span>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* LEFT: Input & Settings */}
              <div className="space-y-6">
                <div className="bg-dark-card/70 rounded-2xl p-6 border border-primary-500/30">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-6 h-6 text-luxury-400" />
                    <h2 className="text-xl font-bold bg-gradient-to-r from-primary-400 to-luxury-400 bg-clip-text text-transparent">Enter Your Idea</h2>
                  </div>
                  
                  <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter any topic... AI will generate title, script, and video automatically."
                    disabled={isGenerating}
                    className="w-full h-32 bg-dark-bg text-white px-4 py-3 rounded-xl border border-dark-border focus:border-primary-500 outline-none resize-none disabled:opacity-50"
                  />

                  <div className="mt-4 flex flex-wrap gap-2">
                    {['The Psychology of Money', 'Ancient Egypt', 'AI Revolution', 'True Crime', 'Space'].map((s) => (
                      <button
                        key={s}
                        onClick={() => setTopic(s)}
                        disabled={isGenerating}
                        className="px-3 py-1.5 text-xs bg-dark-border hover:bg-primary-500/20 text-slate-300 hover:text-primary-300 rounded-full disabled:opacity-50 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-dark-card/50 rounded-xl p-6 border border-dark-border">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-slate-400 mb-3">Style</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(Object.entries(STYLE_INFO) as [VideoStyle, { name: string; icon: string }][]).slice(0, 4).map(([key, info]) => (
                          <button
                            key={key}
                            onClick={() => setStyle(key)}
                            disabled={isGenerating}
                            className={`p-2 rounded-lg border text-sm transition-colors ${
                              style === key ? 'border-lavender-500 bg-lavender-500/20 text-white' : 'border-dark-border text-slate-400 hover:border-lavender-500/50'
                            }`}
                          >
                            {info.icon} {info.name}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-slate-400 mb-3">Duration</label>
                      <div className="grid grid-cols-2 gap-2">
                        {DURATION_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setDuration(opt.value)}
                            disabled={isGenerating}
                            className={`p-2 rounded-lg border text-sm transition-colors ${
                              duration === opt.value ? 'border-primary-500 bg-primary-500/20 text-white' : 'border-dark-border text-slate-400 hover:border-primary-500/50'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {stage === 'idle' && (
                  <button
                    onClick={handleGenerate}
                    disabled={!topic.trim()}
                    className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                      topic.trim() ? 'bg-gradient-to-r from-primary-500 via-azure-500 to-lavender-500 hover:from-primary-400 hover:via-azure-400 hover:to-lavender-400 text-white shadow-lg shadow-primary-500/25' : 'bg-dark-border text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <Rocket className="w-6 h-6" />
                    Generate {duration} Minute Video
                  </button>
                )}

                {isGenerating && (
                  <button onClick={handleCancel} className="w-full py-3 rounded-xl border border-red-500/50 text-red-400 hover:bg-red-500/20">
                    Cancel Generation
                  </button>
                )}

                {error && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <p className="text-red-300">{error}</p>
                  </div>
                )}
              </div>

              {/* RIGHT: Live Preview */}
              <div className="space-y-6">
                {(generatedTitle || stage === 'generating-title') && (
                  <div className="bg-dark-card/70 rounded-xl p-6 border border-luxury-500/30">
                    <div className="flex items-center gap-2 mb-3">
                      {stage === 'generating-title' ? <Loader2 className="w-5 h-5 text-luxury-400 animate-spin" /> : <CheckCircle className="w-5 h-5 text-primary-400" />}
                      <span className="text-sm text-slate-400">AI Generated Title</span>
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-luxury-400 to-primary-400 bg-clip-text text-transparent">{generatedTitle || 'Generating...'}</h3>
                  </div>
                )}

                {(streamedChapters.length > 0 || stage === 'generating-script') && (
                  <div className="bg-dark-card/70 rounded-xl p-6 border border-azure-500/30 max-h-[400px] overflow-y-auto">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {stage === 'generating-script' ? <Loader2 className="w-5 h-5 text-azure-400 animate-spin" /> : <CheckCircle className="w-5 h-5 text-primary-400" />}
                        <span className="text-sm text-slate-400">AI Script ({streamedChapters.length} chapters)</span>
                      </div>
                      <button onClick={() => setShowScript(!showScript)} className="text-sm text-azure-400 hover:text-azure-300">{showScript ? 'Hide' : 'Show'}</button>
                    </div>

                    {showScript && (
                      <div className="space-y-4">
                        {streamedChapters.map((chapter, idx) => (
                          <div key={idx} className="border-l-2 border-lavender-500 pl-4">
                            <h4 className="text-white font-semibold mb-2">Chapter {idx + 1}: {chapter.title}</h4>
                            <p className="text-slate-400 text-sm line-clamp-3">{chapter.content.substring(0, 200)}...</p>
                            <div className="flex gap-4 mt-2 text-xs text-slate-500">
                              <span>⏱️ {chapter.duration} min</span>
                              <span>🎭 {chapter.mood}</span>
                            </div>
                          </div>
                        ))}
                        {stage === 'generating-script' && (
                          <div className="flex items-center gap-2 text-azure-400">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-sm">Generating more...</span>
                          </div>
                        )}
                      </div>
                    )}

                    {generatedScript && (
                      <div className="mt-4 pt-4 border-t border-dark-border flex justify-between text-sm">
                        <span className="text-slate-400">Total Words:</span>
                        <span className="text-luxury-400 font-bold">{generatedScript.totalWordCount.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                )}

                {(stage === 'rendering-video' || stage === 'complete') && (
                  <div className="bg-dark-card/70 rounded-xl p-6 border border-primary-500/30">
                    <div className="flex items-center gap-2 mb-4">
                      {stage === 'rendering-video' ? <Loader2 className="w-5 h-5 text-primary-400 animate-spin" /> : <CheckCircle className="w-5 h-5 text-primary-400" />}
                      <span className="text-sm text-slate-400">{stage === 'complete' ? 'Video Complete!' : 'Rendering...'}</span>
                    </div>

                    {videoProgress && (
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">{videoProgress.message}</span>
                          <span className="text-primary-400 font-bold">{videoProgress.progress}%</span>
                        </div>
                        <div className="h-3 bg-dark-border rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-primary-500 to-azure-500 rounded-full" style={{ width: `${videoProgress.progress}%` }} />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {stage === 'complete' && generatedVideo && (
                  <div className="bg-dark-card/70 rounded-xl overflow-hidden border border-primary-500/50">
                    {generatedVideo.thumbnailBase64 && <img src={generatedVideo.thumbnailBase64} alt="Thumbnail" className="w-full aspect-video object-cover" />}
                    <div className="p-6 space-y-4">
                      <h3 className="text-xl font-bold bg-gradient-to-r from-primary-400 to-luxury-400 bg-clip-text text-transparent">{generatedVideo.title}</h3>
                      <div className="flex flex-wrap gap-3 text-sm text-slate-400">
                        <span>📹 {generatedVideo.resolution}</span>
                        <span>⏱️ {Math.floor(generatedVideo.duration / 60)} min</span>
                        <span>💾 {(generatedVideo.size / 1024 / 1024).toFixed(1)} MB</span>
                      </div>

                      <div className="bg-dark-bg rounded-lg p-4 max-h-32 overflow-y-auto">
                        {generatedVideo.chapters.map((ch, i) => (
                          <div key={i} className="flex gap-3 text-sm">
                            <span className="text-lavender-400 font-mono">{ch.time}</span>
                            <span className="text-slate-300">{ch.title}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-3">
                        <button onClick={handleDownload} className="flex-1 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
                          <Download className="w-5 h-5" /> Download
                        </button>
                        <button onClick={() => { navigator.clipboard.writeText(generateYouTubeDescription(generatedVideo)); alert('Copied!'); }} className="flex-1 py-3 bg-dark-border hover:bg-azure-500/20 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
                          <Upload className="w-5 h-5" /> Copy Desc
                        </button>
                      </div>

                      {/* CHANNEL SELECTION & UPLOAD */}
                      <div className="border-t border-dark-border pt-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-azure-400" />
                            <span className="text-sm text-slate-400">
                              {connectionSummary.connectedChannels} channel{connectionSummary.connectedChannels !== 1 ? 's' : ''} connected
                            </span>
                          </div>
                          {connectionSummary.connectedChannels === 0 ? (
                            <Link href="/connect" className="text-sm text-azure-400 hover:text-azure-300">
                              Connect →
                            </Link>
                          ) : (
                            <button 
                              onClick={() => setShowChannelSelector(!showChannelSelector)}
                              className="text-sm text-azure-400 hover:text-azure-300"
                            >
                              {showChannelSelector ? 'Hide' : 'Select Channels'}
                            </button>
                          )}
                        </div>

                        {/* Channel Selection List */}
                        {showChannelSelector && connectedChannels.length > 0 && (
                          <div className="mb-4 bg-dark-bg rounded-xl p-4 border border-dark-border">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-semibold text-white">Select channels to upload to:</span>
                              <div className="flex gap-2">
                                <button 
                                  onClick={selectAllChannels}
                                  className="text-xs text-azure-400 hover:text-azure-300"
                                >
                                  Select All
                                </button>
                                <span className="text-slate-600">|</span>
                                <button 
                                  onClick={clearChannelSelection}
                                  className="text-xs text-slate-400 hover:text-slate-300"
                                >
                                  Clear
                                </button>
                              </div>
                            </div>
                            <div className="space-y-2">
                              {connectedChannels.map((channel) => (
                                <label 
                                  key={channel.id}
                                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                                    selectedChannels.includes(channel.id)
                                      ? 'bg-azure-500/20 border border-azure-500/50'
                                      : 'bg-dark-card border border-dark-border hover:border-azure-500/30'
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedChannels.includes(channel.id)}
                                    onChange={() => toggleChannelSelection(channel.id)}
                                    className="w-4 h-4 rounded border-dark-border text-azure-500 focus:ring-azure-500 bg-dark-bg"
                                  />
                                  <div className="flex-1">
                                    <span className="text-white font-medium">{channel.name}</span>
                                    <span className="text-xs text-slate-500 ml-2">({channel.id.slice(0, 12)}...)</span>
                                  </div>
                                  {selectedChannels.includes(channel.id) && (
                                    <CheckCircle className="w-4 h-4 text-azure-400" />
                                  )}
                                </label>
                              ))}
                            </div>
                            {selectedChannels.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-dark-border text-sm text-slate-400">
                                Selected: <span className="text-azure-400 font-bold">{selectedChannels.length}</span> channel{selectedChannels.length !== 1 ? 's' : ''}
                              </div>
                            )}
                          </div>
                        )}
                        
                        {!uploadJob && (
                          <button 
                            onClick={handleUploadToSelectedChannels}
                            disabled={isUploading || connectionSummary.connectedChannels === 0 || (showChannelSelector && selectedChannels.length === 0)}
                            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                              connectionSummary.connectedChannels > 0 && (!showChannelSelector || selectedChannels.length > 0)
                                ? 'bg-gradient-to-r from-azure-500 to-lavender-500 hover:from-azure-400 hover:to-lavender-400 text-white' 
                                : 'bg-dark-border text-slate-500 cursor-not-allowed'
                            }`}
                          >
                            {isUploading ? (
                              <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Uploading to {uploadProgress?.currentChannel || 'channel'}...
                              </>
                            ) : showChannelSelector && selectedChannels.length > 0 ? (
                              <>
                                <Send className="w-5 h-5" />
                                Upload to {selectedChannels.length} Selected Channel{selectedChannels.length !== 1 ? 's' : ''}
                              </>
                            ) : showChannelSelector ? (
                              <>
                                <Send className="w-5 h-5" />
                                Select channels above
                              </>
                            ) : (
                              <>
                                <Send className="w-5 h-5" />
                                Upload to YouTube
                              </>
                            )}
                          </button>
                        )}
                        
                        {uploadProgress && isUploading && (
                          <div className="mt-3 space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-400">Uploading to {uploadProgress.currentChannel}</span>
                              <span className="text-azure-400">{uploadProgress.completed}/{uploadProgress.totalChannels}</span>
                            </div>
                            <div className="h-2 bg-dark-border rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-azure-500 to-lavender-500 rounded-full transition-all" 
                                style={{ width: `${uploadProgress.overallProgress}%` }} 
                              />
                            </div>
                          </div>
                        )}
                        
                        {uploadJob && (
                          <div className="mt-3 space-y-2">
                            <div className={`flex items-center gap-2 ${
                              uploadJob.status === 'completed' ? 'text-primary-400' :
                              uploadJob.status === 'partial' ? 'text-luxury-400' : 'text-red-400'
                            }`}>
                              {uploadJob.status === 'completed' ? <CheckCircle className="w-5 h-5" /> :
                               uploadJob.status === 'partial' ? <AlertCircle className="w-5 h-5" /> :
                               <AlertCircle className="w-5 h-5" />}
                              <span className="font-bold">
                                {uploadJob.status === 'completed' ? 'All uploads successful!' :
                                 uploadJob.status === 'partial' ? 'Some uploads completed' : 'Uploads failed'}
                              </span>
                            </div>
                            <div className="space-y-1">
                              {uploadJob.results.map((result, i) => (
                                <div key={i} className="flex items-center justify-between text-sm">
                                  <span className="text-slate-400">{result.channelName}</span>
                                  {result.status === 'success' ? (
                                    <a href={result.videoUrl} target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300">
                                      View ↗
                                    </a>
                                  ) : (
                                    <span className="text-red-400">{result.error || 'Failed'}</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <button onClick={handleReset} className="w-full py-2 text-slate-400 hover:text-luxury-400 transition-colors">Create Another</button>
                    </div>
                  </div>
                )}

                {stage === 'idle' && !generatedTitle && (
                  <div className="bg-dark-card/30 rounded-xl p-12 border border-dashed border-dark-border text-center">
                    <Video className="w-16 h-16 text-primary-500/50 mx-auto mb-4" />
                    <h3 className="text-xl text-slate-300 mb-2">Ready to Create</h3>
                    <p className="text-slate-500 text-sm">Enter a topic and AI will generate title, script, and {duration}-minute video.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

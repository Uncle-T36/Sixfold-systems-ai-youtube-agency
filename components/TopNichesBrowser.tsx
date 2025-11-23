import React, { useState } from 'react';
import { TOP_NICHES, TopNiche, calculateNicheRevenue, getHighRevenueNiches, getNichesByCategory } from '../lib/topNiches';
import { autonomousVideoSystem } from '../lib/autonomousVideoSystem';

interface Props {
  onNicheSetup?: (channelId: string) => void;
}

export default function TopNichesBrowser({ onNicheSetup }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedNiche, setSelectedNiche] = useState<TopNiche | null>(null);
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [setupComplete, setSetupComplete] = useState<string[]>([]);

  const categories = [
    { id: 'all', name: '🎯 All Niches', icon: '🎯' },
    { id: 'high-revenue', name: '💰 Highest Revenue', icon: '💰' },
    { id: 'finance', name: '💵 Finance', icon: '💵' },
    { id: 'business', name: '📈 Business', icon: '📈' },
    { id: 'tech', name: '💻 Tech', icon: '💻' },
    { id: 'psychology', name: '🧠 Psychology', icon: '🧠' },
    { id: 'health', name: '❤️ Health', icon: '❤️' },
  ];

  const getFilteredNiches = () => {
    if (selectedCategory === 'all') return TOP_NICHES;
    if (selectedCategory === 'high-revenue') return getHighRevenueNiches();
    return getNichesByCategory(selectedCategory as TopNiche['category']);
  };

  const handleSetupChannel = async (niche: TopNiche) => {
    setIsSettingUp(true);
    
    try {
      // Create channel with niche template
      const channelId = `channel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const channelData = {
        id: channelId,
        name: niche.channelName,
        description: niche.channelDescription,
        keywords: niche.keywords.join(', '),
        niche: niche.name,
        cpm: niche.cpm,
        connectedAt: new Date().toISOString(),
        status: 'active',
        nicheTemplate: niche.id,
      };
      
      // Save to localStorage
      const channels = JSON.parse(localStorage.getItem('youtube_channels') || '[]');
      channels.push(channelData);
      localStorage.setItem('youtube_channels', JSON.stringify(channels));
      
      // Create mock channel object for autonomous system
      const mockChannel = {
        id: channelId,
        name: niche.channelName,
        description: niche.channelDescription,
        subscriberCount: 0,
      };
      
      // Auto-generate first 3 videos from niche topics
      for (let i = 0; i < 3; i++) {
        await autonomousVideoSystem.autoGenerateFirstVideo(mockChannel);
        
        // Small delay between videos
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Auto-plan remaining videos from niche topics
      await autonomousVideoSystem.autoplanVideosUntilMonetization(mockChannel);
      
      setSetupComplete([...setupComplete, niche.id]);
      setSelectedNiche(null);
      
      if (onNicheSetup) {
        onNicheSetup(channelId);
      }
      
      alert(`✅ ${niche.channelName} is ready!\n\n3 videos generated\n15-20 videos planned\nExpected revenue Day 90: $${niche.expectedRevenueDay90.toLocaleString()}\n\nStart uploading NOW!`);
      
    } catch (error) {
      console.error('Setup failed:', error);
      alert('Setup failed. Check console for details.');
    } finally {
      setIsSettingUp(false);
    }
  };

  const getCPMBadgeColor = (cpm: number) => {
    if (cpm >= 30) return 'bg-green-500';
    if (cpm >= 25) return 'bg-blue-500';
    if (cpm >= 20) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  const getCompetitionColor = (competition: string) => {
    if (competition === 'low') return 'text-green-400';
    if (competition === 'medium') return 'text-yellow-400';
    return 'text-red-400';
  };

  const filteredNiches = getFilteredNiches();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400">High-CPM niches. One-click setup. Start earning in 90 days.</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-green-400">$25-40 CPM</div>
          <div className="text-sm text-gray-400">Revenue per 1,000 views</div>
        </div>
      </div>
        
        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Niches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNiches.map(niche => {
          const revenue = calculateNicheRevenue(niche);
          const isSetup = setupComplete.includes(niche.id);
          
          return (
            <div
              key={niche.id}
              className={`bg-gray-800 rounded-xl border-2 p-6 cursor-pointer transition-all hover:scale-105 ${
                selectedNiche?.id === niche.id
                  ? 'border-purple-500 shadow-2xl shadow-purple-500/50'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
              onClick={() => setSelectedNiche(niche)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{niche.name}</h3>
                  <p className="text-sm text-gray-400 mb-3">{niche.channelDescription}</p>
                </div>
                {isSetup && (
                  <div className="ml-2 text-2xl">✅</div>
                )}
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white ${getCPMBadgeColor(niche.cpm)}`}>
                    ${niche.cpm} CPM
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400">Avg Views</div>
                  <div className="font-bold">{(niche.avgViews / 1000).toFixed(0)}K</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Competition</div>
                  <div className={`font-bold capitalize ${getCompetitionColor(niche.competition)}`}>
                    {niche.competition}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400">Difficulty</div>
                  <div className="font-bold capitalize">{niche.difficulty}</div>
                </div>
              </div>

              {/* Revenue Projection */}
              <div className="bg-gray-900 rounded-lg p-3 mb-4">
                <div className="text-xs text-gray-400 mb-2">Revenue Timeline (5 videos/week)</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-400">Day 30:</span>
                    <span className="ml-2 font-bold text-green-400">${(revenue.day30).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Day 90:</span>
                    <span className="ml-2 font-bold text-green-400">${(revenue.day90).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Day 60:</span>
                    <span className="ml-2 font-bold text-green-400">${(revenue.day60).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Day 180:</span>
                    <span className="ml-2 font-bold text-green-400">${(revenue.day180).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Setup Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isSetup && !isSettingUp) {
                    if (confirm(`Setup ${niche.name}?\n\nThis will:\n- Create optimized channel\n- Generate 3 videos\n- Plan 15-20 more videos\n- Setup auto-scheduler\n\nReady to start?`)) {
                      handleSetupChannel(niche);
                    }
                  }
                }}
                disabled={isSetup || isSettingUp}
                className={`w-full py-3 rounded-lg font-bold transition-all ${
                  isSetup
                    ? 'bg-green-600 cursor-not-allowed'
                    : isSettingUp
                    ? 'bg-gray-600 cursor-wait'
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {isSetup ? '✅ Channel Active' : isSettingUp ? '⏳ Setting Up...' : '🚀 Setup This Niche'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Detailed Modal */}
      {selectedNiche && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50" onClick={() => setSelectedNiche(null)}>
          <div className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">{selectedNiche.name}</h2>
                <p className="text-gray-400">{selectedNiche.channelDescription}</p>
              </div>
              <button onClick={() => setSelectedNiche(null)} className="text-4xl hover:text-red-500">×</button>
            </div>

            {/* Imperial Wisdom */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                <div className="text-red-400 font-bold mb-2">👑 Machiavellian Edge</div>
                <p className="text-sm text-gray-300">{selectedNiche.machiavellianEdge}</p>
              </div>
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <div className="text-blue-400 font-bold mb-2">🏛️ Stoic Discipline</div>
                <p className="text-sm text-gray-300">{selectedNiche.stoicDiscipline}</p>
              </div>
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                <div className="text-yellow-400 font-bold mb-2">⚔️ Sun Tzu Strategy</div>
                <p className="text-sm text-gray-300">{selectedNiche.sunTzuStrategy}</p>
              </div>
            </div>

            {/* Video Topics */}
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3">🎬 Video Topics (First 10)</h3>
              <div className="space-y-2">
                {selectedNiche.videoTopics.slice(0, 10).map((topic, idx) => (
                  <div key={idx} className="bg-gray-800 rounded-lg p-3 flex items-start gap-3">
                    <div className="text-purple-400 font-bold">{idx + 1}</div>
                    <div className="flex-1 text-sm">{topic}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Strategy */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold mb-2">🎨 Content Style</h3>
                <p className="text-sm text-gray-300">{selectedNiche.contentStyle}</p>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">🎯 Target Audience</h3>
                <p className="text-sm text-gray-300">{selectedNiche.targetAudience}</p>
              </div>
            </div>

            {/* Keywords */}
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-2">🔑 SEO Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {selectedNiche.keywords.map((keyword, idx) => (
                  <span key={idx} className="bg-purple-600 px-3 py-1 rounded-full text-sm">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            {/* Setup Button */}
            <button
              onClick={() => {
                if (!setupComplete.includes(selectedNiche.id) && !isSettingUp) {
                  if (confirm(`Setup ${selectedNiche.name}?\n\nThis will:\n- Create optimized channel\n- Generate 3 videos\n- Plan 15-20 more videos\n- Setup auto-scheduler\n\nReady to start?`)) {
                    handleSetupChannel(selectedNiche);
                  }
                }
              }}
              disabled={setupComplete.includes(selectedNiche.id) || isSettingUp}
              className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
                setupComplete.includes(selectedNiche.id)
                  ? 'bg-green-600 cursor-not-allowed'
                  : isSettingUp
                  ? 'bg-gray-600 cursor-wait'
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {setupComplete.includes(selectedNiche.id) 
                ? '✅ Channel Active - Check Dashboard' 
                : isSettingUp 
                ? '⏳ Setting Up Channel...' 
                : '🚀 Setup This Niche Now'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * COMPLETE FINANCIAL FREEDOM DASHBOARD
 * See everything, start creating content NOW
 * Cost: $0
 */

import { useState, useEffect } from 'react';
import { 
  analyzeIncomeOpportunities, 
  findAffiliateOpportunities,
  calculateFreedomTimeline 
} from '../lib/multiIncomeStreams';
import { createCrossPlatformContent } from '../lib/crossPlatformEmpire';
import { generateFirstContentNow, runFullAutonomousWorkflow } from '../lib/aiCloneWorkforce';

export default function FreedomDashboard() {
  const [currentRevenue, setCurrentRevenue] = useState(500);
  const [targetRevenue, setTargetRevenue] = useState(10000);
  const [selectedNiche, setSelectedNiche] = useState('mystery');
  const [isGenerating, setIsGenerating] = useState(false);
  const [firstContent, setFirstContent] = useState<any>(null);

  // Calculate freedom timeline
  const freedomCalc = calculateFreedomTimeline(currentRevenue, targetRevenue, 20);

  const handleGenerateContent = async () => {
    setIsGenerating(true);
    try {
      const content = await generateFirstContentNow(selectedNiche);
      setFirstContent(content);
      alert('🎉 Your first viral content is ready! Check below.');
    } catch (error) {
      alert('Error generating content');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white shadow-2xl">
          <h1 className="text-5xl font-bold mb-4">🚀 Your Path to Financial Freedom</h1>
          <p className="text-2xl text-emerald-100 mb-6">100% FREE Tools • Zero Monthly Costs • Start Today</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur rounded-xl p-6">
              <div className="text-4xl mb-2">⏱️</div>
              <div className="text-3xl font-bold">{freedomCalc.monthsToFreedom}</div>
              <div className="text-emerald-100">Months to Freedom</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-6">
              <div className="text-4xl mb-2">💰</div>
              <div className="text-3xl font-bold">${targetRevenue.toLocaleString()}</div>
              <div className="text-emerald-100">Target Monthly Income</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-6">
              <div className="text-4xl mb-2">📈</div>
              <div className="text-3xl font-bold">20%</div>
              <div className="text-emerald-100">Monthly Growth Rate</div>
            </div>
          </div>
        </div>

        {/* Quick Start - Generate First Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">🎬 Generate Your First Viral Content NOW</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Select Your Niche:</label>
            <select 
              value={selectedNiche}
              onChange={(e) => setSelectedNiche(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg"
            >
              <option value="mystery">🔍 Mystery & Unsolved Cases</option>
              <option value="crime">🚨 True Crime</option>
              <option value="finance">💰 Finance & Money</option>
              <option value="tech">💻 Tech & Innovation</option>
              <option value="psychology">🧠 Psychology & Mind Hacks</option>
            </select>
          </div>

          <button
            onClick={handleGenerateContent}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 px-8 rounded-xl font-bold text-xl hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 shadow-lg"
          >
            {isGenerating ? '⏳ Generating...' : '🚀 GENERATE MY FIRST VIRAL VIDEO'}
          </button>

          <p className="text-center text-gray-600 mt-4">
            AI will create: Script, 10 Titles, Description, Thumbnails, Hooks • Ready in 30 seconds
          </p>
        </div>

        {/* Generated Content Display */}
        {firstContent && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-emerald-600">✨ Your Viral Content Is Ready!</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-emerald-50 rounded-lg p-4">
                <div className="text-sm text-gray-600">Estimated Views</div>
                <div className="text-2xl font-bold text-emerald-600">{firstContent.estimatedViews.toLocaleString()}</div>
              </div>
              <div className="bg-teal-50 rounded-lg p-4">
                <div className="text-sm text-gray-600">Estimated Revenue</div>
                <div className="text-2xl font-bold text-teal-600">${firstContent.estimatedRevenue.toLocaleString()}</div>
              </div>
              <div className="bg-emerald-50 rounded-lg p-4">
                <div className="text-sm text-gray-600">Time to Create</div>
                <div className="text-2xl font-bold text-emerald-600">{firstContent.timeToCreate}</div>
              </div>
            </div>

            {/* 10 Viral Titles */}
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3">📝 Choose Your Title (10 Viral Options):</h3>
              <div className="space-y-2">
                {firstContent.titles.map((title: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-emerald-50 cursor-pointer">
                    <input type="radio" name="title" id={`title-${i}`} />
                    <label htmlFor={`title-${i}`} className="font-medium cursor-pointer">{title}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Full Script */}
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3">📜 Your Full Script:</h3>
              <div className="bg-gray-50 p-6 rounded-lg font-mono text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
                {firstContent.script}
              </div>
              <button className="mt-3 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                📋 Copy Script to Clipboard
              </button>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3">📄 SEO-Optimized Description:</h3>
              <div className="bg-gray-50 p-6 rounded-lg text-sm whitespace-pre-wrap max-h-64 overflow-y-auto">
                {firstContent.description}
              </div>
              <button className="mt-3 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
                📋 Copy Description
              </button>
            </div>

            {/* Thumbnail Ideas */}
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3">🖼️ Thumbnail Concepts:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {firstContent.thumbnailIdeas.map((idea: string, i: number) => (
                  <div key={i} className="bg-gradient-to-br from-emerald-100 to-pink-100 p-4 rounded-lg">
                    <div className="text-sm font-semibold mb-2">Option {i + 1}:</div>
                    <div className="text-sm">{idea}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hooks */}
            <div>
              <h3 className="text-xl font-bold mb-3">🎣 Viral Hooks (First 10 seconds):</h3>
              <div className="space-y-2">
                {firstContent.hooks.map((hook: string, i: number) => (
                  <div key={i} className="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-500">
                    <strong>Hook {i + 1}:</strong> {hook}
                  </div>
                ))}
              </div>
            </div>

            {/* Next Steps */}
            <div className="mt-8 bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 rounded-xl">
              <h3 className="text-2xl font-bold mb-4">🎯 Next Steps:</h3>
              <ol className="space-y-2">
                <li>1. Record voiceover using the script (or use AI voice - FREE with ElevenLabs)</li>
                <li>2. Create video using Advanced Video Generator (animated or stock footage)</li>
                <li>3. Generate thumbnail using Canva (FREE)</li>
                <li>4. Schedule across all platforms (YouTube, TikTok, Instagram)</li>
                <li>5. Let Autopilot handle posting & promotion</li>
              </ol>
              <button className="mt-4 bg-white text-emerald-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100">
                ▶️ Start Video Production
              </button>
            </div>
          </div>
        )}

        {/* Revenue Streams Overview */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-6">💰 Your Revenue Streams (All FREE)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'YouTube Ad Revenue', current: '$500', potential: '$2,000', icon: '🎥' },
              { name: 'Affiliate Marketing', current: '$0', potential: '$1,500', icon: '🔗' },
              { name: 'Digital Products', current: '$0', potential: '$3,000', icon: '📦' },
              { name: 'Sponsorships', current: '$0', potential: '$2,500', icon: '🤝' },
              { name: 'Membership', current: '$0', potential: '$1,000', icon: '👥' },
              { name: 'Merchandise', current: '$0', potential: '$800', icon: '👕' }
            ].map((stream, i) => (
              <div key={i} className="border-2 border-gray-200 rounded-xl p-4 hover:border-emerald-500 transition-all">
                <div className="text-3xl mb-2">{stream.icon}</div>
                <div className="font-bold text-lg mb-1">{stream.name}</div>
                <div className="text-sm text-gray-600">Current: {stream.current}</div>
                <div className="text-emerald-600 font-semibold">Potential: {stream.potential}/mo</div>
              </div>
            ))}
          </div>
        </div>

        {/* Cross-Platform Strategy */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-6">🌐 Cross-Platform Empire (All FREE)</h2>
          <div className="space-y-4">
            {[
              { platform: 'YouTube', posts: '3x/week', reach: '50K views/video', revenue: '$250/video' },
              { platform: 'YouTube Shorts', posts: '3x/day', reach: '100K views/short', revenue: '$50/short' },
              { platform: 'TikTok', posts: '5x/day', reach: '200K views/video', revenue: '$100/video' },
              { platform: 'Instagram Reels', posts: '3x/day', reach: '150K views/reel', revenue: '$75/reel' },
              { platform: 'Twitter/X', posts: '5x/day', reach: '50K views/tweet', revenue: 'Indirect' }
            ].map((p, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg">
                <div>
                  <div className="font-bold text-lg">{p.platform}</div>
                  <div className="text-sm text-gray-600">{p.posts} • {p.reach}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-600">{p.revenue}</div>
                  <div className="text-xs text-gray-500">per post</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline to Freedom */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-6">📅 Your Timeline to Freedom</h2>
          <div className="space-y-4">
            {freedomCalc.timeline.slice(0, 12).map((month) => (
              <div key={month.month} className="flex items-center gap-4">
                <div className="w-20 text-center">
                  <div className="font-bold text-emerald-600">Month {month.month}</div>
                </div>
                <div className="flex-1 bg-gray-100 rounded-full h-12 relative overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full flex items-center px-4 text-white font-bold transition-all"
                    style={{ width: `${Math.min((month.revenue / targetRevenue) * 100, 100)}%` }}
                  >
                    ${month.revenue.toLocaleString()}/mo
                  </div>
                </div>
                {month.milestone && (
                  <div className="w-64 text-sm font-semibold text-emerald-600">
                    {month.milestone}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 text-center text-xl font-bold text-emerald-600">
            {freedomCalc.recommendation}
          </div>
        </div>

      </div>
    </div>
  );
}


// Landing Page - Fully Responsive Marketing Page
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PricingPage from '../components/PricingPage';

export default function LandingPage() {
  const [showPricing, setShowPricing] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    channelsCreated: 1234,
    videosGenerated: 45678,
    revenueGenerated: 2567890
  });
  const router = useRouter();

  useEffect(() => {
    // Animate numbers on load
    const interval = setInterval(() => {
      setStats(prev => ({
        channelsCreated: prev.channelsCreated + Math.floor(Math.random() * 3),
        videosGenerated: prev.videosGenerated + Math.floor(Math.random() * 10),
        revenueGenerated: prev.revenueGenerated + Math.floor(Math.random() * 1000)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    setShowPricing(true);
  };

  const handleSelectPlan = (tierId: string) => {
    router.push(`/signup?plan=${tierId}`);
  };

  if (showPricing) {
    return <PricingPage onSelectPlan={handleSelectPlan} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald- via-blue-900 to-teal-">
      {/* Navigation */}
      <nav className="relative px-4 py-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white">AI YouTube Agency</h1>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <button 
              onClick={() => setShowPricing(true)}
              className="text-blue-200 hover:text-white transition-colors"
            >
              Pricing
            </button>
            <button className="text-blue-200 hover:text-white transition-colors">
              Features
            </button>
            <button className="text-blue-200 hover:text-white transition-colors">
              About
            </button>
            <button
              onClick={() => router.push('/login')}
              className="text-blue-200 hover:text-white transition-colors"
            >
              Login
            </button>
            <button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-emerald- to-pink-500 text-white px-6 py-2 rounded-lg hover:from-emerald- hover:to-pink-400 transition-all"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-white p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-emerald-/95 backdrop-blur-sm border-t border-emerald- z-50">
            <div className="px-4 py-6 space-y-4">
              <button 
                onClick={() => setShowPricing(true)}
                className="block w-full text-left text-blue-200 hover:text-white transition-colors py-2"
              >
                Pricing
              </button>
              <button className="block w-full text-left text-blue-200 hover:text-white transition-colors py-2">
                Features
              </button>
              <button className="block w-full text-left text-blue-200 hover:text-white transition-colors py-2">
                About
              </button>
              <button
                onClick={() => router.push('/login')}
                className="block w-full text-left text-blue-200 hover:text-white transition-colors py-2"
              >
                Login
              </button>
              <button
                onClick={handleGetStarted}
                className="w-full bg-gradient-to-r from-emerald- to-pink-500 text-white px-6 py-3 rounded-lg hover:from-emerald- hover:to-pink-400 transition-all mt-4"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 lg:py-20 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          Build Your AI
          <span className="bg-gradient-to-r from-emerald- to-pink-400 bg-clip-text text-transparent"> YouTube Empire</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-blue-200 max-w-4xl mx-auto mb-8 leading-relaxed">
          Automate multiple YouTube channels with AI-powered content creation. 
          Generate viral videos, optimize for monetization, and scale your business to 6-figure revenue.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <button
            onClick={handleGetStarted}
            className="bg-gradient-to-r from-emerald- to-pink-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-emerald- hover:to-pink-400 transition-all shadow-lg hover:shadow-xl w-full sm:w-auto"
          >
            Start Free Trial
          </button>
          <button
            onClick={() => document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="border-2 border-blue-300 text-blue-300 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-300 hover:text-emerald- transition-all w-full sm:w-auto"
          >
            Watch Demo
          </button>
        </div>

        {/* Live Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="text-3xl lg:text-4xl font-bold text-yellow-400 mb-2">
              {stats.channelsCreated.toLocaleString()}+
            </div>
            <div className="text-blue-200">Channels Created</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="text-3xl lg:text-4xl font-bold text-green-400 mb-2">
              {stats.videosGenerated.toLocaleString()}+
            </div>
            <div className="text-blue-200">Videos Generated</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="text-3xl lg:text-4xl font-bold text-emerald- mb-2">
              ${(stats.revenueGenerated / 1000000).toFixed(1)}M+
            </div>
            <div className="text-blue-200">Revenue Generated</div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16" id="features-section">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Everything You Need to Dominate YouTube
          </h2>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            Our AI-powered platform handles every aspect of YouTube content creation and optimization
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: '🤖',
              title: 'AI Script Generation',
              description: 'Generate viral video scripts using advanced AI that understands YouTube algorithms and viewer psychology.'
            },
            {
              icon: '🎥',
              title: 'Automated Video Creation',
              description: 'Create professional videos with AI voiceovers, stock footage, and background music - all automatically.'
            },
            {
              icon: '📈',
              title: 'Trend Analysis',
              description: 'Stay ahead of trends with real-time analysis of viral content and emerging topics in your niche.'
            },
            {
              icon: '📺',
              title: 'Multi-Channel Management',
              description: 'Manage up to 20 YouTube channels simultaneously with automated scheduling and optimization.'
            },
            {
              icon: '💰',
              title: 'Monetization Optimization',
              description: 'Accelerate your path to YouTube monetization with strategies proven to grow subscribers and watch time.'
            },
            {
              icon: '⚡',
              title: 'Lightning Fast',
              description: 'Generate and upload 50+ videos per day across all your channels with zero manual work required.'
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
              <p className="text-blue-200 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Demo Section */}
      <div className="max-w-7xl mx-auto px-4 py-16" id="demo-section">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            See It In Action
          </h2>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            Watch how our AI creates viral YouTube videos in minutes, not hours
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <div className="aspect-video bg-gray-800 rounded-xl mb-6 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl text-gray-400 mb-4">▶️</div>
              <div className="text-white text-xl mb-2">Interactive Demo</div>
              <div className="text-gray-400">Click to see AI video generation process</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-emerald-/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-emerald- font-bold">1</span>
              </div>
              <h4 className="text-white font-semibold mb-2">AI Analyzes Trends</h4>
              <p className="text-blue-200 text-sm">Scans millions of videos to find viral topics</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-500/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-400 font-bold">2</span>
              </div>
              <h4 className="text-white font-semibold mb-2">Generates Content</h4>
              <p className="text-blue-200 text-sm">Creates script, voiceover, and visuals automatically</p>
            </div>
            <div className="text-center">
              <div className="bg-green-500/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-green-400 font-bold">3</span>
              </div>
              <h4 className="text-white font-semibold mb-2">Uploads & Optimizes</h4>
              <p className="text-blue-200 text-sm">Publishes to YouTube with SEO optimization</p>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Trusted by Successful Creators
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              name: 'Sarah Chen',
              title: 'Tech Reviewer',
              channels: '3 channels',
              revenue: '$12K/month',
              quote: 'Went from 0 to monetized on all 3 channels in just 4 months. The AI creates better content than I ever could manually.'
            },
            {
              name: 'Mike Rodriguez',
              title: 'Kids Content Creator',
              channels: '6 channels',
              revenue: '$28K/month',
              quote: 'This platform transformed my YouTube business. I now run 6 successful channels with less effort than 1 channel before.'
            },
            {
              name: 'Emma Thompson',
              title: 'Lifestyle Influencer',
              channels: '8 channels',
              revenue: '$45K/month',
              quote: 'The monetization strategies are incredible. Every channel reached 1K subs and 4K watch hours faster than I thought possible.'
            }
          ].map((testimonial, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald- to-pink-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  {testimonial.name[0]}
                </div>
                <div>
                  <div className="text-white font-semibold">{testimonial.name}</div>
                  <div className="text-blue-200 text-sm">{testimonial.title}</div>
                </div>
              </div>
              <p className="text-blue-200 mb-4 italic">"{testimonial.quote}"</p>
              <div className="flex justify-between text-sm">
                <span className="text-emerald-">{testimonial.channels}</span>
                <span className="text-green-400 font-semibold">{testimonial.revenue}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to Build Your YouTube Empire?
        </h2>
        <p className="text-xl text-blue-200 mb-8">
          Join thousands of creators who are already using AI to dominate YouTube and generate life-changing income.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleGetStarted}
            className="bg-gradient-to-r from-emerald- to-pink-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-emerald- hover:to-pink-400 transition-all shadow-lg hover:shadow-xl w-full sm:w-auto"
          >
            Start Your Free Trial Now
          </button>
          <div className="text-blue-200 text-sm">
            No credit card required • 7-day free trial • Cancel anytime
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/20 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">AI YouTube Agency</h3>
              <p className="text-blue-200 text-sm">
                The most advanced AI-powered YouTube automation platform.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-blue-200">
                <li><button>Features</button></li>
                <li><button onClick={() => setShowPricing(true)}>Pricing</button></li>
                <li><button>Demo</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-blue-200">
                <li><button>Help Center</button></li>
                <li><button>Contact</button></li>
                <li><button>API Docs</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-blue-200">
                <li><button>Privacy Policy</button></li>
                <li><button>Terms of Service</button></li>
                <li><button>GDPR</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 mt-12 pt-8 text-center text-blue-200 text-sm">
            © 2025 AI YouTube Agency. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

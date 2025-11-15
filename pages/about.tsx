import React from 'react';
import AppNavigation from '../components/AppNavigation';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
      <AppNavigation title="About" currentPage="Learn about SixFold Studios" />
      
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-500 to-yellow-500 rounded-3xl flex items-center justify-center shadow-2xl">
            <span className="text-5xl">🎬</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-yellow-500 bg-clip-text text-transparent mb-4">
            SixFold Studios
          </h1>
          <p className="text-2xl text-slate-300 mb-4">
            AI-Powered YouTube Content Creation Platform
          </p>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto">
            Revolutionizing content creation with cutting-edge AI technology. Create, automate, and monetize your YouTube empire with ease.
          </p>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-2xl p-8"
          >
            <div className="text-4xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-slate-300 leading-relaxed">
              To democratize content creation by providing powerful AI tools that enable creators of all levels to produce professional, engaging, and monetizable YouTube content at scale.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-2xl p-8"
          >
            <div className="text-4xl mb-4">🚀</div>
            <h2 className="text-2xl font-bold text-white mb-4">Our Vision</h2>
            <p className="text-slate-300 leading-relaxed">
              To become the world's leading AI-powered content creation platform, empowering millions of creators to build sustainable, profitable YouTube businesses.
            </p>
          </motion.div>
        </div>

        {/* Key Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '🤖',
                title: 'AI Script Generation',
                description: '6 professional writing styles with worldwide story discovery from 10+ categories'
              },
              {
                icon: '🎨',
                title: 'Advanced Video Creator',
                description: '15+ animation styles including 2D cartoons, anime, 3D, and motion graphics'
              },
              {
                icon: '📺',
                title: 'Series Channel Builder',
                description: 'Create viral series with auto-generated episodes and professional scriptwriting'
              },
              {
                icon: '💰',
                title: 'Revenue Optimization',
                description: 'AI-powered monetization strategies with regional CPM analysis'
              },
              {
                icon: '🔍',
                title: 'Competitor Intelligence',
                description: 'Spy on top creators and steal winning strategies automatically'
              },
              {
                icon: '⚡',
                title: 'Autopilot Mode',
                description: '24/7 automated content creation and channel management'
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/50 rounded-xl p-6 hover:border-green-500/50 transition-all"
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {[
            { value: '10+', label: 'Story Categories' },
            { value: '15+', label: 'Video Styles' },
            { value: '98%', label: 'Viral Potential' },
            { value: '24/7', label: 'Automation' }
          ].map((stat, i) => (
            <div key={i} className="text-center p-6 bg-gradient-to-br from-green-500/10 to-yellow-500/10 border border-green-500/30 rounded-xl">
              <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-yellow-500 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Technology Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-2xl p-8 mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-8">Powered By Advanced AI</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'GPT-4', desc: 'Script Generation' },
              { name: 'Stable Diffusion', desc: 'Visual Creation' },
              { name: 'Neural Networks', desc: 'Content Analysis' },
              { name: 'Machine Learning', desc: 'Optimization' }
            ].map((tech, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-green-500/20 to-yellow-500/20 border border-green-500/30 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🧠</span>
                </div>
                <h3 className="text-white font-semibold mb-1">{tech.name}</h3>
                <p className="text-slate-400 text-xs">{tech.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Company Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-4">SixFold Systems LLC</h2>
          <p className="text-slate-400 mb-4">
            A technology company dedicated to empowering creators with AI-powered tools
          </p>
          <div className="text-slate-400 mb-6">
            Founded by <span className="text-white font-semibold">Uncle-T36</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 text-slate-400">
            <div className="flex items-center gap-6">
              <span>🌍 Global</span>
              <span>•</span>
              <span>📧 <a href="mailto:tchafuruka@gmail.com" className="text-green-400 hover:text-green-300 transition-colors">tchafuruka@gmail.com</a></span>
              <span>•</span>
              <span>� <a href="tel:+27749415020" className="text-green-400 hover:text-green-300 transition-colors">+27 74 941 5020</a></span>
            </div>
            <div>
              <span>�🚀 Constantly Innovating</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}


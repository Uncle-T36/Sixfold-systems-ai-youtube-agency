import React, { useState } from 'react';
import AppNavigation from '../components/AppNavigation';
import { motion } from 'framer-motion';

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: '',
    priority: 'normal'
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to localStorage for later review
    const tickets = JSON.parse(localStorage.getItem('support_tickets') || '[]');
    tickets.push({
      ...formData,
      id: `ticket-${Date.now()}`,
      status: 'open',
      createdAt: new Date().toISOString()
    });
    localStorage.setItem('support_tickets', JSON.stringify(tickets));
    
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: 'general',
        message: '',
        priority: 'normal'
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
      <AppNavigation title="Support" currentPage="Get help & contact us" />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-yellow-500 bg-clip-text text-transparent mb-4">
            How Can We Help?
          </h1>
          <p className="text-xl text-slate-300">
            We're here 24/7 to support your content creation journey
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Quick Help Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Quick Help</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {[
                {
                  icon: '📚',
                  title: 'Documentation',
                  desc: 'Comprehensive guides and tutorials',
                  action: 'View Docs'
                },
                {
                  icon: '💬',
                  title: 'Live Chat',
                  desc: 'Chat with our support team',
                  action: 'Start Chat'
                },
                {
                  icon: '🎥',
                  title: 'Video Tutorials',
                  desc: 'Step-by-step video guides',
                  action: 'Watch Now'
                },
                {
                  icon: '❓',
                  title: 'FAQ',
                  desc: 'Frequently asked questions',
                  action: 'Browse FAQ'
                }
              ].map((item, i) => (
                <button
                  key={i}
                  className="text-left p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-xl hover:border-green-500 transition-all"
                >
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="text-white font-bold mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm mb-3">{item.desc}</p>
                  <span className="text-green-400 text-sm font-semibold">{item.action} →</span>
                </button>
              ))}
            </div>

            {/* Contact Form */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Submit a Support Ticket</h2>
              
              {submitted ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 mx-auto mb-4 bg-green-500/20 border-2 border-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Ticket Submitted!</h3>
                  <p className="text-slate-400">We'll respond within 24 hours</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-slate-300 font-medium mb-2">Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-green-500 focus:outline-none"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-medium mb-2">Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-green-500 focus:outline-none"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Subject *</label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-green-500 focus:outline-none"
                      placeholder="Brief description of your issue"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-slate-300 font-medium mb-2">Category *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:border-green-500 focus:outline-none"
                      >
                        <option value="general">General Question</option>
                        <option value="technical">Technical Issue</option>
                        <option value="billing">Billing & Payments</option>
                        <option value="feature">Feature Request</option>
                        <option value="bug">Bug Report</option>
                        <option value="account">Account Issue</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-300 font-medium mb-2">Priority</label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:border-green-500 focus:outline-none"
                      >
                        <option value="low">Low - Can wait</option>
                        <option value="normal">Normal</option>
                        <option value="high">High - Urgent</option>
                        <option value="critical">Critical - Blocking</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Message *</label>
                    <textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={6}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-green-500 focus:outline-none resize-none"
                      placeholder="Please describe your issue in detail..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full px-8 py-4 bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 rounded-xl text-white font-bold text-lg shadow-lg transition-all"
                  >
                    Submit Ticket
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Contact Info Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Response Times */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Response Times</h3>
              <div className="space-y-4">
                {[
                  { priority: 'Critical', time: '< 1 hour', color: 'text-red-400' },
                  { priority: 'High', time: '< 4 hours', color: 'text-orange-400' },
                  { priority: 'Normal', time: '< 24 hours', color: 'text-green-400' },
                  { priority: 'Low', time: '< 48 hours', color: 'text-blue-400' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-slate-400">{item.priority}</span>
                    <span className={`font-semibold ${item.color}`}>{item.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Methods */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Contact Us</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📧</span>
                  <div>
                    <div className="text-white font-semibold">Email</div>
                    <a href="mailto:tchafuruka@gmail.com" className="text-green-400 hover:text-green-300 text-sm transition-colors">
                      tchafuruka@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">�</span>
                  <div>
                    <div className="text-white font-semibold">Phone/WhatsApp</div>
                    <a href="tel:+27749415020" className="text-green-400 hover:text-green-300 text-sm transition-colors">
                      +27 74 941 5020
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💬</span>
                  <div>
                    <div className="text-white font-semibold">Live Chat</div>
                    <div className="text-slate-400 text-sm">Available 24/7</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <h3 className="text-xl font-bold text-white">All Systems Operational</h3>
              </div>
              <p className="text-slate-400 text-sm">
                All services running smoothly
              </p>
            </div>

            {/* Knowledge Base */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Popular Articles</h3>
              <div className="space-y-3">
                {[
                  'Getting Started Guide',
                  'How to Connect Channels',
                  'Creating Your First Video',
                  'Monetization Setup',
                  'Troubleshooting Guide'
                ].map((article, i) => (
                  <button
                    key={i}
                    className="w-full text-left p-3 bg-slate-900/50 hover:bg-slate-800/50 border border-slate-700/50 hover:border-green-500/50 rounded-lg transition-all"
                  >
                    <span className="text-slate-300 text-sm">{article}</span>
                    <span className="float-right text-slate-500">→</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                q: 'How do I connect my YouTube channel?',
                a: 'Go to the Connect page, click "Connect Channel", and authorize with your Google account. Your channel will be connected instantly.'
              },
              {
                q: 'Can I generate videos in different styles?',
                a: 'Yes! We offer 15+ video styles including 2D cartoons, anime, 3D animation, motion graphics, and more.'
              },
              {
                q: 'How does the Series Creator work?',
                a: 'Select a story category, choose your scriptwriting style, and our AI will discover viral stories and generate professional scripts for you.'
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, PayPal, and bank transfers. Your payment information is securely encrypted.'
              },
              {
                q: 'Is there a free trial?',
                a: 'Yes! All new users get a 14-day free trial with full access to all features.'
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Absolutely. You can cancel your subscription at any time with no penalties or fees.'
              }
            ].map((faq, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/50 rounded-xl p-6"
              >
                <h3 className="text-white font-bold mb-3">{faq.q}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

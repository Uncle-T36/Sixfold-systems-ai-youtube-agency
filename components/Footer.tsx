import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-yellow-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🎬</span>
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-green-400 to-yellow-500 bg-clip-text text-transparent">
                  SixFold Studios
                </h3>
                <p className="text-xs text-slate-500">AI Content Creation</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Revolutionizing YouTube content creation with cutting-edge AI technology.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-green-500 rounded-lg flex items-center justify-center transition-all">
                <span className="text-lg">𝕏</span>
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-green-500 rounded-lg flex items-center justify-center transition-all">
                <span className="text-lg">📘</span>
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-green-500 rounded-lg flex items-center justify-center transition-all">
                <span className="text-lg">💬</span>
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              {[
                { name: 'Dashboard', path: '/dashboard' },
                { name: 'Series Creator', path: '/series' },
                { name: 'Video Creator', path: '/video-creator' },
                { name: 'Revenue Analytics', path: '/revenue' },
                { name: 'Pricing', path: '/pricing' }
              ].map((item, i) => (
                <li key={i}>
                  <Link href={item.path} className="text-slate-400 hover:text-green-400 text-sm transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {[
                { name: 'About Us', path: '/about' },
                { name: 'Support', path: '/support' },
                { name: 'Terms of Service', path: '/terms' },
                { name: 'Privacy Policy', path: '/privacy' },
                { name: 'Contact', path: '/support' }
              ].map((item, i) => (
                <li key={i}>
                  <Link href={item.path} className="text-slate-400 hover:text-green-400 text-sm transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              {[
                'Documentation',
                'API Reference',
                'Video Tutorials',
                'Community Forum',
                'Status Page'
              ].map((item, i) => (
                <li key={i}>
                  <a href="#" className="text-slate-400 hover:text-green-400 text-sm transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-slate-400 text-sm text-center md:text-left">
              © {currentYear} SixFold Systems LLC. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-slate-400 text-sm">All Systems Operational</span>
              </div>
              <div className="text-slate-400 text-sm">
                Made with <span className="text-red-500">♥</span> for Creators
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}


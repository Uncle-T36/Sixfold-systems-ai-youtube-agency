/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  
  // Memory optimization settings
  experimental: {
    // Reduce memory usage
    workerThreads: false,
    cpus: 1,
  },
  
  // Optimize image loading to prevent memory spikes
  images: {
    domains: ['i.ytimg.com', 'yt3.ggpht.com', 'images.unsplash.com', 'images.pexels.com'],
    unoptimized: true, // Disable image optimization to save memory
  },
  
  // Webpack optimization for memory
  webpack: (config, { dev, isServer }) => {
    // Limit memory usage during builds
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        minimize: true,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Split large dependencies into separate chunks
            framework: {
              name: 'framework',
              chunks: 'all',
              test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
              priority: 40,
              enforce: true,
            },
            lib: {
              test: /[\\/]node_modules[\\/]/,
              name(module) {
                const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                return `lib.${packageName.replace('@', '')}`;
              },
              priority: 30,
              minChunks: 1,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    
    return config;
  },
  
  env: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    YOUTUBE_CLIENT_ID: process.env.YOUTUBE_CLIENT_ID,
    YOUTUBE_CLIENT_SECRET: process.env.YOUTUBE_CLIENT_SECRET,
    GITHUB_COPILOT_TOKEN: process.env.GITHUB_COPILOT_TOKEN,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  
  poweredByHeader: false,
  compress: true,
  
  // Reduce concurrent operations
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
}

module.exports = nextConfig
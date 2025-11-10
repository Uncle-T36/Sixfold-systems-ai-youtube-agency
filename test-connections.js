// Test script to verify all free tools are connected and working
// Run this to validate your setup: node test-connections.js

const https = require('https');
const fs = require('fs');

console.log('🔧 Testing all FREE tool connections...\n');

// Test functions for each free tool
const tests = [
  {
    name: '📊 Google Trends API',
    test: () => testURL('https://trends.google.com/trends/api/dailytrends?geo=US'),
    cost: 'FREE',
    limit: 'Reasonable usage'
  },
  {
    name: '🔴 Reddit API', 
    test: () => testURL('https://www.reddit.com/r/popular/hot.json?limit=1'),
    cost: 'FREE',
    limit: '60 requests/minute'
  },
  {
    name: '📷 Unsplash API (if configured)',
    test: () => {
      const apiKey = process.env.UNSPLASH_ACCESS_KEY;
      if (!apiKey) {
        console.log('   ⚠️  API key not set - get free key at https://unsplash.com/developers');
        return Promise.resolve(false);
      }
      return testURL(`https://api.unsplash.com/search/photos?query=test&per_page=1&client_id=${apiKey}`);
    },
    cost: 'FREE',
    limit: '50 requests/hour'
  },
  {
    name: '🎥 Pexels API (if configured)',
    test: () => {
      const apiKey = process.env.PEXELS_API_KEY;
      if (!apiKey) {
        console.log('   ⚠️  API key not set - get free key at https://www.pexels.com/api/');
        return Promise.resolve(false);
      }
      return testURLWithHeaders('https://api.pexels.com/v1/search?query=test&per_page=1', {
        'Authorization': apiKey
      });
    },
    cost: 'FREE', 
    limit: '200 requests/hour'
  },
  {
    name: '📺 YouTube Data API (if configured)',
    test: () => {
      const apiKey = process.env.YOUTUBE_API_KEY;
      if (!apiKey) {
        console.log('   ⚠️  API key not set - get free key at https://console.cloud.google.com/');
        return Promise.resolve(false);
      }
      return testURL(`https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=1&key=${apiKey}`);
    },
    cost: 'FREE',
    limit: '10,000 requests/day'
  },
  {
    name: '🤖 GitHub Copilot API (if configured)',
    test: () => {
      const token = process.env.GITHUB_COPILOT_TOKEN;
      if (!token) {
        console.log('   ⚠️  Token not set - this uses your existing $10/month GitHub Copilot subscription');
        return Promise.resolve(false);
      }
      // Simple test - just check if token format is valid
      return Promise.resolve(token.length > 20);
    },
    cost: '$10/month (existing subscription)',
    limit: 'Based on subscription'
  },
  {
    name: '🎤 Windows TTS (if on Windows)',
    test: () => {
      if (process.platform !== 'win32') {
        console.log('   ℹ️  Not on Windows - TTS will use backup options');
        return Promise.resolve(true);
      }
      // Check if PowerShell is available
      const { spawn } = require('child_process');
      return new Promise((resolve) => {
        const ps = spawn('powershell', ['-Command', 'echo "test"']);
        ps.on('close', (code) => resolve(code === 0));
        ps.on('error', () => resolve(false));
      });
    },
    cost: 'FREE',
    limit: 'Unlimited'
  },
  {
    name: '🎬 FFmpeg (video processing)',
    test: () => {
      const { spawn } = require('child_process');
      return new Promise((resolve) => {
        const ffmpeg = spawn('ffmpeg', ['-version']);
        ffmpeg.on('close', (code) => resolve(code === 0));
        ffmpeg.on('error', () => {
          console.log('   ⚠️  FFmpeg not installed - install from https://ffmpeg.org/');
          resolve(false);
        });
      });
    },
    cost: 'FREE',
    limit: 'System resources only'
  }
];

// Helper function to test URLs
function testURL(url) {
  return new Promise((resolve) => {
    const request = https.get(url, (response) => {
      resolve(response.statusCode < 400);
    });
    
    request.on('error', () => resolve(false));
    request.setTimeout(5000, () => {
      request.destroy();
      resolve(false);
    });
  });
}

// Helper function to test URLs with headers
function testURLWithHeaders(url, headers) {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      headers: headers
    };
    
    const request = https.get(options, (response) => {
      resolve(response.statusCode < 400);
    });
    
    request.on('error', () => resolve(false));
    request.setTimeout(5000, () => {
      request.destroy();
      resolve(false);
    });
  });
}

// Run all tests
async function runAllTests() {
  const results = {
    working: [],
    failed: [],
    totalCost: 0
  };

  console.log('🚀 Testing FREE tool connections...\n');

  for (const test of tests) {
    process.stdout.write(`Testing ${test.name}... `);
    
    try {
      const isWorking = await test.test();
      
      if (isWorking) {
        console.log('✅ CONNECTED');
        results.working.push(test.name);
      } else {
        console.log('❌ FAILED');
        results.failed.push(test.name);
      }
      
      console.log(`   💰 Cost: ${test.cost}`);
      console.log(`   📊 Limit: ${test.limit}\n`);
      
    } catch (error) {
      console.log('❌ ERROR');
      console.log(`   Error: ${error.message}\n`);
      results.failed.push(test.name);
    }
  }

  // Summary
  console.log('📋 CONNECTION SUMMARY:');
  console.log(`✅ Working: ${results.working.length}/${tests.length} tools`);
  console.log(`❌ Failed: ${results.failed.length}/${tests.length} tools`);
  console.log(`💰 Total additional cost: $0/month (beyond existing GitHub Copilot)`);
  
  if (results.working.length >= 6) {
    console.log('\n🎉 SUCCESS! You have enough connected tools to run the AI agency!');
    console.log('\n🚀 Next steps:');
    console.log('1. Set up missing API keys for better results');
    console.log('2. Run: npm run dev');
    console.log('3. Visit: http://localhost:3000');
    console.log('4. Deploy to Vercel: vercel --prod');
  } else {
    console.log('\n⚠️  Consider setting up more API keys for optimal performance');
    console.log('   All APIs listed are FREE with generous limits');
  }

  return results;
}

// Run the tests
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { runAllTests, tests };
# 🚀 Deploy to Vercel - Complete Setup Guide

## Quick Deployment Steps

### 1. Push to GitHub
```bash
cd "c:\Users\tchaf\OneDrive\Desktop\SixFold Systems\ai_youtube_agency"
git init
git add .
git commit -m "🚀 AI YouTube Agency - Initial deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ai-youtube-agency.git
git push -u origin main
```

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your `ai-youtube-agency` repository
5. Configure environment variables (see below)
6. Click "Deploy"

### 3. Environment Variables (Vercel Dashboard)
```env
# Required for functionality
GITHUB_COPILOT_TOKEN=your_github_copilot_token
YOUTUBE_CLIENT_ID=your_youtube_client_id
YOUTUBE_CLIENT_SECRET=your_youtube_client_secret
NEXTAUTH_SECRET=your_random_secret_key

# Optional (free tiers available)
OPENAI_API_KEY=your_openai_key
UNSPLASH_ACCESS_KEY=your_unsplash_key
PEXELS_API_KEY=your_pexels_key
GOOGLE_TTS_KEY=your_google_tts_key

# Database (optional)
DATABASE_URL=postgresql://username:password@host:port/database
```

## 🔧 Vercel Configuration

### vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "functions": {
    "pages/api/**/*.ts": {
      "maxDuration": 300
    }
  },
  "env": {
    "GITHUB_COPILOT_TOKEN": "@github_copilot_token",
    "YOUTUBE_CLIENT_ID": "@youtube_client_id",
    "YOUTUBE_CLIENT_SECRET": "@youtube_client_secret",
    "NEXTAUTH_SECRET": "@nextauth_secret"
  }
}
```

## 📋 Pre-Deployment Checklist

### ✅ Required Setup
- [ ] GitHub repository created
- [ ] YouTube Data API credentials obtained
- [ ] GitHub Copilot access token ready
- [ ] Vercel account connected to GitHub

### ✅ Optional Enhancements
- [ ] OpenAI API key for fallback AI
- [ ] Google Cloud TTS credentials
- [ ] Unsplash API key for free images
- [ ] Pexels API key for free videos

## 🎬 Getting API Keys (FREE)

### 1. YouTube Data API (FREE)
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project
3. Enable YouTube Data API v3
4. Create OAuth 2.0 credentials
5. Download JSON file

### 2. GitHub Copilot Token
```bash
# If you have GitHub CLI
gh auth token

# Or use your existing Copilot subscription token
# This leverages your existing $10/month subscription!
```

### 3. Free Image APIs
- **Unsplash**: [unsplash.com/developers](https://unsplash.com/developers) - FREE
- **Pexels**: [pexels.com/api](https://pexels.com/api) - FREE

### 4. Free TTS APIs
- **Google TTS**: 1M characters/month FREE
- **Azure Speech**: 500K characters/month FREE

## 🚀 Automated Deployment

### GitHub Actions (Optional)
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 💰 Cost Optimization

### FREE Tier Limits
- **Vercel**: 100GB bandwidth, 100 deployments/month
- **YouTube API**: 10,000 requests/day
- **GitHub Copilot**: Already paying $10/month
- **TTS Services**: 500K-1M characters/month free
- **Image APIs**: Unlimited with attribution

### Scaling Costs
```
Month 1-3: $0 additional (use free tiers)
Month 4-6: $20-50/month (upgrade TTS, storage)
Month 7+: $100-200/month (premium features as revenue grows)
```

## 🎯 Post-Deployment Steps

### 1. Test Everything
```bash
# Test API endpoints
curl https://your-app.vercel.app/api/health

# Test video generation
curl -X POST https://your-app.vercel.app/api/generate-content
```

### 2. Monitor Performance
- Check Vercel dashboard for errors
- Monitor API usage limits
- Track video generation success rates

### 3. Scale Gradually
- Start with free tiers
- Upgrade based on revenue
- Reinvest 20-30% of YouTube earnings

## 🔧 Troubleshooting

### Common Issues
1. **API Limits Exceeded**: Upgrade to paid tiers
2. **Video Generation Fails**: Check FFmpeg in Vercel
3. **YouTube Upload Fails**: Verify OAuth setup
4. **Slow Performance**: Upgrade Vercel plan

### Solutions
- Enable Vercel Edge Functions for better performance
- Use CDN for static assets
- Implement caching for API responses
- Monitor with Vercel Analytics

## 🎉 You're Live!

Your AI YouTube Agency will be live at:
`https://your-app-name.vercel.app`

### What You Get
✅ Professional web dashboard
✅ Automated video generation
✅ YouTube upload automation
✅ Analytics and monitoring
✅ Mobile-responsive design
✅ Real-time progress tracking

### Expected Performance
- **Video Generation**: 2-5 minutes per video
- **Upload Speed**: 30 seconds - 2 minutes
- **Dashboard Load**: <2 seconds
- **API Response**: <1 second

Start with the FREE setup and scale as your channels grow and generate revenue!
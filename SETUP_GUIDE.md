# 🚀 SIXFOLD SYSTEMS - SETUP GUIDE
## AI YouTube Agency - Production Ready Configuration

**⏱️ Setup Time:** 10-15 minutes  
**💰 Cost:** $0/month (using all free tiers)  
**🎯 Completion:** Get to 100% production ready

---

## 📋 QUICK START CHECKLIST

- [ ] Step 1: Setup YouTube API (FREE)
- [ ] Step 2: Setup AI Content Generation (FREE)
- [ ] Step 3: Setup Supabase Database (FREE)
- [ ] Step 4: Configure Environment Variables
- [ ] Step 5: Test Integration
- [ ] Step 6: Deploy to Production

---

## 1️⃣ YOUTUBE API SETUP (Required)

**Purpose:** Fetch channel data, analytics, and video information  
**Cost:** FREE - 10,000 API units/day (enough for 1,000+ requests)

### Steps:

1. Go to [Google Cloud Console](https://console.cloud.google.com)

2. Create a new project or select existing:
   - Click "Select a project" → "New Project"
   - Name it: "SixFold YouTube API"
   - Click "Create"

3. Enable YouTube Data API v3:
   - In the search bar, type "YouTube Data API v3"
   - Click on it → Click "ENABLE"

4. Create API credentials:
   - Go to "Credentials" in the left sidebar
   - Click "+ CREATE CREDENTIALS"
   - Select "API key"
   - Copy the API key

5. (Optional) Restrict the API key:
   - Click on the key you just created
   - Under "API restrictions", select "Restrict key"
   - Choose "YouTube Data API v3"
   - Click "Save"

6. Add to your `.env.local` file:
   ```bash
   YOUTUBE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```

### Testing:
```bash
# The app will automatically use real YouTube data when the key is set
# Check console for: "✅ YouTube API configured"
```

---

## 2️⃣ AI CONTENT GENERATION SETUP (Required)

**Purpose:** Generate viral scripts, titles, descriptions, and thumbnails  
**Choose ONE option below:**

### Option A: Google Gemini (RECOMMENDED - FREE)

**Cost:** FREE - 60 requests/minute  
**Quality:** Excellent for YouTube content

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)

2. Sign in with your Google account

3. Click "Get API key" → "Create API key in new project"

4. Copy the API key

5. Add to `.env.local`:
   ```bash
   GOOGLE_GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```

### Option B: OpenAI GPT-4 (PAID)

**Cost:** ~$20/month for regular use  
**Quality:** Highest quality, most creative

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)

2. Sign in or create account

3. Click "+ Create new secret key"

4. Copy the key (starts with `sk-`)

5. Add to `.env.local`:
   ```bash
   OPENAI_API_KEY=sk-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```

### Testing:
```bash
# Open your app and try generating content
# Check console for: "✅ AI configured: Google Gemini" or "✅ AI configured: OpenAI"
```

---

## 3️⃣ SUPABASE DATABASE SETUP (Required)

**Purpose:** Store channels, videos, analytics, and automation tasks  
**Cost:** FREE - 500MB database, 50k monthly active users

### Steps:

1. Go to [Supabase](https://supabase.com/dashboard)

2. Create account or sign in

3. Click "New Project"
   - Name: "SixFold YouTube Agency"
   - Database Password: (generate strong password, save it!)
   - Region: Choose closest to you
   - Click "Create new project"
   - Wait 2-3 minutes for setup to complete

4. Get your credentials:
   - Go to "Settings" → "API"
   - Copy "Project URL"
   - Copy "anon public" key

5. Add to `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

6. Run the database schema:
   - In Supabase dashboard, go to "SQL Editor"
   - Click "New query"
   - Open `supabase/schema.sql` from your project
   - Copy ALL content and paste into Supabase SQL Editor
   - Click "Run" (bottom right)
   - You should see: "Success. No rows returned"

7. Enable Email Authentication (Optional):
   - Go to "Authentication" → "Providers"
   - Make sure "Email" is enabled
   - Configure email templates as needed

### Testing:
```bash
# Your app will automatically sync to Supabase
# Data will persist across devices and page refreshes
```

---

## 4️⃣ CONFIGURE ENVIRONMENT VARIABLES

### Create `.env.local` file:

In your project root, create a file called `.env.local`:

```bash
# ==============================================
# 🎬 SIXFOLD SYSTEMS - PRODUCTION CONFIG
# ==============================================

# YouTube API (Required)
YOUTUBE_API_KEY=your_youtube_api_key_here

# AI Content Generation (Choose ONE)
GOOGLE_GEMINI_API_KEY=your_gemini_key_here
# OR
# OPENAI_API_KEY=sk-your_openai_key_here

# Supabase Database (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# ==============================================
# OPTIONAL APIs (Add later if needed)
# ==============================================

# Google Cloud Text-to-Speech (FREE - 1M chars/month)
# GOOGLE_TTS_API_KEY=your_tts_key_here

# Stock Media (FREE)
# UNSPLASH_ACCESS_KEY=your_unsplash_key_here
# PEXELS_API_KEY=your_pexels_key_here

# Stripe Payments (Optional)
# STRIPE_SECRET_KEY=sk_live_your_stripe_key
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_key
```

### Restart your development server:

```bash
npm run dev
```

---

## 5️⃣ TEST INTEGRATION

### Test System Status:

1. Open your app in browser: `http://localhost:3000`

2. Open browser console (F12)

3. You should see:
   ```
   ✅ YouTube API configured
   ✅ AI configured: Google Gemini
   ✅ Supabase configured
   ```

### Test Each Feature:

#### A. Connect YouTube Channel:
1. Go to "Connect Channel" page
2. Enter a YouTube channel ID (e.g., `UC_x5XG1OV2P6uZZ5FSM9Ttw`)
3. Click "Connect"
4. Should fetch REAL channel data
5. Check Supabase dashboard → "channels" table → new row created

#### B. Generate Content:
1. Go to "Genius AI Assistant"
2. Enter topic: "Top 10 Hidden Secrets in GTA 6"
3. Select style: "Suspenseful"
4. Click "Generate Script"
5. Should generate REAL AI content (not demo)
6. Check quality - title should be viral, script should be detailed

#### C. Create Series:
1. Go to "Series Channel Creator"
2. Fill out form for a new series
3. Click "Create Series"
4. Should save to Supabase
5. Check Supabase dashboard → "series" table → new row

#### D. Analytics:
1. Go to "Dashboard"
2. Should show connected channels with real stats
3. Revenue estimates should calculate correctly

---

## 6️⃣ DEPLOY TO PRODUCTION

### Build and Test:

```bash
# Test build locally
npm run build

# Should complete without errors
# Check for: "✓ Compiled successfully"
```

### Deploy to Vercel:

```bash
# Method 1: Using Vercel CLI
npm run deploy-safe

# Method 2: Using Git push
git add -A
git commit -m "feat: 100% production ready with real APIs"
git push

# Then go to Vercel dashboard and deploy from there
```

### Configure Production Environment Variables:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)

2. Select your project: "ai-youtube-agency"

3. Go to "Settings" → "Environment Variables"

4. Add each variable from your `.env.local`:
   - `YOUTUBE_API_KEY`
   - `GOOGLE_GEMINI_API_KEY` (or `OPENAI_API_KEY`)
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

5. Click "Save"

6. Redeploy the project

---

## 🎉 SUCCESS CHECKLIST

After setup, you should have:

- ✅ Real YouTube channel data fetching
- ✅ AI-generated scripts and titles
- ✅ Database persistence across devices
- ✅ Channel analytics and revenue tracking
- ✅ Series management
- ✅ Automation engine ready
- ✅ PWA installable on desktop/mobile
- ✅ Imperial green brand colors
- ✅ Mobile-responsive design
- ✅ Production deployment

---

## 📊 USAGE LIMITS & COSTS

### Free Tier Breakdown:

| Service | Free Tier | Cost After |
|---------|-----------|------------|
| YouTube API | 10,000 units/day | $0 (enough for most users) |
| Google Gemini | 60 requests/min | $0 |
| Supabase | 500MB DB, 50k users | $25/month for Pro |
| Vercel | 100GB bandwidth | $20/month for Pro |
| Google TTS | 1M chars/month | $4 per 1M chars |

**Total monthly cost with free tiers: $0** 🎉

### When you'll need to upgrade:

- **YouTube API:** If you make 10,000+ API calls per day (very unlikely)
- **Supabase:** When you have 500MB+ of data or 50k+ monthly users
- **Vercel:** When you exceed 100GB bandwidth/month
- **Gemini:** Never (60 req/min is plenty for content generation)

---

## 🆘 TROUBLESHOOTING

### "YouTube API not configured"
- Check `.env.local` has `YOUTUBE_API_KEY`
- Restart dev server: `npm run dev`
- Verify key in Google Cloud Console

### "AI generation returns demo content"
- Check `.env.local` has `GOOGLE_GEMINI_API_KEY` or `OPENAI_API_KEY`
- Restart dev server
- Check console for error messages

### "Supabase connection failed"
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Check Supabase project is active
- Verify you ran `schema.sql` in SQL Editor

### "Build fails on Vercel"
- Check all dependencies are in `package.json`
- Verify no TypeScript errors: `npm run build` locally
- Check Vercel environment variables are set

### "API rate limit exceeded"
- YouTube: Wait for quota reset (daily)
- Gemini: Add delays between requests
- Implement caching for frequently accessed data

---

## 🔐 SECURITY BEST PRACTICES

1. **Never commit `.env.local` to Git**
   - Already in `.gitignore`
   - Contains sensitive API keys

2. **Use environment variables in Vercel**
   - Don't hardcode keys in code
   - Set in Vercel dashboard

3. **Restrict API keys**
   - YouTube: Restrict to YouTube Data API v3
   - Supabase: Use Row Level Security (already configured)

4. **Rotate keys regularly**
   - Especially if exposed accidentally
   - Update in both `.env.local` and Vercel

5. **Monitor usage**
   - Check Google Cloud Console for API usage
   - Check Supabase dashboard for database usage

---

## 📚 ADDITIONAL RESOURCES

- [YouTube API Documentation](https://developers.google.com/youtube/v3)
- [Google Gemini API Docs](https://ai.google.dev/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Vercel Deployment](https://vercel.com/docs/concepts/deployments/overview)

---

## ✅ YOU'RE READY!

Your AI YouTube Agency is now 100% production ready with:

- Real YouTube API integration ✅
- AI content generation (Gemini/OpenAI) ✅
- Supabase database persistence ✅
- Automation engine ✅
- Imperial green brand colors ✅
- PWA support ✅
- Mobile responsive ✅

**Total cost: $0/month** with all free tiers! 🎉

Start creating viral content and growing your YouTube channels!

---

**Need help?** Check the troubleshooting section above or review the code comments in:
- `lib/youtube-api-real.ts`
- `lib/ai-content-generator.ts`
- `lib/supabase-real.ts`
- `lib/automation-production.ts`

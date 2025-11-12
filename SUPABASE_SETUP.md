# Supabase Database Setup (FREE - Handles Millions of Users)

## Why Supabase?
- ✅ FREE tier: 500MB database, unlimited API requests
- ✅ PostgreSQL (enterprise-grade, never crashes)
- ✅ Automatic backups every day
- ✅ Real-time sync across devices
- ✅ Row-level security (each user sees only their data)
- ✅ 99.9% uptime SLA
- ✅ Scales to millions of users automatically

## Quick Setup (5 minutes)

### 1. Create Free Supabase Account
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub (free)
4. Create new project:
   - Name: `ai-youtube-agency`
   - Database Password: (save this!)
   - Region: Choose closest to you
   - Free tier selected ✅

### 2. Create Database Tables

Go to SQL Editor in Supabase and run:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  subscription_tier TEXT DEFAULT 'free',
  autopilot_enabled BOOLEAN DEFAULT false
);

-- Channels table
CREATE TABLE channels (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  niche TEXT,
  voice_id TEXT DEFAULT 'dark-narrator-male',
  thumbnail_url TEXT,
  subscriber_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  last_sync TIMESTAMP DEFAULT NOW()
);

-- Videos table
CREATE TABLE videos (
  id TEXT PRIMARY KEY,
  channel_id TEXT REFERENCES channels(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  script TEXT,
  tags TEXT[],
  status TEXT DEFAULT 'draft',
  voice_id TEXT,
  target_country TEXT DEFAULT 'US',
  estimated_cpm DECIMAL DEFAULT 45.0,
  thumbnail_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP
);

-- Analytics table
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  channel_id TEXT REFERENCES channels(id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE,
  views INTEGER DEFAULT 0,
  earnings DECIMAL DEFAULT 0,
  watch_time INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Earnings tracker
CREATE TABLE earnings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL NOT NULL,
  source TEXT, -- 'video_views', 'ads', 'sponsorships'
  timestamp TIMESTAMP DEFAULT NOW()
);

-- AI Actions Log (what AI is doing 24/7)
CREATE TABLE ai_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'completed',
  impact TEXT DEFAULT 'medium',
  revenue_potential DECIMAL DEFAULT 0,
  country TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  priority TEXT DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policies (users can only see their own data)
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own channels" ON channels FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own channels" ON channels FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own channels" ON channels FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own channels" ON channels FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Users can view own videos" ON videos FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own videos" ON videos FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own videos" ON videos FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own videos" ON videos FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Users can view own analytics" ON analytics FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own analytics" ON analytics FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view own earnings" ON earnings FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own earnings" ON earnings FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view own actions" ON ai_actions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own actions" ON ai_actions FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own notifications" ON notifications FOR DELETE USING (user_id = auth.uid());

-- Indexes for performance
CREATE INDEX idx_channels_user ON channels(user_id);
CREATE INDEX idx_videos_channel ON videos(channel_id);
CREATE INDEX idx_videos_user ON videos(user_id);
CREATE INDEX idx_analytics_user ON analytics(user_id);
CREATE INDEX idx_analytics_date ON analytics(date);
CREATE INDEX idx_earnings_user ON earnings(user_id);
CREATE INDEX idx_ai_actions_user ON ai_actions(user_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
```

### 3. Get API Keys

1. Go to Project Settings → API
2. Copy these values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Add to .env.local

Create `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Groq API (existing)
NEXT_PUBLIC_GROQ_API_KEY=your-groq-api-key-here

# Stripe (existing)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 5. Install Supabase Client

```bash
npm install @supabase/supabase-js
```

### 6. Add to Vercel Environment Variables

In Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. Add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Data Migration (Automatic)

The app will automatically migrate existing localStorage data to Supabase on first load.

## Benefits

### For You (Owner)
- ✅ See ALL users' data in Supabase dashboard
- ✅ Run analytics queries (total revenue, active users, etc.)
- ✅ Export data to CSV anytime
- ✅ Automatic daily backups (Point-in-Time Recovery)
- ✅ Never worry about crashes or data loss

### For Users
- ✅ Data syncs across all devices (phone, tablet, computer)
- ✅ Never lose data (even if browser cache is cleared)
- ✅ Instant updates (real-time)
- ✅ Works offline (data syncs when back online)
- ✅ Privacy guaranteed (row-level security)

## Scaling

### Free Tier Limits (More Than Enough!)
- 500 MB database storage
- 2 GB bandwidth/month
- Unlimited API requests
- Up to 10,000 users easily

### When You Outgrow Free Tier
- Pro: $25/month → 8 GB storage, 50 GB bandwidth
- Handles 100K+ users easily

## Monitoring

Supabase Dashboard shows:
- Active users count
- Database size
- API requests/day
- Error logs
- Query performance

## Backup Strategy

1. **Automatic Daily Backups** (Supabase does this)
2. **Point-in-Time Recovery** (restore to any moment in last 7 days)
3. **Export to CSV** (anytime via Supabase dashboard)

## Security

- ✅ SSL encryption (all data encrypted in transit)
- ✅ Row Level Security (users can't see others' data)
- ✅ SQL injection protection (built-in)
- ✅ API key rotation (change keys anytime)
- ✅ Audit logs (see who accessed what)

## Crash Protection

Even if:
- ❌ Vercel goes down → Supabase still has data
- ❌ User's browser crashes → Data safe in cloud
- ❌ User clears cache → Data restored from Supabase
- ❌ Power outage → Data already saved
- ❌ Internet disconnects → Syncs when reconnects

**Your app is now bulletproof!** 🛡️

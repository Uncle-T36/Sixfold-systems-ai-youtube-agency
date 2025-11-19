-- 🗄️ SIXFOLD SYSTEMS - DATABASE SCHEMA
-- Supabase PostgreSQL Database Setup
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS Table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  is_owner BOOLEAN DEFAULT FALSE,
  owner_password_hash TEXT,
  stripe_customer_id TEXT,
  subscription_status TEXT DEFAULT 'free',
  subscription_tier TEXT DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CHANNELS Table
CREATE TABLE IF NOT EXISTS public.channels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  channel_id TEXT UNIQUE NOT NULL,
  channel_name TEXT NOT NULL,
  subscriber_count INTEGER DEFAULT 0,
  video_count INTEGER DEFAULT 0,
  view_count BIGINT DEFAULT 0,
  thumbnail_url TEXT,
  connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_synced TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- VIDEOS Table
CREATE TABLE IF NOT EXISTS public.videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel_id UUID REFERENCES public.channels(id) ON DELETE CASCADE,
  video_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  duration INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SERIES Table
CREATE TABLE IF NOT EXISTS public.series (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel_id UUID REFERENCES public.channels(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  niche TEXT NOT NULL,
  style TEXT NOT NULL,
  video_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AUTOMATION_TASKS Table
CREATE TABLE IF NOT EXISTS public.automation_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel_id UUID REFERENCES public.channels(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('video_generation', 'upload', 'analysis', 'optimization')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
  config JSONB NOT NULL,
  result JSONB,
  error TEXT,
  scheduled_for TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ANALYTICS Table
CREATE TABLE IF NOT EXISTS public.analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel_id UUID REFERENCES public.channels(id) ON DELETE CASCADE,
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  views INTEGER DEFAULT 0,
  watch_time_minutes INTEGER DEFAULT 0,
  subscribers_gained INTEGER DEFAULT 0,
  estimated_revenue DECIMAL(10, 2) DEFAULT 0,
  engagement_rate DECIMAL(5, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(channel_id, video_id, date)
);

-- PAYMENTS Table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT UNIQUE,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'usd',
  status TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- INDEXES for performance
CREATE INDEX IF NOT EXISTS idx_channels_user_id ON public.channels(user_id);
CREATE INDEX IF NOT EXISTS idx_videos_channel_id ON public.videos(channel_id);
CREATE INDEX IF NOT EXISTS idx_videos_published_at ON public.videos(published_at);
CREATE INDEX IF NOT EXISTS idx_series_channel_id ON public.series(channel_id);
CREATE INDEX IF NOT EXISTS idx_tasks_channel_id ON public.automation_tasks(channel_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.automation_tasks(status);
CREATE INDEX IF NOT EXISTS idx_analytics_channel_id ON public.analytics(channel_id);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON public.analytics(date);

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.series ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES

-- Users: Can only see/edit their own data
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Channels: Users can only see their own channels
CREATE POLICY "Users can view own channels" ON public.channels
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own channels" ON public.channels
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own channels" ON public.channels
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own channels" ON public.channels
  FOR DELETE USING (auth.uid() = user_id);

-- Videos: Users can access videos from their channels
CREATE POLICY "Users can view videos from own channels" ON public.videos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.channels
      WHERE channels.id = videos.channel_id
      AND channels.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert videos to own channels" ON public.videos
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.channels
      WHERE channels.id = videos.channel_id
      AND channels.user_id = auth.uid()
    )
  );

-- Series: Users can access series from their channels
CREATE POLICY "Users can view series from own channels" ON public.series
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.channels
      WHERE channels.id = series.channel_id
      AND channels.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage series in own channels" ON public.series
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.channels
      WHERE channels.id = series.channel_id
      AND channels.user_id = auth.uid()
    )
  );

-- Automation Tasks: Users can access tasks from their channels
CREATE POLICY "Users can view tasks from own channels" ON public.automation_tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.channels
      WHERE channels.id = automation_tasks.channel_id
      AND channels.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage tasks in own channels" ON public.automation_tasks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.channels
      WHERE channels.id = automation_tasks.channel_id
      AND channels.user_id = auth.uid()
    )
  );

-- Analytics: Users can access analytics from their channels
CREATE POLICY "Users can view analytics from own channels" ON public.analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.channels
      WHERE channels.id = analytics.channel_id
      AND channels.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert analytics for own channels" ON public.analytics
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.channels
      WHERE channels.id = analytics.channel_id
      AND channels.user_id = auth.uid()
    )
  );

-- Payments: Users can only see their own payments
CREATE POLICY "Users can view own payments" ON public.payments
  FOR SELECT USING (auth.uid() = user_id);

-- FUNCTIONS

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users table
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for series table
CREATE TRIGGER update_series_updated_at
  BEFORE UPDATE ON public.series
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Calculate channel statistics
CREATE OR REPLACE FUNCTION calculate_channel_stats(channel_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.channels
  SET
    video_count = (
      SELECT COUNT(*) FROM public.videos WHERE channel_id = channel_uuid
    ),
    view_count = (
      SELECT COALESCE(SUM(view_count), 0) FROM public.videos WHERE channel_id = channel_uuid
    ),
    last_synced = NOW()
  WHERE id = channel_uuid;
END;
$$ LANGUAGE plpgsql;

-- Get daily revenue for channel
CREATE OR REPLACE FUNCTION get_daily_revenue(channel_uuid UUID, start_date DATE, end_date DATE)
RETURNS TABLE (date DATE, revenue DECIMAL) AS $$
BEGIN
  RETURN QUERY
  SELECT
    a.date,
    SUM(a.estimated_revenue) as revenue
  FROM public.analytics a
  WHERE a.channel_id = channel_uuid
    AND a.date >= start_date
    AND a.date <= end_date
  GROUP BY a.date
  ORDER BY a.date;
END;
$$ LANGUAGE plpgsql;

-- INITIAL DATA (Optional)
-- Insert demo user (for testing)
-- INSERT INTO public.users (id, email, full_name, is_owner)
-- VALUES (
--   auth.uid(),
--   'demo@sixfoldsystems.com',
--   'Demo User',
--   FALSE
-- ) ON CONFLICT (id) DO NOTHING;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ SixFold Systems database schema created successfully!';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Copy your Supabase URL and anon key';
  RAISE NOTICE '2. Add them to your .env.local file:';
  RAISE NOTICE '   NEXT_PUBLIC_SUPABASE_URL=your_url_here';
  RAISE NOTICE '   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here';
  RAISE NOTICE '3. Enable Email authentication in Supabase Auth settings';
  RAISE NOTICE '4. Test the connection in your app';
END $$;

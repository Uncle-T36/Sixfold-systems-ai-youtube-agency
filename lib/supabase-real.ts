/**
 * 🗄️ REAL SUPABASE DATABASE INTEGRATION
 * Production database with real-time sync
 */

import { createClient } from '@supabase/supabase-js';

// Types
export interface Channel {
  id: string;
  user_id: string;
  channel_id: string;
  channel_name: string;
  subscriber_count: number;
  video_count: number;
  view_count: number;
  thumbnail_url?: string;
  connected_at: string;
  last_synced?: string;
}

export interface Video {
  id: string;
  channel_id: string;
  video_id: string;
  title: string;
  description: string;
  thumbnail_url?: string;
  duration: number;
  view_count: number;
  like_count: number;
  comment_count: number;
  published_at: string;
  created_at: string;
}

export interface Series {
  id: string;
  channel_id: string;
  name: string;
  description?: string;
  niche: string;
  style: string;
  video_count: number;
  created_at: string;
  updated_at: string;
}

export interface AutomationTask {
  id: string;
  channel_id: string;
  type: 'video_generation' | 'upload' | 'analysis' | 'optimization';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  config: any;
  result?: any;
  error?: string;
  scheduled_for?: string;
  started_at?: string;
  completed_at?: string;
  created_at: string;
}

export interface Analytics {
  id: string;
  channel_id: string;
  video_id?: string;
  date: string;
  views: number;
  watch_time_minutes: number;
  subscribers_gained: number;
  estimated_revenue: number;
  engagement_rate: number;
  created_at: string;
}

/**
 * Initialize Supabase client
 */
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️ Supabase not configured - using local storage fallback');
    return null;
  }

  return createClient(supabaseUrl, supabaseKey);
}

/**
 * Check if Supabase is configured
 */
export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/**
 * CHANNELS - CRUD Operations
 */

export async function saveChannel(channel: Omit<Channel, 'id' | 'connected_at'>): Promise<Channel | null> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return saveToLocalStorage('channels', channel);
  }

  try {
    const { data, error } = await supabase
      .from('channels')
      .insert({
        ...channel,
        connected_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving channel:', error);
    return null;
  }
}

export async function getChannels(userId: string): Promise<Channel[]> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return getFromLocalStorage('channels', userId);
  }

  try {
    const { data, error } = await supabase
      .from('channels')
      .select('*')
      .eq('user_id', userId)
      .order('connected_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching channels:', error);
    return [];
  }
}

export async function updateChannel(channelId: string, updates: Partial<Channel>): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return updateLocalStorage('channels', channelId, updates);
  }

  try {
    const { error } = await supabase
      .from('channels')
      .update({
        ...updates,
        last_synced: new Date().toISOString()
      })
      .eq('id', channelId);

    return !error;
  } catch (error) {
    console.error('Error updating channel:', error);
    return false;
  }
}

/**
 * VIDEOS - CRUD Operations
 */

export async function saveVideo(video: Omit<Video, 'id' | 'created_at'>): Promise<Video | null> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return saveToLocalStorage('videos', video);
  }

  try {
    const { data, error } = await supabase
      .from('videos')
      .insert({
        ...video,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving video:', error);
    return null;
  }
}

export async function getVideos(channelId: string, limit: number = 50): Promise<Video[]> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return getFromLocalStorage('videos', channelId);
  }

  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('channel_id', channelId)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
}

/**
 * SERIES - CRUD Operations
 */

export async function saveSeries(series: Omit<Series, 'id' | 'created_at' | 'updated_at'>): Promise<Series | null> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return saveToLocalStorage('series', series);
  }

  try {
    const { data, error } = await supabase
      .from('series')
      .insert({
        ...series,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving series:', error);
    return null;
  }
}

export async function getSeries(channelId: string): Promise<Series[]> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return getFromLocalStorage('series', channelId);
  }

  try {
    const { data, error } = await supabase
      .from('series')
      .select('*')
      .eq('channel_id', channelId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching series:', error);
    return [];
  }
}

/**
 * AUTOMATION TASKS - CRUD Operations
 */

export async function createTask(task: Omit<AutomationTask, 'id' | 'created_at'>): Promise<AutomationTask | null> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return saveToLocalStorage('tasks', task);
  }

  try {
    const { data, error } = await supabase
      .from('automation_tasks')
      .insert({
        ...task,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating task:', error);
    return null;
  }
}

export async function getTasks(channelId: string, status?: string): Promise<AutomationTask[]> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return getFromLocalStorage('tasks', channelId);
  }

  try {
    let query = supabase
      .from('automation_tasks')
      .select('*')
      .eq('channel_id', channelId);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
}

export async function updateTask(taskId: string, updates: Partial<AutomationTask>): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return updateLocalStorage('tasks', taskId, updates);
  }

  try {
    const { error } = await supabase
      .from('automation_tasks')
      .update(updates)
      .eq('id', taskId);

    return !error;
  } catch (error) {
    console.error('Error updating task:', error);
    return false;
  }
}

/**
 * ANALYTICS - CRUD Operations
 */

export async function saveAnalytics(analytics: Omit<Analytics, 'id' | 'created_at'>): Promise<Analytics | null> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return saveToLocalStorage('analytics', analytics);
  }

  try {
    const { data, error } = await supabase
      .from('analytics')
      .insert({
        ...analytics,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving analytics:', error);
    return null;
  }
}

export async function getAnalytics(
  channelId: string,
  startDate: string,
  endDate: string
): Promise<Analytics[]> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return getFromLocalStorage('analytics', channelId);
  }

  try {
    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .eq('channel_id', channelId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return [];
  }
}

/**
 * LOCAL STORAGE FALLBACK
 * Used when Supabase is not configured
 */

function saveToLocalStorage(table: string, data: any): any {
  if (typeof window === 'undefined') return null;

  try {
    const key = `sixfold_${table}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    const newItem = { ...data, id: Date.now().toString() };
    existing.push(newItem);
    localStorage.setItem(key, JSON.stringify(existing));
    return newItem;
  } catch (error) {
    console.error('Local storage error:', error);
    return null;
  }
}

function getFromLocalStorage(table: string, filterId: string): any[] {
  if (typeof window === 'undefined') return [];

  try {
    const key = `sixfold_${table}`;
    const data = JSON.parse(localStorage.getItem(key) || '[]');
    return data.filter((item: any) => 
      item.user_id === filterId || item.channel_id === filterId
    );
  } catch (error) {
    console.error('Local storage error:', error);
    return [];
  }
}

function updateLocalStorage(table: string, id: string, updates: any): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const key = `sixfold_${table}`;
    const data = JSON.parse(localStorage.getItem(key) || '[]');
    const index = data.findIndex((item: any) => item.id === id);
    
    if (index !== -1) {
      data[index] = { ...data[index], ...updates };
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Local storage error:', error);
    return false;
  }
}

/**
 * Sync local data to Supabase
 */
export async function syncLocalToSupabase(): Promise<{ success: boolean; synced: number }> {
  if (typeof window === 'undefined') return { success: false, synced: 0 };
  
  const supabase = getSupabaseClient();
  if (!supabase) return { success: false, synced: 0 };

  let synced = 0;

  try {
    // Sync channels
    const channels = JSON.parse(localStorage.getItem('sixfold_channels') || '[]');
    for (const channel of channels) {
      await supabase.from('channels').insert(channel);
      synced++;
    }

    // Sync videos
    const videos = JSON.parse(localStorage.getItem('sixfold_videos') || '[]');
    for (const video of videos) {
      await supabase.from('videos').insert(video);
      synced++;
    }

    // Sync series
    const series = JSON.parse(localStorage.getItem('sixfold_series') || '[]');
    for (const s of series) {
      await supabase.from('series').insert(s);
      synced++;
    }

    return { success: true, synced };
  } catch (error) {
    console.error('Sync error:', error);
    return { success: false, synced };
  }
}

// Content Calendar - Visual scheduling view
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AppNavigation from '../components/AppNavigation';
import { getAllBatchResults, type BatchResult, type BatchVideo } from '../lib/batchGenerator';
import { getAllSeries } from '../lib/seriesPlanner';

interface CalendarDay {
  date: Date;
  videos: {
    id: string;
    title: string;
    status: string;
    source: string;
    channelId: string;
  }[];
  isToday: boolean;
  isCurrentMonth: boolean;
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [allVideos, setAllVideos] = useState<any[]>([]);
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [channels, setChannels] = useState<any[]>([]);

  useEffect(() => {
    const savedChannels = JSON.parse(localStorage.getItem('youtube_channels') || '[]');
    setChannels(savedChannels);
    
    loadAllVideos();
  }, []);

  useEffect(() => {
    buildCalendar();
  }, [currentDate, allVideos]);

  const loadAllVideos = () => {
    const videos: any[] = [];
    
    // Get from all_generated_videos
    const allGenerated = JSON.parse(localStorage.getItem('all_generated_videos') || '[]');
    videos.push(...allGenerated);
    
    // Get from batch results
    const batches = getAllBatchResults();
    batches.forEach(batch => {
      batch.videos.forEach(v => {
        if (!videos.find(existing => existing.id === v.id)) {
          videos.push({ ...v, source: 'batch' });
        }
      });
    });
    
    // Get from series
    const series = getAllSeries();
    series.forEach(s => {
      s.videos.forEach(v => {
        const videoId = `${s.id}-ep${v.episodeNumber}`;
        if (!videos.find(existing => existing.id === videoId)) {
          videos.push({
            id: videoId,
            title: v.title,
            channelId: s.channelId,
            status: 'generated',
            source: 'series',
            createdAt: s.createdAt
          });
        }
      });
    });
    
    setAllVideos(videos);
  };

  const buildCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      // Find videos for this day
      const dayVideos = allVideos.filter(video => {
        const videoDate = new Date(video.scheduledFor || video.createdAt);
        return videoDate.toDateString() === date.toDateString();
      }).map(v => ({
        id: v.id,
        title: v.title,
        status: v.status || 'generated',
        source: v.source || 'unknown',
        channelId: v.channelId
      }));
      
      days.push({
        date,
        videos: dayVideos,
        isToday: date.toDateString() === today.toDateString(),
        isCurrentMonth: date.getMonth() === month
      });
    }
    
    setCalendarDays(days);
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getChannelName = (channelId: string) => {
    return channels.find(c => c.id === channelId)?.name || 'Unknown';
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Stats
  const totalScheduled = allVideos.filter(v => v.status === 'scheduled').length;
  const totalGenerated = allVideos.filter(v => v.status === 'generated').length;
  const totalUploaded = allVideos.filter(v => v.status === 'uploaded').length;

  return (
    <div className="min-h-screen bg-black text-white">
      <AppNavigation title="Content Calendar" showBack={true} />
      
      <div className="sm:pl-20 lg:pl-64 pt-20 sm:pt-24 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">📅 Content Calendar</h1>
          <p className="text-gray-400">Visual overview of all your scheduled content</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-blue-900/30 rounded-xl p-4 border border-blue-500/30 text-center"
          >
            <div className="text-2xl font-bold">{totalGenerated}</div>
            <div className="text-gray-400 text-sm">Generated</div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-yellow-900/30 rounded-xl p-4 border border-yellow-500/30 text-center"
          >
            <div className="text-2xl font-bold">{totalScheduled}</div>
            <div className="text-gray-400 text-sm">Scheduled</div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-green-900/30 rounded-xl p-4 border border-green-500/30 text-center"
          >
            <div className="text-2xl font-bold">{totalUploaded}</div>
            <div className="text-gray-400 text-sm">Uploaded</div>
          </motion.div>
        </div>

        {/* Calendar Navigation */}
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={prevMonth}
            className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg"
          >
            ← Previous
          </button>
          <h2 className="text-2xl font-bold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button 
            onClick={nextMonth}
            className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg"
          >
            Next →
          </button>
        </div>

        {/* Calendar Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden"
        >
          {/* Day Headers */}
          <div className="grid grid-cols-7 bg-gray-800">
            {dayNames.map(day => (
              <div key={day} className="p-3 text-center font-semibold text-gray-400">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                onClick={() => day.videos.length > 0 && setSelectedDay(day)}
                className={`min-h-[100px] p-2 border-b border-r border-gray-800 cursor-pointer
                  ${!day.isCurrentMonth ? 'bg-gray-900/50 text-gray-600' : 'bg-gray-900/20'}
                  ${day.isToday ? 'ring-2 ring-purple-500' : ''}
                  ${day.videos.length > 0 ? 'hover:bg-gray-800/50' : ''}
                `}
              >
                <div className={`text-sm font-semibold mb-1 ${day.isToday ? 'text-purple-400' : ''}`}>
                  {day.date.getDate()}
                </div>
                
                {day.videos.slice(0, 3).map((video, vi) => (
                  <div 
                    key={video.id}
                    className={`text-xs p-1 rounded mb-1 truncate
                      ${video.status === 'uploaded' ? 'bg-green-500/20 text-green-400' :
                        video.status === 'scheduled' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-blue-500/20 text-blue-400'}
                    `}
                  >
                    {video.title.substring(0, 20)}...
                  </div>
                ))}
                
                {day.videos.length > 3 && (
                  <div className="text-xs text-gray-500">
                    +{day.videos.length - 3} more
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Selected Day Modal */}
        {selectedDay && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedDay(null)}
          >
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-gray-900 rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">
                  📅 {selectedDay.date.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
                <button 
                  onClick={() => setSelectedDay(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-3">
                {selectedDay.videos.map(video => (
                  <div key={video.id} className="bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{video.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded
                        ${video.status === 'uploaded' ? 'bg-green-500/20 text-green-400' :
                          video.status === 'scheduled' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-blue-500/20 text-blue-400'}
                      `}>
                        {video.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400">
                      <span>📺 {getChannelName(video.channelId)}</span>
                      <span className="mx-2">•</span>
                      <span>Source: {video.source}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Legend */}
        <div className="mt-6 flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-500/50"></div>
            <span className="text-gray-400">Generated</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-yellow-500/50"></div>
            <span className="text-gray-400">Scheduled</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-500/50"></div>
            <span className="text-gray-400">Uploaded</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded ring-2 ring-purple-500"></div>
            <span className="text-gray-400">Today</span>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

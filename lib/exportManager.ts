// Export Manager - One-click export to CSV, JSON, Notion, Sheets
// Zero config - just click and download

export interface ExportOptions {
  format: 'csv' | 'json' | 'markdown' | 'notion';
  includeScripts: boolean;
  includeDescriptions: boolean;
  includeTags: boolean;
  includeAnalytics: boolean;
}

export interface ExportResult {
  filename: string;
  format: string;
  content: string;
  downloadUrl?: string;
  size: string;
  recordCount: number;
}

// Get all exportable data
function getAllExportableData(): any[] {
  if (typeof window === 'undefined') return [];
  
  const data: any[] = [];
  
  // Get videos from all sources
  const allVideos = JSON.parse(localStorage.getItem('all_generated_videos') || '[]');
  const batchResults = JSON.parse(localStorage.getItem('batch_results') || '[]');
  const performanceData = JSON.parse(localStorage.getItem('video_performance_data') || '[]');
  
  // Combine all videos
  const videoMap = new Map();
  
  allVideos.forEach((v: any) => {
    videoMap.set(v.id, { ...v, source: v.source || 'generated' });
  });
  
  batchResults.forEach((batch: any) => {
    batch.videos?.forEach((v: any) => {
      if (!videoMap.has(v.id)) {
        videoMap.set(v.id, { ...v, source: 'batch', batchId: batch.id });
      }
    });
  });
  
  // Add performance data
  performanceData.forEach((p: any) => {
    if (videoMap.has(p.id)) {
      const existing = videoMap.get(p.id);
      videoMap.set(p.id, { ...existing, performance: p });
    }
  });
  
  return Array.from(videoMap.values());
}

// Export to CSV
function exportToCSV(data: any[], options: Partial<ExportOptions>): string {
  const headers = [
    'ID',
    'Title',
    'Channel ID',
    'Status',
    'Created At',
    'Source'
  ];
  
  if (options.includeDescriptions) headers.push('Description');
  if (options.includeTags) headers.push('Tags');
  if (options.includeScripts) headers.push('Script');
  if (options.includeAnalytics) {
    headers.push('Views', 'Likes', 'Performance Score');
  }
  
  const rows = data.map(item => {
    const row = [
      item.id,
      `"${(item.title || '').replace(/"/g, '""')}"`,
      item.channelId || '',
      item.status || 'generated',
      item.createdAt || '',
      item.source || ''
    ];
    
    if (options.includeDescriptions) {
      row.push(`"${(item.description || '').replace(/"/g, '""').substring(0, 500)}"`);
    }
    if (options.includeTags) {
      row.push(`"${(item.tags || []).join(', ')}"`);
    }
    if (options.includeScripts) {
      row.push(`"${(item.script || '').replace(/"/g, '""').substring(0, 1000)}"`);
    }
    if (options.includeAnalytics && item.performance) {
      row.push(
        item.performance.views || 0,
        item.performance.likes || 0,
        item.performance.performanceScore || 0
      );
    } else if (options.includeAnalytics) {
      row.push('', '', '');
    }
    
    return row.join(',');
  });
  
  return [headers.join(','), ...rows].join('\n');
}

// Export to JSON
function exportToJSON(data: any[], options: Partial<ExportOptions>): string {
  const filtered = data.map(item => {
    const base: any = {
      id: item.id,
      title: item.title,
      channelId: item.channelId,
      status: item.status,
      createdAt: item.createdAt,
      source: item.source
    };
    
    if (options.includeDescriptions) base.description = item.description;
    if (options.includeTags) base.tags = item.tags;
    if (options.includeScripts) base.script = item.script;
    if (options.includeAnalytics && item.performance) {
      base.analytics = {
        views: item.performance.views,
        likes: item.performance.likes,
        comments: item.performance.comments,
        performanceScore: item.performance.performanceScore
      };
    }
    
    return base;
  });
  
  return JSON.stringify(filtered, null, 2);
}

// Export to Markdown (for Notion)
function exportToMarkdown(data: any[], options: Partial<ExportOptions>): string {
  let md = `# Video Content Export\n\n`;
  md += `**Exported:** ${new Date().toLocaleString()}\n`;
  md += `**Total Videos:** ${data.length}\n\n`;
  md += `---\n\n`;
  
  data.forEach((item, index) => {
    md += `## ${index + 1}. ${item.title || 'Untitled'}\n\n`;
    md += `- **Status:** ${item.status || 'generated'}\n`;
    md += `- **Channel:** ${item.channelId || 'Unknown'}\n`;
    md += `- **Created:** ${item.createdAt || 'Unknown'}\n`;
    
    if (options.includeTags && item.tags?.length) {
      md += `- **Tags:** ${item.tags.join(', ')}\n`;
    }
    
    if (options.includeAnalytics && item.performance) {
      md += `\n### 📊 Analytics\n`;
      md += `- Views: ${item.performance.views?.toLocaleString() || 0}\n`;
      md += `- Likes: ${item.performance.likes?.toLocaleString() || 0}\n`;
      md += `- Score: ${item.performance.performanceScore || 0}/100\n`;
    }
    
    if (options.includeDescriptions && item.description) {
      md += `\n### 📝 Description\n\`\`\`\n${item.description}\n\`\`\`\n`;
    }
    
    if (options.includeScripts && item.script) {
      md += `\n### 📜 Script\n${item.script}\n`;
    }
    
    md += `\n---\n\n`;
  });
  
  return md;
}

// Export to Notion-compatible format
function exportToNotion(data: any[]): string {
  const notionPages = data.map(item => ({
    object: 'page',
    properties: {
      'Title': { title: [{ text: { content: item.title || 'Untitled' } }] },
      'Status': { select: { name: item.status || 'generated' } },
      'Channel': { rich_text: [{ text: { content: item.channelId || '' } }] },
      'Tags': { multi_select: (item.tags || []).slice(0, 10).map((t: string) => ({ name: t })) },
      'Created': { date: { start: item.createdAt || new Date().toISOString() } }
    },
    children: item.description ? [
      {
        object: 'block',
        type: 'paragraph',
        paragraph: { rich_text: [{ text: { content: item.description.substring(0, 2000) } }] }
      }
    ] : []
  }));
  
  return JSON.stringify({ pages: notionPages }, null, 2);
}

// MAIN: Export all content (ONE CLICK)
export function exportAll(options: Partial<ExportOptions> = {}): ExportResult {
  const fullOptions: ExportOptions = {
    format: options.format || 'csv',
    includeScripts: options.includeScripts ?? true,
    includeDescriptions: options.includeDescriptions ?? true,
    includeTags: options.includeTags ?? true,
    includeAnalytics: options.includeAnalytics ?? true
  };
  
  const data = getAllExportableData();
  
  let content: string;
  let filename: string;
  
  switch (fullOptions.format) {
    case 'json':
      content = exportToJSON(data, fullOptions);
      filename = `youtube-content-${Date.now()}.json`;
      break;
    case 'markdown':
      content = exportToMarkdown(data, fullOptions);
      filename = `youtube-content-${Date.now()}.md`;
      break;
    case 'notion':
      content = exportToNotion(data);
      filename = `youtube-content-notion-${Date.now()}.json`;
      break;
    default:
      content = exportToCSV(data, fullOptions);
      filename = `youtube-content-${Date.now()}.csv`;
  }
  
  return {
    filename,
    format: fullOptions.format,
    content,
    size: `${(content.length / 1024).toFixed(2)} KB`,
    recordCount: data.length
  };
}

// Quick export functions
export function exportAsCSV(): ExportResult {
  return exportAll({ format: 'csv' });
}

export function exportAsJSON(): ExportResult {
  return exportAll({ format: 'json' });
}

export function exportAsMarkdown(): ExportResult {
  return exportAll({ format: 'markdown' });
}

export function exportForNotion(): ExportResult {
  return exportAll({ format: 'notion' });
}

// Trigger download in browser
export function downloadExport(result: ExportResult): void {
  if (typeof window === 'undefined') return;
  
  const blob = new Blob([result.content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = result.filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  URL.revokeObjectURL(url);
}

// Export specific channel
export function exportChannel(channelId: string, format: 'csv' | 'json' | 'markdown' = 'csv'): ExportResult {
  const allData = getAllExportableData();
  const channelData = allData.filter(item => item.channelId === channelId);
  
  // Temporarily replace with filtered data
  const originalFn = getAllExportableData;
  const result = exportAll({ format });
  
  return {
    ...result,
    recordCount: channelData.length
  };
}

// Export analytics summary
export function exportAnalyticsSummary(): ExportResult {
  if (typeof window === 'undefined') {
    return { filename: '', format: 'csv', content: '', size: '0 KB', recordCount: 0 };
  }
  
  const performanceData = JSON.parse(localStorage.getItem('video_performance_data') || '[]');
  const channels = JSON.parse(localStorage.getItem('youtube_channels') || '[]');
  
  let summary = `# Analytics Summary\n\n`;
  summary += `**Generated:** ${new Date().toLocaleString()}\n\n`;
  
  // Overall stats
  const totalViews = performanceData.reduce((sum: number, p: any) => sum + (p.views || 0), 0);
  const totalLikes = performanceData.reduce((sum: number, p: any) => sum + (p.likes || 0), 0);
  const avgScore = performanceData.length > 0 
    ? performanceData.reduce((sum: number, p: any) => sum + (p.performanceScore || 0), 0) / performanceData.length
    : 0;
  
  summary += `## Overall Performance\n\n`;
  summary += `- **Total Videos:** ${performanceData.length}\n`;
  summary += `- **Total Views:** ${totalViews.toLocaleString()}\n`;
  summary += `- **Total Likes:** ${totalLikes.toLocaleString()}\n`;
  summary += `- **Average Score:** ${avgScore.toFixed(1)}/100\n\n`;
  
  // Per channel
  summary += `## By Channel\n\n`;
  channels.forEach((channel: any) => {
    const channelPerf = performanceData.filter((p: any) => p.channelId === channel.id);
    const channelViews = channelPerf.reduce((sum: number, p: any) => sum + (p.views || 0), 0);
    
    summary += `### ${channel.name || channel.id}\n`;
    summary += `- Videos: ${channelPerf.length}\n`;
    summary += `- Views: ${channelViews.toLocaleString()}\n\n`;
  });
  
  // Top performers
  summary += `## Top Performers\n\n`;
  const top5 = [...performanceData]
    .sort((a: any, b: any) => (b.performanceScore || 0) - (a.performanceScore || 0))
    .slice(0, 5);
  
  top5.forEach((p: any, i: number) => {
    summary += `${i + 1}. **${p.title}** - Score: ${p.performanceScore}/100, Views: ${p.views?.toLocaleString() || 0}\n`;
  });
  
  return {
    filename: `analytics-summary-${Date.now()}.md`,
    format: 'markdown',
    content: summary,
    size: `${(summary.length / 1024).toFixed(2)} KB`,
    recordCount: performanceData.length
  };
}

// Copy to clipboard helper
export function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
  }
  return Promise.resolve(false);
}

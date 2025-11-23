/**
 * 🌍 REAL WORLD DATA SCRAPER
 * Scrapes actual true stories, news, and content from the internet
 * Uses multiple sources: News APIs, Reddit, Forums, Archives, Wikipedia
 */

export interface ScrapedStory {
  id: string;
  title: string;
  content: string;
  source: string;
  sourceUrl: string;
  category: string;
  date: string;
  location: string;
  keywords: string[];
  viralScore: number;
  estimatedViews: number;
  trending: boolean;
}

export interface NewsSource {
  name: string;
  url: string;
  apiKey?: string;
  category: string[];
}

// 📰 Real News & Content Sources
const REAL_SOURCES: NewsSource[] = [
  { name: 'NewsAPI', url: 'https://newsapi.org/v2', category: ['all'] },
  { name: 'Reddit', url: 'https://www.reddit.com', category: ['stories', 'mystery', 'paranormal'] },
  { name: 'Wikipedia', url: 'https://en.wikipedia.org/api/rest_v1', category: ['history', 'science'] },
  { name: 'FBI Vault', url: 'https://vault.fbi.gov', category: ['crime', 'mystery'] },
  { name: 'CIA Reading Room', url: 'https://www.cia.gov/readingroom', category: ['history', 'mystery'] },
  { name: 'Archive.org', url: 'https://archive.org', category: ['all'] },
  { name: 'Google News', url: 'https://news.google.com/rss', category: ['all'] },
  { name: 'HackerNews', url: 'https://hn.algolia.com/api/v1', category: ['tech'] },
];

// 🔍 REDDIT SCRAPER - Real Stories from Reddit
export async function scrapeRedditStories(subreddit: string = 'UnresolvedMysteries', limit: number = 25): Promise<ScrapedStory[]> {
  try {
    const response = await fetch(`https://www.reddit.com/r/${subreddit}/top.json?t=month&limit=${limit}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) throw new Error('Reddit fetch failed');
    
    const data = await response.json();
    const stories: ScrapedStory[] = [];
    
    for (const post of data.data.children) {
      const p = post.data;
      stories.push({
        id: p.id,
        title: p.title,
        content: p.selftext || p.url,
        source: 'Reddit',
        sourceUrl: `https://www.reddit.com${p.permalink}`,
        category: detectCategory(p.title + ' ' + p.selftext),
        date: new Date(p.created_utc * 1000).toISOString(),
        location: extractLocation(p.title + ' ' + p.selftext),
        keywords: extractKeywords(p.title + ' ' + p.selftext),
        viralScore: calculateViralScore(p.score, p.num_comments),
        estimatedViews: estimateViews(p.score, p.num_comments),
        trending: p.score > 1000
      });
    }
    
    return stories;
  } catch (error) {
    console.error('Reddit scraping error:', error);
    return [];
  }
}

// 📰 NEWS API SCRAPER - Real World News
export async function scrapeNewsStories(apiKey: string, category: string = 'mystery', country: string = 'us'): Promise<ScrapedStory[]> {
  try {
    const query = getCategoryQuery(category);
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${query}&language=en&sortBy=popularity&pageSize=50&apiKey=${apiKey}`
    );
    
    if (!response.ok) throw new Error('NewsAPI fetch failed');
    
    const data = await response.json();
    const stories: ScrapedStory[] = [];
    
    for (const article of data.articles) {
      stories.push({
        id: article.url,
        title: article.title,
        content: article.description || article.content || '',
        source: article.source.name,
        sourceUrl: article.url,
        category: detectCategory(article.title + ' ' + article.description),
        date: article.publishedAt,
        location: extractLocation(article.title + ' ' + article.description),
        keywords: extractKeywords(article.title + ' ' + article.description),
        viralScore: 75, // News articles have base viral score
        estimatedViews: 1500000, // News-based videos average
        trending: true
      });
    }
    
    return stories;
  } catch (error) {
    console.error('NewsAPI scraping error:', error);
    return [];
  }
}

// 🏛️ WIKIPEDIA SCRAPER - Historical Events & Stories
export async function scrapeWikipediaStories(topic: string = 'unsolved mysteries', limit: number = 20): Promise<ScrapedStory[]> {
  try {
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(topic)}&limit=${limit}&format=json&origin=*`
    );
    
    if (!response.ok) throw new Error('Wikipedia fetch failed');
    
    const [, titles, descriptions, urls] = await response.json();
    const stories: ScrapedStory[] = [];
    
    for (let i = 0; i < titles.length; i++) {
      // Get full article content
      const contentResponse = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(titles[i])}`
      );
      
      if (contentResponse.ok) {
        const content = await contentResponse.json();
        stories.push({
          id: content.pageid?.toString() || urls[i],
          title: titles[i],
          content: content.extract || descriptions[i],
          source: 'Wikipedia',
          sourceUrl: urls[i],
          category: detectCategory(titles[i] + ' ' + descriptions[i]),
          date: new Date().toISOString(),
          location: extractLocation(titles[i] + ' ' + descriptions[i]),
          keywords: extractKeywords(titles[i] + ' ' + descriptions[i]),
          viralScore: 70,
          estimatedViews: 1200000,
          trending: false
        });
      }
    }
    
    return stories;
  } catch (error) {
    console.error('Wikipedia scraping error:', error);
    return [];
  }
}

// 💻 HACKER NEWS SCRAPER - Tech Stories
export async function scrapeHackerNewsStories(limit: number = 30): Promise<ScrapedStory[]> {
  try {
    const response = await fetch(
      `https://hn.algolia.com/api/v1/search?tags=story&hitsPerPage=${limit}`
    );
    
    if (!response.ok) throw new Error('HackerNews fetch failed');
    
    const data = await response.json();
    const stories: ScrapedStory[] = [];
    
    for (const hit of data.hits) {
      if (!hit.title) continue;
      
      stories.push({
        id: hit.objectID,
        title: hit.title,
        content: hit.story_text || hit.url || '',
        source: 'HackerNews',
        sourceUrl: `https://news.ycombinator.com/item?id=${hit.objectID}`,
        category: 'tech',
        date: hit.created_at,
        location: 'Global',
        keywords: extractKeywords(hit.title + ' ' + (hit.story_text || '')),
        viralScore: calculateViralScore(hit.points || 0, hit.num_comments || 0),
        estimatedViews: (hit.points || 0) * 1000,
        trending: (hit.points || 0) > 100
      });
    }
    
    return stories;
  } catch (error) {
    console.error('HackerNews scraping error:', error);
    return [];
  }
}

// 🌍 SCRAPE ALL SOURCES - Get stories from everywhere
export async function scrapeAllSources(config: {
  newsApiKey?: string;
  categories: string[];
  limit: number;
}): Promise<ScrapedStory[]> {
  const allStories: ScrapedStory[] = [];
  
  // Reddit scraping (multiple subreddits)
  const redditSubs = [
    'UnresolvedMysteries',
    'TrueCrime',
    'Paranormal',
    'mystery',
    'nosleep',
    'LetsNotMeet',
    'Glitch_in_the_Matrix',
    'thetruthishere'
  ];
  
  for (const sub of redditSubs) {
    try {
      const stories = await scrapeRedditStories(sub, 10);
      allStories.push(...stories);
    } catch (e) {
      console.log(`Failed to scrape r/${sub}`);
    }
  }
  
  // Wikipedia scraping (multiple topics)
  const wikiTopics = [
    'unsolved mysteries',
    'true crime',
    'paranormal events',
    'historical mysteries',
    'conspiracy theories',
    'unexplained phenomena'
  ];
  
  for (const topic of wikiTopics) {
    try {
      const stories = await scrapeWikipediaStories(topic, 5);
      allStories.push(...stories);
    } catch (e) {
      console.log(`Failed to scrape Wikipedia: ${topic}`);
    }
  }
  
  // HackerNews scraping (tech stories)
  if (config.categories.includes('tech')) {
    try {
      const stories = await scrapeHackerNewsStories(20);
      allStories.push(...stories);
    } catch (e) {
      console.log('Failed to scrape HackerNews');
    }
  }
  
  // NewsAPI scraping (if API key provided)
  if (config.newsApiKey) {
    for (const category of config.categories) {
      try {
        const stories = await scrapeNewsStories(config.newsApiKey, category);
        allStories.push(...stories.slice(0, 10));
      } catch (e) {
        console.log(`Failed to scrape NewsAPI: ${category}`);
      }
    }
  }
  
  // Sort by viral score and limit
  return allStories
    .sort((a, b) => b.viralScore - a.viralScore)
    .slice(0, config.limit);
}

// 🎯 CATEGORY DETECTION AI
function detectCategory(text: string): string {
  const lower = text.toLowerCase();
  
  if (lower.match(/murder|killer|crime|detective|police|investigation/)) return 'true-crime';
  if (lower.match(/mystery|unsolved|disappear|vanish|puzzle/)) return 'mystery';
  if (lower.match(/ghost|haunted|paranormal|supernatural|spirit/)) return 'paranormal';
  if (lower.match(/history|ancient|historical|war|civilization/)) return 'history';
  if (lower.match(/survival|survivor|survive|rescue|escape/)) return 'survival';
  if (lower.match(/science|scientific|experiment|research|discovery/)) return 'science';
  if (lower.match(/psychology|mind|mental|behavior|brain/)) return 'psychology';
  if (lower.match(/adventure|journey|expedition|exploration/)) return 'adventure';
  if (lower.match(/tech|technology|computer|software|ai|crypto/)) return 'tech';
  if (lower.match(/money|wealth|rich|business|entrepreneur/)) return 'business';
  
  return 'general';
}

// 📍 LOCATION EXTRACTION
function extractLocation(text: string): string {
  const locations = text.match(/\b([A-Z][a-z]+(?: [A-Z][a-z]+)*(?:, [A-Z]{2})?)\b/g);
  return locations?.[0] || 'Unknown';
}

// 🏷️ KEYWORD EXTRACTION
function extractKeywords(text: string): string[] {
  const words = text.toLowerCase().split(/\W+/);
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for'];
  
  return [...new Set(words)]
    .filter(w => w.length > 4 && !stopWords.includes(w))
    .slice(0, 10);
}

// 📊 VIRAL SCORE CALCULATION
function calculateViralScore(upvotes: number, comments: number): number {
  const engagementScore = (upvotes * 0.7) + (comments * 1.5);
  return Math.min(100, Math.round((engagementScore / 100) * 100));
}

// 👁️ VIEW ESTIMATION
function estimateViews(upvotes: number, comments: number): number {
  const baseViews = upvotes * 100;
  const engagementBonus = comments * 50;
  return Math.round(baseViews + engagementBonus);
}

// 🔍 CATEGORY QUERY MAPPING
function getCategoryQuery(category: string): string {
  const queries: Record<string, string> = {
    'mystery': 'unsolved mystery OR disappearance OR puzzle',
    'crime': 'true crime OR murder OR investigation',
    'paranormal': 'ghost OR haunted OR supernatural OR paranormal',
    'history': 'historical mystery OR ancient civilization OR war story',
    'survival': 'survival story OR rescue OR disaster',
    'science': 'scientific discovery OR experiment OR research',
    'psychology': 'psychology OR mental health OR behavior',
    'adventure': 'adventure OR expedition OR exploration',
    'tech': 'technology OR innovation OR startup OR crypto',
    'business': 'business success OR entrepreneur OR wealth'
  };
  
  return queries[category] || category;
}

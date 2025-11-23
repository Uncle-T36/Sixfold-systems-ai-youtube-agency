/**
 * TOP NICHES DATABASE
 * High-CPM YouTube niches with setup templates
 */

export interface TopNiche {
  id: string;
  name: string;
  category: 'finance' | 'business' | 'tech' | 'psychology' | 'science' | 'health';
  cpm: number;
  avgViews: number;
  competition: 'low' | 'medium' | 'high';
  difficulty: 'easy' | 'medium' | 'hard';
  monetizationSpeed: 'fast' | 'medium' | 'slow';
  
  // Channel setup
  channelName: string;
  channelDescription: string;
  keywords: string[];
  
  // Content strategy
  videoTopics: string[];
  contentStyle: string;
  targetAudience: string;
  
  // Success metrics
  expectedSubsDay30: number;
  expectedRevenueDay90: number;
  
  // Imperial wisdom
  machiavellianEdge: string;
  stoicDiscipline: string;
  sunTzuStrategy: string;
}

export const TOP_NICHES: TopNiche[] = [
  // FINANCE TIER ($30-40 CPM)
  {
    id: 'personal-finance',
    name: 'Personal Finance & Wealth Building',
    category: 'finance',
    cpm: 38,
    avgViews: 25000,
    competition: 'high',
    difficulty: 'medium',
    monetizationSpeed: 'fast',
    
    channelName: 'Wealth Strategy Lab',
    channelDescription: 'Master your money. Build generational wealth. Smart strategies for investing, saving, and financial freedom. No fluff, just results.',
    keywords: ['personal finance', 'wealth building', 'investing', 'financial freedom', 'passive income', 'money management', 'retirement planning', 'real estate investing'],
    
    videoTopics: [
      'How I Built $100K Passive Income Portfolio (Step-by-Step)',
      'The 5 Investments Rich People Make That Poor People Don\'t',
      '30-Day Money Challenge: Save $5,000 in One Month',
      'Why 99% of People Will Never Be Rich (And How You Can)',
      'Dividend Investing: Build $10K/Month Passive Income',
      'Real Estate vs Stock Market: Which Makes You Richer?',
      'How to Retire at 40 with $2 Million (Realistic Plan)',
      'Credit Card Hacks That Banks Don\'t Want You to Know',
      'Side Hustles That Actually Make $10K/Month in 2025',
      'The Psychology of Wealth: Think Like a Millionaire',
    ],
    contentStyle: 'Educational + Actionable + Data-driven. Use charts, real numbers, case studies. Serious tone but engaging.',
    targetAudience: 'Ages 25-45, income $40K-$100K, ambitious professionals, aspiring investors',
    
    expectedSubsDay30: 850,
    expectedRevenueDay90: 12000,
    
    machiavellianEdge: 'Exploit fear + greed. Titles like "What Banks Don\'t Tell You" create urgency. Position yourself as the insider revealing secrets.',
    stoicDiscipline: 'Post finance content during market hours (9am-4pm EST). Use Bloomberg Terminal aesthetic. Build authority through consistency.',
    sunTzuStrategy: 'Attack when competition is complacent (weekends, holidays). Financial anxiety peaks Sunday nights - schedule premium content then.',
  },
  
  {
    id: 'crypto-trading',
    name: 'Crypto Trading & Blockchain',
    category: 'finance',
    cpm: 35,
    avgViews: 30000,
    competition: 'high',
    difficulty: 'hard',
    monetizationSpeed: 'fast',
    
    channelName: 'Crypto Empire Builder',
    channelDescription: 'Bitcoin, Ethereum, altcoins. Trading strategies that actually work. Technical analysis, market predictions, portfolio breakdowns. Your edge in crypto.',
    keywords: ['cryptocurrency', 'bitcoin', 'ethereum', 'crypto trading', 'blockchain', 'defi', 'nft', 'altcoins'],
    
    videoTopics: [
      'Bitcoin to $150K: The Data Everyone is Ignoring',
      'How I Turned $1,000 into $50,000 in 90 Days (Crypto Strategy)',
      'Top 5 Altcoins That Will 100x in 2025 (Research-Backed)',
      'Why Ethereum Will Flip Bitcoin (Technical Analysis)',
      'Crypto Tax Loopholes: Save Thousands Legally',
      'DeFi Passive Income: $5K/Month from Liquidity Pools',
      'NFT Flipping: Made $100K in 30 Days (Case Study)',
      'Bear Market Survival Guide: Protect Your Portfolio',
      'Crypto Whales Are Buying This (On-Chain Data)',
      'The Next Bitcoin: 3 Coins Under $1 with 1000x Potential',
    ],
    contentStyle: 'Urgent + Technical + Visual. Use TradingView charts, on-chain metrics. Fast-paced editing.',
    targetAudience: 'Ages 18-35, tech-savvy, risk-tolerant, crypto investors',
    
    expectedSubsDay30: 920,
    expectedRevenueDay90: 13500,
    
    machiavellianEdge: 'Ride volatility waves. Post "Bitcoin CRASH" videos during dips, "Bitcoin MOON" during pumps. Emotion = engagement = revenue.',
    stoicDiscipline: 'Markets never sleep. Schedule content for Asian market open (8pm EST). Automate morning briefs (7am) when traders check phones.',
    sunTzuStrategy: 'When others fear, be greedy with content. Market crashes = 10x views. Prepare crash/pump video templates in advance.',
  },
  
  // BUSINESS TIER ($28-35 CPM)
  {
    id: 'entrepreneurship',
    name: 'Entrepreneurship & Startups',
    category: 'business',
    cpm: 32,
    avgViews: 22000,
    competition: 'high',
    difficulty: 'medium',
    monetizationSpeed: 'fast',
    
    channelName: 'Startup Empire Playbook',
    channelDescription: 'Build, launch, scale. Startup strategies from zero to millions. Real founder stories, business models, growth hacks. Your roadmap to entrepreneurship.',
    keywords: ['entrepreneurship', 'startups', 'business growth', 'founder stories', 'scaling', 'business strategy', 'venture capital', 'bootstrapping'],
    
    videoTopics: [
      'How I Built a $10M Company in 18 Months (Full Breakdown)',
      'The 5 Business Models That Create Millionaires',
      'I Analyzed 1,000 Failed Startups: Here\'s What Kills Them',
      'Raising Venture Capital: What VCs Actually Look For',
      'Bootstrapped to $1M ARR: No Funding Needed (Step-by-Step)',
      'The SaaS Playbook: $100K MRR in 12 Months',
      'Founder Mental Health: Surviving the Startup Grind',
      'How to Validate Your Startup Idea in 7 Days',
      'The Best Business to Start in 2025 (Data-Backed)',
      'Exit Strategy: How I Sold My Company for $50M',
    ],
    contentStyle: 'Inspirational + Tactical + Transparent. Share real numbers, failures, lessons. Documentary-style storytelling.',
    targetAudience: 'Ages 22-40, aspiring founders, early-stage entrepreneurs, business students',
    
    expectedSubsDay30: 780,
    expectedRevenueDay90: 10500,
    
    machiavellianEdge: 'Success porn sells. Showcase wealth signals (offices, teams, funding announcements) but provide real value. Appear successful to attract success.',
    stoicDiscipline: 'Founders watch content during lunch breaks (12-1pm) and late nights (10pm-12am). Schedule around their pain points.',
    sunTzuStrategy: 'Position yourself between Gary Vee (motivation) and Y Combinator (tactics). Fill the gap: motivational tactics.',
  },
  
  {
    id: 'real-estate',
    name: 'Real Estate Investing',
    category: 'business',
    cpm: 30,
    avgViews: 20000,
    competition: 'medium',
    difficulty: 'easy',
    monetizationSpeed: 'fast',
    
    channelName: 'Property Empire Builder',
    channelDescription: 'Real estate wealth strategies. Rental properties, flipping, commercial investing, REITs. Build your property portfolio from zero to millions.',
    keywords: ['real estate investing', 'rental properties', 'house flipping', 'commercial real estate', 'REIT', 'property investment', 'landlord', 'passive income real estate'],
    
    videoTopics: [
      'How I Bought 10 Rental Properties with No Money Down',
      'House Flipping: Made $150K on One Property (Full Walkthrough)',
      'The 1% Rule: Never Lose Money on Rental Properties',
      'Commercial Real Estate: Why I Quit Residential',
      'Airbnb vs Long-Term Rentals: Which Makes More Money?',
      'Tax Strategies for Real Estate Investors (Save $50K+)',
      'How to Find Deals: Off-Market Properties No One Knows About',
      'Managing 50+ Rental Units: Systems That Scale',
      'Real Estate Market Crash: Buy or Wait?',
      'From $0 to $1M in Real Estate Equity (5-Year Plan)',
    ],
    contentStyle: 'Practical + Visual + Property tours. Show real deals, numbers, properties. Use before/after transformations.',
    targetAudience: 'Ages 30-55, stable income $60K+, looking for tangible assets, risk-averse',
    
    expectedSubsDay30: 690,
    expectedRevenueDay90: 9200,
    
    machiavellianEdge: 'Real estate = status + security. Appeal to both. Show luxury properties (aspiration) and starter deals (accessibility).',
    stoicDiscipline: 'Real estate investors are patient. Build long-form content (15-20 min). They want depth, not quick hits.',
    sunTzuStrategy: 'Market timing content. "Buy Now" videos during dips, "Hold or Sell" during peaks. Be the trusted advisor in chaos.',
  },
  
  // TECH TIER ($25-32 CPM)
  {
    id: 'ai-automation',
    name: 'AI & Automation',
    category: 'tech',
    cpm: 30,
    avgViews: 28000,
    competition: 'medium',
    difficulty: 'medium',
    monetizationSpeed: 'fast',
    
    channelName: 'AI Automation Empire',
    channelDescription: 'AI tools that make money. ChatGPT, automation, no-code AI, business automation. Turn AI into your 24/7 employee. Practical tutorials that actually work.',
    keywords: ['artificial intelligence', 'ai automation', 'chatgpt', 'ai tools', 'automation', 'no-code ai', 'ai business', 'machine learning'],
    
    videoTopics: [
      'I Built an AI Business That Makes $50K/Month (Full Setup)',
      'ChatGPT Money-Making Strategies No One Talks About',
      '10 AI Tools That Will Replace Your Job (Use Them First)',
      'How I Automated My Entire Business with AI (Zero Employees)',
      'AI Side Hustles: $10K/Month in 90 Days',
      'The AI Playbook: From Idea to $100K in 6 Months',
      'I Cloned Myself with AI: 10x Productivity',
      'AI Agents That Run Your Business on Autopilot',
      'Why AI Won\'t Steal Your Job (It Will Make You Richer)',
      'Building AI SaaS: $50K MRR Case Study',
    ],
    contentStyle: 'Futuristic + Tutorial + Results-focused. Screen recordings, AI demos, real revenue dashboards. Show, don\'t just tell.',
    targetAudience: 'Ages 20-40, tech early adopters, freelancers, entrepreneurs, automation seekers',
    
    expectedSubsDay30: 950,
    expectedRevenueDay90: 11800,
    
    machiavellianEdge: 'AI fear + FOMO. "Adapt or die" messaging. Position AI as the weapon, you as the trainer. Create urgency around job displacement.',
    stoicDiscipline: 'Tech moves fast. Post daily. Use AI to generate AI content (meta strategy). Batch-produce 30 videos in one weekend.',
    sunTzuStrategy: 'Dominate search. Target "ChatGPT + [problem]" keywords. Every new AI tool = new video opportunity. Be first.',
  },
  
  {
    id: 'software-development',
    name: 'Software Development & Coding',
    category: 'tech',
    cpm: 28,
    avgViews: 24000,
    competition: 'high',
    difficulty: 'hard',
    monetizationSpeed: 'medium',
    
    channelName: 'Code Empire Academy',
    channelDescription: 'Master software development. Web dev, mobile apps, system design, career growth. From junior to senior engineer. Real code, real projects, real career advice.',
    keywords: ['software development', 'coding', 'programming', 'web development', 'app development', 'software engineer', 'tech career', 'system design'],
    
    videoTopics: [
      'I Built a $1M SaaS Product: Full Tech Stack Breakdown',
      'From Bootcamp to $200K Engineer in 2 Years (Exact Roadmap)',
      'System Design Interview: How I Got Offers from FAANG',
      'The Coding Project That Got Me 50 Job Offers',
      'JavaScript to $150K: Complete Developer Roadmap 2025',
      'Why Senior Engineers Make 10x Junior Salary (Skills Gap)',
      'Building a Startup Tech Stack: What Actually Scales',
      'Clean Code That Got Me Promoted (Before/After)',
      'The Best Programming Language to Learn in 2025 (Data)',
      'Freelance Developer: $300/Hour Clients (How I Get Them)',
    ],
    contentStyle: 'Educational + Code walkthroughs + Career insights. Split-screen (talking head + IDE). High production quality.',
    targetAudience: 'Ages 18-35, CS students, bootcamp grads, junior devs, career switchers',
    
    expectedSubsDay30: 820,
    expectedRevenueDay90: 10200,
    
    machiavellianEdge: 'Developers respect competence. Show real code, real projects, real GitHub repos. No fluff. Competence = authority = subscribers.',
    stoicDiscipline: 'Devs watch during compile time, lunch, and late nights. Post technical deep-dives on weekends when they have time to focus.',
    sunTzuStrategy: 'Pick battles wisely. Don\'t compete with CS50 on basics. Target niche pain points: "Next.js 14 server actions" > "Intro to JavaScript".',
  },
  
  // PSYCHOLOGY TIER ($22-28 CPM)
  {
    id: 'self-improvement',
    name: 'Self Improvement & Productivity',
    category: 'psychology',
    cpm: 25,
    avgViews: 26000,
    competition: 'high',
    difficulty: 'easy',
    monetizationSpeed: 'medium',
    
    channelName: 'Peak Performance Protocol',
    channelDescription: 'Optimize your life. Productivity systems, habit formation, mental models, peak performance. Science-backed strategies for high achievers.',
    keywords: ['self improvement', 'productivity', 'habits', 'personal development', 'peak performance', 'time management', 'goal setting', 'life optimization'],
    
    videoTopics: [
      'The Morning Routine That Changed My Life (Backed by Science)',
      'Atomic Habits: How I Built 10 New Habits in 90 Days',
      'Why You\'re Not Productive (And How to Fix It)',
      'The 1% Rule: Compound Your Life Improvements',
      'David Goggins Mindset: I Tried It for 30 Days',
      'Time Blocking: How I 10x My Output',
      'The Psychology of Discipline: Never Be Lazy Again',
      'From Procrastinator to Producer: My Transformation',
      'The Best Books That Actually Changed My Life',
      'Dopamine Detox: Reset Your Brain in 7 Days',
    ],
    contentStyle: 'Motivational + Practical + Relatable. Cinematic B-roll, personal stories, actionable frameworks. High energy.',
    targetAudience: 'Ages 18-35, ambitious individuals, students, young professionals, self-starters',
    
    expectedSubsDay30: 740,
    expectedRevenueDay90: 8600,
    
    machiavellianEdge: 'Sell transformation. Use before/after stories. Make viewers believe change is possible + you have the formula. Hope = views = revenue.',
    stoicDiscipline: 'Self-improvement viewers watch early morning (5-7am, during routines) and Sunday nights (planning week). Schedule accordingly.',
    sunTzuStrategy: 'Ride trends. When Andrew Tate trends, make "Stoic Alpha Male" content. When minimalism trends, make "Essentialism" content. Adapt quickly.',
  },
  
  {
    id: 'psychology-human-behavior',
    name: 'Psychology & Human Behavior',
    category: 'psychology',
    cpm: 22,
    avgViews: 24000,
    competition: 'medium',
    difficulty: 'medium',
    monetizationSpeed: 'medium',
    
    channelName: 'Mind Decoded',
    channelDescription: 'Decode the human mind. Psychology, behavioral science, social dynamics, manipulation tactics, mental models. Understand people, understand power.',
    keywords: ['psychology', 'human behavior', 'social psychology', 'manipulation', 'dark psychology', 'persuasion', 'influence', 'mental models'],
    
    videoTopics: [
      '10 Psychological Tricks That Always Work',
      'Dark Psychology: How to Read Anyone Instantly',
      'The 48 Laws of Power (Animated Summary)',
      'Why Smart People Do Dumb Things (Cognitive Biases)',
      'Body Language Secrets FBI Uses',
      'How to Win Any Argument (Persuasion Tactics)',
      'The Psychology of Attraction: What Actually Works',
      'Narcissists: How to Spot and Handle Them',
      'Manipulation Tactics Used on You Daily',
      'Stoicism: Ancient Psychology for Modern Life',
    ],
    contentStyle: 'Educational + Mysterious + Animated. Use motion graphics, psychological diagrams, case studies. Neutral but intriguing tone.',
    targetAudience: 'Ages 20-45, intellectually curious, interested in self-mastery, social climbers',
    
    expectedSubsDay30: 680,
    expectedRevenueDay90: 7800,
    
    machiavellianEdge: 'Promise power through knowledge. "Learn these tactics before someone uses them on YOU." Fear + curiosity = clicks.',
    stoicDiscipline: 'Psychology content is evergreen. Focus on depth > frequency. One excellent 20-min video > five mediocre 5-min videos.',
    sunTzuStrategy: 'Own the "dark psychology" + "stoicism" + "48 laws" keywords. These topics have cult followings. Become their source.',
  },
  
  // SCIENCE/HEALTH TIER ($18-25 CPM)
  {
    id: 'health-longevity',
    name: 'Health & Longevity',
    category: 'health',
    cpm: 24,
    avgViews: 22000,
    competition: 'medium',
    difficulty: 'medium',
    monetizationSpeed: 'medium',
    
    channelName: 'Longevity Protocol',
    channelDescription: 'Live longer, perform better. Biohacking, nutrition science, fitness optimization, longevity research. Data-driven health strategies for peak human performance.',
    keywords: ['longevity', 'biohacking', 'health optimization', 'nutrition science', 'fitness', 'anti-aging', 'wellness', 'human performance'],
    
    videoTopics: [
      'I Tried Bryan Johnson\'s $2M Longevity Protocol for 30 Days',
      'The 5 Supplements That Actually Extend Lifespan (Science)',
      'How to Live to 100: Lessons from Blue Zones',
      'Intermittent Fasting: I Did It for 1 Year (Results)',
      'The Best Exercise for Longevity (It\'s Not What You Think)',
      'Sleep Optimization: How I Hacked My Sleep Score to 95',
      'Reverse Aging: What Actually Works (Clinical Studies)',
      'The Longevity Diet: Eat Like Centenarians',
      'Cold Plunge Therapy: 90 Days of Ice Baths',
      'Biomarkers to Track: How Healthy Are You Really?',
    ],
    contentStyle: 'Scientific + Experimental + Data-rich. Show lab results, health metrics, transformation data. Clinical but accessible.',
    targetAudience: 'Ages 35-65, health-conscious, high income, optimization mindset, aging concerns',
    
    expectedSubsDay30: 620,
    expectedRevenueDay90: 7200,
    
    machiavellianEdge: 'Exploit mortality fear. Health = wealth in retirement. Older viewers (higher CPM) desperately want longevity content.',
    stoicDiscipline: 'Health viewers are routine-oriented. Post weekly (not daily). They want comprehensive guides, not quick tips.',
    sunTzuStrategy: 'Target "how to" + [health goal] searches. "How to lower blood pressure naturally" gets millions of searches. Own these keywords.',
  },
];

/**
 * Get top niches by category
 */
export function getNichesByCategory(category: TopNiche['category']): TopNiche[] {
  return TOP_NICHES.filter(n => n.category === category);
}

/**
 * Get niches by CPM tier
 */
export function getNichesByCPM(minCPM: number): TopNiche[] {
  return TOP_NICHES.filter(n => n.cpm >= minCPM).sort((a, b) => b.cpm - a.cpm);
}

/**
 * Get niches by difficulty
 */
export function getNichesByDifficulty(difficulty: TopNiche['difficulty']): TopNiche[] {
  return TOP_NICHES.filter(n => n.difficulty === difficulty);
}

/**
 * Get recommended niches for beginners
 */
export function getBeginnerFriendlyNiches(): TopNiche[] {
  return TOP_NICHES
    .filter(n => n.difficulty === 'easy' || n.difficulty === 'medium')
    .filter(n => n.monetizationSpeed === 'fast' || n.monetizationSpeed === 'medium')
    .sort((a, b) => b.cpm - a.cpm)
    .slice(0, 5);
}

/**
 * Get high-revenue niches (best for making money fast)
 */
export function getHighRevenueNiches(): TopNiche[] {
  return TOP_NICHES
    .filter(n => n.cpm >= 28)
    .filter(n => n.monetizationSpeed === 'fast')
    .sort((a, b) => b.expectedRevenueDay90 - a.expectedRevenueDay90);
}

/**
 * Calculate potential revenue for niche
 */
export function calculateNicheRevenue(niche: TopNiche, videosPerWeek: number = 5): {
  day30: number;
  day60: number;
  day90: number;
  day180: number;
} {
  const viewsPerVideo = niche.avgViews;
  const cpm = niche.cpm;
  
  // Growth multipliers based on niche characteristics
  const baseMultiplier = niche.competition === 'low' ? 1.3 : niche.competition === 'medium' ? 1.2 : 1.15;
  
  const calculateRevenue = (days: number) => {
    const totalVideos = Math.floor((days / 7) * videosPerWeek);
    const growthFactor = Math.pow(baseMultiplier, days / 30);
    const totalViews = totalVideos * viewsPerVideo * growthFactor;
    return Math.floor(totalViews * (cpm / 1000));
  };
  
  return {
    day30: calculateRevenue(30),
    day60: calculateRevenue(60),
    day90: calculateRevenue(90),
    day180: calculateRevenue(180),
  };
}

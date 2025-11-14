/**
 * MULTI-INCOME STREAM DIVERSIFICATION
 * Turn 1 video into 7+ revenue sources - ALL FREE
 * Cost: $0 - No paid tools needed
 */

export interface IncomeStream {
  id: string;
  name: string;
  type: 'affiliate' | 'sponsorship' | 'product' | 'service' | 'membership' | 'merchandise' | 'licensing';
  revenue: number;
  status: 'active' | 'pending' | 'paused';
  automationLevel: 'full' | 'semi' | 'manual';
  setupCost: number; // Always $0
  monthlyRevenue: number;
  estimatedAnnual: number;
}

export interface AffiliateOpportunity {
  product: string;
  niche: string;
  commission: string; // "10-50%"
  avgOrderValue: number;
  conversionRate: number;
  program: string; // "Amazon Associates", "ClickBank", etc.
  link: string;
  estimatedMonthlyRevenue: number;
  isFree: boolean; // Always true
}

export interface SponsorshipMatch {
  brand: string;
  niche: string;
  dealSize: string; // "$500-$5000 per video"
  requirements: string[];
  contactEmail: string;
  likelihood: number; // 0-100
  reachOutScript: string;
}

export interface ProductIdea {
  name: string;
  type: 'digital' | 'physical' | 'service';
  niche: string;
  price: number;
  productionCost: number; // $0 for digital
  timeToCreate: string;
  estimatedSales: number;
  platform: string; // "Gumroad (FREE)", "Etsy", "Shopify"
}

export interface RevenueStreamStrategy {
  channelNiche: string;
  subscriberCount: number;
  currentRevenue: number;
  potentialRevenue: number;
  streams: IncomeStream[];
  quickWins: string[]; // Implement these first
  monthlyPlan: {
    month: number;
    action: string;
    expectedRevenue: number;
    timeRequired: string;
  }[];
}

/**
 * Analyze channel and recommend income streams
 */
export function analyzeIncomeOpportunities(channel: {
  niche: string;
  subscribers: number;
  avgViews: number;
  currentRevenue: number;
}): RevenueStreamStrategy {
  const baseMultiplier = channel.subscribers / 1000;
  
  const streams: IncomeStream[] = [
    // YouTube Ad Revenue (existing)
    {
      id: 'youtube-ads',
      name: 'YouTube Ad Revenue',
      type: 'licensing',
      revenue: channel.currentRevenue,
      status: 'active',
      automationLevel: 'full',
      setupCost: 0,
      monthlyRevenue: channel.currentRevenue,
      estimatedAnnual: channel.currentRevenue * 12
    },
    // Affiliate Marketing (FREE - just add links)
    {
      id: 'affiliate-marketing',
      name: 'Affiliate Marketing',
      type: 'affiliate',
      revenue: 0,
      status: 'pending',
      automationLevel: 'full',
      setupCost: 0,
      monthlyRevenue: Math.round(channel.avgViews * 0.05 * 50), // 5% click, $50 avg commission
      estimatedAnnual: Math.round(channel.avgViews * 0.05 * 50 * 12)
    },
    // Digital Products (FREE to create)
    {
      id: 'digital-products',
      name: 'Digital Products (eBooks, Templates, Courses)',
      type: 'product',
      revenue: 0,
      status: 'pending',
      automationLevel: 'semi',
      setupCost: 0,
      monthlyRevenue: Math.round(channel.subscribers * 0.01 * 29), // 1% conversion at $29
      estimatedAnnual: Math.round(channel.subscribers * 0.01 * 29 * 12)
    },
    // Sponsorships (FREE - just reach out)
    {
      id: 'sponsorships',
      name: 'Brand Sponsorships',
      type: 'sponsorship',
      revenue: 0,
      status: 'pending',
      automationLevel: 'semi',
      setupCost: 0,
      monthlyRevenue: Math.round(baseMultiplier * 500), // $500 per 1K subs
      estimatedAnnual: Math.round(baseMultiplier * 500 * 12)
    },
    // Consulting/Coaching (FREE - just your time)
    {
      id: 'consulting',
      name: 'Consulting/Coaching',
      type: 'service',
      revenue: 0,
      status: 'pending',
      automationLevel: 'manual',
      setupCost: 0,
      monthlyRevenue: 2000, // 2 clients at $1000/month
      estimatedAnnual: 24000
    },
    // Membership Community (FREE with Discord/Telegram)
    {
      id: 'membership',
      name: 'Membership Community',
      type: 'membership',
      revenue: 0,
      status: 'pending',
      automationLevel: 'semi',
      setupCost: 0,
      monthlyRevenue: Math.round(channel.subscribers * 0.02 * 10), // 2% at $10/month
      estimatedAnnual: Math.round(channel.subscribers * 0.02 * 10 * 12)
    },
    // Print-on-Demand Merch (FREE with Printful/Printify)
    {
      id: 'merchandise',
      name: 'Print-on-Demand Merchandise',
      type: 'merchandise',
      revenue: 0,
      status: 'pending',
      automationLevel: 'full',
      setupCost: 0,
      monthlyRevenue: Math.round(channel.subscribers * 0.005 * 15), // 0.5% at $15 profit
      estimatedAnnual: Math.round(channel.subscribers * 0.005 * 15 * 12)
    }
  ];

  const totalPotential = streams.reduce((sum, s) => sum + s.monthlyRevenue, 0);

  return {
    channelNiche: channel.niche,
    subscriberCount: channel.subscribers,
    currentRevenue: channel.currentRevenue,
    potentialRevenue: totalPotential,
    streams,
    quickWins: [
      '1. Add 3 affiliate links to EVERY video description (5 min setup)',
      '2. Create 1 digital product (PDF guide/template) - sell for $29 (1 day)',
      '3. Reach out to 5 brands for sponsorships (1 hour)',
      '4. Start FREE Discord/Telegram community - charge $10/month (30 min)',
      '5. Set up Print-on-Demand store with 5 designs (2 hours)'
    ],
    monthlyPlan: generateMonthlyPlan(channel)
  };
}

/**
 * Generate affiliate opportunities for niche
 */
export function findAffiliateOpportunities(niche: string, subscriberCount: number): AffiliateOpportunity[] {
  const opportunities: AffiliateOpportunity[] = [];

  // Universal affiliates (work for ANY niche)
  opportunities.push({
    product: 'Amazon Associates',
    niche: 'universal',
    commission: '1-10%',
    avgOrderValue: 50,
    conversionRate: 5,
    program: 'Amazon Associates',
    link: 'https://affiliate-program.amazon.com',
    estimatedMonthlyRevenue: Math.round(subscriberCount * 0.1 * 0.05 * 5), // 10% click, 5% buy, $5 commission
    isFree: true
  });

  // Niche-specific high-ticket affiliates
  const nichePrograms: Record<string, AffiliateOpportunity[]> = {
    'mystery': [
      {
        product: 'Audible Books',
        niche: 'mystery',
        commission: '$15 per signup',
        avgOrderValue: 15,
        conversionRate: 8,
        program: 'Audible Affiliate Program',
        link: 'https://www.audible.com/affiliate',
        estimatedMonthlyRevenue: Math.round(subscriberCount * 0.1 * 0.08 * 15),
        isFree: true
      },
      {
        product: 'ExpressVPN',
        niche: 'privacy/mystery',
        commission: '40%+ ($20-50)',
        avgOrderValue: 50,
        conversionRate: 3,
        program: 'ExpressVPN Affiliate',
        link: 'https://www.expressvpn.com/affiliate',
        estimatedMonthlyRevenue: Math.round(subscriberCount * 0.05 * 0.03 * 50),
        isFree: true
      }
    ],
    'finance': [
      {
        product: 'Credit Cards',
        niche: 'finance',
        commission: '$50-200 per signup',
        avgOrderValue: 100,
        conversionRate: 2,
        program: 'Various Banks',
        link: 'https://www.creditcards.com/affiliate',
        estimatedMonthlyRevenue: Math.round(subscriberCount * 0.1 * 0.02 * 100),
        isFree: true
      }
    ],
    'tech': [
      {
        product: 'Hosting (Hostinger/Bluehost)',
        niche: 'tech',
        commission: '$100+ per sale',
        avgOrderValue: 100,
        conversionRate: 5,
        program: 'Multiple hosting affiliates',
        link: 'https://www.hostinger.com/affiliates',
        estimatedMonthlyRevenue: Math.round(subscriberCount * 0.05 * 0.05 * 100),
        isFree: true
      }
    ]
  };

  // Add niche-specific opportunities
  if (nichePrograms[niche.toLowerCase()]) {
    opportunities.push(...nichePrograms[niche.toLowerCase()]);
  }

  return opportunities.sort((a, b) => b.estimatedMonthlyRevenue - a.estimatedMonthlyRevenue);
}

/**
 * Find brand sponsorship opportunities
 */
export function findSponsorshipOpportunities(channel: {
  niche: string;
  subscribers: number;
  avgViews: number;
  engagement: number;
}): SponsorshipMatch[] {
  const baseRate = channel.subscribers >= 10000 ? 
    Math.round((channel.subscribers / 1000) * 100) : // $100 per 1K subs
    500; // Minimum $500 for smaller channels

  const brands: SponsorshipMatch[] = [
    {
      brand: 'Established Titles',
      niche: 'storytelling/history',
      dealSize: `$${baseRate * 5}-${baseRate * 10} per video`,
      requirements: ['10K+ subscribers', 'Good engagement', 'Storytelling content'],
      contactEmail: 'partnerships@establishedtitles.com',
      likelihood: channel.subscribers >= 10000 ? 90 : 60,
      reachOutScript: generateSponsorshipEmail('Established Titles', channel)
    },
    {
      brand: 'NordVPN',
      niche: 'universal',
      dealSize: `$${baseRate * 3}-${baseRate * 8} per video`,
      requirements: ['5K+ subscribers', 'Tech-savvy audience'],
      contactEmail: 'partnerships@nordvpn.com',
      likelihood: 80,
      reachOutScript: generateSponsorshipEmail('NordVPN', channel)
    },
    {
      brand: 'HelloFresh',
      niche: 'lifestyle/entertainment',
      dealSize: `$${baseRate * 2}-${baseRate * 6} per video`,
      requirements: ['10K+ subscribers', 'Engaging personality'],
      contactEmail: 'influencer@hellofresh.com',
      likelihood: 75,
      reachOutScript: generateSponsorshipEmail('HelloFresh', channel)
    },
    {
      brand: 'Raycon',
      niche: 'universal',
      dealSize: `$${baseRate}-${baseRate * 4} per video`,
      requirements: ['5K+ subscribers'],
      contactEmail: 'partnerships@raycon.com',
      likelihood: 85,
      reachOutScript: generateSponsorshipEmail('Raycon', channel)
    }
  ];

  return brands.sort((a, b) => b.likelihood - a.likelihood);
}

/**
 * Generate sponsorship reach-out email
 */
function generateSponsorshipEmail(brand: string, channel: any): string {
  return `Subject: Partnership Opportunity - [Your Channel Name] (${channel.subscribers.toLocaleString()} subscribers)

Hi ${brand} Team,

I'm reaching out to explore a potential partnership between ${brand} and my YouTube channel, [Your Channel Name].

CHANNEL METRICS:
• Subscribers: ${channel.subscribers.toLocaleString()}
• Average Views: ${channel.avgViews.toLocaleString()} per video
• Engagement Rate: ${channel.engagement}%
• Niche: ${channel.niche}
• Audience: [Your audience demographics]

WHY WE'RE A GREAT FIT:
• My audience is highly engaged and trusts my recommendations
• Content aligns perfectly with ${brand}'s target market
• Professional production quality
• Proven track record of successful integrations

I'd love to discuss how we can create authentic, engaging content featuring ${brand}.

Are you available for a quick call this week?

Best regards,
[Your Name]
[Channel Link]
[Media Kit Link]`;
}

/**
 * Generate digital product ideas
 */
export function generateProductIdeas(niche: string): ProductIdea[] {
  const baseIdeas: ProductIdea[] = [
    {
      name: `${niche} Ultimate Guide (eBook)`,
      type: 'digital',
      niche,
      price: 29,
      productionCost: 0,
      timeToCreate: '1-2 days',
      estimatedSales: 50,
      platform: 'Gumroad (FREE)'
    },
    {
      name: `${niche} Video Scripts Pack (50 scripts)`,
      type: 'digital',
      niche,
      price: 49,
      productionCost: 0,
      timeToCreate: '3-5 days',
      estimatedSales: 30,
      platform: 'Gumroad (FREE)'
    },
    {
      name: `${niche} Notion Templates`,
      type: 'digital',
      niche,
      price: 19,
      productionCost: 0,
      timeToCreate: '1 day',
      estimatedSales: 100,
      platform: 'Gumroad (FREE)'
    },
    {
      name: `${niche} Course (Video Series)`,
      type: 'digital',
      niche,
      price: 197,
      productionCost: 0,
      timeToCreate: '1-2 weeks',
      estimatedSales: 20,
      platform: 'Gumroad or Teachable (FREE tier)'
    },
    {
      name: `${niche} Merchandise Designs`,
      type: 'physical',
      niche,
      price: 25,
      productionCost: 0, // Print-on-demand
      timeToCreate: '2-3 hours',
      estimatedSales: 40,
      platform: 'Printful + Shopify (FREE)'
    }
  ];

  return baseIdeas.map(idea => ({
    ...idea,
    estimatedSales: Math.round(idea.estimatedSales * (1 + Math.random() * 0.5))
  }));
}

/**
 * Auto-insert affiliate links into video descriptions
 */
export function generateDescriptionWithAffiliates(
  baseDescription: string,
  niche: string,
  affiliateLinks: string[]
): string {
  const affiliateSection = `

━━━━━━━━━━━━━━━━━━━━━━━━━━
🔗 RESOURCES & LINKS (Affiliate)
━━━━━━━━━━━━━━━━━━━━━━━━━━

${affiliateLinks.map((link, i) => `${i + 1}. ${link}`).join('\n')}

*Disclosure: These are affiliate links. I earn a small commission at no extra cost to you. Thanks for supporting the channel! ❤️

━━━━━━━━━━━━━━━━━━━━━━━━━━`;

  return baseDescription + affiliateSection;
}

/**
 * Generate monthly revenue plan
 */
function generateMonthlyPlan(channel: any) {
  return [
    {
      month: 1,
      action: 'Set up affiliate links + create first digital product',
      expectedRevenue: Math.round(channel.currentRevenue * 1.5),
      timeRequired: '10 hours'
    },
    {
      month: 2,
      action: 'Launch sponsorship outreach + start membership community',
      expectedRevenue: Math.round(channel.currentRevenue * 2),
      timeRequired: '15 hours'
    },
    {
      month: 3,
      action: 'Launch print-on-demand store + second digital product',
      expectedRevenue: Math.round(channel.currentRevenue * 2.5),
      timeRequired: '12 hours'
    },
    {
      month: 4,
      action: 'Optimize all streams + add consulting offers',
      expectedRevenue: Math.round(channel.currentRevenue * 3),
      timeRequired: '8 hours'
    },
    {
      month: 5,
      action: 'Scale successful streams + automate workflows',
      expectedRevenue: Math.round(channel.currentRevenue * 4),
      timeRequired: '10 hours'
    },
    {
      month: 6,
      action: 'Full automation + passive income systems',
      expectedRevenue: Math.round(channel.currentRevenue * 5),
      timeRequired: '5 hours (maintenance only)'
    }
  ];
}

/**
 * Track all revenue streams
 */
export function trackAllRevenue(userId: string): {
  totalMonthly: number;
  totalAnnual: number;
  breakdown: Record<string, number>;
  growthRate: number;
  projections: { month: number; revenue: number }[];
} {
  const streams = JSON.parse(localStorage.getItem(`income_streams_${userId}`) || '[]');
  
  const totalMonthly = streams.reduce((sum: number, s: IncomeStream) => sum + s.monthlyRevenue, 0);
  const totalAnnual = totalMonthly * 12;

  const breakdown: Record<string, number> = {};
  streams.forEach((s: IncomeStream) => {
    breakdown[s.name] = s.monthlyRevenue;
  });

  // Calculate 12-month projections with 20% monthly growth
  const projections = [];
  let projectedRevenue = totalMonthly;
  for (let i = 1; i <= 12; i++) {
    projectedRevenue *= 1.20; // 20% growth per month
    projections.push({ month: i, revenue: Math.round(projectedRevenue) });
  }

  return {
    totalMonthly,
    totalAnnual,
    breakdown,
    growthRate: 20, // 20% per month
    projections
  };
}

/**
 * Get FREE tools for each income stream
 */
export function getFreeTools(): Record<string, { name: string; cost: string; purpose: string }[]> {
  return {
    'Affiliate Marketing': [
      { name: 'Amazon Associates', cost: 'FREE', purpose: 'Universal affiliate program' },
      { name: 'ClickBank', cost: 'FREE', purpose: 'Digital product affiliates' },
      { name: 'ShareASale', cost: 'FREE', purpose: 'Wide range of programs' },
      { name: 'CJ Affiliate', cost: 'FREE', purpose: 'Premium brand partnerships' }
    ],
    'Digital Products': [
      { name: 'Gumroad', cost: 'FREE (10% fee only on sales)', purpose: 'Sell digital products' },
      { name: 'Canva', cost: 'FREE', purpose: 'Create product designs' },
      { name: 'Google Docs', cost: 'FREE', purpose: 'Write eBooks/guides' },
      { name: 'Notion', cost: 'FREE', purpose: 'Create templates' }
    ],
    'Sponsorships': [
      { name: 'Email', cost: 'FREE', purpose: 'Direct brand outreach' },
      { name: 'LinkedIn', cost: 'FREE', purpose: 'Find brand contacts' },
      { name: 'Twitter/X', cost: 'FREE', purpose: 'Network with brands' }
    ],
    'Membership': [
      { name: 'Discord', cost: 'FREE', purpose: 'Community platform' },
      { name: 'Telegram', cost: 'FREE', purpose: 'Premium groups' },
      { name: 'Patreon', cost: 'FREE (5-12% fee)', purpose: 'Membership management' }
    ],
    'Merchandise': [
      { name: 'Printful', cost: 'FREE (print on demand)', purpose: 'No upfront inventory' },
      { name: 'Printify', cost: 'FREE (print on demand)', purpose: 'Multiple suppliers' },
      { name: 'Canva', cost: 'FREE', purpose: 'Design merchandise' }
    ],
    'Consulting': [
      { name: 'Calendly', cost: 'FREE', purpose: 'Booking system' },
      { name: 'Zoom', cost: 'FREE', purpose: 'Video calls' },
      { name: 'Google Forms', cost: 'FREE', purpose: 'Client applications' }
    ]
  };
}

/**
 * Calculate financial freedom timeline
 */
export function calculateFreedomTimeline(
  currentRevenue: number,
  targetRevenue: number,
  growthRate: number = 20
): {
  monthsToFreedom: number;
  timeline: { month: number; revenue: number; milestone: string }[];
  recommendation: string;
} {
  const timeline = [];
  let revenue = currentRevenue;
  let month = 0;

  while (revenue < targetRevenue && month < 24) {
    month++;
    revenue *= (1 + growthRate / 100);
    
    let milestone = '';
    if (revenue >= 1000 && revenue < 2000) milestone = '🎯 Part-time income replacement';
    if (revenue >= 2000 && revenue < 5000) milestone = '💼 Side hustle → Main income';
    if (revenue >= 5000 && revenue < 10000) milestone = '🚀 Full-time income achieved!';
    if (revenue >= 10000) milestone = '💰 FINANCIAL FREEDOM!';

    timeline.push({ month, revenue: Math.round(revenue), milestone });
  }

  return {
    monthsToFreedom: month,
    timeline,
    recommendation: month <= 6 ? 
      '🔥 You could quit your job in 6 months!' :
      month <= 12 ?
      '💪 One year to freedom - totally doable!' :
      '📈 Focus on high-leverage activities to speed this up'
  };
}

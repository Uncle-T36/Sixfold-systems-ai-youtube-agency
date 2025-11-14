/**
 * SELF-MARKETING & VIRAL GROWTH SYSTEM
 * Makes the app market itself through user-generated content and viral loops
 * Free organic growth strategies that compound over time
 */

export interface ViralLoop {
  id: string;
  name: string;
  type: 'referral' | 'ugc' | 'social-proof' | 'organic-seo' | 'community';
  description: string;
  conversionRate: number; // %
  viralCoefficient: number; // How many users each user brings
  implementation: string;
  status: 'active' | 'testing' | 'paused';
  metrics: {
    impressions: number;
    clicks: number;
    signups: number;
    revenue: number;
  };
}

export interface ReferralProgram {
  enabled: boolean;
  rewards: {
    referrer: {
      type: 'credits' | 'discount' | 'cash';
      amount: number;
      currency?: string;
    };
    referee: {
      type: 'trial-extension' | 'discount' | 'credits';
      amount: number;
    };
  };
  terms: {
    minSubscription: string;
    payoutThreshold: number;
    expiryDays: number;
  };
}

export interface UserGeneratedContent {
  id: string;
  userId: string;
  type: 'testimonial' | 'case-study' | 'video-showcase' | 'social-post';
  platform: string;
  url: string;
  reach: number;
  engagement: number;
  conversions: number;
  approved: boolean;
  featured: boolean;
  incentiveGiven: boolean;
}

export interface SocialProofElement {
  id: string;
  type: 'user-count' | 'revenue-generated' | 'videos-created' | 'testimonial' | 'badge';
  content: string;
  placement: 'homepage' | 'signup' | 'dashboard' | 'checkout';
  priority: number;
  active: boolean;
}

export interface GrowthMetrics {
  totalUsers: number;
  activeUsers: number;
  paidUsers: number;
  viralCoefficient: number;
  churnRate: number;
  cac: number; // Customer Acquisition Cost
  ltv: number; // Lifetime Value
  growthRate: number; // Month-over-month
  referralSignups: number;
  organicSignups: number;
}

// Viral Loop Strategies
export const VIRAL_LOOPS: ViralLoop[] = [
  {
    id: 'watermark_branding',
    name: 'Video Watermark Branding',
    type: 'ugc',
    description: 'Add subtle watermark to all generated videos that links back to app',
    conversionRate: 0.5,
    viralCoefficient: 1.3,
    implementation: 'Add "Made with SixFold" + logo in corner of videos (removable for Pro users)',
    status: 'active',
    metrics: {
      impressions: 5000000,
      clicks: 25000,
      signups: 1250,
      revenue: 12500
    }
  },
  {
    id: 'referral_program',
    name: 'Referral Program',
    type: 'referral',
    description: 'Give users $50 credit for each paid referral, referee gets 30-day free trial',
    conversionRate: 12,
    viralCoefficient: 2.1,
    implementation: 'Unique referral link + automated tracking + instant rewards',
    status: 'active',
    metrics: {
      impressions: 100000,
      clicks: 15000,
      signups: 1800,
      revenue: 53100
    }
  },
  {
    id: 'success_sharing',
    name: 'Success Story Sharing',
    type: 'ugc',
    description: 'One-click share revenue milestones on social media',
    conversionRate: 3,
    viralCoefficient: 1.5,
    implementation: 'Auto-generate celebratory posts when users hit $100, $1K, $10K revenue',
    status: 'active',
    metrics: {
      impressions: 2000000,
      clicks: 60000,
      signups: 1800,
      revenue: 18000
    }
  },
  {
    id: 'video_showcase',
    name: 'User Video Showcase',
    type: 'social-proof',
    description: 'Gallery of best videos created with the app',
    conversionRate: 8,
    viralCoefficient: 1.2,
    implementation: 'Public gallery page + badge for featured creators + SEO optimization',
    status: 'active',
    metrics: {
      impressions: 500000,
      clicks: 40000,
      signups: 3200,
      revenue: 32000
    }
  },
  {
    id: 'seo_content',
    name: 'SEO Content Engine',
    type: 'organic-seo',
    description: 'Auto-generate blog posts about user niches and success stories',
    conversionRate: 4,
    viralCoefficient: 0.9,
    implementation: 'AI writes blog posts about trending topics, links to app',
    status: 'active',
    metrics: {
      impressions: 800000,
      clicks: 32000,
      signups: 1280,
      revenue: 12800
    }
  },
  {
    id: 'template_library',
    name: 'Public Template Library',
    type: 'organic-seo',
    description: 'Free templates that require signup to use',
    conversionRate: 15,
    viralCoefficient: 1.1,
    implementation: 'Browse free templates, signup required to download/customize',
    status: 'active',
    metrics: {
      impressions: 300000,
      clicks: 45000,
      signups: 6750,
      revenue: 67500
    }
  },
  {
    id: 'youtube_channel',
    name: 'Tutorial YouTube Channel',
    type: 'organic-seo',
    description: 'YouTube channel teaching content creation strategies',
    conversionRate: 6,
    viralCoefficient: 1.4,
    implementation: 'Weekly tutorials on making money with YouTube, subtle app promotion',
    status: 'active',
    metrics: {
      impressions: 3000000,
      clicks: 180000,
      signups: 10800,
      revenue: 108000
    }
  },
  {
    id: 'discord_community',
    name: 'Creator Community',
    type: 'community',
    description: 'Free Discord community for content creators',
    conversionRate: 20,
    viralCoefficient: 1.8,
    implementation: 'Free community + exclusive channels for paid members',
    status: 'active',
    metrics: {
      impressions: 150000,
      clicks: 30000,
      signups: 6000,
      revenue: 60000
    }
  },
  {
    id: 'affiliate_program',
    name: 'Affiliate Program',
    type: 'referral',
    description: '30% recurring commission for YouTubers/influencers',
    conversionRate: 25,
    viralCoefficient: 3.5,
    implementation: 'Affiliate dashboard + promo codes + monthly payouts',
    status: 'testing',
    metrics: {
      impressions: 1000000,
      clicks: 250000,
      signups: 62500,
      revenue: 1875000
    }
  },
  {
    id: 'social_sharing',
    name: 'Social Sharing Incentive',
    type: 'ugc',
    description: 'Unlock premium features by sharing on social media',
    conversionRate: 10,
    viralCoefficient: 1.6,
    implementation: 'Share to unlock: extra videos, premium voices, advanced features',
    status: 'active',
    metrics: {
      impressions: 750000,
      clicks: 75000,
      signups: 7500,
      revenue: 75000
    }
  },
  {
    id: 'comparison_pages',
    name: 'VS Competitor Pages',
    type: 'organic-seo',
    description: 'SEO pages comparing to competitors',
    conversionRate: 12,
    viralCoefficient: 0.8,
    implementation: 'Create "SixFold vs [Competitor]" comparison pages',
    status: 'active',
    metrics: {
      impressions: 400000,
      clicks: 48000,
      signups: 5760,
      revenue: 57600
    }
  },
  {
    id: 'product_hunt',
    name: 'Product Hunt Launch',
    type: 'social-proof',
    description: 'Launch on Product Hunt for viral exposure',
    conversionRate: 8,
    viralCoefficient: 1.2,
    implementation: 'Well-timed launch with supporter network',
    status: 'paused',
    metrics: {
      impressions: 50000,
      clicks: 15000,
      signups: 1200,
      revenue: 12000
    }
  }
];

// Referral Program Configuration
export const REFERRAL_CONFIG: ReferralProgram = {
  enabled: true,
  rewards: {
    referrer: {
      type: 'cash',
      amount: 50,
      currency: 'USD'
    },
    referee: {
      type: 'trial-extension',
      amount: 30 // days
    }
  },
  terms: {
    minSubscription: 'starter',
    payoutThreshold: 100,
    expiryDays: 90
  }
};

// Social Proof Elements
export const SOCIAL_PROOF: SocialProofElement[] = [
  {
    id: 'user_count',
    type: 'user-count',
    content: 'Join 50,000+ creators making money with AI',
    placement: 'homepage',
    priority: 10,
    active: true
  },
  {
    id: 'revenue_stat',
    type: 'revenue-generated',
    content: '$2.5M+ generated by our creators this month',
    placement: 'homepage',
    priority: 9,
    active: true
  },
  {
    id: 'videos_created',
    type: 'videos-created',
    content: '500K+ professional videos created',
    placement: 'signup',
    priority: 8,
    active: true
  },
  {
    id: 'testimonial_1',
    type: 'testimonial',
    content: '"Made $12K in my first month - this is insane!" - Sarah M.',
    placement: 'checkout',
    priority: 10,
    active: true
  },
  {
    id: 'testimonial_2',
    type: 'testimonial',
    content: '"Quit my job after 3 months. Best decision ever." - Mike T.',
    placement: 'homepage',
    priority: 9,
    active: true
  },
  {
    id: 'badge_1',
    type: 'badge',
    content: '⭐ 4.9/5 from 10K+ reviews',
    placement: 'homepage',
    priority: 8,
    active: true
  }
];

/**
 * Generate unique referral code for user
 */
export function generateReferralCode(userId: string, username: string): string {
  const cleanName = username.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${cleanName}${random}`;
}

/**
 * Track referral and give rewards
 */
export function processReferral(referralCode: string, newUserId: string): {
  success: boolean;
  rewards: {
    referrer: any;
    referee: any;
  };
  error?: string;
} {
  try {
    // Find referrer by code
    const referrerId = findUserByReferralCode(referralCode);
    if (!referrerId) {
      throw new Error('Invalid referral code');
    }

    // Record referral
    const referral = {
      id: `ref_${Date.now()}`,
      referrerId,
      refereeId: newUserId,
      code: referralCode,
      createdAt: new Date(),
      status: 'pending', // pending -> active -> paid
      rewards: {
        referrerAmount: REFERRAL_CONFIG.rewards.referrer.amount,
        refereeAmount: REFERRAL_CONFIG.rewards.referee.amount
      }
    };

    // Save referral
    const referrals = JSON.parse(localStorage.getItem('referrals') || '[]');
    referrals.push(referral);
    localStorage.setItem('referrals', JSON.stringify(referrals));

    // Give instant reward to referee (trial extension)
    const newUserData = JSON.parse(localStorage.getItem(`user_${newUserId}`) || '{}');
    newUserData.trialExtensionDays = REFERRAL_CONFIG.rewards.referee.amount;
    localStorage.setItem(`user_${newUserId}`, JSON.stringify(newUserData));

    return {
      success: true,
      rewards: {
        referrer: {
          type: REFERRAL_CONFIG.rewards.referrer.type,
          amount: REFERRAL_CONFIG.rewards.referrer.amount,
          status: 'pending',
          note: `You'll receive $${REFERRAL_CONFIG.rewards.referrer.amount} when they subscribe`
        },
        referee: {
          type: REFERRAL_CONFIG.rewards.referee.type,
          amount: REFERRAL_CONFIG.rewards.referee.amount,
          status: 'applied',
          note: `${REFERRAL_CONFIG.rewards.referee.amount} extra days added to your trial`
        }
      }
    };
  } catch (error: any) {
    return {
      success: false,
      rewards: { referrer: null, referee: null },
      error: error.message
    };
  }
}

function findUserByReferralCode(code: string): string | null {
  // In production, query database
  // For demo, check localStorage
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find((u: any) => u.referralCode === code);
  return user?.id || null;
}

/**
 * Generate shareable success post
 */
export function generateSuccessPost(userId: string, milestone: {
  type: 'revenue' | 'views' | 'subscribers';
  amount: number;
}): {
  text: string;
  image: string;
  hashtags: string[];
  platforms: string[];
} {
  const milestoneText: Record<string, string> = {
    revenue: `💰 Just hit $${milestone.amount.toLocaleString()} in revenue!`,
    views: `🚀 ${milestone.amount.toLocaleString()} views milestone!`,
    subscribers: `🎉 ${milestone.amount.toLocaleString()} subscribers!`
  };

  const baseText = milestoneText[milestone.type];
  
  return {
    text: `${baseText}\n\nThanks to @SixFoldSystems AI - this would've taken me YEARS manually.\n\nAnyone can do this. Get started: [referral link]`,
    image: `celebration_${milestone.type}_${milestone.amount}.png`,
    hashtags: [
      '#ContentCreator',
      '#MakeMoneyOnline',
      '#YouTube',
      '#PassiveIncome',
      '#AItools',
      '#SideHustle',
      '#CreatorEconomy'
    ],
    platforms: ['twitter', 'instagram', 'linkedin', 'facebook']
  };
}

/**
 * Submit user-generated content
 */
export function submitUserContent(ugc: Omit<UserGeneratedContent, 'id' | 'approved' | 'featured' | 'incentiveGiven'>): string {
  const content: UserGeneratedContent = {
    ...ugc,
    id: `ugc_${Date.now()}`,
    approved: false,
    featured: false,
    incentiveGiven: false
  };

  const allUGC = JSON.parse(localStorage.getItem('user_generated_content') || '[]');
  allUGC.push(content);
  localStorage.setItem('user_generated_content', JSON.stringify(allUGC));

  return content.id;
}

/**
 * Get growth metrics
 */
export function getGrowthMetrics(): GrowthMetrics {
  // In production, fetch from database
  const mockMetrics: GrowthMetrics = {
    totalUsers: 52341,
    activeUsers: 38920,
    paidUsers: 8467,
    viralCoefficient: 1.8, // Each user brings 1.8 new users
    churnRate: 4.2,
    cac: 12, // $12 to acquire a customer
    ltv: 580, // Lifetime value of $580
    growthRate: 23.5, // 23.5% month-over-month
    referralSignups: 15234,
    organicSignups: 37107
  };

  return mockMetrics;
}

/**
 * Calculate viral coefficient
 */
export function calculateViralCoefficient(timeframe: number = 30): {
  coefficient: number;
  interpretation: string;
  projectedGrowth: string;
} {
  const referrals = JSON.parse(localStorage.getItem('referrals') || '[]');
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - timeframe);

  const recentReferrals = referrals.filter((r: any) => 
    new Date(r.createdAt) >= cutoff
  );

  // Count unique referrers
  const referrerSet = new Set(recentReferrals.map((r: any) => r.referrerId));
  const totalReferrers = referrerSet.size;
  
  // Calculate coefficient
  const coefficient = totalReferrers > 0 
    ? recentReferrals.length / totalReferrers 
    : 0;

  let interpretation = '';
  let projectedGrowth = '';

  if (coefficient > 1.5) {
    interpretation = 'Explosive viral growth! 🚀';
    projectedGrowth = '10x growth in 6 months';
  } else if (coefficient > 1.0) {
    interpretation = 'Strong viral growth 📈';
    projectedGrowth = '5x growth in 6 months';
  } else if (coefficient > 0.7) {
    interpretation = 'Moderate organic growth 📊';
    projectedGrowth = '2x growth in 6 months';
  } else {
    interpretation = 'Linear growth 📉';
    projectedGrowth = '1.5x growth in 6 months';
  }

  return {
    coefficient,
    interpretation,
    projectedGrowth
  };
}

/**
 * Optimize marketing channels
 */
export function optimizeMarketingChannels(): {
  topChannels: Array<{ name: string; roi: number }>;
  recommendations: string[];
  budgetAllocation: Record<string, number>;
} {
  // Calculate ROI for each viral loop
  const channelROI = VIRAL_LOOPS.map(loop => ({
    name: loop.name,
    roi: loop.metrics.revenue / (loop.metrics.impressions * 0.001), // Assume $0.001 per impression cost
    metrics: loop.metrics
  })).sort((a, b) => b.roi - a.roi);

  const topChannels = channelROI.slice(0, 5);
  
  const recommendations: string[] = [];
  
  // Analyze top performers
  if (topChannels[0].roi > 100) {
    recommendations.push(`${topChannels[0].name} is crushing it with ${topChannels[0].roi.toFixed(0)}x ROI - invest more here`);
  }

  // Find underperformers
  const underperformers = channelROI.filter(c => c.roi < 10);
  if (underperformers.length > 0) {
    recommendations.push(`Consider pausing: ${underperformers.map(c => c.name).join(', ')} (ROI < 10x)`);
  }

  // Budget allocation (spend more on high ROI channels)
  const totalROI = channelROI.reduce((sum, c) => sum + c.roi, 0);
  const budgetAllocation: Record<string, number> = {};
  
  channelROI.forEach(channel => {
    const percentage = (channel.roi / totalROI) * 100;
    budgetAllocation[channel.name] = Math.round(percentage);
  });

  return {
    topChannels: topChannels.map(c => ({ name: c.name, roi: c.roi })),
    recommendations,
    budgetAllocation
  };
}

/**
 * Auto-generate marketing content
 */
export function generateMarketingContent(type: 'blog' | 'social' | 'email'): {
  title: string;
  content: string;
  cta: string;
  seoKeywords?: string[];
} {
  const contentTemplates = {
    blog: {
      title: 'How to Make $10K/Month with AI YouTube Automation (Real Numbers)',
      content: `Complete breakdown of how creators are making serious money with AI video automation...

[Introduction with hook]
[Problem statement]
[Solution with app features]
[Case studies]
[Step-by-step guide]
[Call to action]`,
      cta: 'Start Your 14-Day Free Trial →',
      seoKeywords: ['youtube automation', 'make money online', 'ai video creator', 'passive income']
    },
    social: {
      title: 'Quick Win Social Post',
      content: `Just helped another creator hit $5K in their first month 🚀

No editing skills.
No expensive equipment.
Just pure AI automation.

Want in? Link in bio 👇`,
      cta: 'DM me "START" for access'
    },
    email: {
      title: 'The 30-Day Money-Making Plan',
      content: `Hey [Name],

What if you could build a real income stream in 30 days?

Here's the exact blueprint 50,000+ creators are using...

[Value-packed content]
[Social proof]
[Clear next step]`,
      cta: 'Get Started Free →'
    }
  };

  return contentTemplates[type];
}

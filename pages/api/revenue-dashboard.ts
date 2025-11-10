// Revenue Dashboard API - Shows earnings and metrics
import { NextApiRequest, NextApiResponse } from 'next';
import RevenueManager from '../../lib/revenue-manager';

interface RevenueDashboardResponse {
  success: boolean;
  data?: {
    totalRevenue: number;
    monthlyRecurringRevenue: number;
    activeSubscriptions: number;
    churnRate: number;
    averageRevenuePerUser: number;
    growthRate: number;
    recentSubscriptions: Array<{
      userId: string;
      tier: string;
      amount: number;
      date: string;
      status: string;
    }>;
    topTiers: Array<{
      tier: string;
      subscribers: number;
      revenue: number;
      percentage: number;
    }>;
    projections: {
      nextMonthRevenue: number;
      nextYearRevenue: number;
      breakEvenPoint: string;
    };
  };
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RevenueDashboardResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    const revenueManager = new RevenueManager();
    
    // Get revenue metrics
    const metrics = await revenueManager.getRevenueMetrics();
    
    // Mock data for dashboard (would come from your database)
    const recentSubscriptions = [
      {
        userId: 'user_001',
        tier: 'Professional',
        amount: 79,
        date: '2025-10-24',
        status: 'active'
      },
      {
        userId: 'user_002', 
        tier: 'Starter',
        amount: 29,
        date: '2025-10-23',
        status: 'active'
      },
      {
        userId: 'user_003',
        tier: 'Enterprise',
        amount: 199,
        date: '2025-10-22',
        status: 'active'
      }
    ];

    const topTiers = [
      {
        tier: 'Professional',
        subscribers: 45,
        revenue: 3555,
        percentage: 65
      },
      {
        tier: 'Starter',
        subscribers: 23,
        revenue: 667,
        percentage: 25
      },
      {
        tier: 'Enterprise', 
        subscribers: 8,
        revenue: 1592,
        percentage: 10
      }
    ];

    // Calculate projections
    const currentMRR = metrics.monthlyRecurringRevenue;
    const growthRate = metrics.growthRate;
    
    const projections = {
      nextMonthRevenue: Math.round(currentMRR * (1 + growthRate)),
      nextYearRevenue: Math.round(currentMRR * Math.pow(1 + growthRate, 12)),
      breakEvenPoint: calculateBreakEven(currentMRR, growthRate)
    };

    const response: RevenueDashboardResponse = {
      success: true,
      data: {
        ...metrics,
        recentSubscriptions,
        topTiers,
        projections
      }
    };

    console.log('📊 Revenue Dashboard Data:');
    console.log(`💰 MRR: $${metrics.monthlyRecurringRevenue.toLocaleString()}`);
    console.log(`👥 Active Subscriptions: ${metrics.activeSubscriptions}`);
    console.log(`📈 Growth Rate: ${(metrics.growthRate * 100).toFixed(1)}%`);
    
    res.status(200).json(response);

  } catch (error) {
    console.error('Revenue dashboard error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch revenue data'
    });
  }
}

function calculateBreakEven(currentMRR: number, growthRate: number): string {
  // Assuming operational costs of $2000/month
  const operationalCosts = 2000;
  
  if (currentMRR >= operationalCosts) {
    return 'Already profitable';
  }
  
  if (growthRate <= 0) {
    return 'Growth needed';
  }
  
  // Calculate months to break even
  let mrr = currentMRR;
  let months = 0;
  
  while (mrr < operationalCosts && months < 24) {
    mrr *= (1 + growthRate);
    months++;
  }
  
  if (months >= 24) {
    return 'More than 2 years';
  }
  
  return `${months} months`;
}
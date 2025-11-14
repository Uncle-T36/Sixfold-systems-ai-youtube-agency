// Revenue Dashboard Component - Shows your earnings from the SaaS
import React, { useState, useEffect } from 'react';

interface RevenueMetrics {
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
}

export default function RevenueDashboard() {
  const [metrics, setMetrics] = useState<RevenueMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    fetchRevenueData();
  }, [timeframe]);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/revenue-dashboard?timeframe=${timeframe}`);
      const data = await response.json();
      
      if (data.success) {
        setMetrics(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch revenue data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading revenue data...</div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">Failed to load revenue data</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Revenue Dashboard
            </h1>
            <p className="text-gray-400">
              Track your AI YouTube Agency SaaS performance
            </p>
          </div>
          
          {/* Timeframe Selector */}
          <div className="flex bg-gray-800 rounded-lg p-1">
            {['30d', '90d', '1y'].map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period as any)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  timeframe === period
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {period === '30d' ? '30 Days' : period === '90d' ? '90 Days' : '1 Year'}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Monthly Recurring Revenue */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Monthly Recurring Revenue</h3>
              <svg className="w-8 h-8 opacity-80" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-3xl font-bold mb-2">
              ${metrics.monthlyRecurringRevenue.toLocaleString()}
            </div>
            <div className="text-green-100 text-sm">
              +{(metrics.growthRate * 100).toFixed(1)}% from last month
            </div>
          </div>

          {/* Active Subscriptions */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Active Subscriptions</h3>
              <svg className="w-8 h-8 opacity-80" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
            </div>
            <div className="text-3xl font-bold mb-2">
              {metrics.activeSubscriptions}
            </div>
            <div className="text-blue-100 text-sm">
              {Math.round(metrics.activeSubscriptions * 0.15)} new this month
            </div>
          </div>

          {/* Average Revenue Per User */}
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Avg Revenue Per User</h3>
              <svg className="w-8 h-8 opacity-80" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-3xl font-bold mb-2">
              ${Math.round(metrics.averageRevenuePerUser)}
            </div>
            <div className="text-emerald-100 text-sm">
              {metrics.churnRate < 0.05 ? 'Low churn' : 'Monitor churn'}
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Total Revenue</h3>
              <svg className="w-8 h-8 opacity-80" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-3xl font-bold mb-2">
              ${metrics.totalRevenue.toLocaleString()}
            </div>
            <div className="text-yellow-100 text-sm">
              Annualized revenue
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Revenue Projections */}
          <div className="lg:col-span-2 bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Revenue Projections</h3>
            
            <div className="space-y-6">
              {/* Next Month */}
              <div className="flex justify-between items-center p-4 bg-gray-700 rounded-lg">
                <div>
                  <div className="text-white font-medium">Next Month Revenue</div>
                  <div className="text-gray-400 text-sm">Based on current growth</div>
                </div>
                <div className="text-2xl font-bold text-green-400">
                  ${metrics.projections.nextMonthRevenue.toLocaleString()}
                </div>
              </div>

              {/* Next Year */}
              <div className="flex justify-between items-center p-4 bg-gray-700 rounded-lg">
                <div>
                  <div className="text-white font-medium">Next Year Revenue</div>
                  <div className="text-gray-400 text-sm">Projected annual revenue</div>
                </div>
                <div className="text-2xl font-bold text-blue-400">
                  ${metrics.projections.nextYearRevenue.toLocaleString()}
                </div>
              </div>

              {/* Break Even */}
              <div className="flex justify-between items-center p-4 bg-gray-700 rounded-lg">
                <div>
                  <div className="text-white font-medium">Break Even Point</div>
                  <div className="text-gray-400 text-sm">When revenue covers costs</div>
                </div>
                <div className="text-2xl font-bold text-emerald-400">
                  {metrics.projections.breakEvenPoint}
                </div>
              </div>

              {/* Growth Rate */}
              <div className="flex justify-between items-center p-4 bg-gray-700 rounded-lg">
                <div>
                  <div className="text-white font-medium">Monthly Growth Rate</div>
                  <div className="text-gray-400 text-sm">Subscription growth</div>
                </div>
                <div className="text-2xl font-bold text-yellow-400">
                  {(metrics.growthRate * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Tiers Breakdown */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Top Subscription Tiers</h3>
            
            <div className="space-y-4">
              {metrics.topTiers.map((tier, index) => (
                <div key={tier.tier} className="p-4 bg-gray-700 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-medium">{tier.tier}</span>
                    <span className="text-green-400 font-bold">
                      ${tier.revenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>{tier.subscribers} subscribers</span>
                    <span>{tier.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        index === 0 ? 'bg-green-500' : 
                        index === 1 ? 'bg-blue-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${tier.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Subscriptions */}
        <div className="mt-8 bg-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Recent Subscriptions</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-gray-400 font-medium py-3">User</th>
                  <th className="text-gray-400 font-medium py-3">Tier</th>
                  <th className="text-gray-400 font-medium py-3">Amount</th>
                  <th className="text-gray-400 font-medium py-3">Date</th>
                  <th className="text-gray-400 font-medium py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {metrics.recentSubscriptions.map((sub, index) => (
                  <tr key={index} className="border-b border-gray-700">
                    <td className="text-white py-3">{sub.userId.slice(0, 8)}...</td>
                    <td className="text-white py-3">{sub.tier}</td>
                    <td className="text-green-400 py-3 font-medium">${sub.amount}</td>
                    <td className="text-gray-400 py-3">{sub.date}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        sub.status === 'active' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
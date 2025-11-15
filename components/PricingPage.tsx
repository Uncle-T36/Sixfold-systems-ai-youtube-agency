// Pricing Page Component - Shows subscription tiers to potential customers
import React, { useState, useEffect } from 'react';

interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  channels: number;
  videosPerDay: number;
  features: string[];
  popular?: boolean;
  savings?: number;
  savingsText?: string;
  pricePerChannel?: number;
  pricePerVideo?: number;
}

interface PricingPageProps {
  onSelectPlan?: (tierId: string) => void;
}

export default function PricingPage({ onSelectPlan }: PricingPageProps) {
  const [tiers, setTiers] = useState<SubscriptionTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    fetchSubscriptionTiers();
  }, []);

  const fetchSubscriptionTiers = async () => {
    try {
      const response = await fetch('/api/subscription');
      const data = await response.json();
      
      if (data.success) {
        setTiers(data.tiers);
      }
    } catch (error) {
      console.error('Failed to fetch subscription tiers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTiers = tiers.filter(tier => 
    billingInterval === 'monthly' ? tier.interval === 'month' : tier.interval === 'year'
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-blue-900 to-teal-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading pricing...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-blue-900 to-teal-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Start Your AI YouTube Empire
          </h1>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto mb-8">
            Automate multiple YouTube channels with AI-powered content creation. 
            Generate viral videos, optimize for monetization, and scale your business.
          </p>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white/10 rounded-lg p-1 backdrop-blur-sm">
            <button
              onClick={() => setBillingInterval('monthly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                billingInterval === 'monthly'
                  ? 'bg-white text-emerald-900 shadow-md'
                  : 'text-white hover:text-emerald-200'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingInterval('yearly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                billingInterval === 'yearly'
                  ? 'bg-white text-emerald-900 shadow-md'
                  : 'text-white hover:text-emerald-200'
              }`}
            >
              Yearly
              <span className="ml-2 text-xs bg-green-400 text-green-900 px-2 py-1 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredTiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative bg-white/10 backdrop-blur-md rounded-2xl p-8 border transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                tier.popular
                  ? 'border-yellow-400 ring-2 ring-yellow-400/50 shadow-yellow-400/20'
                  : 'border-white/20 hover:border-white/40'
              }`}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-1 rounded-full text-sm font-bold">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Tier Name */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                <div className="text-4xl font-bold text-white">
                  ${tier.price}
                  <span className="text-lg text-blue-200">/{tier.interval}</span>
                </div>
                {tier.savingsText && (
                  <div className="text-green-400 text-sm mt-2 font-medium">
                    {tier.savingsText}
                  </div>
                )}
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-white/5 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{tier.channels}</div>
                  <div className="text-xs text-blue-200">Channels</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{tier.videosPerDay}</div>
                  <div className="text-xs text-blue-200">Videos/Day</div>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-white text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Value Propositions */}
              <div className="text-xs text-blue-200 mb-6 space-y-1">
                <div>💰 ${tier.pricePerChannel}/month per channel</div>
                <div>📹 ${tier.pricePerVideo}/month per video</div>
                <div>🎯 ROI: Break even at 1K subs per channel</div>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => onSelectPlan?.(tier.id)}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                  tier.popular
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-300 hover:to-orange-400 shadow-lg hover:shadow-xl'
                    : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
                }`}
              >
                Start {tier.name} Plan
              </button>

              {/* Trial Notice */}
              <div className="text-center mt-3 text-xs text-blue-200">
                7-day free trial • Cancel anytime
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="text-center mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">10+</div>
              <div className="text-sm text-blue-200">Free AI Tools</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">$0</div>
              <div className="text-sm text-blue-200">Additional Costs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">24/7</div>
              <div className="text-sm text-blue-200">Automation</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">6 Mo</div>
              <div className="text-sm text-blue-200">To Monetization</div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                q: "How quickly can I start earning?",
                a: "Most users reach YouTube monetization requirements (1K subs, 4K watch hours) within 3-6 months per channel."
              },
              {
                q: "What if I'm not satisfied?",
                a: "7-day free trial and 30-day money-back guarantee. Cancel anytime with no penalties."
              },
              {
                q: "Do I need technical skills?", 
                a: "No coding required. Our AI handles script writing, video creation, and YouTube optimization automatically."
              },
              {
                q: "How much can I earn?",
                a: "YouTube monetization varies, but channels typically earn $1-5 per 1K views. Our users average $500-2000/month per channel."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md rounded-lg p-6">
                <h3 className="text-white font-semibold mb-2">{faq.q}</h3>
                <p className="text-blue-200 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Build Your AI YouTube Empire?
          </h2>
          <p className="text-blue-200 mb-8 max-w-2xl mx-auto">
            Join successful creators who are already using AI to automate their YouTube channels 
            and generate passive income. Start your free trial today.
          </p>
          <button
            onClick={() => onSelectPlan?.('professional')}
            className="bg-gradient-to-r from-emerald-500 to-yellow-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-emerald-400 hover:to-yellow-400 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Start Free Trial Now
          </button>
        </div>
      </div>
    </div>
  );
}

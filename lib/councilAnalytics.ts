/**
 * 📊 COUNCIL ANALYTICS ENGINE
 * Tracks Council recommendations performance and ROI
 */

export interface CouncilRecommendation {
  id: string;
  type: 'create-channel' | 'scrape-stories' | 'optimize-channel' | 'generate-video';
  recommendation: string;
  implementedAt: string;
  channelId?: string;
  channelName?: string;
  status: 'pending' | 'implemented' | 'success' | 'failed';
  expectedRevenue?: number;
  actualRevenue?: number;
  roi?: number;
}

export interface CouncilPerformanceMetrics {
  totalRecommendations: number;
  implementedRecommendations: number;
  successfulRecommendations: number;
  failedRecommendations: number;
  totalExpectedRevenue: number;
  totalActualRevenue: number;
  overallROI: number;
  topPerformingRecommendation: string;
  recommendationsByType: Record<string, number>;
}

/**
 * 📝 LOG COUNCIL RECOMMENDATION
 */
export function logCouncilRecommendation(
  type: CouncilRecommendation['type'],
  recommendation: string,
  channelId?: string,
  channelName?: string,
  expectedRevenue?: number
): string {
  const recommendations = getCouncilRecommendations();
  
  const newRec: CouncilRecommendation = {
    id: `council-rec-${Date.now()}`,
    type,
    recommendation,
    implementedAt: new Date().toISOString(),
    channelId,
    channelName,
    status: 'implemented',
    expectedRevenue,
    actualRevenue: 0,
    roi: 0
  };
  
  recommendations.push(newRec);
  localStorage.setItem('council_recommendations', JSON.stringify(recommendations));
  
  return newRec.id;
}

/**
 * 📈 UPDATE RECOMMENDATION STATUS
 */
export function updateRecommendationStatus(
  recommendationId: string,
  status: CouncilRecommendation['status'],
  actualRevenue?: number
): void {
  const recommendations = getCouncilRecommendations();
  const rec = recommendations.find(r => r.id === recommendationId);
  
  if (rec) {
    rec.status = status;
    if (actualRevenue !== undefined) {
      rec.actualRevenue = actualRevenue;
      if (rec.expectedRevenue) {
        rec.roi = ((actualRevenue - rec.expectedRevenue) / rec.expectedRevenue) * 100;
      }
    }
    localStorage.setItem('council_recommendations', JSON.stringify(recommendations));
  }
}

/**
 * 📊 GET COUNCIL PERFORMANCE METRICS
 */
export function getCouncilPerformanceMetrics(): CouncilPerformanceMetrics {
  const recommendations = getCouncilRecommendations();
  
  const metrics: CouncilPerformanceMetrics = {
    totalRecommendations: recommendations.length,
    implementedRecommendations: recommendations.filter(r => r.status === 'implemented' || r.status === 'success').length,
    successfulRecommendations: recommendations.filter(r => r.status === 'success').length,
    failedRecommendations: recommendations.filter(r => r.status === 'failed').length,
    totalExpectedRevenue: recommendations.reduce((sum, r) => sum + (r.expectedRevenue || 0), 0),
    totalActualRevenue: recommendations.reduce((sum, r) => sum + (r.actualRevenue || 0), 0),
    overallROI: 0,
    topPerformingRecommendation: '',
    recommendationsByType: {}
  };
  
  // Calculate overall ROI
  if (metrics.totalExpectedRevenue > 0) {
    metrics.overallROI = ((metrics.totalActualRevenue - metrics.totalExpectedRevenue) / metrics.totalExpectedRevenue) * 100;
  }
  
  // Find top performing recommendation
  const successfulRecs = recommendations.filter(r => r.status === 'success' && r.actualRevenue);
  if (successfulRecs.length > 0) {
    const topRec = successfulRecs.sort((a, b) => (b.actualRevenue || 0) - (a.actualRevenue || 0))[0];
    metrics.topPerformingRecommendation = topRec.recommendation;
  }
  
  // Count by type
  recommendations.forEach(rec => {
    metrics.recommendationsByType[rec.type] = (metrics.recommendationsByType[rec.type] || 0) + 1;
  });
  
  return metrics;
}

/**
 * 📋 GET ALL RECOMMENDATIONS
 */
export function getCouncilRecommendations(): CouncilRecommendation[] {
  const data = localStorage.getItem('council_recommendations');
  return data ? JSON.parse(data) : [];
}

/**
 * 🗑️ CLEAR OLD RECOMMENDATIONS (older than 90 days)
 */
export function clearOldRecommendations(): number {
  const recommendations = getCouncilRecommendations();
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  
  const filtered = recommendations.filter(rec => {
    const recDate = new Date(rec.implementedAt);
    return recDate > ninetyDaysAgo;
  });
  
  const removed = recommendations.length - filtered.length;
  localStorage.setItem('council_recommendations', JSON.stringify(filtered));
  
  return removed;
}

/**
 * 📊 EXPORT ANALYTICS DATA
 */
export function exportCouncilAnalytics(): string {
  const recommendations = getCouncilRecommendations();
  const metrics = getCouncilPerformanceMetrics();
  
  return JSON.stringify({
    exportDate: new Date().toISOString(),
    metrics,
    recommendations
  }, null, 2);
}

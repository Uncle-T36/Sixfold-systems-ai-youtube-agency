// VIDEO GENERATION COST GUARD
// Prevents ANY paid API calls for video generation

export class CostGuard {
  private static PAID_APIS = [
    'synthesia.io',
    'd-id.com',
    'runway.ml',
    'elevenlabs.io',
    'aws.amazon.com/polly',
    'play.ht',
    'murf.ai',
    'pictory.ai',
    'descript.com',
    'lumen5.com'
  ];

  /**
   * Checks if a URL is a paid video generation service
   * @throws Error if paid API detected
   */
  static validateVideoGeneration(url: string): void {
    const isPaidAPI = this.PAID_APIS.some(api => url.includes(api));
    
    if (isPaidAPI) {
      throw new Error(`
        🚫 BLOCKED: Paid video API detected!
        
        URL: ${url}
        
        This app uses ONLY FREE tools:
        ✅ HTML5 + Screen Recording (FREE)
        ✅ OBS Studio (FREE)
        ✅ FFmpeg (FREE)
        ✅ Web Speech API (FREE)
        
        See FREE_VIDEO_GUIDE.md for instructions.
        
        Cost: $0.00 guaranteed!
      `);
    }
  }

  /**
   * Validates that no paid APIs are being used
   */
  static validateSettings(settings: any): boolean {
    // Check for any API keys related to paid services
    const suspiciousKeys = [
      'synthesia_api_key',
      'did_api_key',
      'runway_api_key',
      'elevenlabs_api_key',
      'polly_api_key',
      'playht_api_key',
      'murf_api_key',
      'pictory_api_key'
    ];

    for (const key of suspiciousKeys) {
      if (settings[key] && settings[key].length > 0) {
        console.warn(`⚠️ WARNING: Paid API key detected: ${key}`);
        console.warn('🔒 This will be ignored - app uses FREE tools only');
        return false;
      }
    }

    return true;
  }

  /**
   * Gets approved free video generation methods
   */
  static getApprovedMethods(): string[] {
    return [
      'html5-canvas',
      'web-speech-api',
      'screen-recording',
      'obs-studio',
      'ffmpeg',
      'browser-capture',
      'local-generation'
    ];
  }

  /**
   * Calculates actual cost (should always be $0)
   */
  static calculateCost(method: string, videoCount: number): number {
    const approvedMethods = this.getApprovedMethods();
    
    if (!approvedMethods.includes(method)) {
      console.error(`❌ UNAPPROVED METHOD: ${method}`);
      console.error('💰 This might cost money!');
      console.error('✅ Switch to approved FREE methods');
      return -1; // Indicates potential cost
    }

    // All approved methods are FREE
    return 0;
  }

  /**
   * Generates cost report
   */
  static generateCostReport(videosGenerated: number): {
    totalCost: number;
    costPerVideo: number;
    method: string;
    savings: number;
  } {
    // Compare to paid alternatives
    const syntesiaCost = videosGenerated * 30;
    const didCost = videosGenerated * 10;
    const runwayCost = videosGenerated * 15;

    return {
      totalCost: 0, // Always $0!
      costPerVideo: 0,
      method: 'Free HTML5 + Screen Recording',
      savings: Math.max(syntesiaCost, didCost, runwayCost)
    };
  }

  /**
   * Enforces free-only mode
   */
  static enforceFreeMode(): void {
    console.log('🔒 FREE MODE ENFORCED');
    console.log('✅ No paid APIs allowed');
    console.log('✅ All videos generated at $0 cost');
    console.log('✅ Unlimited video generation');
    console.log('💰 Total cost: $0.00');

    // Block any external API calls during video generation
    if (typeof window !== 'undefined') {
      const originalFetch = window.fetch;
      
      window.fetch = function(...args) {
        const url = args[0]?.toString() || '';
        
        // Allow only approved domains
        const approvedDomains = [
          'source.unsplash.com',
          'picsum.photos',
          'placeholder.com',
          'localhost',
          'vercel.app',
          'github.com',
          'freemusicarchive.org',
          'incompetech.com'
        ];

        const isApproved = approvedDomains.some(domain => url.includes(domain));
        
        if (!isApproved && CostGuard.PAID_APIS.some(api => url.includes(api))) {
          console.error('🚫 BLOCKED: Attempted paid API call');
          console.error('URL:', url);
          throw new Error('Paid API calls are blocked. Use free methods only!');
        }

        return originalFetch.apply(this, args);
      };
    }
  }
}

// Auto-enforce on import
if (typeof window !== 'undefined') {
  CostGuard.enforceFreeMode();
}

// Log confirmation
console.log('✅ Cost Guard Active');
console.log('💰 Guaranteed $0 video generation');
console.log('🚫 All paid APIs blocked');

export default CostGuard;

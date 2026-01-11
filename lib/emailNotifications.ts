/**
 * Email Notification System
 * Sends emails for important events using Resend
 */

// For Resend, install: npm install resend

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface SendResult {
  success: boolean;
  id?: string;
  error?: string;
}

// Email templates
export const emailTemplates = {
  welcome: (name: string) => ({
    subject: 'Welcome to AI YouTube Agency! 🎬',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #00563F, #007FFF); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Welcome to AI YouTube Agency</h1>
        </div>
        <div style="padding: 30px; background: #1a1a2e; color: #fff;">
          <h2 style="color: #FFD700;">Hey ${name}! 👋</h2>
          <p>Thanks for joining AI YouTube Agency. You now have access to:</p>
          <ul style="line-height: 2;">
            <li>🎬 AI-powered video generation</li>
            <li>📊 Channel analytics dashboard</li>
            <li>🚀 Auto-upload to multiple channels</li>
            <li>📈 Growth optimization tools</li>
          </ul>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
             style="display: inline-block; background: #00563F; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin-top: 20px;">
            Go to Dashboard →
          </a>
        </div>
        <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
          <p>AI YouTube Agency - Automate Your YouTube Empire</p>
        </div>
      </div>
    `,
  }),

  subscriptionConfirmed: (name: string, plan: string) => ({
    subject: `Your ${plan} subscription is active! 🎉`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #00563F, #007FFF); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Subscription Confirmed!</h1>
        </div>
        <div style="padding: 30px; background: #1a1a2e; color: #fff;">
          <h2 style="color: #FFD700;">Hey ${name}! 🎉</h2>
          <p>Your <strong>${plan}</strong> subscription is now active!</p>
          <div style="background: #2a2a4e; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #00563F; margin-top: 0;">What's included:</h3>
            <ul style="line-height: 2;">
              <li>✅ Unlimited video generation</li>
              <li>✅ Priority support</li>
              <li>✅ Advanced analytics</li>
              <li>✅ Multi-channel management</li>
            </ul>
          </div>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
             style="display: inline-block; background: #FFD700; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
            Start Creating Videos →
          </a>
        </div>
      </div>
    `,
  }),

  paymentFailed: (name: string) => ({
    subject: 'Payment failed - Action required ⚠️',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #dc3545; padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Payment Failed</h1>
        </div>
        <div style="padding: 30px; background: #1a1a2e; color: #fff;">
          <h2>Hey ${name},</h2>
          <p>We couldn't process your latest payment. Please update your payment method to continue using AI YouTube Agency.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/settings" 
             style="display: inline-block; background: #dc3545; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin-top: 20px;">
            Update Payment Method →
          </a>
          <p style="margin-top: 30px; color: #999;">If you have questions, reply to this email.</p>
        </div>
      </div>
    `,
  }),

  videoUploaded: (channelName: string, videoTitle: string, videoUrl: string) => ({
    subject: `Video uploaded to ${channelName}! 🎬`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #00563F, #007FFF); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Video Uploaded! 🎬</h1>
        </div>
        <div style="padding: 30px; background: #1a1a2e; color: #fff;">
          <p>Your video has been successfully uploaded:</p>
          <div style="background: #2a2a4e; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #FFD700; margin-top: 0;">${videoTitle}</h3>
            <p style="color: #999;">Channel: ${channelName}</p>
          </div>
          <a href="${videoUrl}" 
             style="display: inline-block; background: #FF0000; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px;">
            View on YouTube →
          </a>
        </div>
      </div>
    `,
  }),

  weeklyReport: (name: string, stats: { views: number; subs: number; revenue: number }) => ({
    subject: 'Your weekly YouTube report 📊',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #00563F, #007FFF); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Weekly Report 📊</h1>
        </div>
        <div style="padding: 30px; background: #1a1a2e; color: #fff;">
          <h2 style="color: #FFD700;">Hey ${name}! Here's your week:</h2>
          <div style="display: flex; justify-content: space-around; text-align: center; margin: 30px 0;">
            <div style="background: #2a2a4e; padding: 20px; border-radius: 8px; flex: 1; margin: 0 5px;">
              <div style="font-size: 32px; color: #00563F; font-weight: bold;">${stats.views.toLocaleString()}</div>
              <div style="color: #999;">Views</div>
            </div>
            <div style="background: #2a2a4e; padding: 20px; border-radius: 8px; flex: 1; margin: 0 5px;">
              <div style="font-size: 32px; color: #007FFF; font-weight: bold;">+${stats.subs}</div>
              <div style="color: #999;">Subscribers</div>
            </div>
            <div style="background: #2a2a4e; padding: 20px; border-radius: 8px; flex: 1; margin: 0 5px;">
              <div style="font-size: 32px; color: #FFD700; font-weight: bold;">$${stats.revenue}</div>
              <div style="color: #999;">Revenue</div>
            </div>
          </div>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/analytics" 
             style="display: inline-block; background: #00563F; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px;">
            View Full Analytics →
          </a>
        </div>
      </div>
    `,
  }),
};

/**
 * Send email using Resend
 */
export async function sendEmail(options: EmailOptions): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.EMAIL_FROM || 'AI YouTube Agency <noreply@aiyoutubeagency.com>';

  // If no API key, log and skip
  if (!apiKey) {
    console.log('📧 Email would be sent (Resend not configured):');
    console.log(`   To: ${options.to}`);
    console.log(`   Subject: ${options.subject}`);
    return { success: true, id: 'demo_' + Date.now() };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Email send failed:', data);
      return { success: false, error: data.message || 'Failed to send email' };
    }

    console.log(`✅ Email sent: ${options.subject} → ${options.to}`);
    return { success: true, id: data.id };

  } catch (error: any) {
    console.error('Email error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send welcome email to new user
 */
export async function sendWelcomeEmail(email: string, name: string): Promise<SendResult> {
  const template = emailTemplates.welcome(name);
  return sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
  });
}

/**
 * Send subscription confirmation email
 */
export async function sendSubscriptionEmail(email: string, name: string, plan: string): Promise<SendResult> {
  const template = emailTemplates.subscriptionConfirmed(name, plan);
  return sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
  });
}

/**
 * Send payment failed email
 */
export async function sendPaymentFailedEmail(email: string, name: string): Promise<SendResult> {
  const template = emailTemplates.paymentFailed(name);
  return sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
  });
}

/**
 * Send video uploaded notification
 */
export async function sendVideoUploadedEmail(
  email: string, 
  channelName: string, 
  videoTitle: string, 
  videoUrl: string
): Promise<SendResult> {
  const template = emailTemplates.videoUploaded(channelName, videoTitle, videoUrl);
  return sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
  });
}

/**
 * Send weekly report email
 */
export async function sendWeeklyReportEmail(
  email: string, 
  name: string, 
  stats: { views: number; subs: number; revenue: number }
): Promise<SendResult> {
  const template = emailTemplates.weeklyReport(name, stats);
  return sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
  });
}

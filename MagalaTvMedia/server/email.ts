import { MailService } from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

if (!process.env.EMAIL_FROM) {
  throw new Error("EMAIL_FROM environment variable must be set");
}

const mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY);

interface EmailParams {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    await mailService.send({
      to: params.to,
      from: process.env.EMAIL_FROM as string,
      subject: params.subject,
      text: params.text,
      html: params.html,
    });
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

// Email Templates
export const emailTemplates = {
  welcome: (name: string, verificationLink: string) => ({
    subject: "Welcome to Magala Media - Verify Your Email",
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Magala Media</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Your trusted source for Uganda news</p>
        </div>
        <div style="padding: 40px 20px; background: white;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${name}!</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
            Thank you for joining Magala Media House. To start receiving news updates and notifications, 
            please verify your email address by clicking the button below.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" 
               style="background: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              Verify Email Address
            </a>
          </div>
          <p style="color: #666; line-height: 1.6; font-size: 14px;">
            If you didn't create an account, you can safely ignore this email.
          </p>
        </div>
        <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px;">
          <p>© 2025 Magala Media House. Kampala, Uganda</p>
        </div>
      </div>
    `,
    text: `Welcome to Magala Media, ${name}! Please verify your email: ${verificationLink}`
  }),

  passwordReset: (name: string, resetLink: string) => ({
    subject: "Reset Your Magala Media Password",
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Password Reset</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Magala Media House</p>
        </div>
        <div style="padding: 40px 20px; background: white;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${name}</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
            We received a request to reset your password. Click the button below to create a new password.
            This link will expire in 1 hour for security reasons.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background: #FF6B6B; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p style="color: #666; line-height: 1.6; font-size: 14px;">
            If you didn't request this reset, please ignore this email. Your password will remain unchanged.
          </p>
        </div>
        <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px;">
          <p>© 2025 Magala Media House. Kampala, Uganda</p>
        </div>
      </div>
    `,
    text: `Reset your Magala Media password: ${resetLink}`
  }),

  breakingNews: (title: string, excerpt: string, articleUrl: string) => ({
    subject: `🚨 BREAKING: ${title}`,
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: #dc2626; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🚨 BREAKING NEWS</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0;">Magala Media House</p>
        </div>
        <div style="padding: 30px 20px; background: white;">
          <h2 style="color: #333; margin-bottom: 15px; line-height: 1.3;">${title}</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">${excerpt}</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${articleUrl}" 
               style="background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              Read Full Story
            </a>
          </div>
        </div>
        <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px;">
          <p>© 2025 Magala Media House. Kampala, Uganda</p>
          <p><a href="#" style="color: #666;">Unsubscribe from breaking news alerts</a></p>
        </div>
      </div>
    `,
    text: `BREAKING: ${title}\n\n${excerpt}\n\nRead more: ${articleUrl}`
  }),

  weeklyDigest: (articles: Array<{title: string; excerpt: string; url: string}>) => ({
    subject: "Your Weekly News Digest from Magala Media",
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Weekly Digest</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Top stories from Uganda</p>
        </div>
        <div style="padding: 30px 20px; background: white;">
          <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
            Here are the most important stories from this week:
          </p>
          ${articles.map(article => `
            <div style="border-left: 4px solid #667eea; padding-left: 20px; margin-bottom: 25px;">
              <h3 style="color: #333; margin: 0 0 10px 0; line-height: 1.3;">
                <a href="${article.url}" style="color: #333; text-decoration: none;">${article.title}</a>
              </h3>
              <p style="color: #666; line-height: 1.5; margin: 0;">${article.excerpt}</p>
            </div>
          `).join('')}
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://magalamedia.com" 
               style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              Visit Magala Media
            </a>
          </div>
        </div>
        <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px;">
          <p>© 2025 Magala Media House. Kampala, Uganda</p>
          <p><a href="#" style="color: #666;">Manage email preferences</a></p>
        </div>
      </div>
    `,
    text: `Weekly Digest from Magala Media\n\n${articles.map(a => `${a.title}\n${a.excerpt}\n${a.url}\n`).join('\n')}`
  })
};
import { sendMail } from '../config/nodemailer.config';
import { env } from '../config/env.config';

/**
 * Base HTML email template with CareerHub branding.
 */
function baseTemplate(content: string, preheader = ''): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${env.APP_NAME}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <span style="display:none;max-height:0;overflow:hidden;">${preheader}</span>
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:32px 40px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:700;letter-spacing:-0.5px;">${env.APP_NAME}</h1>
              <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:13px;">AI-Powered Career Platform</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f8f9fa;padding:24px 40px;text-align:center;border-top:1px solid #e9ecef;">
              <p style="color:#6c757d;font-size:12px;margin:0;">
                &copy; ${new Date().getFullYear()} ${env.APP_NAME}. All rights reserved.<br/>
                <a href="${env.CLIENT_URL}/settings" style="color:#6366f1;text-decoration:none;">Unsubscribe</a> · 
                <a href="${env.CLIENT_URL}/privacy" style="color:#6366f1;text-decoration:none;">Privacy Policy</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Send OTP email for email verification.
 */
export async function sendEmailVerificationOtp(email: string, otp: string, name: string): Promise<void> {
  await sendMail({
    to: email,
    subject: `Verify your email — ${env.APP_NAME}`,
    html: baseTemplate(`
      <h2 style="color:#1a1a2e;font-size:22px;font-weight:700;margin:0 0 16px;">Welcome to ${env.APP_NAME}! 👋</h2>
      <p style="color:#4b5563;font-size:15px;line-height:1.6;margin:0 0 24px;">Hi ${name}, please verify your email address using the OTP below:</p>
      <div style="background:#f3f4f6;border-radius:12px;padding:24px;text-align:center;margin:0 0 24px;">
        <p style="color:#6b7280;font-size:13px;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">Your verification code</p>
        <span style="color:#6366f1;font-size:40px;font-weight:800;letter-spacing:8px;">${otp}</span>
        <p style="color:#9ca3af;font-size:12px;margin:8px 0 0;">Expires in 10 minutes</p>
      </div>
      <p style="color:#9ca3af;font-size:13px;margin:0;">If you didn't create an account, you can safely ignore this email.</p>
    `, 'Your verification code is ready'),
  });
}

/**
 * Send password reset email.
 */
export async function sendPasswordResetEmail(email: string, resetUrl: string, name: string): Promise<void> {
  await sendMail({
    to: email,
    subject: `Reset your password — ${env.APP_NAME}`,
    html: baseTemplate(`
      <h2 style="color:#1a1a2e;font-size:22px;font-weight:700;margin:0 0 16px;">Reset your password</h2>
      <p style="color:#4b5563;font-size:15px;line-height:1.6;margin:0 0 24px;">Hi ${name}, we received a request to reset your password. Click the button below to create a new password:</p>
      <div style="text-align:center;margin:0 0 24px;">
        <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:15px;">Reset Password</a>
      </div>
      <p style="color:#6b7280;font-size:13px;margin:0 0 8px;">Or copy this link:</p>
      <p style="color:#6366f1;font-size:13px;word-break:break-all;margin:0 0 24px;">${resetUrl}</p>
      <p style="color:#9ca3af;font-size:13px;margin:0;">This link expires in 1 hour. If you didn't request a password reset, please ignore this email.</p>
    `, 'Reset your CareerHub AI password'),
  });
}

/**
 * Send welcome email after successful registration.
 */
export async function sendWelcomeEmail(email: string, name: string): Promise<void> {
  await sendMail({
    to: email,
    subject: `Welcome to ${env.APP_NAME}! 🚀`,
    html: baseTemplate(`
      <h2 style="color:#1a1a2e;font-size:22px;font-weight:700;margin:0 0 16px;">You're all set, ${name}! 🎉</h2>
      <p style="color:#4b5563;font-size:15px;line-height:1.6;margin:0 0 24px;">Your account is verified and ready to go. Start exploring everything CareerHub AI has to offer:</p>
      <ul style="color:#4b5563;font-size:15px;line-height:2;padding-left:20px;margin:0 0 24px;">
        <li>📄 Build your ATS-optimized resume</li>
        <li>🤖 Get AI-powered career advice</li>
        <li>💼 Track your job applications</li>
        <li>🎯 Practice mock interviews</li>
      </ul>
      <div style="text-align:center;">
        <a href="${env.CLIENT_URL}/dashboard" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:15px;">Go to Dashboard</a>
      </div>
    `, 'Your CareerHub AI journey starts now'),
  });
}

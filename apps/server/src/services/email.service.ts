import { sendMail, SendMailOptions } from '../config/nodemailer.config';
import { env } from '../config/env.config';
import { logger } from '../utils/logger.util';

export interface EmailPayload {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  /**
   * Send transactional email using configured provider (SMTP or Brevo).
   */
  static async sendEmail(payload: EmailPayload): Promise<void> {
    if (env.EMAIL_PROVIDER === 'brevo' && env.BREVO_API_KEY) {
      return this.sendViaBrevo(payload);
    }
    return this.sendViaSmtp(payload);
  }

  /**
   * SMTP Transport (Gmail / Custom SMTP)
   */
  private static async sendViaSmtp(payload: EmailPayload): Promise<void> {
    logger.info(`Sending email via SMTP to: ${Array.isArray(payload.to) ? payload.to.join(', ') : payload.to}`);
    const options: SendMailOptions = {
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    };
    await sendMail(options);
  }

  /**
   * Brevo API Transport abstraction
   */
  private static async sendViaBrevo(payload: EmailPayload): Promise<void> {
    logger.info(`Sending email via Brevo API to: ${Array.isArray(payload.to) ? payload.to.join(', ') : payload.to}`);
    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'api-key': env.BREVO_API_KEY || '',
        },
        body: JSON.stringify({
          sender: { name: env.EMAIL_FROM_NAME, email: env.EMAIL_FROM_ADDRESS },
          to: Array.isArray(payload.to) ? payload.to.map((e) => ({ email: e })) : [{ email: payload.to }],
          subject: payload.subject,
          htmlContent: payload.html,
          textContent: payload.text,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Brevo API error: ${response.status} - ${errorText}`);
      }
    } catch (err) {
      logger.error('Failed to send email via Brevo API, falling back to SMTP:', err);
      await this.sendViaSmtp(payload);
    }
  }

  /**
   * Send OTP Verification Code
   */
  static async sendOtpEmail(to: string, otp: string, purpose: string): Promise<void> {
    const subject = `Your ${env.APP_NAME} Verification Code`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #2563eb;">${env.APP_NAME} Verification</h2>
        <p>Use the code below to complete your ${purpose}:</p>
        <div style="background: #f3f4f6; font-size: 32px; font-weight: bold; letter-spacing: 4px; padding: 16px; text-align: center; border-radius: 6px; margin: 20px 0;">
          ${otp}
        </div>
        <p style="color: #6b7280; font-size: 14px;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
      </div>
    `;
    await this.sendEmail({ to, subject, html });
  }
}

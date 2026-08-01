import nodemailer from 'nodemailer';

import { env } from './env.config';
import { logger } from '../utils/logger.util';

let transporter: nodemailer.Transporter | null = null;

/**
 * Initialize the Nodemailer transporter (call once on app startup).
 */
export function initMailer(): void {
  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: env.NODE_ENV === 'production',
    },
  });

  logger.info('✅ Email transporter configured');
}

/**
 * Get the Nodemailer transporter instance.
 */
export function getMailer(): nodemailer.Transporter {
  if (!transporter) {
    throw new Error('Email transporter not initialized. Call initMailer() first.');
  }
  return transporter;
}

export interface SendMailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

/**
 * Send an email via the configured transporter.
 */
export async function sendMail(options: SendMailOptions): Promise<void> {
  const mailer = getMailer();
  await mailer.sendMail({
    from: `"${env.EMAIL_FROM_NAME}" <${env.EMAIL_FROM_ADDRESS}>`,
    to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
    replyTo: options.replyTo,
  });
}

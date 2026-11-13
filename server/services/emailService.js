import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

let cachedTransporter = null;

function getTransporter() {
  if (!env.smtpHost || !env.smtpUser || !env.smtpPass) {
    return null;
  }
  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort,
      secure: env.smtpSecure,
      auth: {
        user: env.smtpUser,
        pass: env.smtpPass,
      },
    });
  }
  return cachedTransporter;
}

export async function sendContactNotification(contactRecord) {
  const transporter = getTransporter();
  if (!transporter || !env.contactRecipientEmail) {
    return { sent: false, channel: 'database_only' };
  }

  try {
    await transporter.sendMail({
      from: env.smtpUser,
      to: env.contactRecipientEmail,
      replyTo: contactRecord.email,
      subject: `[FCIT Contact] ${contactRecord.subject}`,
      text: [
        `Name: ${contactRecord.name}`,
        `Email: ${contactRecord.email}`,
        `Category: ${contactRecord.category}`,
        '',
        contactRecord.message,
      ].join('\n'),
    });
    return { sent: true, channel: 'smtp' };
  } catch (err) {
    console.warn('[FCIT Email] Optional SMTP delivery failed:', err.message);
    return { sent: false, channel: 'database_fallback' };
  }
}

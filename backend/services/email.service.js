const nodemailer = require('nodemailer');

const getTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.SMTP_HOST) {
    console.warn(`[WARN] SMTP not configured. Skipping email to ${to}: "${subject}"`);
    return;
  }
  const transporter = getTransporter();
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'noreply@aiinterview.com',
    to,
    subject,
    html,
  });
};

const sendPasswordResetEmail = (to, resetUrl) =>
  sendEmail({
    to,
    subject: 'Reset your password',
    html: `<p>You requested a password reset.</p><p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 15 minutes.</p><p>If you did not request this, ignore this email.</p>`,
  });

const sendWelcomeEmail = (to, name) =>
  sendEmail({
    to,
    subject: 'Welcome to AI Interview Prep',
    html: `<p>Hi ${name},</p><p>Welcome aboard! Start practicing your first AI-powered mock interview now.</p>`,
  });

module.exports = { sendEmail, sendPasswordResetEmail, sendWelcomeEmail };

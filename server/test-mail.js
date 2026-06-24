/**
 * One-off SMTP check. Run after filling SMTP_PASS in .env:
 *   node --env-file=.env test-mail.js
 * Sends a test message to LEAD_EMAIL_TO and prints the result.
 */
import nodemailer from 'nodemailer';

const { SMTP_HOST, SMTP_USER, SMTP_PASS, LEAD_EMAIL_TO } = process.env;
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587;
const LEAD_EMAIL_FROM = process.env.LEAD_EMAIL_FROM || SMTP_USER;

if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
  console.error('Missing SMTP_HOST / SMTP_USER / SMTP_PASS in .env');
  process.exit(1);
}

const mailer = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
});

try {
  await mailer.verify();
  console.log(`SMTP connection OK (${SMTP_HOST}:${SMTP_PORT}, secure=${SMTP_PORT === 465})`);
  const info = await mailer.sendMail({
    from: LEAD_EMAIL_FROM,
    to: LEAD_EMAIL_TO || SMTP_USER,
    subject: 'flickflauder — SMTP Test',
    text: 'Wenn Sie das lesen, funktioniert der Mailversand.',
  });
  console.log('Test email sent:', info.messageId);
} catch (err) {
  console.error('SMTP test failed:', err?.message || err);
  console.error('If this is a TLS/port error, try SMTP_PORT=587 (or 465) in .env.');
  process.exit(1);
}

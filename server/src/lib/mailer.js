/**
 * Email transport + templates (Nodemailer).
 * If SMTP_HOST is not set, emails are logged to the console instead of sent,
 * so the app runs end-to-end with zero email config in dev.
 * See /docs/payments.md (receipts) and /docs/architecture.md.
 */
import nodemailer from 'nodemailer';
import { env } from './env.js';

let transporter = null;

function getTransport() {
  if (transporter) return transporter;
  if (!env.smtp.host) {
    // Console transport — prints the email instead of sending.
    transporter = {
      sendMail: async (msg) => {
        // eslint-disable-next-line no-console
        console.log('\n[mailer:console] (set SMTP_HOST to send for real)\n', {
          to: msg.to,
          subject: msg.subject,
        });
        return { messageId: 'console' };
      },
    };
    return transporter;
  }
  transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.secure,
    auth: env.smtp.user ? { user: env.smtp.user, pass: env.smtp.pass } : undefined,
  });
  return transporter;
}

export async function sendMail({ to, subject, html, text }) {
  return getTransport().sendMail({ from: env.smtp.from, to, subject, html, text });
}

const inr = (paise) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(
    paise / 100
  );

const shell = (title, inner) => `
<div style="font-family:Arial,Helvetica,sans-serif;background:#F6F4ED;padding:32px">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:14px;overflow:hidden;border:1px solid #e6e2d6">
    <div style="background:#103B33;color:#F6F4ED;padding:22px 28px">
      <div style="font-size:13px;letter-spacing:2px;text-transform:uppercase;opacity:.8">Aarogya Foundation</div>
      <div style="font-size:20px;font-weight:bold;margin-top:4px">${title}</div>
    </div>
    <div style="padding:28px;color:#103B33;font-size:15px;line-height:1.6">${inner}</div>
    <div style="padding:18px 28px;background:#F6F4ED;color:#5B6B66;font-size:12px">
      Aarogya Foundation · Reg. No. BR/2014/0098765 · 80G &amp; 12A registered<br/>
      Patna, Bihar, India · ${env.clientUrl}
    </div>
  </div>
</div>`;

export async function sendDonationReceipt(donation) {
  const html = shell(
    'Thank you for your gift 💚',
    `<p>Dear ${donation.donorName},</p>
     <p>We gratefully acknowledge your ${donation.frequency === 'MONTHLY' ? 'monthly ' : ''}donation to Aarogya Foundation.</p>
     <table style="width:100%;border-collapse:collapse;font-family:monospace;margin:18px 0">
       <tr><td style="padding:6px 0;color:#5B6B66">Receipt No.</td><td style="text-align:right">${donation.receiptNo}</td></tr>
       <tr><td style="padding:6px 0;color:#5B6B66">Amount</td><td style="text-align:right;font-weight:bold">${inr(donation.amountInPaise)}</td></tr>
       <tr><td style="padding:6px 0;color:#5B6B66">Payment ID</td><td style="text-align:right">${donation.razorpayPaymentId}</td></tr>
       ${donation.pan ? `<tr><td style="padding:6px 0;color:#5B6B66">PAN</td><td style="text-align:right">${donation.pan}</td></tr>` : ''}
       <tr><td style="padding:6px 0;color:#5B6B66">Date</td><td style="text-align:right">${new Date(donation.updatedAt || Date.now()).toLocaleDateString('en-IN')}</td></tr>
     </table>
     <p>This contribution is eligible for tax deduction under Section 80G of the Income Tax Act, 1961.
        Please retain this email as your provisional receipt.</p>
     <p style="margin-top:20px">With gratitude,<br/><strong>Team Aarogya</strong></p>`
  );
  await sendMail({
    to: donation.email,
    subject: `Your donation receipt — ${donation.receiptNo}`,
    html,
    text: `Thank you ${donation.donorName}. Receipt ${donation.receiptNo} for ${inr(donation.amountInPaise)}.`,
  });
}

export async function sendVolunteerConfirmation(vol) {
  const html = shell(
    'Welcome aboard 🙌',
    `<p>Hi ${vol.name},</p>
     <p>Thank you for offering your time to Aarogya Foundation. Our volunteer team will reach out
        to you in ${vol.city} within 3–5 working days to talk about next steps.</p>
     <p>You told us you can help with: <strong>${vol.skills.join(', ')}</strong> (${vol.availability}).</p>
     <p>Warmly,<br/><strong>Team Aarogya</strong></p>`
  );
  await sendMail({ to: vol.email, subject: 'Thanks for volunteering with Aarogya Foundation', html });
}

export async function sendContactConfirmation(contact) {
  const html = shell(
    'We received your message',
    `<p>Hi ${contact.name},</p>
     <p>Thanks for writing to us about “${contact.subject}”. A member of our team will get back to
        you shortly. For anything urgent, call our office on +91 612 222 0000.</p>
     <p>Warmly,<br/><strong>Team Aarogya</strong></p>`
  );
  await sendMail({ to: contact.email, subject: 'We received your message — Aarogya Foundation', html });
}

export async function notifyAdmin(subject, lines) {
  const html = shell(subject, `<ul>${lines.map((l) => `<li>${l}</li>`).join('')}</ul>`);
  await sendMail({ to: env.smtp.adminNotify, subject: `[Aarogya] ${subject}`, html });
}

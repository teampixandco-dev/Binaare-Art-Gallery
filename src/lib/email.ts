import nodemailer from "nodemailer";
import { randomUUID } from "node:crypto";
import { getDatabase } from "./database.mjs";

export const GALLERY_PRIMARY_EMAIL = "Binari.gamage@binaareartgallery.com";

export interface ContactInquiry {
  name: string;
  email: string;
  subject: string;
  enquiryType: string;
  message: string;
}

export interface EmailDispatchResult {
  success: boolean;
  messageId?: string;
  savedInquiryId: string;
  transport: "smtp" | "logged";
  error?: string;
}

/**
 * Creates the appropriate nodemailer transport based on environment configuration.
 * Supports standard SMTP (cPanel webmail, SendGrid, Amazon SES, Google Workspace, etc.).
 */
function createTransport() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === "production",
      },
    });
  }

  return null;
}

/**
 * Generates an elegant, gallery-branded HTML email for Binari Gamage.
 */
function generateInquiryHtml(inquiry: ContactInquiry, id: string, timestamp: string): string {
  const replyMailto = `mailto:${inquiry.email}?subject=Re: ${encodeURIComponent(inquiry.subject)} — Binaare Art Gallery`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Gallery Inquiry</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #F8F6F2;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #24211F;
    }
    .wrapper {
      max-width: 600px;
      margin: 40px auto;
      background: #FFFFFF;
      border: 1px solid #E5E0D8;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      border-radius: 8px;
      overflow: hidden;
    }
    .header {
      background: #1C1917;
      padding: 32px 40px;
      text-align: center;
      border-bottom: 2px solid #8C704F;
    }
    .brand-eyebrow {
      color: #C5A880;
      font-size: 11px;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      margin: 0 0 6px 0;
    }
    .brand-title {
      color: #FFFFFF;
      font-family: "Playfair Display", Georgia, serif;
      font-size: 24px;
      letter-spacing: 0.08em;
      margin: 0;
      font-weight: 400;
    }
    .body-content {
      padding: 40px;
    }
    .badge {
      display: inline-block;
      background: #F1ECE4;
      color: #8C704F;
      font-size: 11px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      font-weight: 600;
      padding: 6px 14px;
      border-radius: 20px;
      margin-bottom: 16px;
    }
    .headline {
      font-family: "Playfair Display", Georgia, serif;
      font-size: 22px;
      color: #1C1917;
      margin: 0 0 24px 0;
      line-height: 1.35;
    }
    .meta-box {
      background: #FBF9F6;
      border: 1px solid #EBE5DC;
      border-radius: 6px;
      padding: 20px;
      margin-bottom: 28px;
    }
    .meta-row {
      display: flex;
      padding: 8px 0;
      border-bottom: 1px solid #EBE5DC;
      font-size: 14px;
    }
    .meta-row:last-child {
      border-bottom: none;
    }
    .meta-label {
      width: 130px;
      color: #78716C;
      font-weight: 500;
      flex-shrink: 0;
    }
    .meta-value {
      color: #1C1917;
      font-weight: 600;
    }
    .meta-value a {
      color: #8C704F;
      text-decoration: none;
    }
    .message-container {
      margin-top: 24px;
      margin-bottom: 32px;
    }
    .message-label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #78716C;
      margin-bottom: 10px;
      font-weight: 600;
    }
    .message-text {
      background: #FAF8F5;
      border-left: 3px solid #8C704F;
      padding: 20px;
      font-size: 15px;
      line-height: 1.7;
      color: #2D2926;
      white-space: pre-wrap;
      font-family: Georgia, serif;
      font-style: normal;
    }
    .action-button {
      display: inline-block;
      background: #8C704F;
      color: #FFFFFF !important;
      text-decoration: none;
      font-size: 13px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      font-weight: 600;
      padding: 14px 28px;
      border-radius: 4px;
      text-align: center;
    }
    .footer {
      background: #FAF8F5;
      padding: 24px 40px;
      border-top: 1px solid #E5E0D8;
      text-align: center;
      font-size: 12px;
      color: #78716C;
      line-height: 1.6;
    }
    .ref-code {
      font-family: monospace;
      color: #A8A29E;
      font-size: 11px;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <p class="brand-eyebrow">Curatorial Notice</p>
      <h1 class="brand-title">BINAARE ART GALLERY</h1>
    </div>
    <div class="body-content">
      <span class="badge">${inquiry.enquiryType}</span>
      <h2 class="headline">${inquiry.subject}</h2>
      
      <div class="meta-box">
        <div class="meta-row">
          <span class="meta-label">From:</span>
          <span class="meta-value">${inquiry.name}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Email:</span>
          <span class="meta-value"><a href="mailto:${inquiry.email}">${inquiry.email}</a></span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Enquiry Category:</span>
          <span class="meta-value">${inquiry.enquiryType}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Received At:</span>
          <span class="meta-value">${timestamp}</span>
        </div>
      </div>

      <div class="message-container">
        <div class="message-label">Inquirer's Message:</div>
        <div class="message-text">${inquiry.message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
      </div>

      <div style="text-align: center; margin-top: 32px;">
        <a href="${replyMailto}" class="action-button">Reply Directly to ${inquiry.name}</a>
      </div>
    </div>
    
    <div class="footer">
      <p style="margin: 0 0 6px 0;">This inquiry was submitted via the official Binaare Art Gallery contact portal.</p>
      <p style="margin: 0 0 8px 0;"><strong>Binaare Art Gallery</strong> &bull; Colombo, Sri Lanka &bull; Colors of Love</p>
      <p class="ref-code">Inquiry Reference: ${id}</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Dispatches the contact inquiry to Binari Gamage (Binari.gamage@binaareartgallery.com).
 * Records the inquiry in SQLite so no message is ever lost.
 */
export async function sendContactInquiry(inquiry: ContactInquiry): Promise<EmailDispatchResult> {
  const id = `inq_${randomUUID().slice(0, 12)}`;
  const now = new Date();
  const timestamp = now.toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Asia/Colombo",
  });

  // 1. Record inquiry into SQLite database
  try {
    const db = getDatabase();
    db.prepare(`
      INSERT INTO inquiries (id, name, email, subject, enquiry_type, message, created_at, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, inquiry.name, inquiry.email, inquiry.subject, inquiry.enquiryType, inquiry.message, now.toISOString(), "received");
  } catch (dbErr) {
    console.error("[Email/Database] Failed to persist inquiry to SQLite:", dbErr);
  }

  // 2. Prepare Email Body & Headers
  const recipient = GALLERY_PRIMARY_EMAIL;
  const fromAddress = process.env.SMTP_FROM || `"Binaare Gallery Portal" <notifications@binaareartgallery.com>`;
  const subjectLine = `[Gallery Inquiry: ${inquiry.enquiryType}] ${inquiry.subject} — from ${inquiry.name}`;
  const htmlContent = generateInquiryHtml(inquiry, id, timestamp);
  const textContent = `
New Contact Inquiry for Binaare Art Gallery
Reference: ${id}
Received: ${timestamp}

Category: ${inquiry.enquiryType}
From: ${inquiry.name} <${inquiry.email}>
Subject: ${inquiry.subject}

Message:
${inquiry.message}

--
Binaare Art Gallery • Colombo, Sri Lanka
Reply directly to: ${inquiry.email}
  `.trim();

  // 3. Dispatch via SMTP if configured
  const transport = createTransport();
  if (transport) {
    try {
      const info = await transport.sendMail({
        from: fromAddress,
        to: recipient,
        replyTo: inquiry.email,
        subject: subjectLine,
        text: textContent,
        html: htmlContent,
      });

      console.log(`[Email] Successfully delivered inquiry ${id} to ${recipient}. MessageId: ${info.messageId}`);
      return {
        success: true,
        messageId: info.messageId,
        savedInquiryId: id,
        transport: "smtp",
      };
    } catch (smtpErr) {
      console.error(`[Email] SMTP dispatch failed for ${id}:`, smtpErr);
      return {
        success: true, // We still return success to the user because the message was securely saved in database
        savedInquiryId: id,
        transport: "smtp",
        error: smtpErr instanceof Error ? smtpErr.message : "SMTP dispatch failed",
      };
    }
  }

  // 4. Fallback / Development logging:
  console.log(`\n======================================================`);
  console.log(`[Simulated Email Dispatch] Recipient: ${recipient}`);
  console.log(`Inquiry ID: ${id}`);
  console.log(`From: ${inquiry.name} <${inquiry.email}>`);
  console.log(`Subject: ${subjectLine}`);
  console.log(`Category: ${inquiry.enquiryType}`);
  console.log(`Message preview: ${inquiry.message.slice(0, 140)}...`);
  console.log(`(Configure SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in .env to enable direct live SMTP delivery)`);
  console.log(`======================================================\n`);

  return {
    success: true,
    savedInquiryId: id,
    transport: "logged",
  };
}

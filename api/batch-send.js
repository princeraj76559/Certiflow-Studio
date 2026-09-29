import { createTransporter, sendSingleEmail, interpolateTemplate } from '../server/emailService.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { smtpConfig, emailTemplate, items, delayMs = 300 } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'No recipient items provided' });
    }

    const transporter = createTransporter(smtpConfig);
    await transporter.verify();

    const results = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const recipientName = item.name || 'Participant';
      const recipientEmail = item.email ? item.email.trim() : null;

      if (!recipientEmail || !recipientEmail.includes('@')) {
        results.push({
          index: i,
          name: recipientName,
          email: recipientEmail || 'Missing Email',
          status: 'failed',
          error: 'Invalid or missing email address',
          timestamp: new Date().toISOString(),
        });
        continue;
      }

      const personalizedSubject = interpolateTemplate(emailTemplate?.subject || 'Certificate of Achievement', item);
      const personalizedBody = interpolateTemplate(emailTemplate?.body || 'Please find your certificate attached.', item);

      try {
        const info = await sendSingleEmail(transporter, {
          from: smtpConfig.user,
          to: recipientEmail,
          subject: personalizedSubject,
          htmlBody: personalizedBody,
          attachment: item.pdfBase64 ? {
            filename: `${recipientName.replace(/[^a-zA-Z0-9_\-]/g, '_')}_Certificate.pdf`,
            content: item.pdfBase64,
            contentType: 'application/pdf',
          } : null,
        });

        results.push({
          index: i,
          name: recipientName,
          email: recipientEmail,
          status: 'success',
          messageId: info.messageId,
          filename: `${recipientName}_Certificate.pdf`,
          timestamp: new Date().toISOString(),
        });
      } catch (sendError) {
        results.push({
          index: i,
          name: recipientName,
          email: recipientEmail,
          status: 'failed',
          error: sendError.message || 'SMTP Send Failed',
          timestamp: new Date().toISOString(),
        });
      }

      if (delayMs > 0 && i < items.length - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }

    return res.status(200).json({
      success: true,
      total: items.length,
      sentCount: results.filter(r => r.status === 'success').length,
      failedCount: results.filter(r => r.status === 'failed').length,
      results,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Batch email dispatch failed',
    });
  }
}

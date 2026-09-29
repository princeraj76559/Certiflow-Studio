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
    const { smtpConfig, emailTemplate, recipient } = req.body;

    if (!smtpConfig || !smtpConfig.user || !smtpConfig.pass) {
      return res.status(400).json({ error: 'Incomplete SMTP credentials provided.' });
    }

    if (!recipient || !recipient.email) {
      return res.status(400).json({ error: 'Missing recipient email address.' });
    }

    const transporter = createTransporter(smtpConfig);
    const recipientName = recipient.name || 'Participant';
    const personalizedSubject = interpolateTemplate(emailTemplate?.subject || 'Certificate of Achievement', recipient);
    const personalizedBody = interpolateTemplate(emailTemplate?.body || 'Please find your certificate attached.', recipient);

    const info = await sendSingleEmail(transporter, {
      from: smtpConfig.user,
      to: recipient.email,
      subject: personalizedSubject,
      htmlBody: personalizedBody,
      attachment: recipient.pdfBase64 ? {
        filename: `${recipientName.replace(/[^a-zA-Z0-9_\-]/g, '_')}_Certificate.pdf`,
        content: recipient.pdfBase64,
        contentType: 'application/pdf',
      } : null,
    });

    return res.status(200).json({
      success: true,
      name: recipientName,
      email: recipient.email,
      messageId: info.messageId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Serverless send error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'SMTP Dispatch Failed',
    });
  }
}

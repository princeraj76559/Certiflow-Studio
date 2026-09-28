import express from 'express';
import cors from 'cors';
import { SMTP_PRESETS } from './smtpPresets.js';
import { createTransporter, verifySmtpConnection, sendSingleEmail, interpolateTemplate } from './emailService.js';
import { generateDeliveryReportBuffer } from './reportGenerator.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and high JSON limits for base64 PDF attachments in batch mode
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Get SMTP Presets & Info
app.get('/api/smtp/presets', (req, res) => {
  res.json(SMTP_PRESETS);
});

// Test/Verify SMTP Connection
app.post('/api/smtp/verify', async (req, res) => {
  const { host, port, secure, user, pass } = req.body;
  const result = await verifySmtpConnection({ host, port, secure, user, pass });
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
});

// Send a single test email
app.post('/api/email/test-send', async (req, res) => {
  const { smtpConfig, toEmail, subject, htmlBody } = req.body;
  try {
    const transporter = createTransporter(smtpConfig);
    const info = await sendSingleEmail(transporter, {
      from: smtpConfig.user,
      to: toEmail || smtpConfig.user,
      subject: subject || 'Test Certificate Dispatch Connection',
      htmlBody: htmlBody || '<p>This is a test email from CertiFlow. Your SMTP setup is operational!</p>',
    });
    res.json({ success: true, message: 'Test email sent successfully!', messageId: info.messageId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Batch send emails with attached personalized PDF certificates
app.post('/api/email/batch-send', async (req, res) => {
  const { smtpConfig, emailTemplate, items, delayMs = 600 } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'No recipient items provided' });
  }

  let transporter;
  try {
    transporter = createTransporter(smtpConfig);
    // Verify first
    await transporter.verify();
  } catch (err) {
    return res.status(400).json({ 
      error: `SMTP Authentication / Connection Error: ${err.message}` 
    });
  }

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

    // Interpolate template placeholders
    const personalizedSubject = interpolateTemplate(emailTemplate.subject || 'Certificate of Achievement', item);
    const personalizedBody = interpolateTemplate(emailTemplate.body || '<p>Dear {name}, here is your certificate.</p>', item);

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
      console.error(`Failed to send email to ${recipientEmail}:`, sendError);
      results.push({
        index: i,
        name: recipientName,
        email: recipientEmail,
        status: 'failed',
        error: sendError.message || 'SMTP Send Failed',
        timestamp: new Date().toISOString(),
      });
    }

    // Optional delay between sends to respect provider rate limits
    if (delayMs > 0 && i < items.length - 1) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  res.json({
    success: true,
    total: items.length,
    sentCount: results.filter(r => r.status === 'success').length,
    failedCount: results.filter(r => r.status === 'failed').length,
    results,
  });
});

// Download final delivery report as Excel (.xlsx)
app.post('/api/report/export-excel', (req, res) => {
  const { results, meta } = req.body;
  if (!results || !Array.isArray(results)) {
    return res.status(400).json({ error: 'No results provided' });
  }

  try {
    const buffer = generateDeliveryReportBuffer(results, meta);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="Certificate_Dispatch_Report.xlsx"');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate Excel report: ' + error.message });
  }
});

app.listen(PORT, () => {
  console.log(`CertiFlow backend server is listening on http://localhost:${PORT}`);
});

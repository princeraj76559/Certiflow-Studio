import nodemailer from 'nodemailer';

/**
 * Creates a Nodemailer transporter instance based on SMTP config
 */
export function createTransporter(config) {
  const { host, port, secure, user, pass } = config;

  if (!host || !port || !user || !pass) {
    throw new Error('Incomplete SMTP configuration. Host, Port, Email, and Password/App Password are required.');
  }

  const portNum = parseInt(port, 10);
  const isSecure = secure === true || secure === 'true' || portNum === 465;

  return nodemailer.createTransport({
    host: host.trim(),
    port: portNum,
    secure: isSecure,
    auth: {
      user: user.trim(),
      pass: pass.trim(),
    },
    tls: {
      rejectUnauthorized: false, // Prevents self-signed cert blocks on institutional servers
    },
    connectionTimeout: 15000,
    greetingTimeout: 10000,
  });
}

/**
 * Verifies if the provided SMTP credentials are valid
 */
export async function verifySmtpConnection(config) {
  try {
    const transporter = createTransporter(config);
    await transporter.verify();
    return { success: true, message: 'SMTP Connection established successfully!' };
  } catch (error) {
    let friendlyMessage = error.message;
    if (error.code === 'EAUTH') {
      friendlyMessage = 'Authentication failed. Please verify your Email and App Password. Note: Gmail & Outlook require an App Password if 2-Factor Authentication is enabled.';
    } else if (error.code === 'ESOCKET' || error.code === 'ETIMEDOUT') {
      friendlyMessage = `Connection timed out or refused by ${config.host}:${config.port}. Please check your internet connection or SMTP host/port.`;
    }
    return { success: false, message: friendlyMessage, error: error.toString() };
  }
}

/**
 * Replace placeholders in template text: {name}, {email}, {event}, {date}, {cert_id}, {role}
 */
export function interpolateTemplate(template, rowData = {}) {
  if (!template) return '';
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    // case-insensitive lookup in rowData
    const foundKey = Object.keys(rowData).find(k => k.toLowerCase() === key.toLowerCase());
    return foundKey && rowData[foundKey] !== undefined ? rowData[foundKey] : match;
  });
}

/**
 * Sends a single email with optional attachment and anti-spam deliverability headers
 */
export async function sendSingleEmail(transporter, { from, to, subject, htmlBody, attachment }) {
  const senderEmail = from.trim();
  const recipientEmail = to.trim();
  const rawContent = htmlBody || 'Please find your official certificate attached.';
  
  // Clean plain text version (vital for spam filter scoring)
  const plainText = rawContent
    .replace(/<br\s*[\/]?>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .trim();

  // Clean HTML wrapper
  const formattedHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 20px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #1f2937; background-color: #ffffff;">
        <div style="max-width: 600px; margin: 0 auto; padding: 0 15px;">
          ${rawContent.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>')}
        </div>
      </body>
    </html>
  `;

  const mailOptions = {
    from: `"Event Organizing Committee" <${senderEmail}>`,
    to: recipientEmail,
    replyTo: senderEmail,
    subject: (subject || 'Your Certificate of Achievement').trim(),
    text: plainText,
    html: formattedHtml,
    headers: {
      'X-Priority': '3',
      'X-MSMail-Priority': 'Normal',
      'Importance': 'Normal',
      'X-Mailer': 'CertiFlow Official Dispatcher',
    },
    attachments: [],
  };

  if (attachment && attachment.content) {
    mailOptions.attachments.push({
      filename: attachment.filename || 'Certificate.pdf',
      content: attachment.content.includes('base64,') 
        ? Buffer.from(attachment.content.split('base64,')[1], 'base64')
        : Buffer.from(attachment.content, 'base64'),
      contentType: 'application/pdf',
    });
  }

  const info = await transporter.sendMail(mailOptions);
  return info;
}

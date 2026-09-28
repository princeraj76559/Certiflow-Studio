export const SMTP_PRESETS = {
  gmail: {
    id: 'gmail',
    name: 'Google Gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // SSL
    authType: 'App Password',
    hint: 'Google requires a 16-character App Password (not your normal Gmail password). 2-Step Verification must be enabled.',
    guideUrl: 'https://myaccount.google.com/apppasswords',
    helpSteps: [
      'Go to your Google Account (myaccount.google.com)',
      'Navigate to Security -> 2-Step Verification (must be turned ON)',
      'Scroll to "App passwords" at the bottom',
      'Enter an app name (e.g. "Certificate Automation") and click Generate',
      'Copy the 16-character code (without spaces) and paste it into the App Password field'
    ]
  },
  outlook: {
    id: 'outlook',
    name: 'Microsoft Outlook / Office 365',
    host: 'smtp.office365.com',
    port: 587,
    secure: false, // STARTTLS
    authType: 'App Password / Password',
    hint: 'For Microsoft 365 & Outlook.com accounts with 2FA enabled, generate an App Password in your Microsoft Account security page.',
    guideUrl: 'https://account.live.com/proofs/manage/additional',
    helpSteps: [
      'Log in to Microsoft Account Security (account.microsoft.com/security)',
      'Select "Advanced security options"',
      'Under "App passwords", select "Create a new app password"',
      'Copy the generated password and paste it into the App Password field'
    ]
  },
  yahoo: {
    id: 'yahoo',
    name: 'Yahoo Mail',
    host: 'smtp.mail.yahoo.com',
    port: 465,
    secure: true,
    authType: 'App Password',
    hint: 'Yahoo requires an App Password generated from Account Security.',
    guideUrl: 'https://login.yahoo.com/account/security',
    helpSteps: [
      'Go to Yahoo Account Security page',
      'Click "Generate and manage app passwords"',
      'Enter "Certificate Automation" and generate',
      'Paste the password into the App Password field'
    ]
  },
  custom: {
    id: 'custom',
    name: 'Custom SMTP Server',
    host: '',
    port: 587,
    secure: false,
    authType: 'Password',
    hint: 'Enter your custom university or institutional SMTP server details (e.g., smtp.university.edu).',
    guideUrl: null,
    helpSteps: [
      'Contact your institutional IT administrator for SMTP host and port details',
      'Standard SSL port is 465, and TLS/STARTTLS port is 587 or 25',
      'Ensure your sender account is permitted to send external emails'
    ]
  }
};

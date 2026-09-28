/**
 * Generates sample certificate SVGs converted to data URLs for instant demo testing
 */
export function generateSampleCertificateImage(type = 'achievement') {
  const width = 1920;
  const height = 1080;

  if (type === 'coordinator') {
    return `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0a1128"/>
            <stop offset="50%" stop-color="#1c2541"/>
            <stop offset="100%" stop-color="#0b132b"/>
          </linearGradient>
          <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#f59e0b"/>
            <stop offset="50%" stop-color="#fbbf24"/>
            <stop offset="100%" stop-color="#d97706"/>
          </linearGradient>
          <linearGradient id="cyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#06b6d4"/>
            <stop offset="100%" stop-color="#3b82f6"/>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#bg)"/>
        <!-- Ornate Borders -->
        <rect x="50" y="50" width="${width - 100}" height="${height - 100}" fill="none" stroke="url(#gold)" stroke-width="3" opacity="0.6"/>
        <rect x="70" y="70" width="${width - 140}" height="${height - 140}" fill="none" stroke="url(#cyan)" stroke-width="1.5" opacity="0.4" stroke-dasharray="10 5"/>
        
        <!-- Corner Accents -->
        <path d="M50 180 L50 50 L180 50" fill="none" stroke="url(#gold)" stroke-width="8"/>
        <path d="M${width - 50} 180 L${width - 50} 50 L${width - 180} 50" fill="none" stroke="url(#gold)" stroke-width="8"/>
        <path d="M50 ${height - 180} L50 ${height - 50} L180 ${height - 50}" fill="none" stroke="url(#gold)" stroke-width="8"/>
        <path d="M${width - 50} ${height - 180} L${width - 50} ${height - 50} L${width - 180} ${height - 50}" fill="none" stroke="url(#gold)" stroke-width="8"/>

        <!-- Header Titles -->
        <text x="50%" y="220" text-anchor="middle" font-family="'Cinzel', serif" font-size="44" font-weight="700" fill="url(#gold)" letter-spacing="8">UNIVERSITY EXCELLENCE AWARDS</text>
        <text x="50%" y="290" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="20" font-weight="600" fill="#94a3b8" letter-spacing="14">CERTIFICATE OF APPRECIATION</text>
        
        <text x="50%" y="420" text-anchor="middle" font-family="'Playfair Display', serif" font-size="26" font-style="italic" fill="#cbd5e1">This is proudly presented to</text>

        <!-- Underline line for name -->
        <line x1="450" y1="580" x2="${width - 450}" y2="580" stroke="url(#gold)" stroke-width="2" opacity="0.7"/>

        <!-- Subtext description -->
        <text x="50%" y="670" text-anchor="middle" font-family="'Inter', sans-serif" font-size="24" fill="#94a3b8">For outstanding leadership, extraordinary dedication, and stellar service as a</text>
        <text x="50%" y="715" text-anchor="middle" font-family="'Cinzel', serif" font-size="28" font-weight="600" fill="#38bdf8" letter-spacing="4">STUDENT COORDINATOR</text>
        <text x="50%" y="760" text-anchor="middle" font-family="'Inter', sans-serif" font-size="20" fill="#64748b">during the Annual Tech & Innovation Fest 2026</text>

        <!-- Signatures and Stamp -->
        <g transform="translate(320, 880)">
          <line x1="0" y1="0" x2="300" y2="0" stroke="#475569" stroke-width="1.5"/>
          <text x="150" y="35" text-anchor="middle" font-family="'Inter', sans-serif" font-size="18" font-weight="600" fill="#cbd5e1">Dr. Arthur Vance</text>
          <text x="150" y="60" text-anchor="middle" font-family="'Inter', sans-serif" font-size="14" fill="#64748b">Dean of Student Affairs</text>
        </g>

        <!-- Center Badge -->
        <g transform="translate(${width / 2}, 890)">
          <circle cx="0" cy="0" r="65" fill="#131b2e" stroke="url(#gold)" stroke-width="4"/>
          <circle cx="0" cy="0" r="54" fill="none" stroke="url(#cyan)" stroke-width="1.5" stroke-dasharray="6 3"/>
          <text x="0" y="-8" text-anchor="middle" font-family="'Cinzel', serif" font-size="12" font-weight="bold" fill="url(#gold)" letter-spacing="2">OFFICIAL</text>
          <text x="0" y="12" text-anchor="middle" font-family="'Cinzel', serif" font-size="12" font-weight="bold" fill="url(#gold)" letter-spacing="2">SEAL</text>
          <text x="0" y="28" text-anchor="middle" font-family="'Inter', sans-serif" font-size="10" fill="#94a3b8">2026</text>
        </g>

        <g transform="translate(${width - 620}, 880)">
          <line x1="0" y1="0" x2="300" y2="0" stroke="#475569" stroke-width="1.5"/>
          <text x="150" y="35" text-anchor="middle" font-family="'Inter', sans-serif" font-size="18" font-weight="600" fill="#cbd5e1">Prof. Elena Rostova</text>
          <text x="150" y="60" text-anchor="middle" font-family="'Inter', sans-serif" font-size="14" fill="#64748b">Event Head & Convener</text>
        </g>
      </svg>
    `)}`;
  }

  if (type === 'participation') {
    return `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <defs>
          <linearGradient id="pbg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#051923"/>
            <stop offset="60%" stop-color="#003554"/>
            <stop offset="100%" stop-color="#051923"/>
          </linearGradient>
          <linearGradient id="emerald" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#10b981"/>
            <stop offset="100%" stop-color="#06b6d4"/>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#pbg)"/>
        
        <!-- Elegant modern geometric frames -->
        <rect x="40" y="40" width="${width - 80}" height="${height - 80}" fill="none" stroke="url(#emerald)" stroke-width="2"/>
        <rect x="60" y="60" width="${width - 120}" height="${height - 120}" fill="none" stroke="#1e293b" stroke-width="1"/>

        <!-- Header -->
        <text x="50%" y="210" text-anchor="middle" font-family="'Orbitron', sans-serif" font-size="38" font-weight="700" fill="url(#emerald)" letter-spacing="10">GLOBAL HACKATHON 2026</text>
        <text x="50%" y="270" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="18" font-weight="600" fill="#94a3b8" letter-spacing="8">CERTIFICATE OF PARTICIPATION</text>
        
        <text x="50%" y="410" text-anchor="middle" font-family="'Playfair Display', serif" font-size="24" font-style="italic" fill="#cbd5e1">This certificate is honorably bestowed upon</text>

        <!-- Name line -->
        <line x1="480" y1="570" x2="${width - 480}" y2="570" stroke="url(#emerald)" stroke-width="2" opacity="0.8"/>

        <!-- Details -->
        <text x="50%" y="670" text-anchor="middle" font-family="'Inter', sans-serif" font-size="22" fill="#94a3b8">For active participation and innovative contribution during the 48-Hour National AI Sprint.</text>
        <text x="50%" y="715" text-anchor="middle" font-family="'Inter', sans-serif" font-size="18" fill="#64748b">Held on September 18 - 20, 2026</text>

        <!-- Signatures -->
        <g transform="translate(350, 880)">
          <line x1="0" y1="0" x2="280" y2="0" stroke="#334155" stroke-width="1.5"/>
          <text x="140" y="35" text-anchor="middle" font-family="'Inter', sans-serif" font-size="18" font-weight="600" fill="#f1f5f9">David Miller</text>
          <text x="140" y="60" text-anchor="middle" font-family="'Inter', sans-serif" font-size="14" fill="#64748b">Program Director</text>
        </g>

        <!-- Seal -->
        <g transform="translate(${width / 2}, 890)">
          <polygon points="0,-50 35,-35 50,0 35,35 0,50 -35,35 -50,0 -35,-35" fill="#032b43" stroke="url(#emerald)" stroke-width="2"/>
          <text x="0" y="5" text-anchor="middle" font-family="'Orbitron', sans-serif" font-size="13" font-weight="bold" fill="#10b981">VERIFIED</text>
        </g>

        <g transform="translate(${width - 630}, 880)">
          <line x1="0" y1="0" x2="280" y2="0" stroke="#334155" stroke-width="1.5"/>
          <text x="140" y="35" text-anchor="middle" font-family="'Inter', sans-serif" font-size="18" font-weight="600" fill="#f1f5f9">Sarah Jenkins</text>
          <text x="140" y="60" text-anchor="middle" font-family="'Inter', sans-serif" font-size="14" fill="#64748b">Lead Organizer</text>
        </g>
      </svg>
    `)}`;
  }

  // Default: Achievement / Winner
  return `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="wbg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#090d16"/>
          <stop offset="50%" stop-color="#111827"/>
          <stop offset="100%" stop-color="#0b0f19"/>
        </linearGradient>
        <linearGradient id="goldgrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fde047"/>
          <stop offset="40%" stop-color="#eab308"/>
          <stop offset="100%" stop-color="#ca8a04"/>
        </linearGradient>
        <linearGradient id="bordergrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ca8a04"/>
          <stop offset="50%" stop-color="#facc15"/>
          <stop offset="100%" stop-color="#ca8a04"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#wbg)"/>

      <!-- Frames -->
      <rect x="40" y="40" width="${width - 80}" height="${height - 80}" fill="none" stroke="url(#bordergrad)" stroke-width="4"/>
      <rect x="56" y="56" width="${width - 112}" height="${height - 112}" fill="none" stroke="#374151" stroke-width="1.5"/>

      <!-- Corner geometry -->
      <polygon points="40,40 140,40 40,140" fill="url(#goldgrad)" opacity="0.3"/>
      <polygon points="${width - 40},40 ${width - 140},40 ${width - 40},140" fill="url(#goldgrad)" opacity="0.3"/>
      <polygon points="40,${height - 40} 140,${height - 40} 40,${height - 140}" fill="url(#goldgrad)" opacity="0.3"/>
      <polygon points="${width - 40},${height - 40} ${width - 140},${height - 40} ${width - 40},${height - 140}" fill="url(#goldgrad)" opacity="0.3"/>

      <!-- Titles -->
      <text x="50%" y="200" text-anchor="middle" font-family="'Cinzel', serif" font-size="46" font-weight="900" fill="url(#goldgrad)" letter-spacing="12">CERTIFICATE OF ACHIEVEMENT</text>
      <text x="50%" y="260" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="18" font-weight="600" fill="#9ca3af" letter-spacing="10">PROUDLY PRESENTED TO</text>
      
      <!-- Placeholder guide line -->
      <line x1="420" y1="560" x2="${width - 420}" y2="560" stroke="url(#goldgrad)" stroke-width="2" opacity="0.7"/>

      <text x="50%" y="650" text-anchor="middle" font-family="'Inter', sans-serif" font-size="24" fill="#cbd5e1">In special recognition for achieving 1st Position in the National Innovation Challenge</text>
      <text x="50%" y="695" text-anchor="middle" font-family="'Inter', sans-serif" font-size="19" fill="#94a3b8">Presented by the Board of Academic Excellence • 2026</text>

      <!-- Signature section -->
      <g transform="translate(320, 880)">
        <line x1="0" y1="0" x2="300" y2="0" stroke="#4b5563" stroke-width="1.5"/>
        <text x="150" y="35" text-anchor="middle" font-family="'Inter', sans-serif" font-size="18" font-weight="600" fill="#f3f4f6">Chancellor R. Sterling</text>
        <text x="150" y="60" text-anchor="middle" font-family="'Inter', sans-serif" font-size="14" fill="#9ca3af">University Chancellor</text>
      </g>

      <!-- Center Medallion -->
      <g transform="translate(${width / 2}, 880)">
        <circle cx="0" cy="0" r="60" fill="#1e1b4b" stroke="url(#goldgrad)" stroke-width="3"/>
        <circle cx="0" cy="0" r="50" fill="none" stroke="#facc15" stroke-width="1" stroke-dasharray="4 2"/>
        <text x="0" y="-6" text-anchor="middle" font-family="'Cinzel', serif" font-size="14" font-weight="bold" fill="url(#goldgrad)">WINNER</text>
        <text x="0" y="14" text-anchor="middle" font-family="'Cinzel', serif" font-size="10" fill="#e5e7eb">★ 1ST PLACE ★</text>
      </g>

      <g transform="translate(${width - 620}, 880)">
        <line x1="0" y1="0" x2="300" y2="0" stroke="#4b5563" stroke-width="1.5"/>
        <text x="150" y="35" text-anchor="middle" font-family="'Inter', sans-serif" font-size="18" font-weight="600" fill="#f3f4f6">Dr. Maya Lin</text>
        <text x="150" y="60" text-anchor="middle" font-family="'Inter', sans-serif" font-size="14" fill="#9ca3af">Dean of Engineering</text>
      </g>
    </svg>
  `)}`;
}

export const SAMPLE_PARTICIPANTS = [
  { name: 'Alexander Wright', email: 'alex.wright@university.edu', role: 'Winner - 1st Place', event: 'National Hackathon', date: 'Sept 20, 2026', cert_id: 'CERT-2026-001' },
  { name: 'Sophia Chen', email: 'sophia.chen@example.org', role: 'Winner - 2nd Place', event: 'National Hackathon', date: 'Sept 20, 2026', cert_id: 'CERT-2026-002' },
  { name: 'Liam O\'Connor', email: 'liam.oconnor@college.edu', role: 'Student Coordinator', event: 'Tech Symposium', date: 'Sept 20, 2026', cert_id: 'CERT-2026-003' },
  { name: 'Dr. Emily Vance', email: 'emily.vance@research.org', role: 'Lead Coordinator', event: 'Tech Symposium', date: 'Sept 20, 2026', cert_id: 'CERT-2026-004' },
  { name: 'Muhammad Al-Mansoor', email: 'm.almansoor@global.edu', role: 'Participant', event: 'AI Innovation Sprint', date: 'Sept 20, 2026', cert_id: 'CERT-2026-005' },
  { name: 'Alexander Wright', email: 'alexander.wright@alumni.org', role: 'Winner - 1st Place', event: 'National Hackathon', date: 'Sept 20, 2026', cert_id: 'CERT-2026-006' }, // duplicate name to test deduplication
];

export const GOOGLE_FONTS_LIST = [
  { name: 'Cinzel (Serif Elegance)', value: 'Cinzel', preview: 'Alexander Wright' },
  { name: 'Great Vibes (Flowing Calligraphy)', value: 'Great Vibes', preview: 'Alexander Wright' },
  { name: 'Alex Brush (Modern Script)', value: 'Alex Brush', preview: 'Alexander Wright' },
  { name: 'Playfair Display (Classic Luxury)', value: 'Playfair Display', preview: 'Alexander Wright' },
  { name: 'Dancing Script (Casual Script)', value: 'Dancing Script', preview: 'Alexander Wright' },
  { name: 'Pinyon Script (Traditional Formal)', value: 'Pinyon Script', preview: 'Alexander Wright' },
  { name: 'Cormorant Garamond (Academic Serif)', value: 'Cormorant Garamond', preview: 'Alexander Wright' },
  { name: 'Montserrat (Modern Bold Sans)', value: 'Montserrat', preview: 'Alexander Wright' },
  { name: 'Inter (Clean Neutral)', value: 'Inter', preview: 'Alexander Wright' },
  { name: 'Orbitron (Futuristic Tech)', value: 'Orbitron', preview: 'Alexander Wright' },
];

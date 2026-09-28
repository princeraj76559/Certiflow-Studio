# CertiFlow — Automated Certificate Studio & Dispatch System

CertiFlow is a modern, high-performance web application designed for universities, hackathons, and organizations to automate certificate generation, interactive text positioning, batch multi-page PDF compilation for physical printing, and direct SMTP batch email dispatch with delivery reporting.

---

## 🌟 Key Features & Layout

### 1. Viewport-Optimized Layout (Zero Page Overflow)
- *Left Panel (Scrollable)*: Contains all steps (Base Certificate File, Recipients Spreadsheet, Typography & Placement, Workflow Options, and Execution Center) with independent vertical scrolling.
- *Right Panel (Full-Height Studio Canvas)*: Auto-fits the certificate preview directly within the screen height without forcing outer scrollbars.

### 2. PDF & Image Base Certificate Support
- Import blank certificates from *PDF Documents (.pdf)*, as well as *PNG, JPG, and WebP* images.
- High-resolution rendering at native 300 DPI for crystal clear vector sharpness.

### 3. Dynamic Typography & Placement Engine
- *Instant Font Loading*: Google Fonts (*Cinzel*, *Great Vibes*, *Alex Brush*, *Playfair Display*, *Dancing Script*, *Pinyon Script*, *Montserrat*, *Orbitron*, *Inter*) apply immediately upon selection.
- *Accurate Text Alignment*: Left, Center, and Right text alignment.
- *Cross-Browser Letter Spacing*: Precise character spacing controls.
- *Text Casing Selector*: Switch between *Original*, *UPPERCASE*, *Title Case / Capitalize*, and *lowercase*.
- *Interactive Drag & Drop*: Drag name boxes directly on the canvas to place coordinates.

### 4. Dual Workflow Modes

#### Mode A: "Print Physically" (Single Consolidated PDF)
- Compiles all participant certificates into a *single multi-page PDF document* with exact orientation and zero image compression degradation.

#### Mode B: "Send on Email" (Automated Batch Dispatch)
- Validates both `Name` and `Email` columns.
- *Email Service Presets*: Gmail, Microsoft Outlook / Office 365, Yahoo Mail, and Custom SMTP.
- *App Password Security Guides*: In-app step-by-step instructions and direct links to Google & Microsoft account security portals.
- *Template Tag Interpolation*: Dynamic personalized subject and body supporting `{name}`, `{event}`, `{date}`, `{cert_id}`, etc.
- *Deduplicated ZIP Archive*: Option to save individual PDFs to disk where duplicate names are safely deduplicated.
- *Final Delivery Status Excel Report*: Exports a spreadsheet with delivery statuses (`SENT`, `FAILED`), timestamps, and error details.

---

## 🛠️ Project Structure

```
Certificate Automation/
├── package.json                 # Project dependencies & scripts
├── vite.config.js               # Vite bundler configuration & API proxy
├── tailwind.config.js           # Custom modern light theme & tokens
├── postcss.config.js            # PostCSS plugins
├── index.html                   # HTML5 shell with Google Font imports
├── README.md                    # Documentation
├── server/
│   ├── index.js                 # Express server & API endpoints
│   ├── emailService.js          # Nodemailer SMTP engine with retry & template parser
│   ├── smtpPresets.js           # Provider presets (Gmail, Outlook, Yahoo, Custom)
│   └── reportGenerator.js       # Excel delivery report generator
└── src/
    ├── main.jsx                 # React root entrypoint
    ├── App.jsx                  # Main orchestrator component
    ├── index.css                # Clean light design tokens & styles
    ├── utils/
    │   ├── pdfImporter.js       # PDF document parser & renderer
    │   ├── excelParser.js       # Spreadsheet parser, validator & template builder
    │   └── pdfGenerator.js      # Lossless PDF generator, multi-page print PDF & ZIP exporter
    └── components/
        ├── Header.jsx           # App bar with mode toggle & shortcuts
        ├── StatsOverview.jsx    # Metrics cards inspired by reference UI
        ├── Modals/
        │   ├── AppPasswordGuideModal.jsx # Step-by-step App Password tutorial
        │   ├── EmailPreviewModal.jsx     # Inbox simulator
        │   └── BatchProgressModal.jsx    # Live progress overlay & Excel report export
        ├── LeftPanel/
        │   ├── LeftPanelContainer.jsx
        │   ├── Step1_BaseCertificate.jsx
        │   ├── Step2_RecipientsExcel.jsx
        │   ├── Step3_TextCustomizer.jsx
        │   ├── Step4_ModeConfig.jsx
        │   └── Step5_DispatchAction.jsx
        └── RightPanel/
            ├── RightPanelContainer.jsx
            ├── CertificateCanvas.jsx     # Interactive draggable visual studio
            └── RecipientTable.jsx        # Data grid & delivery tracker
```

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Frontend & Backend
```bash
npm run start
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

# CertiFlow — Automated Certificate Studio & Dispatch System

CertiFlow is a modern, high-performance web application designed for universities, hackathons, and organizations to automate certificate generation, interactive text positioning, batch multi-page PDF compilation for physical printing, and direct SMTP batch email dispatch with delivery reporting.

---

## 🌟 Key Features

### 1. Viewport-Optimized Studio Layout (Zero Page Overflow)
- **Left Panel (Scrollable)**: Contains all steps (Base Certificate File, Recipients Spreadsheet, Typography & Placement, Workflow Options, and Execution Center) with independent vertical scrolling.
- **Right Panel (Full-Height Studio Canvas)**: Auto-fits the certificate preview directly within the screen height without forcing outer scrollbars.

### 2. PDF & Image Base Certificate Support
- Import blank certificates from **PDF Documents (.pdf)**, as well as **PNG, JPG, and WebP** images.
- High-resolution rendering at native 300 DPI for crystal clear vector sharpness.

### 3. Dynamic Typography & Placement Engine
- **Instant Font Loading**: Google Fonts (*Cinzel*, *Great Vibes*, *Alex Brush*, *Playfair Display*, *Dancing Script*, *Pinyon Script*, *Montserrat*, *Orbitron*, *Inter*) apply immediately upon selection.
- **Accurate Text Alignment**: Left, Center, and Right text alignment.
- **Cross-Browser Letter Spacing**: Precise character spacing controls.
- **Text Casing Selector**: Switch between *Original*, *UPPERCASE*, *Title Case / Capitalize*, and *lowercase*.
- **Interactive Drag & Drop**: Drag name boxes directly on the canvas to place coordinates.

### 4. Dual Workflow Modes

#### Mode A: "Print Physically" (Single Consolidated PDF)
- Compiles all participant certificates into a **single multi-page PDF document** with exact orientation and zero image compression degradation.

#### Mode B: "Send on Email" (Automated Batch Dispatch)
- Validates both `Name` and `Email` columns.
- **Email Service Presets**: Gmail, Microsoft Outlook / Office 365, Yahoo Mail, and Custom SMTP.
- **App Password Security Guides**: In-app step-by-step instructions and direct links to Google & Microsoft account security portals.
- **Natural Line Breaks**: Automatically preserves all typed newlines and line breaks without requiring HTML tags.
- **Template Tag Interpolation**: Dynamic personalized subject and body supporting `{name}`, `{event}`, `{date}`, `{cert_id}`, etc.
- **Deduplicated ZIP Archive**: Option to save individual PDFs to disk where duplicate names are safely deduplicated.
- **Final Delivery Status Excel Report**: Exports a spreadsheet with delivery statuses (`SENT`, `FAILED`), timestamps, and error details.

---

## ⚡ Deployment on Vercel (100% Free & Open SMTP)

Vercel provides free static hosting on their global CDN and runs the Nodemailer email dispatcher as serverless functions in `/api/` where **outbound SMTP ports 465 (SSL) and 587 (TLS) are fully open**.

### Steps to Deploy:
1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Configure Vercel serverless functions and routing"
   git push origin main
   ```
2. Go to [https://vercel.com](https://vercel.com) and log in with your GitHub account.
3. Click **"Add New Project"** and select your repository.
4. Framework Preset: **Vite** (detected automatically).
5. Click **Deploy**.

---

## 💻 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run both backend server and Vite frontend
npm run dev
```
- Web App: `http://localhost:5173`
- Backend Server: `http://localhost:5000`

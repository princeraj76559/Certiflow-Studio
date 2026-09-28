import jsPDF from 'jspdf';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// In-memory image cache so we never re-decode base64 repeatedly
const imageCache = new Map();

/**
 * Loads an image from a URL/dataURI into an HTMLImageElement with caching
 */
export function loadImage(src) {
  if (imageCache.has(src)) {
    const cached = imageCache.get(src);
    if (cached.complete && cached.naturalWidth > 0) {
      return Promise.resolve(cached);
    }
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    img.onerror = (e) => reject(new Error('Failed to load base certificate image.'));
    img.src = src;
  });
}

/**
 * Ensures Google fonts or custom fonts are loaded in document.fonts
 */
export async function ensureFontLoaded(fontFamily, fontSize = 48, fontWeight = 'normal') {
  try {
    if (document.fonts && document.fonts.load) {
      await document.fonts.load(`${fontWeight} ${fontSize}px "${fontFamily}"`);
      await document.fonts.ready;
    }
  } catch (e) {
    // Non-critical fallback
  }
}

/**
 * Renders text with cross-browser letter-spacing support and accurate alignment
 */
function drawTextWithLetterSpacing(ctx, text, x, y, letterSpacing = 0, align = 'center') {
  if (!letterSpacing || letterSpacing <= 0) {
    ctx.textAlign = align;
    ctx.fillText(text, x, y);
    return;
  }

  // If modern letterSpacing is supported
  if ('letterSpacing' in ctx) {
    ctx.letterSpacing = `${letterSpacing}px`;
    ctx.textAlign = align;
    ctx.fillText(text, x, y);
    ctx.letterSpacing = '0px';
    return;
  }

  // Fallback: character-by-character positioning
  const characters = Array.from(text);
  const widths = characters.map(char => ctx.measureText(char).width);
  const totalWidth = widths.reduce((sum, w) => sum + w, 0) + (characters.length - 1) * letterSpacing;

  let currentX = x;
  if (align === 'center') {
    currentX = x - totalWidth / 2;
  } else if (align === 'right') {
    currentX = x - totalWidth;
  }

  ctx.textAlign = 'left';
  for (let i = 0; i < characters.length; i++) {
    ctx.fillText(characters[i], currentX, y);
    currentX += widths[i] + letterSpacing;
  }
}

/**
 * Renders a certificate on an HTML5 canvas element with high performance
 */
export async function renderCertificateToCanvas(baseImageSrc, textFields, rowData, targetCanvas = null, preloadedImg = null) {
  const img = preloadedImg || await loadImage(baseImageSrc);
  const canvas = targetCanvas || document.createElement('canvas');
  
  const width = img.naturalWidth || img.width || 1920;
  const height = img.naturalHeight || img.height || 1080;
  
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  const ctx = canvas.getContext('2d', { alpha: false });
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Draw base certificate
  ctx.drawImage(img, 0, 0, width, height);

  // Draw each text field
  for (const field of textFields) {
    if (!field.visible) continue;

    // Interpolate token value
    let rawText = field.textTemplate || '';
    rawText = rawText.replace(/\{(\w+)\}/g, (match, key) => {
      const matchKey = Object.keys(rowData || {}).find(k => k.toLowerCase() === key.toLowerCase());
      return matchKey && rowData[matchKey] !== undefined ? rowData[matchKey] : match;
    });

    // Apply Casing
    if (field.transform === 'uppercase') rawText = rawText.toUpperCase();
    else if (field.transform === 'lowercase') rawText = rawText.toLowerCase();
    else if (field.transform === 'capitalize') {
      rawText = rawText.replace(/\b\w/g, l => l.toUpperCase());
    }

    ctx.save();

    // Field position percentage [0..100]
    const posX = (field.x / 100) * width;
    const posY = (field.y / 100) * height;

    if (field.rotation) {
      ctx.translate(posX, posY);
      ctx.rotate((field.rotation * Math.PI) / 180);
      ctx.translate(-posX, -posY);
    }

    const fontSize = field.fontSize || 48;
    const fontWeight = field.fontWeight || 'normal';
    const fontStyle = field.fontStyle || 'normal';
    const fontFamily = field.fontFamily || 'Cinzel';

    ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px "${fontFamily}", serif, sans-serif`;
    ctx.fillStyle = field.color || '#111827';
    ctx.textBaseline = 'middle';

    const align = field.align || 'center';
    const letterSpacing = field.letterSpacing || 0;

    drawTextWithLetterSpacing(ctx, rawText, posX, posY, letterSpacing, align);

    ctx.restore();
  }

  return canvas;
}

/**
 * Generates a high-quality single PDF for a recipient (Super fast & high resolution)
 */
export async function generateSingleCertificatePdf(baseImageSrc, textFields, rowData, preloadedImg = null) {
  const canvas = await renderCertificateToCanvas(baseImageSrc, textFields, rowData, null, preloadedImg);
  const imgData = canvas.toDataURL('image/jpeg', 0.98);
  
  const isLandscape = canvas.width >= canvas.height;
  const orientation = isLandscape ? 'landscape' : 'portrait';
  
  const pdf = new jsPDF({
    orientation,
    unit: 'px',
    format: [canvas.width, canvas.height],
    hotfixes: ['px_scaling'],
  });

  pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height, undefined, 'FAST');
  return {
    pdf,
    dataUrl: pdf.output('datauristring'),
    blob: pdf.output('blob'),
    canvas,
  };
}

/**
 * Mode A: Consolidates ALL certificates into a SINGLE Multi-Page PDF file
 * Optimized for blazing fast generation (pre-loads image, pre-caches fonts, reuses canvas)
 */
export async function generateConsolidatedMultiPagePdf(baseImageSrc, textFields, rows, onProgress) {
  if (!rows || rows.length === 0) {
    throw new Error('No participants provided to generate multi-page PDF.');
  }

  // 1. Pre-load image ONCE
  const preloadedImg = await loadImage(baseImageSrc);
  const width = preloadedImg.naturalWidth || preloadedImg.width || 1920;
  const height = preloadedImg.naturalHeight || preloadedImg.height || 1080;

  // 2. Pre-load fonts ONCE
  for (const field of textFields) {
    if (field.fontFamily) {
      await ensureFontLoaded(field.fontFamily, field.fontSize || 48, field.fontWeight || 'normal');
    }
  }

  // 3. Reuse a single shared canvas
  const sharedCanvas = document.createElement('canvas');
  sharedCanvas.width = width;
  sharedCanvas.height = height;

  const isLandscape = width >= height;
  const orientation = isLandscape ? 'landscape' : 'portrait';

  const pdf = new jsPDF({
    orientation,
    unit: 'px',
    format: [width, height],
    hotfixes: ['px_scaling'],
  });

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (i > 0) {
      pdf.addPage([width, height], orientation);
    }

    // Render using cached image and shared canvas
    await renderCertificateToCanvas(baseImageSrc, textFields, row, sharedCanvas, preloadedImg);
    
    // High-quality JPEG (0.98) encodes in ~10ms per page vs 150ms for PNG
    const imgData = sharedCanvas.toDataURL('image/jpeg', 0.98);
    pdf.addImage(imgData, 'JPEG', 0, 0, width, height, undefined, 'FAST');

    if (onProgress && (i % 5 === 0 || i === rows.length - 1)) {
      onProgress(i + 1, rows.length, row);
    }
  }

  return pdf;
}

/**
 * Mode B: Generates a ZIP archive containing individual PDFs named by participant name,
 * with duplicate name deduplication.
 */
export async function exportIndividualPdfsToZip(baseImageSrc, textFields, rows, onProgress) {
  const zip = new JSZip();
  const folder = zip.folder('Certificates');
  const seenNames = new Set();
  let savedCount = 0;
  let skippedDuplicates = 0;

  const preloadedImg = await loadImage(baseImageSrc);
  for (const field of textFields) {
    if (field.fontFamily) {
      await ensureFontLoaded(field.fontFamily, field.fontSize || 48, field.fontWeight || 'normal');
    }
  }

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rawName = (row.name || row.Name || row.full_name || row.Participant || `Participant_${i + 1}`).toString().trim();
    const sanitizedName = rawName.replace(/[/\\?%*:|"<>]/g, '_');

    if (seenNames.has(sanitizedName)) {
      skippedDuplicates++;
      if (onProgress) {
        onProgress(i + 1, rows.length, rawName, true);
      }
      continue;
    }

    seenNames.add(sanitizedName);
    const { blob } = await generateSingleCertificatePdf(baseImageSrc, textFields, row, preloadedImg);
    folder.file(`${sanitizedName}_Certificate.pdf`, blob);
    savedCount++;

    if (onProgress && (i % 5 === 0 || i === rows.length - 1)) {
      onProgress(i + 1, rows.length, rawName, false);
    }
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  return { zipBlob, savedCount, skippedDuplicates };
}

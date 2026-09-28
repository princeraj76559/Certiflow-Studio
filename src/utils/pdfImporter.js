import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * Converts a PDF file into a high-resolution base64 Image DataURL
 * @param {File} file The uploaded PDF file
 * @param {number} scale Resolution scale multiplier (default 2.5 for crisp print quality)
 * @returns {Promise<{ dataUrl: string, width: number, height: number }>}
 */
export async function convertPdfToImage(file, scale = 2.5) {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  
  // Render the first page
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d', { alpha: false });
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  const renderContext = {
    canvasContext: context,
    viewport: viewport,
  };

  await page.render(renderContext).promise;
  const dataUrl = canvas.toDataURL('image/png');

  return {
    dataUrl,
    width: viewport.width,
    height: viewport.height,
    numPages: pdf.numPages
  };
}

import React, { useRef, useEffect, useState } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  UserCheck, 
  Move,
  FileDown,
  Download,
  UploadCloud,
  Eye
} from 'lucide-react';
import { renderCertificateToCanvas, generateSingleCertificatePdf } from '../../utils/pdfGenerator';
import { saveAs } from 'file-saver';

export default function CertificateCanvas({
  baseImage,
  textFields,
  setTextFields,
  selectedFieldId,
  setSelectedFieldId,
  participants = [],
  currentParticipantIndex = 0,
  setCurrentParticipantIndex
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragFieldId, setDragFieldId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const currentParticipant = participants[currentParticipantIndex] || {
    name: 'Participant Name',
    email: 'recipient@example.com',
    event: 'University Event 2026',
    date: '2026-09-20',
    role: 'Participant',
    cert_id: 'CERT-001'
  };

  // Re-render canvas whenever baseImage, textFields, or participant row changes
  useEffect(() => {
    if (!baseImage || !canvasRef.current) return;

    let isMounted = true;
    renderCertificateToCanvas(baseImage, textFields, currentParticipant, canvasRef.current)
      .catch(err => {
        if (isMounted) console.error('Canvas render error:', err);
      });

    return () => { isMounted = false; };
  }, [baseImage, textFields, currentParticipant]);

  // Handle Dragging text box on Canvas
  const handleMouseDown = (e, field) => {
    e.stopPropagation();
    setIsDragging(true);
    setDragFieldId(field.id);
    setSelectedFieldId(field.id);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
    const mouseY = ((e.clientY - rect.top) / rect.height) * 100;

    setDragOffset({
      x: mouseX - field.x,
      y: mouseY - field.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !dragFieldId || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
    const mouseY = ((e.clientY - rect.top) / rect.height) * 100;

    const newX = Math.max(0, Math.min(100, mouseX - dragOffset.x));
    const newY = Math.max(0, Math.min(100, mouseY - dragOffset.y));

    setTextFields(textFields.map(f => f.id === dragFieldId ? { ...f, x: newX, y: newY } : f));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragFieldId(null);
  };

  const handleDownloadCurrentPdf = async () => {
    if (!baseImage) return;
    try {
      const { blob } = await generateSingleCertificatePdf(baseImage, textFields, currentParticipant);
      const safeName = (currentParticipant.name || 'Certificate').replace(/[^a-zA-Z0-9_\-]/g, '_');
      saveAs(blob, `${safeName}_Certificate.pdf`);
    } catch (err) {
      alert('Error downloading PDF: ' + err.message);
    }
  };

  const handleDownloadCurrentPng = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    const safeName = (currentParticipant.name || 'Certificate').replace(/[^a-zA-Z0-9_\-]/g, '_');
    link.download = `${safeName}_Certificate.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div 
      className="flex flex-col h-full theme-card overflow-hidden select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Studio Top Control Toolbar */}
      <div className="px-4 py-2.5 border-b border-slate-200 bg-slate-50/80 flex flex-wrap items-center justify-between gap-2 flex-shrink-0">
        {/* Participant Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white rounded-xl p-0.5 border border-slate-200 shadow-sm">
            <button
              onClick={() => setCurrentParticipantIndex(Math.max(0, currentParticipantIndex - 1))}
              disabled={currentParticipantIndex === 0}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-900 disabled:opacity-30 transition-colors"
              title="Previous Participant"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold px-2 text-slate-800">
              {participants.length > 0 ? `${currentParticipantIndex + 1} / ${participants.length}` : 'Preview'}
            </span>
            <button
              onClick={() => setCurrentParticipantIndex(Math.min(participants.length - 1, currentParticipantIndex + 1))}
              disabled={participants.length === 0 || currentParticipantIndex >= participants.length - 1}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-900 disabled:opacity-30 transition-colors"
              title="Next Participant"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {participants.length > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-semibold shadow-sm">
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              <span className="truncate max-w-[180px]">{currentParticipant.name || 'Participant'}</span>
            </div>
          )}
        </div>

        {/* Zoom & Canvas Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white rounded-xl p-0.5 border border-slate-200 shadow-sm">
            <button
              onClick={() => setZoom(Math.max(0.4, zoom - 0.1))}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono font-bold px-2 text-slate-700 min-w-[42px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(Math.min(2.0, zoom + 0.1))}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom(1)}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
              title="Reset Zoom (100%)"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {baseImage && (
            <div className="flex items-center gap-1">
              <button
                onClick={handleDownloadCurrentPdf}
                className="flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-sm transition-colors"
                title="Download Single Preview PDF"
              >
                <FileDown className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden md:inline">Test PDF</span>
              </button>
              <button
                onClick={handleDownloadCurrentPng}
                className="flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-sm transition-colors"
                title="Download Single Preview PNG image"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span className="hidden md:inline">PNG</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Interactive Canvas Area (Fits directly within height) */}
      <div 
        ref={containerRef}
        className="flex-1 bg-slate-100/70 p-4 flex items-center justify-center relative overflow-hidden min-h-0"
      >
        {baseImage ? (
          <div 
            className="relative transition-transform duration-100 ease-out shadow-xl rounded-xl overflow-visible max-h-full max-w-full flex items-center justify-center"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
          >
            {/* Main Rendering Canvas */}
            <canvas
              ref={canvasRef}
              className="rounded-xl shadow-md border border-slate-300 max-h-[calc(100vh-280px)] max-w-full w-auto h-auto object-contain block bg-white"
            />

            {/* Interactive Draggable Bounding Boxes Overlay with Anchor Alignment */}
            {textFields.map((field) => {
              const isSelected = selectedFieldId === field.id;
              let displayText = field.textTemplate || '';
              displayText = displayText.replace(/\{(\w+)\}/g, (match, key) => {
                const matchKey = Object.keys(currentParticipant || {}).find(k => k.toLowerCase() === key.toLowerCase());
                return matchKey && currentParticipant[matchKey] !== undefined ? currentParticipant[matchKey] : match;
              });

              const align = field.align || 'center';
              const transformTranslate = align === 'left' 
                ? 'translate(0%, -50%)' 
                : (align === 'right' ? 'translate(-100%, -50%)' : 'translate(-50%, -50%)');

              return (
                <div
                  key={field.id}
                  onMouseDown={(e) => handleMouseDown(e, field)}
                  style={{
                    left: `${field.x}%`,
                    top: `${field.y}%`,
                    transform: transformTranslate,
                  }}
                  className={`absolute cursor-move select-none transition-all group ${
                    isSelected 
                      ? 'ring-2 ring-slate-900 ring-dashed bg-slate-900/10 p-2 rounded-xl z-20 shadow-sm' 
                      : 'hover:ring-1 hover:ring-slate-400 p-1.5 rounded-lg z-10'
                  }`}
                >
                  {/* Drag Handle Tag */}
                  <div className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap flex items-center gap-1 shadow-sm ${
                    isSelected ? 'bg-slate-900 text-white opacity-100' : 'bg-white text-slate-700 opacity-0 group-hover:opacity-100 border border-slate-200'
                  }`}>
                    <Move className="w-2.5 h-2.5" />
                    <span>{field.name}</span>
                  </div>

                  <div className={`opacity-0 pointer-events-none text-xs font-semibold px-2 py-0.5 text-${align}`}>
                    {displayText || field.name}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center p-8 max-w-md">
            <div className="w-16 h-16 rounded-3xl bg-white border border-slate-200 text-slate-400 mx-auto flex items-center justify-center mb-4 shadow-sm">
              <UploadCloud className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No Certificate Uploaded</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Upload your base blank certificate file (PDF, PNG, JPG, or WebP) on the left panel to begin previewing and positioning names.
            </p>
          </div>
        )}
      </div>

      {/* Canvas Footer Bar */}
      <div className="px-4 py-2 bg-white border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <Move className="w-3.5 h-3.5 text-slate-400" />
          <span>Interactive Studio: Drag text boxes directly on the certificate to position recipient name.</span>
        </div>
        <span className="font-mono text-slate-400">
          Lossless 300 DPI High Speed Engine
        </span>
      </div>
    </div>
  );
}

import React, { useRef, useState } from 'react';
import { Upload, FileText, CheckCircle2, Trash2, RefreshCw, FileImage } from 'lucide-react';
import { convertPdfToImage } from '../../utils/pdfImporter';

export default function Step1_BaseCertificate({ 
  baseImage, 
  setBaseImage,
  certificateFileName,
  setCertificateFileName
}) {
  const fileInputRef = useRef(null);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCertificateFileName(file.name);

    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      setIsLoadingPdf(true);
      try {
        const { dataUrl } = await convertPdfToImage(file, 2.5);
        setBaseImage(dataUrl);
      } catch (err) {
        alert('Failed to parse PDF certificate: ' + err.message);
      } finally {
        setIsLoadingPdf(false);
      }
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBaseImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearCertificate = () => {
    setBaseImage(null);
    setCertificateFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <FileImage className="w-4 h-4 text-slate-900" />
          <span>1. Base Certificate File</span>
        </label>
        {baseImage && (
          <span className="pill-badge bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Ready
          </span>
        )}
      </div>

      <p className="text-xs text-slate-500 leading-relaxed">
        Upload your blank certificate design without participant names. Supports <strong>PDF, PNG, JPG, and WebP</strong> files.
      </p>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".pdf, image/png, image/jpeg, image/webp"
        className="hidden"
      />

      {baseImage ? (
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="truncate">
              <span className="text-xs font-bold text-slate-900 block truncate">
                {certificateFileName || 'Uploaded Certificate'}
              </span>
              <span className="text-[11px] text-slate-500">Vector High-Resolution Template</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Replace
            </button>
            <button
              onClick={handleClearCertificate}
              title="Remove Certificate"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 hover:border-slate-900 bg-slate-50/70 hover:bg-slate-50 rounded-2xl p-5 text-center cursor-pointer transition-all group"
        >
          {isLoadingPdf ? (
            <div className="py-2 flex flex-col items-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-slate-900" />
              <span className="text-xs font-medium text-slate-700">Rendering PDF Certificate...</span>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 group-hover:border-slate-900 group-hover:bg-slate-900 text-slate-700 group-hover:text-white mx-auto flex items-center justify-center transition-all mb-2.5 shadow-sm">
                <Upload className="w-4 h-4 stroke-[2.2]" />
              </div>
              <p className="text-xs font-bold text-slate-900">
                Click to Upload Base Certificate
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Supports PDF Documents, High-Res PNG, JPG, WebP
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

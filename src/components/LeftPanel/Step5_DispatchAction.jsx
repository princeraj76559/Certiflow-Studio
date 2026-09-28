import React from 'react';
import { 
  Printer, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  HardDrive
} from 'lucide-react';

export default function Step5_DispatchAction({
  mode,
  isReady,
  validationErrors = [],
  totalParticipants = 0,
  isProcessing = false,
  onStartProcess,
  exportIndividualZip
}) {
  return (
    <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3.5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
          <Send className="w-4 h-4 text-slate-900" />
          <span>Execution Center</span>
        </span>
        <span className="pill-badge bg-slate-100 text-slate-700">
          {totalParticipants} in queue
        </span>
      </div>

      {/* Validation Checklist / Warning */}
      {validationErrors.length > 0 ? (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-rose-800">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
            <span>Action Required:</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] text-rose-700 pl-1">
            {validationErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
          <span>Ready to generate {totalParticipants} certificate(s)!</span>
        </div>
      )}

      {/* Primary Action Button */}
      <button
        onClick={onStartProcess}
        disabled={!isReady || isProcessing || totalParticipants === 0}
        className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm ${
          !isReady || totalParticipants === 0
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
            : isProcessing
            ? 'bg-slate-900 text-white animate-pulse'
            : mode === 'print'
            ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-md'
            : 'bg-slate-900 hover:bg-slate-800 text-white shadow-md'
        }`}
      >
        {isProcessing ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Processing Batch...</span>
          </>
        ) : mode === 'print' ? (
          <>
            <Printer className="w-4 h-4 stroke-[2.2]" />
            <span>Generate Consolidated Multi-Page PDF</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4 stroke-[2.2]" />
            <span>
              {exportIndividualZip ? 'Dispatch Emails & Export ZIP' : 'Start Batch Email Dispatch'}
            </span>
          </>
        )}
      </button>

      {mode === 'email' && exportIndividualZip && (
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 justify-center">
          <HardDrive className="w-3.5 h-3.5 text-slate-600" />
          <span>Individual PDFs will be downloaded as a ZIP archive.</span>
        </div>
      )}
    </div>
  );
}

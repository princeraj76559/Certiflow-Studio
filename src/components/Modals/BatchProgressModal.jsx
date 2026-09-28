import React from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertCircle, 
  FileSpreadsheet, 
  Download, 
  RefreshCw,
  Send,
  Printer,
  Terminal
} from 'lucide-react';
import * as XLSX from 'xlsx';

export default function BatchProgressModal({
  isOpen,
  onClose,
  mode,
  isComplete,
  currentIndex,
  totalItems,
  currentName,
  results = [],
  logs = [],
  onDownloadReport,
  onCancel
}) {
  if (!isOpen) return null;

  const percent = totalItems > 0 ? Math.round((currentIndex / totalItems) * 100) : 0;
  const sentCount = results.filter(r => r.status === 'success').length;
  const failedCount = results.filter(r => r.status === 'failed').length;

  const handleExportLocalExcel = () => {
    if (onDownloadReport) {
      onDownloadReport();
      return;
    }

    const reportData = results.map((r, idx) => ({
      'S.No': idx + 1,
      'Recipient Name': r.name || 'N/A',
      'Email Address': r.email || 'N/A',
      'Delivery Status': r.status === 'success' ? 'SENT' : (r.status === 'failed' ? 'FAILED' : 'SKIPPED'),
      'Timestamp': r.timestamp ? new Date(r.timestamp).toLocaleString() : new Date().toLocaleString(),
      'Message / Error Details': r.error || (r.status === 'success' ? 'Delivered successfully' : 'Processed'),
      'Certificate File': `${(r.name || 'Certificate').replace(/[^a-zA-Z0-9_\-]/g, '_')}.pdf`,
    }));

    const ws = XLSX.utils.json_to_sheet(reportData);
    ws['!cols'] = [{ wch: 6 }, { wch: 25 }, { wch: 30 }, { wch: 15 }, { wch: 22 }, { wch: 35 }, { wch: 30 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Delivery Status');
    XLSX.writeFile(wb, `Certificate_Delivery_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
              isComplete ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-900 text-white'
            }`}>
              {mode === 'print' ? <Printer className="w-5 h-5" /> : <Send className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {isComplete 
                  ? (mode === 'print' ? 'PDF Compilation Completed!' : 'Batch Email Dispatch Completed!')
                  : (mode === 'print' ? 'Compiling Multi-Page PDF...' : 'Dispatching Certificates via SMTP...')}
              </h2>
              <p className="text-xs text-slate-500">
                {isComplete 
                  ? `Processed ${totalItems} participants successfully`
                  : `Currently processing: ${currentName || 'Preparing...'}`}
              </p>
            </div>
          </div>
          {isComplete && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-600">Progress: {currentIndex} of {totalItems}</span>
              <span className="text-slate-900 font-bold text-sm">{percent}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 p-0.5 border border-slate-200 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300 bg-slate-900 shadow-sm"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[11px] font-semibold text-slate-500 block">Total</span>
              <span className="text-lg font-bold text-slate-900">{totalItems}</span>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
              <span className="text-[11px] font-semibold text-emerald-700 block">Delivered</span>
              <span className="text-lg font-bold text-emerald-800">{sentCount}</span>
            </div>
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-center">
              <span className="text-[11px] font-semibold text-rose-700 block">Failed</span>
              <span className="text-lg font-bold text-rose-800">{failedCount}</span>
            </div>
          </div>

          {/* Activity Console */}
          <div className="rounded-2xl border border-slate-200 bg-slate-900 text-slate-200 overflow-hidden">
            <div className="px-3.5 py-2 border-b border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono text-[11px]">Execution Stream</span>
              </div>
              {!isComplete && (
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                  <RefreshCw className="w-2.5 h-2.5 animate-spin" /> Live
                </span>
              )}
            </div>
            <div className="p-3 max-h-40 overflow-y-auto space-y-1 font-mono text-[11px]">
              {logs.length === 0 ? (
                <div className="text-slate-500 italic">Initializing batch queue...</div>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className={`flex items-start gap-2 ${
                    log.type === 'error' ? 'text-rose-400' : (log.type === 'success' ? 'text-emerald-400' : 'text-slate-300')
                  }`}>
                    <span className="text-slate-500 select-none">[{log.time || 'NOW'}]</span>
                    <span>{log.text}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Post-Completion Excel Download Button */}
          {isComplete && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-950">Delivery Status Report Ready</h4>
                  <p className="text-[11px] text-emerald-700">Download the Excel sheet with delivery status per participant</p>
                </div>
              </div>
              <button
                onClick={handleExportLocalExcel}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Excel (.xlsx)</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50/80 flex justify-end gap-2">
          {!isComplete && onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-colors"
            >
              Cancel Process
            </button>
          )}

          {isComplete && (
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

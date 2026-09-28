import React from 'react';
import { 
  Users, 
  MailCheck, 
  Printer, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  ArrowUpRight
} from 'lucide-react';

export default function StatsOverview({ 
  totalCount = 0, 
  sentCount = 0, 
  failedCount = 0, 
  mode = 'email', 
  isProcessing = false 
}) {
  const readyCount = Math.max(0, totalCount - (sentCount + failedCount));
  const successRate = totalCount > 0 && (sentCount + failedCount) > 0 
    ? Math.round((sentCount / (sentCount + failedCount)) * 100) 
    : 100;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-3.5 flex-shrink-0">
      {/* Total Recipients */}
      <div className="theme-card p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Total Participants</span>
          <div className="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
            <Users className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900 tracking-tight">{totalCount}</span>
          <span className="pill-badge bg-emerald-50 text-emerald-700 text-[10px]">
            <ArrowUpRight className="w-2.5 h-2.5" /> loaded
          </span>
        </div>
        <div className="mt-2.5 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-slate-900 h-full rounded-full transition-all duration-300" 
            style={{ width: `${totalCount > 0 ? 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Mode Specific: Pages or Dispatched Emails */}
      {mode === 'print' ? (
        <div className="theme-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Print Pages (PDF)</span>
            <div className="w-7 h-7 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
              <Printer className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">{totalCount}</span>
            <span className="pill-badge bg-amber-50 text-amber-800 text-[10px]">
              Multi-page PDF
            </span>
          </div>
          <div className="mt-2.5 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-amber-600 h-full rounded-full transition-all duration-300" 
              style={{ width: `${totalCount > 0 ? 100 : 0}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="theme-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Emails Sent</span>
            <div className="w-7 h-7 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700">
              <MailCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">{sentCount}</span>
            <span className="pill-badge bg-blue-50 text-blue-800 text-[10px]">
              of {totalCount}
            </span>
          </div>
          <div className="mt-2.5 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-blue-600 h-full rounded-full transition-all duration-300" 
              style={{ width: `${totalCount > 0 ? (sentCount / totalCount) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      {/* Ready in Queue */}
      <div className="theme-card p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">In Queue</span>
          <div className="w-7 h-7 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700">
            <Layers className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900 tracking-tight">{readyCount}</span>
          <span className="pill-badge bg-slate-100 text-slate-700 text-[10px]">
            {isProcessing ? 'processing...' : 'ready'}
          </span>
        </div>
        <div className="mt-2.5 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-purple-600 h-full rounded-full transition-all duration-300" 
            style={{ width: `${totalCount > 0 ? (readyCount / totalCount) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Delivery Health */}
      <div className="theme-card p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Delivery Status</span>
          <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${
            failedCount > 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-700'
          }`}>
            {failedCount > 0 ? <AlertCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
          </div>
        </div>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900 tracking-tight">{successRate}%</span>
          <span className={`pill-badge text-[10px] ${
            failedCount > 0 ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
          }`}>
            {failedCount > 0 ? `${failedCount} error` : 'Optimal'}
          </span>
        </div>
        <div className="mt-2.5 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-300 ${
              failedCount > 0 ? 'bg-rose-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${successRate}%` }}
          />
        </div>
      </div>
    </div>
  );
}

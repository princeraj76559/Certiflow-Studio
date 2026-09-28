import React from 'react';
import { 
  Award, 
  RotateCcw, 
  Printer, 
  Mail,
  ShieldCheck,
  FileCheck
} from 'lucide-react';

export default function Header({ 
  mode, 
  setMode, 
  onReset, 
  onOpenAppPasswordGuide, 
  totalParticipants = 0,
  hasCertificate = false
}) {
  return (
    <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-30 flex-shrink-0">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center shadow-sm">
          <Award className="w-5 h-5 text-white stroke-[2.2]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-slate-900 tracking-tight">CertiFlow</h1>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Studio
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Certificate Generation & Automated Distribution</p>
        </div>
      </div>

      {/* Mode Switcher Pill */}
      <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200">
        <button
          onClick={() => setMode('email')}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            mode === 'email'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Mail className="w-3.5 h-3.5 text-blue-600" />
          Send on Email
        </button>

        <button
          onClick={() => setMode('print')}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            mode === 'print'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Printer className="w-3.5 h-3.5 text-amber-600" />
          Print Physically (Single PDF)
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onOpenAppPasswordGuide}
          title="SMTP & App Password Setup Guide"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
          <span>SMTP Guide</span>
        </button>

        <button
          onClick={onReset}
          title="Reset all settings"
          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}

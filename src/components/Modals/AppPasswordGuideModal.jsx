import React, { useState } from 'react';
import { 
  X, 
  Key, 
  ExternalLink, 
  ShieldCheck, 
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { SMTP_PRESETS } from '../../../server/smtpPresets.js';

export default function AppPasswordGuideModal({ isOpen, onClose, defaultProvider = 'gmail' }) {
  const [selectedProvider, setSelectedProvider] = useState(defaultProvider);

  if (!isOpen) return null;

  const currentPreset = SMTP_PRESETS[selectedProvider] || SMTP_PRESETS.gmail;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">App Password & SMTP Setup Guide</h2>
              <p className="text-xs text-slate-500">Learn how to securely configure email dispatching</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 pb-2 border-b border-slate-100 flex gap-2 overflow-x-auto bg-slate-50/40">
          {Object.entries(SMTP_PRESETS).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => setSelectedProvider(key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                selectedProvider === key
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>{preset.name}</span>
            </button>
          ))}
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-700">
          {/* Important Security Notice */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex gap-3 text-amber-900 text-xs">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-700 mt-0.5" />
            <div>
              <span className="font-bold text-amber-900">Why use an App Password?</span>
              <p className="mt-1 text-amber-800/90 leading-relaxed">
                Modern email providers like Google & Microsoft do not allow using your master account password for third-party automated tools. App Passwords are secure 16-character keys generated specifically for applications.
              </p>
            </div>
          </div>

          {/* Provider Specific Step-by-Step Instructions */}
          <div>
            <h3 className="font-bold text-slate-900 mb-2.5 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              Steps for {currentPreset.name}
            </h3>

            <div className="space-y-2">
              {currentPreset.helpSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </span>
                  <span className="text-xs text-slate-700 pt-0.5 leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Direct Link Button */}
          {currentPreset.guideUrl && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Direct Security Page Link</span>
                <p className="text-[11px] text-slate-500">Open your provider's security portal in a new tab</p>
              </div>
              <a
                href={currentPreset.guideUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm"
              >
                <span>Open Security Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}

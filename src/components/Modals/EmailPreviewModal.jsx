import React from 'react';
import { X, Mail, FileText, Tag } from 'lucide-react';

export default function EmailPreviewModal({ 
  isOpen, 
  onClose, 
  template, 
  smtpConfig, 
  sampleRecipient 
}) {
  if (!isOpen) return null;

  const recipient = sampleRecipient || {
    name: 'Sample Participant',
    email: 'recipient@example.com',
    event: 'University Tech Fest',
    date: '2026-09-20',
    role: 'Student Coordinator',
    cert_id: 'CERT-001'
  };

  const interpolate = (text) => {
    if (!text) return '';
    return text.replace(/\{(\w+)\}/g, (match, key) => {
      const matchKey = Object.keys(recipient).find(k => k.toLowerCase() === key.toLowerCase());
      return matchKey && recipient[matchKey] !== undefined ? recipient[matchKey] : match;
    });
  };

  const renderedSubject = interpolate(template.subject || 'Your Certificate of Achievement');
  const renderedBody = interpolate(template.body || 'Dear {name},\n\nPlease find your certificate attached.');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Email Delivery Simulation</h2>
              <p className="text-xs text-slate-500">Preview how participants receive their certificate in their inbox</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email Client Container */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            {/* Metadata */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/70 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-16 font-semibold text-slate-500">From:</span>
                <span className="text-slate-800 font-mono">
                  {smtpConfig.user ? `"Certificate Automation" <${smtpConfig.user}>` : 'organizer@university.edu'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-16 font-semibold text-slate-500">To:</span>
                <span className="text-blue-700 font-mono font-semibold">
                  {recipient.name} &lt;{recipient.email}&gt;
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-16 font-semibold text-slate-500">Subject:</span>
                <span className="text-slate-900 font-bold text-sm">{renderedSubject}</span>
              </div>
            </div>

            {/* Email Body */}
            <div className="p-6 bg-white text-slate-800 min-h-[160px] text-sm leading-relaxed prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: renderedBody.replace(/\n/g, '<br/>') }} />
            </div>

            {/* Attachment Box */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    {recipient.name.replace(/[^a-zA-Z0-9_\-]/g, '_')}_Certificate.pdf
                  </span>
                  <span className="text-[10px] text-slate-500">PDF Document • Lossless Vector</span>
                </div>
              </div>
              <span className="pill-badge bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px]">
                Auto Attached
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-sm"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}

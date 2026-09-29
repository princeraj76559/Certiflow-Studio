import React from 'react';
import { 
  Mail, 
  Printer, 
  Key, 
  Server, 
  ShieldCheck, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Eye, 
  HardDrive,
  Sliders,
  Send
} from 'lucide-react';
import { SMTP_PRESETS } from '../../../server/smtpPresets.js';

export default function Step4_ModeConfig({
  mode,
  setMode,
  smtpConfig,
  setSmtpConfig,
  emailTemplate,
  setEmailTemplate,
  exportIndividualZip,
  setExportIndividualZip,
  onOpenAppPasswordGuide,
  onOpenEmailPreview,
  onTestSmtpConnection,
  smtpTestStatus
}) {
  const handleProviderChange = (providerId) => {
    const preset = SMTP_PRESETS[providerId];
    if (preset) {
      setSmtpConfig({
        ...smtpConfig,
        provider: providerId,
        host: preset.host,
        port: preset.port,
        secure: preset.secure,
      });
    }
  };

  const activePreset = SMTP_PRESETS[smtpConfig.provider] || SMTP_PRESETS.gmail;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-slate-900" />
          <span>4. Workflow & Dispatch Options</span>
        </label>
      </div>

      {/* Mode Toggle Cards */}
      <div className="grid grid-cols-2 gap-2">
        <div
          onClick={() => setMode('email')}
          className={`p-3.5 rounded-2xl cursor-pointer border transition-all text-xs flex flex-col justify-between ${
            mode === 'email'
              ? 'bg-blue-50/70 border-blue-500/50 shadow-sm'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-blue-600" />
              Send on Email
            </span>
            {mode === 'email' && <div className="w-2 h-2 rounded-full bg-blue-600" />}
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Batch dispatch via SMTP to each recipient's inbox.
          </p>
        </div>

        <div
          onClick={() => setMode('print')}
          className={`p-3.5 rounded-2xl cursor-pointer border transition-all text-xs flex flex-col justify-between ${
            mode === 'print'
              ? 'bg-amber-50/70 border-amber-500/50 shadow-sm'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Printer className="w-4 h-4 text-amber-600" />
              Print Physically
            </span>
            {mode === 'print' && <div className="w-2 h-2 rounded-full bg-amber-600" />}
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Merge all certificates into a single multi-page PDF.
          </p>
        </div>
      </div>

      {/* Mode A: Physical Print Settings */}
      {mode === 'print' && (
        <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 text-xs space-y-2">
          <div className="flex items-center gap-2 text-amber-800 font-bold">
            <Printer className="w-4 h-4 text-amber-700" />
            <span>Single Multi-Page PDF Print Settings</span>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            Generates a <strong>single high-resolution multi-page PDF document</strong> containing all participants on separate pages with identical orientation and zero quality degradation.
          </p>
        </div>
      )}

      {/* Mode B: Send on Email Configuration */}
      {mode === 'email' && (
        <div className="space-y-3">
          {/* SMTP Provider Selector */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-900 block uppercase tracking-wider">
                Email Service Provider
              </span>
              <button
                onClick={onOpenAppPasswordGuide}
                className="text-[11px] font-semibold text-blue-600 hover:underline flex items-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>App Password Guide</span>
              </button>
            </div>

            <select
              value={smtpConfig.provider}
              onChange={(e) => handleProviderChange(e.target.value)}
              className="w-full theme-input px-3 py-2 text-xs text-slate-900 bg-white"
            >
              {Object.entries(SMTP_PRESETS).map(([key, preset]) => (
                <option key={key} value={key}>
                  {preset.name}
                </option>
              ))}
            </select>

            {/* Provider Hint */}
            {activePreset.hint && (
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 leading-relaxed flex items-start gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-700 flex-shrink-0 mt-0.5" />
                <span>{activePreset.hint}</span>
              </div>
            )}

            {/* Sender Email & App Password */}
            <div className="space-y-2.5 pt-1">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Sender Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={smtpConfig.user}
                  onChange={(e) => setSmtpConfig({ ...smtpConfig, user: e.target.value })}
                  placeholder="e.g. yourname@gmail.com"
                  className="w-full theme-input px-3 py-1.5 text-xs text-slate-900"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-slate-700">
                    App Password (16-char) <span className="text-rose-500">*</span>
                  </label>
                  <button
                    onClick={onOpenAppPasswordGuide}
                    className="text-[10px] text-blue-600 hover:underline font-medium"
                  >
                    How to get?
                  </button>
                </div>
                <input
                  type="password"
                  value={smtpConfig.pass}
                  onChange={(e) => setSmtpConfig({ ...smtpConfig, pass: e.target.value })}
                  placeholder="xxxx xxxx xxxx xxxx"
                  className="w-full theme-input px-3 py-1.5 text-xs text-slate-900 font-mono"
                />
              </div>
            </div>

            {/* Custom SMTP host & port */}
            {smtpConfig.provider === 'custom' && (
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <div>
                  <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">SMTP Host</label>
                  <input
                    type="text"
                    value={smtpConfig.host}
                    onChange={(e) => setSmtpConfig({ ...smtpConfig, host: e.target.value })}
                    placeholder="smtp.domain.edu"
                    className="w-full theme-input px-2.5 py-1 text-xs text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">Port</label>
                  <input
                    type="number"
                    value={smtpConfig.port}
                    onChange={(e) => setSmtpConfig({ ...smtpConfig, port: e.target.value })}
                    placeholder="587"
                    className="w-full theme-input px-2.5 py-1 text-xs text-slate-900 font-mono"
                  />
                </div>
              </div>
            )}

            {/* Test Connection Button */}
            <div className="pt-1 flex items-center justify-between">
              <button
                onClick={onTestSmtpConnection}
                disabled={smtpTestStatus?.loading || !smtpConfig.user || !smtpConfig.pass}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-colors disabled:opacity-40"
              >
                {smtpTestStatus?.loading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-700" />
                ) : (
                  <Server className="w-3.5 h-3.5 text-slate-700" />
                )}
                <span>Test SMTP Connection</span>
              </button>

              {smtpTestStatus && !smtpTestStatus.loading && (
                <span className={`text-[11px] font-semibold flex items-center gap-1 ${
                  smtpTestStatus.success ? 'text-emerald-700' : 'text-rose-600'
                }`}>
                  {smtpTestStatus.success ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                  {smtpTestStatus.success ? 'Connected' : 'Auth Failed'}
                </span>
              )}
            </div>
          </div>

          {/* Export Individual PDFs to ZIP Option */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={exportIndividualZip}
                onChange={(e) => setExportIndividualZip(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-slate-900 focus:ring-0 cursor-pointer"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <HardDrive className="w-3.5 h-3.5 text-slate-700" />
                  Save individual PDFs to hard disk (ZIP)
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  Downloads a ZIP containing each participant's certificate. Duplicate names are deduplicated.
                </p>
              </div>
            </label>
          </div>

          {/* Email Subject & Message Customizer */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-900 block uppercase tracking-wider">
                Email Message Template
              </span>
              <button
                onClick={onOpenEmailPreview}
                className="text-[11px] font-semibold text-blue-600 hover:underline flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Simulate Inbox</span>
              </button>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">Email Subject</label>
              <input
                type="text"
                value={emailTemplate.subject}
                onChange={(e) => setEmailTemplate({ ...emailTemplate, subject: e.target.value })}
                placeholder="Your Certificate of Achievement - {event}"
                className="w-full theme-input px-3 py-1.5 text-xs text-slate-900 font-medium"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-slate-700">Message Body</label>
                <div className="flex gap-1">
                  {['{name}', '{event}', '{date}', '{role}'].map(tag => (
                    <button
                      key={tag}
                      onClick={() => setEmailTemplate({
                        ...emailTemplate,
                        body: emailTemplate.body + ' ' + tag
                      })}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono transition-colors"
                    >
                      +{tag}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                rows={5}
                value={emailTemplate.body}
                onChange={(e) => setEmailTemplate({ ...emailTemplate, body: e.target.value })}
                placeholder={`Dear {name},\n\nPlease find your certificate attached.\n\nWarm regards,\nOrganizing Committee`}
                className="w-full theme-input p-2.5 text-xs text-slate-900 font-sans leading-relaxed whitespace-pre-wrap"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

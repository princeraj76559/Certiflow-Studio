import React, { useRef } from 'react';
import { 
  FileSpreadsheet, 
  Upload, 
  Download, 
  AlertCircle, 
  CheckCircle2, 
  Trash2,
  Users
} from 'lucide-react';
import { parseExcelFile, downloadSampleExcelTemplate } from '../../utils/excelParser';

export default function Step2_RecipientsExcel({
  excelData,
  setExcelData,
  columnMapping,
  setColumnMapping,
  mode
}) {
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const parsed = await parseExcelFile(file);
      setExcelData(parsed);
      setColumnMapping({
        name: parsed.detectedNameCol,
        email: parsed.detectedEmailCol,
      });
    } catch (err) {
      alert('Error parsing spreadsheet: ' + err.message);
    }
  };

  const handleClearExcel = () => {
    setExcelData(null);
    setColumnMapping({ name: '', email: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const hasData = excelData && excelData.rows && excelData.rows.length > 0;
  const isEmailMissing = mode === 'email' && hasData && (!columnMapping.email || !excelData.headers.includes(columnMapping.email));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>2. Recipients Spreadsheet</span>
        </label>
        {hasData && (
          <span className="pill-badge bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> {excelData.totalRows} loaded
          </span>
        )}
      </div>

      <p className="text-xs text-slate-500 leading-relaxed">
        Upload your participant list spreadsheet (.xlsx, .xls, .csv).
        {mode === 'print' 
          ? ' Only the recipient Name column is required for physical printing.'
          : ' Both Name and Email columns are required for email dispatching.'}
      </p>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".xlsx, .xls, .csv"
        className="hidden"
      />

      {hasData ? (
        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div className="truncate">
                <span className="text-xs font-bold text-slate-900 block truncate">
                  {excelData.fileName || 'Spreadsheet Loaded'}
                </span>
                <span className="text-[11px] text-slate-500">
                  {excelData.totalRows} participant rows detected
                </span>
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
                onClick={handleClearExcel}
                title="Remove Spreadsheet"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Column Mapping Selectors */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2.5">
            <span className="text-[11px] font-bold text-slate-900 block uppercase tracking-wider">
              Column Mapping
            </span>

            <div>
              <label className="text-[11px] text-slate-600 font-medium block mb-1">
                Recipient Name Column <span className="text-rose-500">*</span>
              </label>
              <select
                value={columnMapping.name || ''}
                onChange={(e) => setColumnMapping({ ...columnMapping, name: e.target.value })}
                className="w-full theme-input px-3 py-1.5 text-xs text-slate-900"
              >
                {excelData.headers.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>

            {mode === 'email' && (
              <div>
                <label className="text-[11px] text-slate-600 font-medium block mb-1">
                  Recipient Email Column <span className="text-rose-500">*</span>
                </label>
                <select
                  value={columnMapping.email || ''}
                  onChange={(e) => setColumnMapping({ ...columnMapping, email: e.target.value })}
                  className="w-full theme-input px-3 py-1.5 text-xs text-slate-900"
                >
                  <option value="" disabled>Select Email Column</option>
                  {excelData.headers.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 hover:border-emerald-600 bg-slate-50/70 hover:bg-emerald-50/30 rounded-2xl p-5 text-center cursor-pointer transition-all group"
        >
          <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 group-hover:border-emerald-600 group-hover:bg-emerald-600 text-slate-700 group-hover:text-white mx-auto flex items-center justify-center transition-all mb-2.5 shadow-sm">
            <Upload className="w-4 h-4 stroke-[2.2]" />
          </div>
          <p className="text-xs font-bold text-slate-900">
            Click to Upload Excel / CSV File
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Supports .xlsx, .xls, and .csv files
          </p>
        </div>
      )}

      {/* Missing Email Column Warning Alert */}
      {isEmailMissing && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600 mt-0.5" />
          <div>
            <span className="font-bold block">Email Column Required</span>
            <p className="mt-0.5 text-rose-700 text-[11px] leading-relaxed">
              "Send on Email" mode requires an Email column. Please select a valid email column above or upload a spreadsheet with participant emails.
            </p>
          </div>
        </div>
      )}

      {/* Sample Template Link */}
      <div className="pt-0.5">
        <button
          onClick={downloadSampleExcelTemplate}
          className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 transition-colors text-[11px] font-medium"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Need a template? Download Sample Excel Sheet</span>
        </button>
      </div>
    </div>
  );
}

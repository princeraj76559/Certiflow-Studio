import React, { useState } from 'react';
import { 
  Search, 
  Eye, 
  FileDown, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Users,
  FileSpreadsheet,
  Trash2
} from 'lucide-react';
import { generateSingleCertificatePdf } from '../../utils/pdfGenerator';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

export default function RecipientTable({
  participants = [],
  deliveryResults = [],
  baseImage,
  textFields,
  onSelectParticipantForPreview,
  currentSelectedIndex,
  mode
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRows = participants.map((row, idx) => {
    const result = deliveryResults.find(r => r.index === idx || (r.email && r.email === row.email));
    return {
      ...row,
      originalIndex: idx,
      deliveryStatus: result ? result.status : 'ready',
      deliveryError: result ? result.error : null,
      deliveryTime: result ? result.timestamp : null,
    };
  }).filter(row => {
    const term = searchTerm.toLowerCase();
    const name = String(row.name || row.Name || '').toLowerCase();
    const email = String(row.email || row.Email || '').toLowerCase();
    const role = String(row.role || row.Role || '').toLowerCase();
    return name.includes(term) || email.includes(term) || role.includes(term);
  });

  const handleDownloadSinglePdf = async (row) => {
    if (!baseImage) {
      alert('Please upload a base certificate first.');
      return;
    }
    try {
      const { blob } = await generateSingleCertificatePdf(baseImage, textFields, row);
      const safeName = (row.name || row.Name || 'Certificate').toString().replace(/[^a-zA-Z0-9_\-]/g, '_');
      saveAs(blob, `${safeName}_Certificate.pdf`);
    } catch (err) {
      alert('Error downloading PDF: ' + err.message);
    }
  };

  const handleExportTableToExcel = () => {
    if (participants.length === 0) return;
    const exportData = filteredRows.map((r, i) => ({
      'S.No': i + 1,
      'Name': r.name || r.Name || 'N/A',
      'Email': r.email || r.Email || 'N/A',
      'Role': r.role || r.Role || 'Participant',
      'Status': r.deliveryStatus.toUpperCase(),
      'Timestamp': r.deliveryTime ? new Date(r.deliveryTime).toLocaleString() : 'N/A',
      'Error': r.deliveryError || 'None',
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Participants');
    XLSX.writeFile(wb, `CertiFlow_Participants_List_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className="theme-card rounded-2xl overflow-hidden flex flex-col h-full">
      {/* Table Header Controls */}
      <div className="p-3.5 border-b border-slate-200 bg-slate-50/80 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-slate-700" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            Participant Records & Status
          </h3>
          <span className="pill-badge bg-white text-slate-700 border border-slate-200">
            {filteredRows.length} Rows
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search name, email..."
              className="theme-input pl-8 pr-3 py-1 text-xs text-slate-900 w-48 sm:w-60 bg-white"
            />
          </div>

          {/* Export Excel Button */}
          <button
            onClick={handleExportTableToExcel}
            disabled={participants.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 transition-colors disabled:opacity-40 shadow-sm"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Export Excel</span>
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-100/90 text-slate-600 uppercase text-[10px] font-bold tracking-wider sticky top-0 border-b border-slate-200 z-10">
            <tr>
              <th className="py-2.5 px-4 w-12">#</th>
              <th className="py-2.5 px-4">Recipient Name</th>
              <th className="py-2.5 px-4">Email Address</th>
              <th className="py-2.5 px-4">Role / Details</th>
              <th className="py-2.5 px-4">Status</th>
              <th className="py-2.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-12 text-center text-slate-400 italic">
                  {participants.length === 0 
                    ? 'No participants loaded yet. Upload your spreadsheet on the left panel.' 
                    : 'No matching participants found for your search query.'}
                </td>
              </tr>
            ) : (
              filteredRows.map((row, index) => {
                const isSelected = row.originalIndex === currentSelectedIndex;
                return (
                  <tr 
                    key={index} 
                    className={`hover:bg-slate-50 transition-colors ${
                      isSelected ? 'bg-blue-50/60 font-medium' : ''
                    }`}
                  >
                    <td className="py-2.5 px-4 font-mono text-slate-400 text-[11px]">{index + 1}</td>
                    <td className="py-2.5 px-4 font-semibold text-slate-900">
                      {row.name || row.Name || 'Unnamed'}
                    </td>
                    <td className="py-2.5 px-4 text-slate-600 font-mono text-[11px]">
                      {row.email || row.Email || (
                        <span className="text-slate-400 italic">N/A (Print Mode)</span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-slate-500">
                      <span className="pill-badge bg-slate-100 text-slate-700 text-[10px]">
                        {row.role || row.Role || 'Participant'}
                      </span>
                    </td>
                    <td className="py-2.5 px-4">
                      {row.deliveryStatus === 'success' ? (
                        <span className="pill-badge bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> SENT
                        </span>
                      ) : row.deliveryStatus === 'failed' ? (
                        <span 
                          title={row.deliveryError || 'Failed to send'}
                          className="pill-badge bg-rose-50 text-rose-700 border border-rose-200 cursor-help"
                        >
                          <AlertCircle className="w-3 h-3" /> FAILED
                        </span>
                      ) : (
                        <span className="pill-badge bg-slate-100 text-slate-600">
                          <Clock className="w-3 h-3" /> Ready
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => onSelectParticipantForPreview(row.originalIndex)}
                        title="Preview on Certificate Canvas"
                        className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDownloadSinglePdf(row)}
                        title="Download Individual PDF"
                        className="p-1 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                      >
                        <FileDown className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

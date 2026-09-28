import * as XLSX from 'xlsx';

/**
 * Parses an Excel (.xlsx, .xls) or CSV file from a File object
 */
export async function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Read first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON array of objects
        const rawJson = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (!rawJson || rawJson.length === 0) {
          throw new Error('The uploaded spreadsheet is empty or has no recognizable data rows.');
        }

        // Detect columns from first row
        const headers = Object.keys(rawJson[0]);

        // Auto-detect Name and Email column candidates
        const detectedNameCol = headers.find(h => 
          /^(name|full[\s_]?name|participant[\s_]?name|student[\s_]?name|coordinator[\s_]?name|recipient)/i.test(h.trim())
        ) || headers[0];

        const detectedEmailCol = headers.find(h => 
          /^(email|e-mail|mail|email[\s_]?address|mail[\s_]?id)/i.test(h.trim())
        ) || (headers.length > 1 ? headers[1] : null);

        resolve({
          fileName: file.name,
          headers,
          rows: rawJson,
          detectedNameCol,
          detectedEmailCol,
          totalRows: rawJson.length
        });
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (err) => reject(new Error('Failed to read spreadsheet file: ' + err.message));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Validates parsed data against selected mode ('print' vs 'email')
 */
export function validateExcelData(parsedData, mode, mapping = {}) {
  const errors = [];
  const warnings = [];

  if (!parsedData || !parsedData.rows || parsedData.rows.length === 0) {
    errors.push('No participant rows found in uploaded spreadsheet.');
    return { isValid: false, errors, warnings };
  }

  const nameCol = mapping.name || parsedData.detectedNameCol;
  const emailCol = mapping.email || parsedData.detectedEmailCol;

  // Check Name Column
  if (!nameCol) {
    errors.push('No Name column could be detected. Please map a column containing participant names.');
  } else {
    const emptyNames = parsedData.rows.filter(r => !r[nameCol] || !String(r[nameCol]).trim()).length;
    if (emptyNames > 0) {
      warnings.push(`${emptyNames} row(s) have empty names and may generate blank certificates.`);
    }
  }

  // If mode is 'email', Email column is STRICTLY required
  if (mode === 'email') {
    if (!emailCol) {
      errors.push('Email column is required when "Send on Email" is selected, but no Email column was found in the Excel sheet. Please upload a spreadsheet containing an "Email" column.');
    } else {
      const invalidEmails = parsedData.rows.filter(r => {
        const val = String(r[emailCol] || '').trim();
        return !val || !val.includes('@');
      }).length;

      if (invalidEmails > 0) {
        warnings.push(`${invalidEmails} row(s) have missing or invalid email addresses. Mails for these rows will fail.`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    nameCol,
    emailCol
  };
}

/**
 * Generates and downloads a sample Excel template for users
 */
export function downloadSampleExcelTemplate() {
  const templateData = [
    { 'Name': 'Alexander Wright', 'Email': 'alexander.wright@example.com', 'Role': 'Winner - 1st Place', 'Event': 'Annual Tech Fest', 'Date': '2026-09-20', 'Certificate ID': 'CERT-2026-001' },
    { 'Name': 'Sophia Chen', 'Email': 'sophia.chen@example.com', 'Role': 'Winner - 2nd Place', 'Event': 'Annual Tech Fest', 'Date': '2026-09-20', 'Certificate ID': 'CERT-2026-002' },
    { 'Name': 'Liam O\'Connor', 'Email': 'liam.oconnor@example.com', 'Role': 'Student Coordinator', 'Event': 'Annual Tech Fest', 'Date': '2026-09-20', 'Certificate ID': 'CERT-2026-003' },
    { 'Name': 'Dr. Emily Vance', 'Email': 'emily.vance@example.com', 'Role': 'Coordinator Lead', 'Event': 'Annual Tech Fest', 'Date': '2026-09-20', 'Certificate ID': 'CERT-2026-004' },
    { 'Name': 'Muhammad Al-Mansoor', 'Email': 'm.almansoor@example.com', 'Role': 'Participant', 'Event': 'Annual Tech Fest', 'Date': '2026-09-20', 'Certificate ID': 'CERT-2026-005' },
  ];

  const worksheet = XLSX.utils.json_to_sheet(templateData);
  worksheet['!cols'] = [
    { wch: 25 },
    { wch: 32 },
    { wch: 22 },
    { wch: 20 },
    { wch: 15 },
    { wch: 18 }
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Participants');

  XLSX.writeFile(workbook, 'CertiFlow_Sample_Template.xlsx');
}

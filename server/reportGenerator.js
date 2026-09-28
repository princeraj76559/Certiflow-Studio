import * as XLSX from 'xlsx';

/**
 * Generates an Excel workbook containing dispatch delivery status report
 * @param {Array} deliveryResults List of items with { name, email, status, timestamp, error, messageId }
 * @returns {Buffer} Excel file buffer
 */
export function generateDeliveryReportBuffer(deliveryResults = [], meta = {}) {
  const formattedRows = deliveryResults.map((item, index) => ({
    'S.No': index + 1,
    'Recipient Name': item.name || 'N/A',
    'Email Address': item.email || 'N/A',
    'Delivery Status': item.status === 'success' ? 'SENT' : (item.status === 'failed' ? 'FAILED' : item.status.toUpperCase()),
    'Delivery Timestamp': item.timestamp ? new Date(item.timestamp).toLocaleString() : new Date().toLocaleString(),
    'Message / Error Details': item.error || item.message || (item.status === 'success' ? 'Successfully Delivered' : 'Pending'),
    'Certificate File': item.filename || `${item.name || 'Certificate'}.pdf`,
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedRows);

  // Set column widths for readability
  worksheet['!cols'] = [
    { wch: 6 },   // S.No
    { wch: 26 },  // Recipient Name
    { wch: 30 },  // Email Address
    { wch: 16 },  // Delivery Status
    { wch: 22 },  // Delivery Timestamp
    { wch: 36 },  // Message / Error Details
    { wch: 28 },  // Certificate File
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Delivery Summary');

  // Add a Metadata / Summary statistics sheet
  const successCount = deliveryResults.filter(r => r.status === 'success').length;
  const failedCount = deliveryResults.filter(r => r.status === 'failed').length;
  const summaryData = [
    { Parameter: 'Report Generation Time', Value: new Date().toLocaleString() },
    { Parameter: 'Total Recipients', Value: deliveryResults.length },
    { Parameter: 'Successfully Sent', Value: successCount },
    { Parameter: 'Failed / Errors', Value: failedCount },
    { Parameter: 'Success Rate', Value: deliveryResults.length > 0 ? `${((successCount / deliveryResults.length) * 100).toFixed(1)}%` : '0%' },
    { Parameter: 'Event Name', Value: meta.eventName || 'University Event' },
    { Parameter: 'Sender Email', Value: meta.senderEmail || 'N/A' },
  ];
  const summarySheet = XLSX.utils.json_to_sheet(summaryData);
  summarySheet['!cols'] = [{ wch: 25 }, { wch: 30 }];
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Dispatch Overview');

  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  return buffer;
}

import { generateDeliveryReportBuffer } from '../server/reportGenerator.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { results, meta } = req.body;
    if (!results || !Array.isArray(results)) {
      return res.status(400).json({ error: 'No results provided' });
    }

    const buffer = generateDeliveryReportBuffer(results, meta);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="Certificate_Dispatch_Report.xlsx"');
    return res.status(200).send(buffer);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to generate Excel report: ' + error.message });
  }
}

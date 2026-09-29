import React, { useState } from 'react';
import Header from './components/Header';
import LeftPanelContainer from './components/LeftPanel/LeftPanelContainer';
import RightPanelContainer from './components/RightPanel/RightPanelContainer';
import AppPasswordGuideModal from './components/Modals/AppPasswordGuideModal';
import EmailPreviewModal from './components/Modals/EmailPreviewModal';
import BatchProgressModal from './components/Modals/BatchProgressModal';
import { validateExcelData } from './utils/excelParser';
import { 
  generateConsolidatedMultiPagePdf, 
  generateSingleCertificatePdf, 
  exportIndividualPdfsToZip,
  loadImage,
  ensureFontLoaded
} from './utils/pdfGenerator';
import { saveAs } from 'file-saver';

export default function App() {
  const [mode, setMode] = useState('email'); // 'email' | 'print'

  // Certificate Base Template State (Starts clean / empty)
  const [baseImage, setBaseImage] = useState(null);
  const [certificateFileName, setCertificateFileName] = useState('');

  // Text Fields Overlays State
  const [textFields, setTextFields] = useState([
    {
      id: 'field_name',
      name: 'Recipient Name',
      textTemplate: '{name}',
      x: 50,
      y: 52,
      fontSize: 54,
      fontFamily: 'Cinzel',
      fontWeight: '700',
      fontStyle: 'normal',
      color: '#111827',
      align: 'center',
      transform: 'none',
      rotation: 0,
      visible: true,
      letterSpacing: 2,
    }
  ]);
  const [selectedFieldId, setSelectedFieldId] = useState('field_name');

  // Participants & Excel State (Starts clean / empty)
  const [excelData, setExcelData] = useState(null);
  const [columnMapping, setColumnMapping] = useState({ name: '', email: '' });
  const [currentParticipantIndex, setCurrentParticipantIndex] = useState(0);

  // Email & SMTP Configuration State
  const [smtpConfig, setSmtpConfig] = useState({
    provider: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    user: '',
    pass: '',
  });

  const [emailTemplate, setEmailTemplate] = useState({
    subject: 'Certificate of Achievement — {event}',
    body: `Dear {name},

Congratulations on your participation and achievement in the {event}!

Please find your official certificate attached to this email.

Warm regards,
Organizing Committee`,
  });

  const [exportIndividualZip, setExportIndividualZip] = useState(true);
  const [smtpTestStatus, setSmtpTestStatus] = useState(null);

  // Modals Visibility
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);

  // Batch Execution Progress State
  const [isProcessing, setIsProcessing] = useState(false);
  const [batchProgress, setBatchProgress] = useState({
    currentIndex: 0,
    totalItems: 0,
    currentName: '',
    isComplete: false,
  });
  const [deliveryResults, setDeliveryResults] = useState([]);
  const [batchLogs, setBatchLogs] = useState([]);

  // Reset to initial clean state
  const handleReset = () => {
    if (window.confirm('Reset all certificate settings and data to clean default?')) {
      setBaseImage(null);
      setCertificateFileName('');
      setExcelData(null);
      setColumnMapping({ name: '', email: '' });
      setMode('email');
      setDeliveryResults([]);
      setBatchLogs([]);
      setCurrentParticipantIndex(0);
    }
  };

  // Validation Check
  const validation = validateExcelData(excelData, mode, columnMapping);
  const validationErrors = [];
  if (!baseImage) validationErrors.push('Please upload a base certificate file (PDF, PNG, JPG).');
  if (!excelData || !excelData.rows || excelData.rows.length === 0) {
    validationErrors.push('Please upload a participants spreadsheet (.xlsx, .xls, .csv).');
  } else {
    validationErrors.push(...validation.errors);
  }

  if (mode === 'email') {
    if (!smtpConfig.user) validationErrors.push('Sender Email is required.');
    if (!smtpConfig.pass) validationErrors.push('App Password is required.');
  }

  // Test SMTP Connection Endpoint
  const handleTestSmtpConnection = async () => {
    setSmtpTestStatus({ loading: true, success: false, message: 'Testing connection...' });
    try {
      const response = await fetch('/api/smtp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(smtpConfig),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setSmtpTestStatus({ loading: false, success: true, message: data.message });
      } else {
        setSmtpTestStatus({ loading: false, success: false, message: data.message || 'SMTP Authentication Failed' });
      }
    } catch (err) {
      setSmtpTestStatus({
        loading: false,
        success: false,
        message: 'Could not connect to backend server. Make sure the Node server is running on port 5000.',
      });
    }
  };

  const addLog = (text, type = 'info') => {
    const timeStr = new Date().toLocaleTimeString();
    setBatchLogs(prev => [...prev, { text, type, time: timeStr }]);
  };

  // Primary Batch Execution Trigger
  const handleStartProcess = async () => {
    if (validationErrors.length > 0 || !baseImage || !excelData?.rows?.length) return;

    const rows = excelData.rows;
    setIsProcessing(true);
    setIsBatchModalOpen(true);
    setBatchLogs([]);
    setDeliveryResults([]);
    setBatchProgress({
      currentIndex: 0,
      totalItems: rows.length,
      currentName: 'Initializing...',
      isComplete: false,
    });

    addLog(`Initiating batch job in [${mode.toUpperCase()}] mode for ${rows.length} participant(s)...`);

    try {
      if (mode === 'print') {
        // Mode A: Compile Single Multi-Page PDF
        addLog('Rendering lossless certificates and compiling multi-page PDF document...');
        
        const multiPagePdf = await generateConsolidatedMultiPagePdf(
          baseImage, 
          textFields, 
          rows, 
          (curr, total, row) => {
            const name = row[columnMapping.name] || `Participant ${curr}`;
            setBatchProgress({
              currentIndex: curr,
              totalItems: total,
              currentName: name,
              isComplete: false,
            });
            addLog(`Compiled Page ${curr}/${total} for: ${name}`, 'info');
          }
        );

        addLog('Packaging and saving final consolidated PDF file...', 'success');
        multiPagePdf.save(`Event_Certificates_Print_Bundle_${rows.length}_Pages.pdf`);

        const printResults = rows.map((r, i) => ({
          index: i,
          name: r[columnMapping.name] || `Participant ${i + 1}`,
          email: r[columnMapping.email] || 'N/A',
          status: 'success',
          timestamp: new Date().toISOString(),
          message: 'Included in Consolidated Print PDF',
        }));

        setDeliveryResults(printResults);
        setBatchProgress(prev => ({ ...prev, isComplete: true, currentIndex: rows.length }));
        addLog(`Successfully generated multi-page PDF with ${rows.length} certificates!`, 'success');

      } else {
        // Mode B: Send on Email + Optional ZIP export
        addLog('Rendering individual certificates for email dispatch...');
        const emailItems = [];

        // Preload base image & fonts once for high performance
        const preloadedImg = await loadImage(baseImage);
        for (const field of textFields) {
          if (field.fontFamily) {
            await ensureFontLoaded(field.fontFamily, field.fontSize || 48, field.fontWeight || 'normal');
          }
        }

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          const name = row[columnMapping.name] || `Participant ${i + 1}`;
          const email = row[columnMapping.email] || '';

          setBatchProgress({
            currentIndex: i + 1,
            totalItems: rows.length,
            currentName: `Rendering certificate for ${name}...`,
            isComplete: false,
          });

          // Generate actual PDF document
          const { pdf } = await generateSingleCertificatePdf(baseImage, textFields, row, preloadedImg);
          const pdfBase64 = pdf.output('datauristring');

          emailItems.push({
            ...row,
            name,
            email,
            pdfBase64,
          });

          addLog(`Rendered PDF certificate for ${name}`, 'info');
        }

        // Optional ZIP export
        if (exportIndividualZip) {
          addLog('Generating individual deduplicated PDF archive (ZIP)...');
          const { zipBlob, savedCount, skippedDuplicates } = await exportIndividualPdfsToZip(
            baseImage,
            textFields,
            rows,
            (curr, total, name, isDup) => {
              if (isDup) {
                addLog(`Deduplicated: skipped redundant file for '${name}' (already archived)`, 'info');
              }
            }
          );
          saveAs(zipBlob, `Certificates_Individual_Export_${savedCount}_Files.zip`);
          addLog(`Saved ${savedCount} unique certificate PDF(s) to ZIP archive (${skippedDuplicates} duplicates combined).`, 'success');
        }

        // Send via SMTP
        addLog(`Connecting to ${smtpConfig.provider.toUpperCase()} SMTP server at ${smtpConfig.host}...`);

        const results = [];
        for (let i = 0; i < emailItems.length; i++) {
          const item = emailItems[i];
          setBatchProgress({
            currentIndex: i + 1,
            totalItems: emailItems.length,
            currentName: `Sending email to ${item.name} (${item.email})...`,
            isComplete: false,
          });

          if (!item.email || !item.email.includes('@')) {
            results.push({
              index: i,
              name: item.name,
              email: item.email || 'Missing Email',
              status: 'failed',
              error: 'Invalid or missing email address',
              timestamp: new Date().toISOString(),
            });
            addLog(`Skipped ${item.name}: Missing or invalid email`, 'error');
            setDeliveryResults([...results]);
            continue;
          }

          try {
            const sendRes = await fetch('/api/send-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                smtpConfig,
                emailTemplate,
                recipient: item,
              }),
            });
            const sendData = await sendRes.json();
            if (sendRes.ok && sendData.success) {
              results.push({
                index: i,
                name: item.name,
                email: item.email,
                status: 'success',
                messageId: sendData.messageId,
                filename: `${item.name}_Certificate.pdf`,
                timestamp: new Date().toISOString(),
              });
              addLog(`Dispatched email to ${item.name} (${item.email})`, 'success');
            } else {
              results.push({
                index: i,
                name: item.name,
                email: item.email,
                status: 'failed',
                error: sendData.error || sendData.message || 'SMTP Send Failed',
                timestamp: new Date().toISOString(),
              });
              addLog(`Failed to email ${item.name} (${item.email}): ${sendData.error || sendData.message || 'Send Failed'}`, 'error');
            }
          } catch (err) {
            results.push({
              index: i,
              name: item.name,
              email: item.email,
              status: 'failed',
              error: err.message,
              timestamp: new Date().toISOString(),
            });
            addLog(`Error emailing ${item.name}: ${err.message}`, 'error');
          }

          setDeliveryResults([...results]);
        }

        const sentCount = results.filter(r => r.status === 'success').length;
        const failedCount = results.filter(r => r.status === 'failed').length;
        addLog(`Batch completed: ${sentCount} sent, ${failedCount} failed.`, 'success');
        setBatchProgress(prev => ({ ...prev, isComplete: true, currentIndex: rows.length }));
      }
    } catch (err) {
      console.error('Batch process error:', err);
      addLog(`Error during execution: ${err.message}`, 'error');
      alert('Error during processing: ' + err.message);
      setBatchProgress(prev => ({ ...prev, isComplete: true }));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadDeliveryReport = async () => {
    try {
      const response = await fetch('/api/report/export-excel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          results: deliveryResults,
          meta: {
            eventName: 'University Event 2026',
            senderEmail: smtpConfig.user || 'N/A',
          }
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        saveAs(blob, `Certificate_Delivery_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
      } else {
        throw new Error('Failed to fetch report from server.');
      }
    } catch (err) {
      console.warn('Backend report error, fallback active:', err);
    }
  };

  const participantsList = excelData?.rows || [];

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-slate-100/60 text-slate-900">
      {/* Top Header */}
      <Header
        mode={mode}
        setMode={setMode}
        onReset={handleReset}
        onOpenAppPasswordGuide={() => setIsGuideOpen(true)}
        totalParticipants={participantsList.length}
        hasCertificate={!!baseImage}
      />

      {/* Main Studio Area (Left Scrollable Controls + Right Fixed-Height Preview) */}
      <main className="flex-1 flex overflow-hidden p-4 gap-4 max-w-[1920px] mx-auto w-full min-h-0">
        {/* Left Panel: Scrollable Column */}
        <LeftPanelContainer
          baseImage={baseImage}
          setBaseImage={setBaseImage}
          certificateFileName={certificateFileName}
          setCertificateFileName={setCertificateFileName}
          excelData={excelData}
          setExcelData={setExcelData}
          columnMapping={columnMapping}
          setColumnMapping={setColumnMapping}
          mode={mode}
          setMode={setMode}
          textFields={textFields}
          setTextFields={setTextFields}
          selectedFieldId={selectedFieldId}
          setSelectedFieldId={setSelectedFieldId}
          smtpConfig={smtpConfig}
          setSmtpConfig={setSmtpConfig}
          emailTemplate={emailTemplate}
          setEmailTemplate={setEmailTemplate}
          exportIndividualZip={exportIndividualZip}
          setExportIndividualZip={setExportIndividualZip}
          onOpenAppPasswordGuide={() => setIsGuideOpen(true)}
          onOpenEmailPreview={() => setIsPreviewOpen(true)}
          onTestSmtpConnection={handleTestSmtpConnection}
          smtpTestStatus={smtpTestStatus}
          onStartProcess={handleStartProcess}
          isProcessing={isProcessing}
          validationErrors={validationErrors}
        />

        {/* Right Panel: Auto-fitted Canvas Preview & Records */}
        <RightPanelContainer
          baseImage={baseImage}
          textFields={textFields}
          setTextFields={setTextFields}
          selectedFieldId={selectedFieldId}
          setSelectedFieldId={setSelectedFieldId}
          participants={participantsList}
          deliveryResults={deliveryResults}
          currentParticipantIndex={currentParticipantIndex}
          setCurrentParticipantIndex={setCurrentParticipantIndex}
          mode={mode}
          isProcessing={isProcessing}
        />
      </main>

      {/* Modals */}
      <AppPasswordGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        defaultProvider={smtpConfig.provider}
      />

      <EmailPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        template={emailTemplate}
        smtpConfig={smtpConfig}
        sampleRecipient={participantsList[currentParticipantIndex] || {
          name: 'Sample Participant',
          email: 'participant@example.com',
          event: 'University Tech Fest',
          role: 'Participant'
        }}
      />

      <BatchProgressModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        mode={mode}
        isComplete={batchProgress.isComplete}
        currentIndex={batchProgress.currentIndex}
        totalItems={batchProgress.totalItems}
        currentName={batchProgress.currentName}
        results={deliveryResults}
        logs={batchLogs}
        onDownloadReport={handleDownloadDeliveryReport}
      />
    </div>
  );
}

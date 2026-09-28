import React from 'react';
import Step1_BaseCertificate from './Step1_BaseCertificate';
import Step2_RecipientsExcel from './Step2_RecipientsExcel';
import Step3_TextCustomizer from './Step3_TextCustomizer';
import Step4_ModeConfig from './Step4_ModeConfig';
import Step5_DispatchAction from './Step5_DispatchAction';

export default function LeftPanelContainer({
  baseImage,
  setBaseImage,
  certificateFileName,
  setCertificateFileName,
  excelData,
  setExcelData,
  columnMapping,
  setColumnMapping,
  mode,
  setMode,
  textFields,
  setTextFields,
  selectedFieldId,
  setSelectedFieldId,
  smtpConfig,
  setSmtpConfig,
  emailTemplate,
  setEmailTemplate,
  exportIndividualZip,
  setExportIndividualZip,
  onOpenAppPasswordGuide,
  onOpenEmailPreview,
  onTestSmtpConnection,
  smtpTestStatus,
  onStartProcess,
  isProcessing,
  validationErrors
}) {
  const isReady = validationErrors.length === 0 && baseImage && excelData?.rows?.length > 0;
  const totalParticipants = excelData?.rows?.length || 0;

  return (
    <div className="w-full lg:w-[420px] xl:w-[440px] flex-shrink-0 flex flex-col gap-4 overflow-y-auto h-full pr-1.5 pb-20 select-none">
      {/* Step 1: Base Certificate */}
      <div className="theme-card p-4">
        <Step1_BaseCertificate
          baseImage={baseImage}
          setBaseImage={setBaseImage}
          certificateFileName={certificateFileName}
          setCertificateFileName={setCertificateFileName}
        />
      </div>

      {/* Step 2: Recipients Data */}
      <div className="theme-card p-4">
        <Step2_RecipientsExcel
          excelData={excelData}
          setExcelData={setExcelData}
          columnMapping={columnMapping}
          setColumnMapping={setColumnMapping}
          mode={mode}
        />
      </div>

      {/* Step 3: Typography & Positioning */}
      <div className="theme-card p-4">
        <Step3_TextCustomizer
          textFields={textFields}
          setTextFields={setTextFields}
          selectedFieldId={selectedFieldId}
          setSelectedFieldId={setSelectedFieldId}
        />
      </div>

      {/* Step 4: Workflow Mode Config (Print vs Email) */}
      <div className="theme-card p-4">
        <Step4_ModeConfig
          mode={mode}
          setMode={setMode}
          smtpConfig={smtpConfig}
          setSmtpConfig={setSmtpConfig}
          emailTemplate={emailTemplate}
          setEmailTemplate={setEmailTemplate}
          exportIndividualZip={exportIndividualZip}
          setExportIndividualZip={setExportIndividualZip}
          onOpenAppPasswordGuide={onOpenAppPasswordGuide}
          onOpenEmailPreview={onOpenEmailPreview}
          onTestSmtpConnection={onTestSmtpConnection}
          smtpTestStatus={smtpTestStatus}
        />
      </div>

      {/* Step 5: Primary Dispatch Action */}
      <Step5_DispatchAction
        mode={mode}
        isReady={isReady}
        validationErrors={validationErrors}
        totalParticipants={totalParticipants}
        isProcessing={isProcessing}
        onStartProcess={onStartProcess}
        exportIndividualZip={exportIndividualZip}
      />
    </div>
  );
}

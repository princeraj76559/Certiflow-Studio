import React, { useState } from 'react';
import StatsOverview from '../StatsOverview';
import CertificateCanvas from './CertificateCanvas';
import RecipientTable from './RecipientTable';
import { Eye, Users, FileImage } from 'lucide-react';

export default function RightPanelContainer({
  baseImage,
  textFields,
  setTextFields,
  selectedFieldId,
  setSelectedFieldId,
  participants,
  deliveryResults,
  currentParticipantIndex,
  setCurrentParticipantIndex,
  mode,
  isProcessing
}) {
  const [activeRightTab, setActiveRightTab] = useState('canvas'); // 'canvas' | 'table'

  const sentCount = deliveryResults.filter(r => r.status === 'success').length;
  const failedCount = deliveryResults.filter(r => r.status === 'failed').length;

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
      {/* Top Overview Metrics */}
      <StatsOverview
        totalCount={participants.length}
        sentCount={sentCount}
        failedCount={failedCount}
        mode={mode}
        isProcessing={isProcessing}
      />

      {/* Tab Switcher */}
      <div className="flex items-center justify-between mb-2.5 flex-shrink-0">
        <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveRightTab('canvas')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeRightTab === 'canvas'
                ? 'bg-white text-slate-900 shadow-sm font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            <span>Interactive Studio Canvas</span>
          </button>
          <button
            onClick={() => setActiveRightTab('table')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeRightTab === 'table'
                ? 'bg-white text-slate-900 shadow-sm font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span>Recipient Records ({participants.length})</span>
          </button>
        </div>
      </div>

      {/* View Content (Flex 1, Fits cleanly in viewport) */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {activeRightTab === 'canvas' ? (
          <CertificateCanvas
            baseImage={baseImage}
            textFields={textFields}
            setTextFields={setTextFields}
            selectedFieldId={selectedFieldId}
            setSelectedFieldId={setSelectedFieldId}
            participants={participants}
            currentParticipantIndex={currentParticipantIndex}
            setCurrentParticipantIndex={setCurrentParticipantIndex}
          />
        ) : (
          <RecipientTable
            participants={participants}
            deliveryResults={deliveryResults}
            baseImage={baseImage}
            textFields={textFields}
            onSelectParticipantForPreview={(idx) => {
              setCurrentParticipantIndex(idx);
              setActiveRightTab('canvas');
            }}
            currentSelectedIndex={currentParticipantIndex}
            mode={mode}
          />
        )}
      </div>
    </div>
  );
}

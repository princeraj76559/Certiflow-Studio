import React from 'react';
import { 
  Type, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Palette, 
  Move, 
  Plus, 
  Trash2, 
  Sliders,
  CaseSensitive
} from 'lucide-react';
import { GOOGLE_FONTS_LIST } from '../../utils/sampleData';
import { ensureFontLoaded } from '../../utils/pdfGenerator';

const COLOR_SWATCHES = [
  { name: 'Pure Black', hex: '#111827' },
  { name: 'Dark Navy', hex: '#0f172a' },
  { name: 'Classic Gold', hex: '#ca8a04' },
  { name: 'Warm Amber', hex: '#d97706' },
  { name: 'Royal Blue', hex: '#1d4ed8' },
  { name: 'Emerald', hex: '#059669' },
  { name: 'Crimson', hex: '#dc2626' },
  { name: 'Pure White', hex: '#ffffff' },
];

export default function Step3_TextCustomizer({ 
  textFields, 
  setTextFields, 
  selectedFieldId, 
  setSelectedFieldId 
}) {
  const activeField = textFields.find(f => f.id === selectedFieldId) || textFields[0];

  const updateActiveField = async (updates) => {
    if (updates.fontFamily) {
      await ensureFontLoaded(updates.fontFamily, activeField?.fontSize || 48, activeField?.fontWeight || 'normal');
    }
    setTextFields(textFields.map(f => f.id === activeField.id ? { ...f, ...updates } : f));
  };

  const handleAddField = () => {
    const newId = `field_${Date.now()}`;
    const newField = {
      id: newId,
      name: 'Custom Field',
      textTemplate: '{event}',
      x: 50,
      y: 65,
      fontSize: 28,
      fontFamily: 'Montserrat',
      fontWeight: '600',
      fontStyle: 'normal',
      color: '#475569',
      align: 'center',
      transform: 'none',
      rotation: 0,
      visible: true,
      letterSpacing: 2,
    };
    setTextFields([...textFields, newField]);
    setSelectedFieldId(newId);
  };

  const handleRemoveField = (id) => {
    if (textFields.length <= 1) {
      alert('You must keep at least one text field (e.g. Participant Name).');
      return;
    }
    const filtered = textFields.filter(f => f.id !== id);
    setTextFields(filtered);
    if (selectedFieldId === id) {
      setSelectedFieldId(filtered[0].id);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <Type className="w-4 h-4 text-slate-900" />
          <span>3. Typography & Text Placement</span>
        </label>
        <button
          onClick={handleAddField}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm"
        >
          <Plus className="w-3 h-3" />
          <span>Add Field</span>
        </button>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed">
        Customize font styling, casing, letter-spacing, and position text on the certificate.
      </p>

      {/* Field Selector Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {textFields.map((field) => (
          <div
            key={field.id}
            onClick={() => setSelectedFieldId(field.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all border whitespace-nowrap ${
              selectedFieldId === field.id
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>{field.name}</span>
            {textFields.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveField(field.id);
                }}
                className={`p-0.5 rounded transition-colors ${
                  selectedFieldId === field.id ? 'hover:text-rose-300' : 'text-slate-400 hover:text-rose-600'
                }`}
              >
                <Trash2 className="w-2.5 h-2.5" />
              </button>
            )}
          </div>
        ))}
      </div>

      {activeField && (
        <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3.5 shadow-sm">
          {/* Text Template / Placeholder Tag */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-slate-700">Dynamic Tag</label>
              <div className="flex gap-1">
                {['{name}', '{event}', '{date}', '{cert_id}', '{role}'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => updateActiveField({ textTemplate: tag })}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            <input
              type="text"
              value={activeField.textTemplate}
              onChange={(e) => updateActiveField({ textTemplate: e.target.value })}
              placeholder="e.g. {name}"
              className="w-full theme-input px-3 py-1.5 text-xs text-slate-900 font-mono"
            />
          </div>

          {/* Font Family Selector */}
          <div>
            <label className="text-[11px] font-semibold text-slate-700 block mb-1">Font Family</label>
            <select
              value={activeField.fontFamily}
              onChange={(e) => updateActiveField({ fontFamily: e.target.value })}
              className="w-full theme-input px-3 py-2 text-xs text-slate-900 bg-white"
            >
              {GOOGLE_FONTS_LIST.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sizing & Weight */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 mb-1">
                <span>Font Size</span>
                <span className="font-mono text-slate-900 font-bold">{activeField.fontSize}px</span>
              </div>
              <input
                type="range"
                min="14"
                max="140"
                value={activeField.fontSize}
                onChange={(e) => updateActiveField({ fontSize: parseInt(e.target.value, 10) })}
                className="w-full h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">Font Weight</label>
              <select
                value={activeField.fontWeight}
                onChange={(e) => updateActiveField({ fontWeight: e.target.value })}
                className="w-full theme-input px-2.5 py-1.5 text-xs text-slate-900"
              >
                <option value="normal">Normal</option>
                <option value="500">Medium</option>
                <option value="600">Semi-Bold</option>
                <option value="700">Bold</option>
                <option value="900">Black / Heavy</option>
              </select>
            </div>
          </div>

          {/* Text Casing Option (as requested) */}
          <div>
            <label className="text-[11px] font-semibold text-slate-700 block mb-1.5 flex items-center gap-1">
              <CaseSensitive className="w-3.5 h-3.5 text-slate-500" />
              <span>Text Casing</span>
            </label>
            <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
              {[
                { id: 'none', label: 'Original' },
                { id: 'uppercase', label: 'UPPERCASE' },
                { id: 'capitalize', label: 'Title Case' },
                { id: 'lowercase', label: 'lowercase' },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => updateActiveField({ transform: id })}
                  className={`py-1 text-[10px] font-semibold rounded-lg transition-all ${
                    (activeField.transform || 'none') === id
                      ? 'bg-white text-slate-900 shadow-sm font-bold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Color Picker & Swatches */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-semibold text-slate-700 flex items-center gap-1">
                <Palette className="w-3.5 h-3.5 text-slate-500" />
                <span>Text Color</span>
              </label>
              <input
                type="color"
                value={activeField.color || '#111827'}
                onChange={(e) => updateActiveField({ color: e.target.value })}
                className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent p-0"
              />
            </div>
            <div className="flex items-center gap-1.5">
              {COLOR_SWATCHES.map((swatch) => (
                <button
                  key={swatch.hex}
                  onClick={() => updateActiveField({ color: swatch.hex })}
                  title={swatch.name}
                  className={`w-5 h-5 rounded-full border transition-all ${
                    activeField.color === swatch.hex
                      ? 'ring-2 ring-slate-900 ring-offset-2 scale-110'
                      : 'border-slate-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: swatch.hex }}
                />
              ))}
            </div>
          </div>

          {/* Alignment & Letter Spacing (fixed alignment & letter spacing) */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">Alignment</label>
              <div className="flex rounded-xl bg-slate-100 p-0.5 border border-slate-200">
                {[
                  { id: 'left', icon: AlignLeft, title: 'Left Align' },
                  { id: 'center', icon: AlignCenter, title: 'Center Align' },
                  { id: 'right', icon: AlignRight, title: 'Right Align' },
                ].map(({ id, icon: Icon, title }) => (
                  <button
                    key={id}
                    onClick={() => updateActiveField({ align: id })}
                    title={title}
                    className={`flex-1 py-1.5 flex items-center justify-center rounded-lg transition-all ${
                      activeField.align === id
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 mb-1">
                <span>Letter Spacing</span>
                <span className="font-mono text-slate-900 font-bold">{activeField.letterSpacing || 0}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                value={activeField.letterSpacing || 0}
                onChange={(e) => updateActiveField({ letterSpacing: parseInt(e.target.value, 10) })}
                className="w-full h-1.5 bg-slate-200 rounded-lg cursor-pointer mt-2"
              />
            </div>
          </div>

          {/* Precise Placement Coordinates */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-slate-700 flex items-center gap-1">
                <Move className="w-3.5 h-3.5 text-slate-500" />
                <span>Placement (X: {Math.round(activeField.x)}%, Y: {Math.round(activeField.y)}%)</span>
              </span>
              <button
                onClick={() => updateActiveField({ x: 50 })}
                className="text-[10px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold transition-colors"
              >
                Center X
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-slate-500">Horizontal (X)</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={activeField.x}
                  onChange={(e) => updateActiveField({ x: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500">Vertical (Y)</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={activeField.y}
                  onChange={(e) => updateActiveField({ y: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

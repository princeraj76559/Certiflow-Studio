import React from 'react';
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  FileSpreadsheet, 
  Type, 
  Send, 
  Printer, 
  History, 
  HelpCircle,
  FileCheck2,
  Sliders
} from 'lucide-react';

export default function SidebarNav({ activeTab, setActiveTab, mode }) {
  const navItems = [
    { id: 'editor', label: 'Studio Editor', icon: LayoutDashboard, badge: null },
    { id: 'template', label: 'Base Certificate', icon: ImageIcon, badge: null },
    { id: 'recipients', label: 'Recipients Data', icon: FileSpreadsheet, badge: null },
    { id: 'typography', label: 'Text & Styling', icon: Type, badge: null },
    { 
      id: 'dispatch', 
      label: mode === 'print' ? 'Print & Export' : 'Email & Dispatch', 
      icon: mode === 'print' ? Printer : Send, 
      badge: mode === 'print' ? 'PDF' : 'SMTP' 
    },
    { id: 'records', label: 'Delivery Records', icon: History, badge: null },
  ];

  return (
    <aside className="w-16 lg:w-60 bg-dark-900 border-r border-white/10 flex flex-col justify-between flex-shrink-0 transition-all duration-300 select-none">
      {/* Navigation Links */}
      <div className="p-3 space-y-1.5">
        <div className="hidden lg:block px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Workflow Pipeline
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                isActive
                  ? 'bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30 shadow-glow-cyan'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${
                isActive ? 'text-brand-cyan' : 'text-slate-400 group-hover:text-slate-200'
              }`} />
              <span className="hidden lg:inline-block truncate">{item.label}</span>
              {item.badge && (
                <span className="hidden lg:inline-block ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                  {item.badge}
                </span>
              )}

              {/* Tooltip for collapsed view on smaller screens */}
              <div className="lg:hidden absolute left-full ml-2 px-2 py-1 bg-dark-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap shadow-lg border border-white/10 z-50">
                {item.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer info box */}
      <div className="p-3 border-t border-white/10">
        <div className="hidden lg:block p-3 rounded-xl bg-gradient-to-br from-dark-850 to-dark-950 border border-white/5 text-xs text-slate-400">
          <div className="flex items-center gap-2 text-slate-200 font-semibold mb-1">
            <FileCheck2 className="w-4 h-4 text-brand-mint" />
            <span>Smart Engine</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-400">
            Vector high-resolution rendering with instant print & SMTP routing.
          </p>
        </div>
      </div>
    </aside>
  );
}

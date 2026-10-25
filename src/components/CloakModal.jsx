import React from 'react';
import { X, ShieldAlert, Check } from 'lucide-react';

export const CLOAK_PRESETS = [
  {
    id: 'default',
    name: 'Default (Apex Games)',
    title: 'Apex Unblocked Games',
    favicon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🕹️</text></svg>'
  },
  {
    id: 'classroom',
    name: 'Google Classroom',
    title: 'Classes - Google Classroom',
    favicon: 'https://ssl.gstatic.com/classroom/favicon.png'
  },
  {
    id: 'drive',
    name: 'Google Drive',
    title: 'My Drive - Google Drive',
    favicon: 'https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png'
  },
  {
    id: 'docs',
    name: 'Google Docs',
    title: 'Document - Google Docs',
    favicon: 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico'
  },
  {
    id: 'canvas',
    name: 'Canvas LMS',
    title: 'Dashboard - Canvas LMS',
    favicon: 'https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico'
  },
  {
    id: 'desmos',
    name: 'Desmos Calculator',
    title: 'Desmos | Graphing Calculator',
    favicon: 'https://www.desmos.com/favicon.ico'
  }
];

export const CloakModal = ({
  isOpen,
  onClose,
  activeCloak,
  onSelectCloak,
  panicKey,
  onSetPanicKey
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2 text-sky-400">
            <ShieldAlert className="w-5 h-5 text-sky-400" />
            <h2 className="text-base font-bold text-white tracking-tight">Stealth Tab Cloaker</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Select Disguise Preset
            </label>
            <p className="text-xs text-slate-500 mb-3">
              Changes the browser tab title and favicon to appear as an educational or productive app.
            </p>

            <div className="space-y-2">
              {CLOAK_PRESETS.map((preset) => {
                const isSelected = activeCloak === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => onSelectCloak(preset)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border text-left text-sm transition-all ${
                      isSelected
                        ? 'bg-sky-950/40 border-sky-500/80 text-white font-medium'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <img
                        src={preset.favicon}
                        alt=""
                        className="w-4 h-4 rounded-sm object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <span className="truncate">{preset.name}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-sky-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                  Quick Panic Hotkey
                </span>
                <span className="text-xs text-slate-500">
                  Pressing this key instantly redirects to Google Classroom.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onSetPanicKey(panicKey === '`' ? 'Escape' : '`')}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-sky-300 font-mono text-xs rounded border border-slate-700 transition-colors"
                >
                  {panicKey === '`' ? '` (Tilde)' : 'Escape'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-950/60 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

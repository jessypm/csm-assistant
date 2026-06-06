import { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-xl border border-slate-100 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function CollapsibleCard({ title, icon: Icon, children, defaultOpen = true, copyText, badge }) {
  const [open, setOpen] = useState(defaultOpen);
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();
    const text = typeof copyText === 'string' ? copyText : copyText?.();
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5 text-indigo-500 flex-shrink-0" />}
          <span className="font-semibold text-slate-800 text-sm">{title}</span>
          {badge}
        </div>
        <div className="flex items-center gap-2 ml-4">
          {copyText && (
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-colors"
              title="Copier"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          )}
          {open ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </button>
      {open && <div className="px-5 pb-5 pt-1">{children}</div>}
    </div>
  );
}

export function CopyButton({ text, className = '' }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${copied ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'} ${className}`}
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copié !' : 'Copier'}
    </button>
  );
}

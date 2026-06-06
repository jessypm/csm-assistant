export default function Textarea({ label, hint, className = '', rows = 5, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-slate-700">{label}</label>
      )}
      <textarea
        rows={rows}
        className={`w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-y ${className}`}
        {...props}
      />
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

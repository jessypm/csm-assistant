const riskColors = {
  'Faible': 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  'Moyen': 'bg-amber-100 text-amber-700 border border-amber-200',
  'Élevé': 'bg-red-100 text-red-700 border border-red-200',
};

const statusColors = {
  vert: 'bg-emerald-100 text-emerald-700',
  orange: 'bg-amber-100 text-amber-700',
  rouge: 'bg-red-100 text-red-700',
};

const statusLabels = {
  vert: '🟢 Sain',
  orange: '🟠 Attention',
  rouge: '🔴 En risque',
};

export function RiskBadge({ level }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${riskColors[level] || 'bg-slate-100 text-slate-600'}`}>
      {level}
    </span>
  );
}

export function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColors[status] || 'bg-slate-100 text-slate-600'}`}>
      {statusLabels[status] || status}
    </span>
  );
}

export function TypeBadge({ label, color = 'indigo' }) {
  const colors = {
    indigo: 'bg-indigo-100 text-indigo-700',
    teal: 'bg-teal-100 text-teal-700',
    violet: 'bg-violet-100 text-violet-700',
    slate: 'bg-slate-100 text-slate-600',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors[color]}`}>
      {label}
    </span>
  );
}

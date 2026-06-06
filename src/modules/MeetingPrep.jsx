import { useState } from 'react';
import {
  Calendar, List, HelpCircle, AlertTriangle, Target,
  Send, FileText, ChevronRight
} from 'lucide-react';
import { useAnthropicAPI, parseJSON } from '../hooks/useAnthropicAPI';
import { MEETING_PREP_PROMPT } from '../utils/prompts';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Textarea from '../components/ui/Textarea';
import { CollapsibleCard, CopyButton } from '../components/ui/Card';
import { LoadingOverlay } from '../components/ui/Spinner';

const RDV_TYPES = [
  'QBR (Quarterly Business Review)',
  'Onboarding',
  'Suivi mensuel',
  'Renouvellement',
  'Escalade',
  'Découverte upsell',
  'Autre',
];

function SmartBlock({ objectif }) {
  if (!objectif) return null;
  const items = [
    { label: 'Spécifique', text: objectif.specifique, color: 'bg-indigo-50 border-indigo-100 text-indigo-700' },
    { label: 'Mesurable', text: objectif.mesurable, color: 'bg-blue-50 border-blue-100 text-blue-700' },
    { label: 'Atteignable', text: objectif.atteignable, color: 'bg-teal-50 border-teal-100 text-teal-700' },
    { label: 'Réaliste', text: objectif.realiste, color: 'bg-emerald-50 border-emerald-100 text-emerald-700' },
    { label: 'Temporel', text: objectif.temporel, color: 'bg-violet-50 border-violet-100 text-violet-700' },
  ];
  return (
    <div className="space-y-2">
      {items.map(({ label, text, color }) => (
        <div key={label} className={`p-3 rounded-lg border ${color}`}>
          <span className="text-xs font-bold uppercase tracking-wide mr-2">{label[0]}</span>
          <span className="text-xs font-semibold">{label}</span>
          <p className="text-sm text-slate-600 mt-1">{text}</p>
        </div>
      ))}
    </div>
  );
}

export default function MeetingPrep() {
  const [form, setForm] = useState({
    nomClient: '',
    objectif: RDV_TYPES[0],
    contexte: '',
    nps: '',
  });
  const [result, setResult] = useState(null);
  const { callAPI, loading, error, clearError } = useAnthropicAPI();

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nomClient.trim() || !form.contexte.trim()) return;
    const raw = await callAPI(MEETING_PREP_PROMPT(form));
    if (!raw) return;
    const parsed = parseJSON(raw);
    setResult(parsed || { _raw: raw });
  };

  const smartText = result?.objectif_smart
    ? Object.entries(result.objectif_smart).map(([k, v]) => `${k}: ${v}`).join('\n')
    : '';

  return (
    <div className="max-w-4xl space-y-5">
      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Calendar className="w-5 h-5 text-indigo-500" />
          <h2 className="font-semibold text-slate-800">Informations du rendez-vous</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Nom du client *"
            value={form.nomClient}
            onChange={update('nomClient')}
            placeholder="Ex : Société ABC"
          />
          <Select
            label="Objectif du RDV *"
            value={form.objectif}
            onChange={update('objectif')}
            options={RDV_TYPES}
          />
        </div>

        <Textarea
          label="Contexte rapide *"
          value={form.contexte}
          onChange={update('contexte')}
          placeholder="Ex : Client historique depuis 2 ans, renouvellement dans 2 mois, adoption correcte mais sponsor a changé récemment..."
          rows={4}
        />

        <Input
          label="NPS / CSAT connu (optionnel)"
          value={form.nps}
          onChange={update('nps')}
          placeholder="Ex : NPS 7, CSAT 4/5"
        />

        <Button type="submit" disabled={loading || !form.nomClient.trim() || !form.contexte.trim()}>
          {loading ? 'Préparation en cours...' : 'Préparer le rendez-vous'}
        </Button>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 flex justify-between">
          <span>{error}</span>
          <button onClick={clearError} className="text-red-400 hover:text-red-600">✕</button>
        </div>
      )}

      {loading && <LoadingOverlay message="L'IA prépare votre rendez-vous..." />}

      {result && !loading && (
        result._raw ? (
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <pre className="whitespace-pre-wrap text-sm text-slate-700">{result._raw}</pre>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Ordre du jour */}
            <CollapsibleCard
              title="Ordre du jour suggéré"
              icon={List}
              copyText={() =>
                result.ordre_du_jour?.map(p => `${p.numero}. ${p.point} (${p.duree})\n   ${p.description}`).join('\n\n')
              }
            >
              <ol className="space-y-3">
                {result.ordre_du_jour?.map((p) => (
                  <li key={p.numero} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{p.numero}</span>
                    <div>
                      <p className="text-sm font-semibold text-slate-700">{p.point}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-400">{p.duree}</span>
                        <span className="text-slate-300">·</span>
                        <span className="text-xs text-slate-500">{p.description}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </CollapsibleCard>

            {/* Questions clés */}
            <CollapsibleCard
              title="Questions clés à poser"
              icon={HelpCircle}
              copyText={() => result.questions_cles?.map(q => `• ${q.question}\n  → ${q.objectif}`).join('\n\n')}
            >
              <div className="space-y-3">
                {result.questions_cles?.map((q, i) => (
                  <div key={i} className="p-3 rounded-lg bg-slate-50">
                    <p className="text-sm font-semibold text-slate-700">« {q.question} »</p>
                    <p className="text-xs text-slate-500 mt-1 flex items-start gap-1">
                      <ChevronRight className="w-3 h-3 flex-shrink-0 mt-0.5" />
                      {q.objectif}
                    </p>
                  </div>
                ))}
              </div>
            </CollapsibleCard>

            {/* Points de vigilance */}
            <CollapsibleCard
              title="Points de vigilance"
              icon={AlertTriangle}
              copyText={() => result.points_vigilance?.map(p => `⚠ ${p.signal}\nRisque : ${p.risque}\nAction : ${p.action}`).join('\n\n')}
            >
              <div className="space-y-3">
                {result.points_vigilance?.map((p, i) => (
                  <div key={i} className="p-3 rounded-lg border border-amber-100 bg-amber-50">
                    <p className="text-sm font-semibold text-amber-700">⚠ {p.signal}</p>
                    <p className="text-xs text-slate-600 mt-1"><span className="font-medium">Risque :</span> {p.risque}</p>
                    <p className="text-xs text-slate-600 mt-0.5"><span className="font-medium">Action :</span> {p.action}</p>
                  </div>
                ))}
              </div>
            </CollapsibleCard>

            {/* Objectif SMART */}
            <CollapsibleCard
              title="Objectif SMART du RDV"
              icon={Target}
              copyText={smartText}
            >
              <SmartBlock objectif={result.objectif_smart} />
            </CollapsibleCard>

            {/* Message de confirmation */}
            <CollapsibleCard
              title="Message de confirmation (avant RDV)"
              icon={Send}
              copyText={result.message_confirmation}
            >
              <div className="bg-slate-50 rounded-lg p-4 flex items-start justify-between gap-4">
                <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed flex-1">{result.message_confirmation}</pre>
                <CopyButton text={result.message_confirmation} />
              </div>
            </CollapsibleCard>

            {/* Email de suivi */}
            <CollapsibleCard
              title="Email de suivi (après RDV)"
              icon={FileText}
              copyText={result.email_suivi}
            >
              <div className="bg-slate-50 rounded-lg p-4 flex items-start justify-between gap-4">
                <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed flex-1">{result.email_suivi}</pre>
                <CopyButton text={result.email_suivi} />
              </div>
            </CollapsibleCard>
          </div>
        )
      )}
    </div>
  );
}

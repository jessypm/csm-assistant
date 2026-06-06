import { useState } from 'react';
import { Mail, RefreshCw, Edit3 } from 'lucide-react';
import { useAnthropicAPI, parseJSON } from '../hooks/useAnthropicAPI';
import { COMMUNICATIONS_PROMPT, COMMUNICATIONS_ADJUST_PROMPT } from '../utils/prompts';
import Button from '../components/ui/Button';
import Textarea from '../components/ui/Textarea';
import Select from '../components/ui/Select';
import Input from '../components/ui/Input';
import { CopyButton } from '../components/ui/Card';
import { LoadingOverlay } from '../components/ui/Spinner';

const COMM_TYPES = [
  'Email de relance',
  'Email d\'escalade',
  'Email de renouvellement',
  'Message Slack/Teams',
  'Compte-rendu de RDV',
  'Plan de remédiation',
  'Note interne',
];

const TONS = ['Formel', 'Neutre', 'Chaleureux'];

function VersionCard({ version, onAdjust, adjusting }) {
  const [showAdjust, setShowAdjust] = useState(false);
  const [instruction, setInstruction] = useState('');

  const handleAdjust = () => {
    onAdjust(version.contenu, instruction);
    setShowAdjust(false);
    setInstruction('');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="bg-slate-50 px-5 py-3 flex items-center justify-between border-b border-slate-100">
        <p className="text-sm font-semibold text-slate-700">{version.titre}</p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAdjust((s) => !s)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:bg-white text-slate-600 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Modifier
          </button>
          <CopyButton text={version.contenu} />
        </div>
      </div>
      <div className="px-5 py-4">
        <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">{version.contenu}</pre>
      </div>

      {showAdjust && (
        <div className="border-t border-slate-100 px-5 py-4 bg-indigo-50/40 space-y-3">
          <p className="text-xs font-semibold text-indigo-700">Instruction d'ajustement</p>
          <Textarea
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="Ex : Rends le ton plus assertif, raccourcis l'email de moitié, ajoute une deadline claire..."
            rows={2}
          />
          <Button size="sm" onClick={handleAdjust} disabled={!instruction.trim() || adjusting}>
            <RefreshCw className={`w-3.5 h-3.5 ${adjusting ? 'animate-spin' : ''}`} />
            {adjusting ? 'En cours...' : 'Appliquer'}
          </Button>
        </div>
      )}
    </div>
  );
}

export default function Communications() {
  const [form, setForm] = useState({
    type: COMM_TYPES[0],
    destinataire: '',
    contexte: '',
    ton: TONS[1],
  });
  const [versions, setVersions] = useState(null);
  const [adjustingIndex, setAdjustingIndex] = useState(null);
  const { callAPI, loading, error, clearError } = useAnthropicAPI();

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.destinataire.trim() || !form.contexte.trim()) return;
    setVersions(null);
    const raw = await callAPI(COMMUNICATIONS_PROMPT(form));
    if (!raw) return;
    const parsed = parseJSON(raw);
    if (parsed?.version1) {
      setVersions([parsed.version1, parsed.version2]);
    } else {
      setVersions([{ titre: 'Résultat', contenu: raw }, null]);
    }
  };

  const handleAdjust = async (contenu, instruction, idx) => {
    setAdjustingIndex(idx);
    const adjusted = await callAPI(COMMUNICATIONS_ADJUST_PROMPT(contenu, instruction));
    if (adjusted) {
      setVersions((prev) => {
        const next = [...prev];
        next[idx] = { ...next[idx], contenu: adjusted };
        return next;
      });
    }
    setAdjustingIndex(null);
  };

  return (
    <div className="max-w-4xl space-y-5">
      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Mail className="w-5 h-5 text-indigo-500" />
          <h2 className="font-semibold text-slate-800">Paramètres de la communication</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Type de communication *"
            value={form.type}
            onChange={update('type')}
            options={COMM_TYPES}
          />
          <Select
            label="Ton souhaité *"
            value={form.ton}
            onChange={update('ton')}
            options={TONS}
          />
        </div>

        <Input
          label="Destinataire *"
          value={form.destinataire}
          onChange={update('destinataire')}
          placeholder="Ex : Sophie Martin (Directrice Ops), Client interne, Équipe produit..."
        />

        <Textarea
          label="Contexte *"
          value={form.contexte}
          onChange={update('contexte')}
          placeholder="Ex : Le client n'a pas répondu depuis 3 semaines malgré 2 tentatives de contact. L'onboarding est bloqué et le go-live approche..."
          rows={4}
          hint="Sois précise : la qualité du contexte conditionne directement la qualité des textes générés."
        />

        <Button type="submit" disabled={loading || !form.destinataire.trim() || !form.contexte.trim()}>
          {loading ? 'Génération en cours...' : 'Générer les 2 versions'}
        </Button>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 flex justify-between">
          <span>{error}</span>
          <button onClick={clearError} className="text-red-400 hover:text-red-600">✕</button>
        </div>
      )}

      {loading && <LoadingOverlay message="L'IA rédige les communications..." />}

      {versions && !loading && (
        <div className="space-y-4">
          <p className="text-sm text-slate-500 font-medium">2 versions générées — choisissez, copiez ou ajustez :</p>
          {versions.filter(Boolean).map((v, i) => (
            <VersionCard
              key={i}
              version={v}
              adjusting={adjustingIndex === i}
              onAdjust={(contenu, instr) => handleAdjust(contenu, instr, i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

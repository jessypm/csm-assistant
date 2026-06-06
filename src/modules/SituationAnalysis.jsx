import { useState, useEffect } from 'react';
import {
  Brain, Target, AlertTriangle, Map, BarChart2, TrendingUp,
  MessageSquare, Lightbulb, ChevronRight
} from 'lucide-react';
import { useAnthropicAPI, parseJSON } from '../hooks/useAnthropicAPI';
import { SITUATION_ANALYSIS_PROMPT } from '../utils/prompts';
import Button from '../components/ui/Button';
import Textarea from '../components/ui/Textarea';
import { CollapsibleCard, CopyButton } from '../components/ui/Card';
import { RiskBadge } from '../components/ui/Badge';
import { LoadingOverlay } from '../components/ui/Spinner';

function ErrorBanner({ message, onClose }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
      <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm text-red-700 font-medium">Erreur</p>
        <p className="text-sm text-red-600 mt-0.5">{message}</p>
      </div>
      <button onClick={onClose} className="text-red-400 hover:text-red-600 text-xs">✕</button>
    </div>
  );
}

function PlanTable({ plan }) {
  const cols = [
    { key: 'court_terme', label: 'Court terme (0-30j)', color: 'bg-emerald-50 text-emerald-700' },
    { key: 'moyen_terme', label: 'Moyen terme (1-3 mois)', color: 'bg-amber-50 text-amber-700' },
    { key: 'long_terme', label: 'Long terme (3-6 mois)', color: 'bg-indigo-50 text-indigo-700' },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cols.map(({ key, label, color }) => (
        <div key={key} className={`rounded-lg p-4 ${color.replace('text-', 'border border-').replace(/\w+-\d+$/, '200')} bg-white border`}>
          <p className={`text-xs font-bold uppercase tracking-wide mb-3 ${color.split(' ')[1]}`}>{label}</p>
          <ul className="space-y-2">
            {(plan[key] || []).map((action, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                {action}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default function SituationAnalysis({ prefilledClient, onPrefilledUsed }) {
  const [situation, setSituation] = useState('');
  const [result, setResult] = useState(null);
  const { callAPI, loading, error, clearError } = useAnthropicAPI();

  useEffect(() => {
    if (prefilledClient) {
      const text = `Client : ${prefilledClient.nom}
Secteur : ${prefilledClient.secteur}
Statut de santé : ${prefilledClient.statut === 'vert' ? 'Sain 🟢' : prefilledClient.statut === 'orange' ? 'Attention 🟠' : 'En risque 🔴'}
NPS : ${prefilledClient.nps ?? 'Non renseigné'}
Date de renouvellement : ${prefilledClient.dateRenouvellement || 'Non renseignée'}
Dernière action : ${prefilledClient.derniereAction || 'Non renseignée'}
Notes : ${prefilledClient.notes || 'Aucune note'}`;
      setSituation(text);
      setResult(null);
      onPrefilledUsed?.();
    }
  }, [prefilledClient, onPrefilledUsed]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!situation.trim()) return;
    const raw = await callAPI(SITUATION_ANALYSIS_PROMPT(situation));
    if (!raw) return;
    const parsed = parseJSON(raw);
    setResult(parsed || { _raw: raw });
  };

  const copyAll = () => {
    if (!result) return '';
    if (result._raw) return result._raw;
    return [
      `BESOIN RÉEL\n${result.besoin_reel}`,
      `RISQUES\n${result.risques?.map(r => `• ${r.risque} [${r.niveau}] : ${r.description}`).join('\n')}`,
      `STRATÉGIE\n${result.strategie}`,
      `PLAN D'ACTION\nCourt terme:\n${result.plan_action?.court_terme?.map(a => `• ${a}`).join('\n')}\nMoyen terme:\n${result.plan_action?.moyen_terme?.map(a => `• ${a}`).join('\n')}\nLong terme:\n${result.plan_action?.long_terme?.map(a => `• ${a}`).join('\n')}`,
      `INDICATEURS\n${result.indicateurs?.map(i => `• ${i.nom} : ${i.cible}`).join('\n')}`,
      `OPPORTUNITÉS\n${result.opportunites?.map(o => `• ${o.type} : ${o.description}`).join('\n')}`,
      `SYNTHÈSE\nLe client pense : ${result.synthese?.client_pense}\nL'entreprise pense : ${result.synthese?.entreprise_pense}\nLe CSM doit : ${result.synthese?.csm_doit_faire}\nErreurs à éviter : ${result.synthese?.erreurs_eviter?.join(', ')}`,
    ].join('\n\n---\n\n');
  };

  return (
    <div className="max-w-4xl space-y-5">
      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Brain className="w-5 h-5 text-indigo-500" />
          <h2 className="font-semibold text-slate-800">Décris la situation client</h2>
        </div>
        <Textarea
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
          placeholder="Ex : Mon client XYZ est dans le secteur retail, utilise notre solution depuis 6 mois. Le taux d'adoption est faible (30%), ils n'ont pas été formés correctement. Le renouvellement est dans 3 mois et le sponsor principal vient de partir..."
          rows={6}
          hint="Plus tu es précise, plus l'analyse sera pertinente. Inclus : secteur, ancienneté, contexte actuel, enjeux, signaux faibles..."
        />
        <div className="flex items-center justify-between">
          <Button type="submit" disabled={loading || !situation.trim()}>
            {loading ? 'Analyse en cours...' : 'Analyser la situation'}
          </Button>
          {result && (
            <CopyButton text={copyAll()} />
          )}
        </div>
      </form>

      {error && <ErrorBanner message={error} onClose={clearError} />}
      {loading && <LoadingOverlay message="L'IA analyse la situation client..." />}

      {/* Results */}
      {result && !loading && (
        result._raw ? (
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <pre className="whitespace-pre-wrap text-sm text-slate-700">{result._raw}</pre>
          </div>
        ) : (
          <div className="space-y-3">
            {/* 1. Besoin réel */}
            <CollapsibleCard
              title="Besoin réel du client"
              icon={Target}
              copyText={result.besoin_reel}
            >
              <p className="text-sm text-slate-600 leading-relaxed">{result.besoin_reel}</p>
            </CollapsibleCard>

            {/* 2. Risques */}
            <CollapsibleCard
              title="Risques identifiés"
              icon={AlertTriangle}
              copyText={() => result.risques?.map(r => `${r.risque} [${r.niveau}] : ${r.description}`).join('\n')}
            >
              <div className="space-y-3">
                {result.risques?.map((r, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                    <RiskBadge level={r.niveau} />
                    <div>
                      <p className="text-sm font-semibold text-slate-700">{r.risque}</p>
                      <p className="text-sm text-slate-500 mt-0.5">{r.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleCard>

            {/* 3. Stratégie */}
            <CollapsibleCard
              title="Stratégie d'accompagnement"
              icon={Lightbulb}
              copyText={result.strategie}
            >
              <p className="text-sm text-slate-600 leading-relaxed">{result.strategie}</p>
            </CollapsibleCard>

            {/* 4. Plan d'action */}
            <CollapsibleCard
              title="Plan d'action"
              icon={Map}
              copyText={() =>
                `Court terme:\n${result.plan_action?.court_terme?.map(a => `• ${a}`).join('\n')}\n\nMoyen terme:\n${result.plan_action?.moyen_terme?.map(a => `• ${a}`).join('\n')}\n\nLong terme:\n${result.plan_action?.long_terme?.map(a => `• ${a}`).join('\n')}`
              }
            >
              <PlanTable plan={result.plan_action || {}} />
            </CollapsibleCard>

            {/* 5. Indicateurs */}
            <CollapsibleCard
              title="Indicateurs de suivi"
              icon={BarChart2}
              copyText={() => result.indicateurs?.map(i => `${i.nom} : ${i.cible}`).join('\n')}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.indicateurs?.map((ind, i) => (
                  <div key={i} className="p-3 rounded-lg bg-indigo-50 border border-indigo-100">
                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide">{ind.nom}</p>
                    <p className="text-sm text-slate-600 mt-1">{ind.cible}</p>
                  </div>
                ))}
              </div>
            </CollapsibleCard>

            {/* 6. Opportunités */}
            <CollapsibleCard
              title="Opportunités de développement"
              icon={TrendingUp}
              copyText={() => result.opportunites?.map(o => `${o.type} : ${o.description}`).join('\n')}
            >
              <div className="space-y-2">
                {result.opportunites?.map((opp, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-teal-50 border border-teal-100">
                    <span className="text-xs font-bold text-teal-600 bg-teal-100 px-2 py-0.5 rounded-full whitespace-nowrap">{opp.type}</span>
                    <p className="text-sm text-slate-600">{opp.description}</p>
                  </div>
                ))}
              </div>
            </CollapsibleCard>

            {/* 7. Formulations */}
            <CollapsibleCard
              title="Formulations professionnelles"
              icon={MessageSquare}
              copyText={() => result.formulations?.map(f => `${f.titre}\n\n${f.contenu}`).join('\n\n---\n\n')}
            >
              <div className="space-y-4">
                {result.formulations?.map((f, i) => (
                  <div key={i} className="border border-slate-100 rounded-lg overflow-hidden">
                    <div className="bg-slate-50 px-4 py-2 flex items-center justify-between">
                      <p className="text-xs font-semibold text-slate-600">{f.titre}</p>
                      <CopyButton text={f.contenu} />
                    </div>
                    <div className="px-4 py-3">
                      <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">{f.contenu}</pre>
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleCard>

            {/* 8. Synthèse */}
            <CollapsibleCard
              title="Synthèse finale"
              icon={Brain}
              copyText={() => {
                const s = result.synthese || {};
                return `Le client pense probablement : ${s.client_pense}\n\nL'entreprise pense : ${s.entreprise_pense}\n\nLe CSM doit : ${s.csm_doit_faire}\n\nErreurs à éviter :\n${s.erreurs_eviter?.map(e => `• ${e}`).join('\n')}`;
              }}
            >
              <div className="space-y-3">
                {[
                  { label: '💭 Ce que pense probablement le client', text: result.synthese?.client_pense, bg: 'bg-slate-50' },
                  { label: '🏢 Ce que risque de penser l\'entreprise', text: result.synthese?.entreprise_pense, bg: 'bg-blue-50' },
                  { label: '✅ Ce que doit faire le CSM', text: result.synthese?.csm_doit_faire, bg: 'bg-emerald-50' },
                ].map(({ label, text, bg }, i) => (
                  <div key={i} className={`p-3 rounded-lg ${bg}`}>
                    <p className="text-xs font-semibold text-slate-600 mb-1">{label}</p>
                    <p className="text-sm text-slate-700">{text}</p>
                  </div>
                ))}
                <div className="p-3 rounded-lg bg-red-50">
                  <p className="text-xs font-semibold text-red-600 mb-2">⚠️ Erreurs à éviter absolument</p>
                  <ul className="space-y-1">
                    {result.synthese?.erreurs_eviter?.map((err, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="text-red-400 flex-shrink-0">✗</span>
                        {err}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CollapsibleCard>
          </div>
        )
      )}
    </div>
  );
}

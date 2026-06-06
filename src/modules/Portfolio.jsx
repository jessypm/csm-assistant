import { useState, useEffect } from 'react';
import { Users, Plus, Pencil, Trash2, Brain, LayoutGrid, List, Search, X } from 'lucide-react';
import { getClients, addClient, updateClient, deleteClient } from '../utils/storage';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Textarea from '../components/ui/Textarea';
import { StatusBadge } from '../components/ui/Badge';

const STATUTS = [
  { value: 'vert', label: '🟢 Sain' },
  { value: 'orange', label: '🟠 Attention' },
  { value: 'rouge', label: '🔴 En risque' },
];

const EMPTY_FORM = {
  nom: '', secteur: '', statut: 'vert', nps: '', dateRenouvellement: '', derniereAction: '', notes: '',
};

function ClientForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div className="bg-white rounded-xl border border-indigo-100 shadow-sm p-5 space-y-4">
      <h3 className="font-semibold text-slate-800">{initial?.id ? 'Modifier le client' : 'Ajouter un client'}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Nom du client *" value={form.nom} onChange={update('nom')} placeholder="Société XYZ" />
        <Input label="Secteur" value={form.secteur} onChange={update('secteur')} placeholder="Retail, Finance, Santé..." />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Select label="Statut de santé *" value={form.statut} onChange={update('statut')} options={STATUTS} />
        <Input label="NPS (0-10)" type="number" min="0" max="10" value={form.nps} onChange={update('nps')} placeholder="7" />
        <Input label="Date de renouvellement" type="date" value={form.dateRenouvellement} onChange={update('dateRenouvellement')} />
      </div>
      <Input label="Dernière action" value={form.derniereAction} onChange={update('derniereAction')} placeholder="Ex : Appel bilan mensuel" />
      <Textarea label="Notes libres" value={form.notes} onChange={update('notes')} rows={3} placeholder="Observations, signaux, contexte..." />
      <div className="flex gap-3">
        <Button onClick={() => onSave(form)} disabled={!form.nom.trim()}>Enregistrer</Button>
        <Button variant="secondary" onClick={onCancel}>Annuler</Button>
      </div>
    </div>
  );
}

function KanbanColumn({ statut, clients, onEdit, onDelete, onAnalyze }) {
  const config = {
    vert: { label: '🟢 Sain', bg: 'bg-emerald-50', border: 'border-emerald-200', header: 'bg-emerald-100 text-emerald-700' },
    orange: { label: '🟠 Attention', bg: 'bg-amber-50', border: 'border-amber-200', header: 'bg-amber-100 text-amber-700' },
    rouge: { label: '🔴 En risque', bg: 'bg-red-50', border: 'border-red-200', header: 'bg-red-100 text-red-700' },
  }[statut];

  return (
    <div className={`flex-1 min-w-0 rounded-xl border ${config.border} ${config.bg} p-3`}>
      <div className={`rounded-lg px-3 py-2 mb-3 ${config.header}`}>
        <p className="text-sm font-semibold">{config.label}</p>
        <p className="text-xs opacity-70">{clients.length} client(s)</p>
      </div>
      <div className="space-y-2">
        {clients.map((c) => (
          <div key={c.id} className="bg-white rounded-lg border border-slate-100 shadow-sm p-3">
            <p className="text-sm font-semibold text-slate-800">{c.nom}</p>
            {c.secteur && <p className="text-xs text-slate-400">{c.secteur}</p>}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {c.nps && <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">NPS {c.nps}</span>}
              {c.dateRenouvellement && <span className="text-xs text-slate-400">↻ {c.dateRenouvellement}</span>}
            </div>
            <div className="flex items-center gap-1 mt-3">
              <button onClick={() => onAnalyze(c)} className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-2 py-1 rounded-md flex items-center gap-1 transition-colors">
                <Brain className="w-3 h-3" /> Analyser
              </button>
              <button onClick={() => onEdit(c)} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors">
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => onDelete(c.id)} className="p-1 hover:bg-red-50 rounded text-slate-400 hover:text-red-500 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
        {clients.length === 0 && (
          <p className="text-xs text-slate-400 text-center py-4">Aucun client</p>
        )}
      </div>
    </div>
  );
}

export default function Portfolio({ onAnalyzeClient }) {
  const [clients, setClients] = useState([]);
  const [view, setView] = useState('table');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatut, setFilterStatut] = useState('');

  useEffect(() => {
    setClients(getClients());
  }, []);

  const refresh = () => setClients(getClients());

  const handleSave = (form) => {
    if (editing?.id) {
      updateClient(editing.id, form);
    } else {
      addClient(form);
    }
    refresh();
    setShowForm(false);
    setEditing(null);
  };

  const handleEdit = (client) => {
    setEditing(client);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Supprimer ce client ?')) {
      deleteClient(id);
      refresh();
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditing(null);
  };

  const filtered = clients.filter((c) => {
    const matchSearch = !search || c.nom.toLowerCase().includes(search.toLowerCase()) || c.secteur?.toLowerCase().includes(search.toLowerCase());
    const matchStatut = !filterStatut || c.statut === filterStatut;
    return matchSearch && matchStatut;
  });

  const byStatut = (s) => filtered.filter((c) => c.statut === s);

  return (
    <div className="max-w-6xl space-y-5">
      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-800">Portefeuille clients</span>
          <span className="text-sm text-slate-400">({clients.length} clients)</span>
        </div>
        <div className="flex-1 min-w-0" />
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-8 py-2 text-sm border border-slate-200 rounded-lg w-48 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Rechercher..."
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2">
              <X className="w-3.5 h-3.5 text-slate-400" />
            </button>
          )}
        </div>
        <select
          value={filterStatut}
          onChange={(e) => setFilterStatut(e.target.value)}
          className="py-2 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Tous les statuts</option>
          {STATUTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <div className="flex border border-slate-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setView('table')}
            className={`px-3 py-2 text-sm transition-colors ${view === 'table' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-50 text-slate-600'}`}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView('kanban')}
            className={`px-3 py-2 text-sm transition-colors ${view === 'kanban' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-50 text-slate-600'}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
        <Button onClick={() => { setEditing(null); setShowForm((s) => !s); }}>
          <Plus className="w-4 h-4" />
          Ajouter un client
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <ClientForm
          initial={editing}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      {/* Empty state */}
      {clients.length === 0 && !showForm && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-12 text-center">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">Aucun client dans le portefeuille</p>
          <p className="text-sm text-slate-400 mt-1">Cliquez sur "Ajouter un client" pour commencer</p>
        </div>
      )}

      {/* Table view */}
      {view === 'table' && filtered.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Client', 'Secteur', 'Statut', 'NPS', 'Renouvellement', 'Dernière action', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-800">{c.nom}</td>
                    <td className="px-4 py-3 text-slate-500">{c.secteur || '—'}</td>
                    <td className="px-4 py-3"><StatusBadge status={c.statut} /></td>
                    <td className="px-4 py-3 text-slate-500">{c.nps ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{c.dateRenouvellement || '—'}</td>
                    <td className="px-4 py-3 text-slate-500 max-w-xs truncate">{c.derniereAction || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onAnalyzeClient?.(c)}
                          className="p-1.5 hover:bg-indigo-50 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors"
                          title="Analyser"
                        >
                          <Brain className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(c)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                          title="Modifier"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Kanban view */}
      {view === 'kanban' && filtered.length > 0 && (
        <div className="flex gap-4">
          {['vert', 'orange', 'rouge'].map((s) => (
            <KanbanColumn
              key={s}
              statut={s}
              clients={byStatut(s)}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAnalyze={onAnalyzeClient || (() => {})}
            />
          ))}
        </div>
      )}
    </div>
  );
}

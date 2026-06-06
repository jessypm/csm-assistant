import { Brain, Calendar, Mail, Users, Briefcase, BookOpen, Zap } from 'lucide-react';

const navItems = [
  { id: 'situation', label: 'Analyse client', icon: Brain, description: 'Analyser une situation' },
  { id: 'meeting', label: 'Prépa RDV', icon: Calendar, description: 'Préparer un rendez-vous' },
  { id: 'communications', label: 'Communications', icon: Mail, description: 'Rédiger des messages' },
  { id: 'portfolio', label: 'Portefeuille', icon: Users, description: 'Gérer mes clients' },
  { id: 'copilot', label: 'Agent Analyser', icon: Briefcase, description: 'Diagnostic situation client' },
  { id: 'knowledge', label: 'Base de connaissances', icon: BookOpen, description: 'Templates CSM rédaction' },
];

export default function Sidebar({ activeModule, onNavigate }) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 flex flex-col z-30">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-700/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Zap className="w-4.5 h-4.5 text-white" size={18} />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">CSM copilot profile</p>
            <p className="text-slate-400 text-xs">Jessica JF</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors group ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:bg-slate-700/60 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} />
              <span className="text-sm font-medium leading-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-slate-700/60">
        <p className="text-slate-500 text-xs">Propulsé par Jessica</p>
      </div>
    </aside>
  );
}

export { navItems };

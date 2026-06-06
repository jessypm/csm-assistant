import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

import SituationAnalysis from './modules/SituationAnalysis';
import MeetingPrep from './modules/MeetingPrep';
import Communications from './modules/Communications';
import Portfolio from './modules/Portfolio';
//import CopilotCSM from './modules/CopilotCSM';
import KnowledgeBase from './modules/KnowledgeBase';

function MissingModule() {
  return (
    <div className="rounded-xl border border-orange-300 bg-orange-50 p-6">
      <h2 className="text-lg font-bold text-orange-800">
        Embauchez-moi ...
      </h2>
      <p className="mt-2 text-orange-700">
        L'accès complet à ce module est volontairement limité.
          Les fonctionnalités avancées sont réservées à un public très sélect :
       <ul>
          <li> - les utilisateurs autorisés ;</li>
          <li> - les futurs collègues ;</li>
          <li> - et, idéalement, mon futur employeur. </li>
       </ul>
      </p>
    </div>
  );
}

const modules = {
  situation: SituationAnalysis,
  meeting: MeetingPrep,
  communications: Communications,
  portfolio: Portfolio,
  copilot: MissingModule,
  knowledge: MissingModule,//KnowledgeBase,
};

export default function App() {
  const [activeModule, setActiveModule] = useState('situation');
  const [prefilledClient, setPrefilledClient] = useState(null);

  const handleAnalyzeClient = (client) => {
    setPrefilledClient(client);
    setActiveModule('situation');
  };

  const handleNavigate = (moduleId) => {
    if (moduleId !== 'situation') {
      setPrefilledClient(null);
    }

    setActiveModule(moduleId);
  };

  const ActiveModule = modules[activeModule] ?? MissingModule;

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar activeModule={activeModule} onNavigate={handleNavigate} />

      <div className="ml-64 min-h-screen flex flex-col">
        <Header activeModule={activeModule} />

        <main className="flex-1 p-6">
          <ActiveModule
            onAnalyzeClient={
              activeModule === 'portfolio' ? handleAnalyzeClient : undefined
            }
            prefilledClient={
              activeModule === 'situation' ? prefilledClient : undefined
            }
            onPrefilledUsed={
              activeModule === 'situation'
                ? () => setPrefilledClient(null)
                : undefined
            }
          />
        </main>
      </div>
    </div>
  );
}

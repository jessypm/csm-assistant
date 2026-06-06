import { navItems } from './Sidebar';

export default function Header({ activeModule }) {
  const current = navItems.find((n) => n.id === activeModule);
  return (
    <header className="h-14 bg-white border-b border-slate-100 flex items-center px-6 sticky top-0 z-20">
      <div>
        <h1 className="text-slate-800 font-semibold text-base leading-tight">{current?.label}</h1>
        <p className="text-slate-400 text-xs">{current?.description}</p>
      </div>
    </header>
  );
}

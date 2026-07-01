import { Layout } from 'lucide-react';

const themes = [
  { id: 'modern',   name: 'Modern',   color: 'from-cyan-500 to-blue-500' },
  { id: 'glass',    name: 'Glass',    color: 'from-violet-500 to-purple-500' },
  { id: 'minimal',  name: 'Minimal',  color: 'from-slate-400 to-slate-300' },
  { id: 'terminal', name: 'Terminal', color: 'from-green-500 to-emerald-400' },
  { id: 'creative', name: 'Creative', color: 'from-orange-500 to-pink-500' },
  { id: 'neobrutalist', name: 'Neo Brutalist', color: 'from-yellow-400 to-red-500' },
  { id: 'claymorphic', name: 'Claymorphic', color: 'from-pink-400 to-indigo-500' },
  { id: 'nordicforest', name: 'Nordic Forest', color: 'from-emerald-600 to-teal-500' },
];

export default function TemplateSelector({ currentTheme, setCurrentTheme }) {
  const active = themes.find(t => t.id === currentTheme);

  return (
    <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1 border border-white/10">
      {themes.map(theme => (
        <button
          key={theme.id}
          onClick={() => setCurrentTheme(theme.id)}
          title={theme.name}
          className={`relative px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
            currentTheme === theme.id
              ? 'text-white'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          {currentTheme === theme.id && (
            <span className={`absolute inset-0 rounded-md bg-gradient-to-r ${theme.color} opacity-90`} />
          )}
          <span className="relative z-10">{theme.name}</span>
        </button>
      ))}
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import Form from '../components/Form';
import Preview from '../components/Preview';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Eye, Edit3, RotateCcw, CheckCircle2 } from 'lucide-react';

const DEFAULT_DATA = {
  name: 'John Doe',
  role: 'Full Stack Engineer',
  email: 'hello@johndoe.com',
  phone: '+1 234 567 8900',
  about: 'I build products that scale. Passionate about beautiful interfaces and performant backends.',
  skills: ['React', 'Node.js', 'TypeScript', 'TailwindCSS'],
  projects: [
    {
      id: '1',
      title: 'Project Alpha',
      description: 'A cutting-edge SaaS platform built with modern web technologies.',
      link: 'https://alpha.example.com'
    }
  ],
  github: 'https://github.com/example',
  linkedin: 'https://linkedin.com/in/example',
};

export default function Generate() {
  const [activeTab, setActiveTab] = useState('form');
  const [currentTheme, setCurrentTheme] = useLocalStorage('pg_theme', 'modern');
  const [data, setData] = useLocalStorage('pg_data', DEFAULT_DATA);
  const [savedFlash, setSavedFlash] = useState(false);
  const saveTimerRef = useRef(null);

  // Flash the "Saved" indicator whenever data or theme changes
  useEffect(() => {
    clearTimeout(saveTimerRef.current);
    setSavedFlash(true);
    saveTimerRef.current = setTimeout(() => setSavedFlash(false), 2000);
    return () => clearTimeout(saveTimerRef.current);
  }, [data, currentTheme]);

  const handleReset = () => {
    if (window.confirm('Reset everything to the default sample data?')) {
      setData(DEFAULT_DATA);
      setCurrentTheme('modern');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-73px)]">
      {/* Mobile Tabs Wrapper */}
      <div className="lg:hidden flex border-b border-slate-800 bg-slate-900">
        <button
          onClick={() => setActiveTab('form')}
          className={`flex-1 py-4 flex items-center justify-center gap-2 font-medium text-sm transition-colors ${
            activeTab === 'form' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-slate-800/30' : 'text-slate-400 hover:bg-slate-800/10'
          }`}
        >
          <Edit3 className="w-4 h-4" /> Editor
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex-1 py-4 flex items-center justify-center gap-2 font-medium text-sm transition-colors ${
            activeTab === 'preview' ? 'text-purple-400 border-b-2 border-purple-400 bg-slate-800/30' : 'text-slate-400 hover:bg-slate-800/10'
          }`}
        >
          <Eye className="w-4 h-4" /> Live Preview
        </button>
      </div>

      {/* Main Split Interface */}
      <div className="flex-1 flex overflow-hidden">

        {/* Form Panel */}
        <div
          className={`w-full lg:w-[45%] h-full flex flex-col overflow-hidden lg:border-r border-slate-800 bg-slate-900/80 ${
            activeTab === 'form' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* Form header bar */}
          <div className="flex items-center justify-between px-5 py-2.5 border-b border-slate-800 bg-slate-900/60 flex-shrink-0">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Editor</span>
            <div className="flex items-center gap-3">
              {/* Saved indicator */}
              <span
                className={`flex items-center gap-1.5 text-xs font-medium transition-all duration-500 ${
                  savedFlash ? 'text-emerald-400 opacity-100' : 'text-slate-600 opacity-60'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {savedFlash ? 'Saved' : 'Auto-saved'}
              </span>
              {/* Reset button */}
              <button
                onClick={handleReset}
                title="Reset to default sample data"
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-400 hover:bg-red-500/10 px-2 py-1 rounded-md transition-all duration-150"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>
          </div>

          {/* Scrollable Form */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <Form data={data} setData={setData} />
          </div>
        </div>

        {/* Preview Panel */}
        <div
          className={`w-full lg:w-[55%] h-full flex flex-col overflow-hidden bg-[#0a0f1d] ${
            activeTab === 'preview' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          <Preview data={data} currentTheme={currentTheme} setCurrentTheme={setCurrentTheme} />
        </div>
      </div>
    </div>
  );
}

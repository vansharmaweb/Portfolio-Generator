import { useState } from 'react';
import Form from '../components/Form';
import Preview from '../components/Preview';
import { Eye, Edit3 } from 'lucide-react';

export default function Generate() {
  // Mobile Tab State
  const [activeTab, setActiveTab] = useState('form');

  // Theme State
  const [currentTheme, setCurrentTheme] = useState('modern');

  // Centralized Data State
  const [data, setData] = useState({
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
  });

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
          className={`w-full lg:w-[45%] h-full overflow-y-auto lg:border-r border-slate-800 bg-slate-900/80 custom-scrollbar ${
            activeTab === 'form' ? 'block' : 'hidden lg:block'
          }`}
        >
          <Form data={data} setData={setData} />
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

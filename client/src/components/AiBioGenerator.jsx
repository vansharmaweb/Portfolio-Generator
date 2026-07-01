import { useState, useEffect } from 'react';
import { Sparkles, Loader2, AlertCircle, Key, Trash2 } from 'lucide-react';
import Groq from 'groq-sdk';

export default function AiBioGenerator({ data, onBioGenerated }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // State for the active API key
  const [activeKey, setActiveKey] = useState('');
  // State for the temporary input key
  const [tempKey, setTempKey] = useState('');
  // State to show/hide the key configuration UI
  const [showConfig, setShowConfig] = useState(false);

  // Check for keys on mount
  useEffect(() => {
    const envKey = import.meta.env.VITE_GROQ_API_KEY || '';
    if (envKey) {
      setActiveKey(envKey);
    } else {
      const storedKey = localStorage.getItem('pg_groq_api_key') || '';
      if (storedKey) {
        setActiveKey(storedKey);
      }
    }
  }, []);

  const handleSaveKey = () => {
    const trimmed = tempKey.trim();
    if (!trimmed) {
      setError('Please enter a valid API key.');
      return;
    }
    if (!trimmed.startsWith('gsk_')) {
      setError('Invalid format. Groq keys usually start with "gsk_".');
      return;
    }
    localStorage.setItem('pg_groq_api_key', trimmed);
    setActiveKey(trimmed);
    setTempKey('');
    setError(null);
    setShowConfig(false);
  };

  const handleClearKey = () => {
    localStorage.removeItem('pg_groq_api_key');
    setActiveKey('');
    setShowConfig(true);
  };

  const generateBio = async () => {
    if (!activeKey) {
      setError('Please configure your Groq API key first.');
      return;
    }

    if (!data.name && !data.role) {
      setError('Fill in your Name and Role first so the AI has something to work with.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Connect directly using the key (enabled for browser usage)
      const groq = new Groq({ apiKey: activeKey, dangerouslyAllowBrowser: true });

      const skills = data.skills?.filter(Boolean).join(', ') || 'various technologies';
      const projects = data.projects?.map(p => p.title).filter(Boolean).join(', ') || '';

      const prompt = `Write a compelling, professional "About Me" paragraph for a developer portfolio website.

Details:
- Name: ${data.name || 'the developer'}
- Role: ${data.role || 'Software Developer'}
- Skills: ${skills}
${projects ? `- Notable projects: ${projects}` : ''}

Requirements:
- 2-3 sentences maximum
- Energetic and personal tone, not corporate
- Mention their role and passion for building
- Subtly weave in 2-3 of their top skills
- Do NOT start with "I am" or "My name is"
- No bullet points, just a clean paragraph
- No quotes around the output`;

      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.1-8b-instant',
      });

      const text = chatCompletion.choices[0]?.message?.content?.trim() || '';
      onBioGenerated(text);
    } catch (err) {
      console.error(err);
      setError(`Generation failed: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const isEnvKey = !!(import.meta.env.VITE_GROQ_API_KEY);

  return (
    <div className="space-y-3">
      {/* ── API Key Configuration Bar (Shown if no key active, or user toggles it) ── */}
      {(!activeKey || showConfig) && (
        <div className="flex flex-col gap-2 p-3 rounded-xl bg-slate-800/40 border border-slate-700/80 max-w-sm transition-all duration-200">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-violet-400" />
            <span>Configure Groq API Key</span>
          </label>
          <div className="flex gap-2">
            <input
              type="password"
              placeholder="gsk_xxxxxxxxxxxx"
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-violet-500"
            />
            <button
              onClick={handleSaveKey}
              className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Save
            </button>
          </div>
          <span className="text-[10px] text-slate-500 leading-tight">
            Key is stored client-side in your browser's LocalStorage and is never shared.
          </span>
        </div>
      )}

      {/* ── Main Buttons Bar ── */}
      {activeKey && (
        <div className="flex items-center gap-2">
          <button
            onClick={generateBio}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-500/15 hover:bg-violet-500/25 border border-violet-500/30 hover:border-violet-400/50 text-violet-300 hover:text-violet-200 text-xs font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform duration-200" />
            )}
            {loading ? 'Generating…' : 'AI Generate'}
          </button>

          {/* Settings / Reset Controls */}
          {!isEnvKey && (
            <button
              onClick={handleClearKey}
              title="Delete stored API Key"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/10 border border-slate-700 hover:border-red-500/30 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          {isEnvKey && (
            <span className="text-[10px] font-medium text-emerald-500/80 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              Key Loaded from Env
            </span>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg max-w-sm">
          <AlertCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-red-400 text-xs leading-relaxed">{error}</p>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import { Sparkles, Loader2, AlertCircle, Key, Trash2, Settings, X, Check } from 'lucide-react';
import Groq from 'groq-sdk';

export default function AiBioGenerator({ data, onBioGenerated }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // State for active keys
  const [activeGroqKey, setActiveGroqKey] = useState('');
  const [activeGeminiKey, setActiveGeminiKey] = useState('');

  // Selected provider: 'groq' | 'gemini'
  const [provider, setProvider] = useState('groq');
  
  // State for temporary inputs
  const [tempKey, setTempKey] = useState('');
  
  // State to show/hide the popover config UI
  const [showConfig, setShowConfig] = useState(false);

  const popoverRef = useRef(null);

  // Load keys and provider on mount
  useEffect(() => {
    // 1. Load active Groq key
    const envGroq = import.meta.env.VITE_GROQ_API_KEY || '';
    if (envGroq) {
      setActiveGroqKey(envGroq);
    } else {
      setActiveGroqKey(localStorage.getItem('pg_groq_api_key') || '');
    }

    // 2. Load active Gemini key
    const envGemini = import.meta.env.VITE_GEMINI_API_KEY || '';
    if (envGemini) {
      setActiveGeminiKey(envGemini);
    } else {
      setActiveGeminiKey(localStorage.getItem('pg_gemini_api_key') || '');
    }

    // 3. Load provider selection
    const savedProvider = localStorage.getItem('pg_ai_provider');
    if (savedProvider === 'groq' || savedProvider === 'gemini') {
      setProvider(savedProvider);
    } else if (envGemini && !envGroq) {
      setProvider('gemini');
    }
  }, []);

  // Update temp key input when provider tab changes or popover opens
  useEffect(() => {
    if (provider === 'groq') {
      const isEnv = !!import.meta.env.VITE_GROQ_API_KEY;
      setTempKey(isEnv ? '••••••••••••••••' : localStorage.getItem('pg_groq_api_key') || '');
    } else {
      const isEnv = !!import.meta.env.VITE_GEMINI_API_KEY;
      setTempKey(isEnv ? '••••••••••••••••' : localStorage.getItem('pg_gemini_api_key') || '');
    }
  }, [provider, showConfig]);

  // Click outside to close popover
  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setShowConfig(false);
      }
    }
    if (showConfig) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showConfig]);

  const handleSaveKey = () => {
    const trimmed = tempKey.trim();
    if (!trimmed) {
      setError('Please enter a key.');
      return;
    }

    if (provider === 'groq') {
      if (import.meta.env.VITE_GROQ_API_KEY) return; // Prevent overwriting env key
      localStorage.setItem('pg_groq_api_key', trimmed);
      setActiveGroqKey(trimmed);
    } else {
      if (import.meta.env.VITE_GEMINI_API_KEY) return; // Prevent overwriting env key
      localStorage.setItem('pg_gemini_api_key', trimmed);
      setActiveGeminiKey(trimmed);
    }

    localStorage.setItem('pg_ai_provider', provider);
    setError(null);
    setShowConfig(false);
  };

  const handleClearKey = () => {
    if (provider === 'groq') {
      if (import.meta.env.VITE_GROQ_API_KEY) return;
      localStorage.removeItem('pg_groq_api_key');
      setActiveGroqKey('');
    } else {
      if (import.meta.env.VITE_GEMINI_API_KEY) return;
      localStorage.removeItem('pg_gemini_api_key');
      setActiveGeminiKey('');
    }
    setTempKey('');
  };

  const handleProviderToggle = (p) => {
    setProvider(p);
    localStorage.setItem('pg_ai_provider', p);
  };

  const generateBio = async () => {
    setError(null);
    
    // Check key configuration
    const activeKey = provider === 'groq' ? activeGroqKey : activeGeminiKey;
    if (!activeKey) {
      setShowConfig(true);
      setError(`Please configure your ${provider === 'groq' ? 'Groq' : 'Gemini'} API key first.`);
      return;
    }

    if (!data.name && !data.role) {
      setError('Fill in your Name and Role first so the AI has something to work with.');
      return;
    }

    setLoading(true);

    const skillsText = data.skills?.filter(Boolean).join(', ') || 'various technologies';
    const projectsText = data.projects?.map(p => p.title).filter(Boolean).join(', ') || '';

    const prompt = `Write a compelling, professional "About Me" paragraph for a developer portfolio website.

Details:
- Name: ${data.name || 'the developer'}
- Role: ${data.role || 'Software Developer'}
- Skills: ${skillsText}
${projectsText ? `- Notable projects: ${projectsText}` : ''}

Requirements:
- 2-3 sentences maximum
- Energetic and personal tone, not corporate
- Mention their role and passion for building
- Subtly weave in 2-3 of their top skills
- Do NOT start with "I am" or "My name is"
- No bullet points, just a clean paragraph
- No quotes around the output`;

    try {
      let text = '';

      if (provider === 'groq') {
        // Groq SDK direct browser call
        const groq = new Groq({ apiKey: activeKey, dangerouslyAllowBrowser: true });
        const chatCompletion = await groq.chat.completions.create({
          messages: [{ role: 'user', content: prompt }],
          model: 'llama-3.1-8b-instant',
        });
        text = chatCompletion.choices[0]?.message?.content?.trim() || '';
      } else {
        // Gemini API Direct Fetch call
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${activeKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }],
            generationConfig: {
              maxOutputTokens: 180,
              temperature: 0.7
            }
          })
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error?.message || `API Error (Status ${response.status})`);
        }

        const resData = await response.json();
        text = resData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
      }

      if (!text) {
        throw new Error('Received empty response from the AI model.');
      }

      onBioGenerated(text);
      setShowConfig(false);
    } catch (err) {
      console.error(err);
      setError(`Generation failed: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const isGroqEnv = !!import.meta.env.VITE_GROQ_API_KEY;
  const isGeminiEnv = !!import.meta.env.VITE_GEMINI_API_KEY;
  const currentIsEnv = provider === 'groq' ? isGroqEnv : isGeminiEnv;
  const activeKey = provider === 'groq' ? activeGroqKey : activeGeminiKey;

  return (
    <div className="relative inline-block" ref={popoverRef}>
      
      {/* ── Button Group ── */}
      <div className="flex items-center bg-violet-500/10 border border-violet-500/20 rounded-lg overflow-hidden">
        <button
          onClick={generateBio}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 text-violet-300 hover:text-violet-200 hover:bg-violet-500/10 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold transition-all duration-150 cursor-pointer"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
          <span>{loading ? 'Generating…' : 'AI Generate'}</span>
        </button>
        <button
          onClick={() => setShowConfig(!showConfig)}
          title="Configure API Keys"
          className="p-1.5 border-l border-violet-500/20 text-violet-400 hover:text-violet-200 hover:bg-violet-500/10 transition-all cursor-pointer"
        >
          <Settings className={`w-3.5 h-3.5 ${showConfig ? 'rotate-45' : ''} transition-transform duration-200`} />
        </button>
      </div>

      {/* ── API Key Configuration Popover (Overlay) ── */}
      {showConfig && (
        <div className="absolute right-0 top-full mt-2 z-50 p-4 rounded-xl bg-slate-950 border border-slate-700/80 shadow-2xl w-80 text-left backdrop-blur-md transition-all duration-200">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-violet-400" />
              <span>Configure AI Providers</span>
            </span>
            <button 
              onClick={() => setShowConfig(false)}
              className="text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Provider Selector Tabs */}
          <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-850 text-[11px] mb-3 font-semibold">
            <button
              onClick={() => handleProviderToggle('groq')}
              className={`flex-1 py-1 rounded-md transition-all flex items-center justify-center gap-1 cursor-pointer ${
                provider === 'groq' 
                  ? 'bg-violet-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Groq (Llama)</span>
              {activeGroqKey && <Check className="w-2.5 h-2.5 text-emerald-400" />}
            </button>
            <button
              onClick={() => handleProviderToggle('gemini')}
              className={`flex-1 py-1 rounded-md transition-all flex items-center justify-center gap-1 cursor-pointer ${
                provider === 'gemini' 
                  ? 'bg-violet-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Gemini</span>
              {activeGeminiKey && <Check className="w-2.5 h-2.5 text-emerald-400" />}
            </button>
          </div>

          {/* Form */}
          <div className="space-y-3">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {provider === 'groq' ? 'Groq API Key' : 'Gemini API Key'}
              </span>
              
              {currentIsEnv ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1.5 rounded-lg text-[11px] text-emerald-400 font-semibold">
                  Loaded from System Environment (.env)
                </div>
              ) : (
                <div className="flex gap-1.5">
                  <input
                    type="password"
                    placeholder={provider === 'groq' ? 'gsk_xxxxxx' : 'AIzaSyxxxxxx'}
                    value={tempKey}
                    onChange={(e) => setTempKey(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700/80 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                  {activeKey && (
                    <button
                      onClick={handleClearKey}
                      title="Clear key"
                      className="p-1.5 bg-slate-900 hover:bg-red-500/10 border border-slate-700 hover:border-red-500/30 rounded-lg text-slate-400 hover:text-red-400 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Save CTA */}
            {!currentIsEnv && (
              <button
                onClick={handleSaveKey}
                className="w-full py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Save Configuration
              </button>
            )}

            <div className="text-[10px] text-slate-500 leading-tight border-t border-slate-800/80 pt-2">
              Keys are stored client-side in your browser's LocalStorage and never sent to any server.
            </div>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="absolute right-0 top-full mt-2 z-50 flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg w-80 text-left shadow-xl">
          <AlertCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-red-400 text-xs leading-relaxed flex-1">{error}</p>
        </div>
      )}

    </div>
  );
}

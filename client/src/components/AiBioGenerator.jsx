import { useState } from 'react';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export default function AiBioGenerator({ data, onBioGenerated }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateBio = async () => {
    if (!API_KEY) {
      setError('No API key found. Add VITE_GEMINI_API_KEY to your .env file.');
      return;
    }

    if (!data.name && !data.role) {
      setError('Fill in your Name and Role first so the AI has something to work with.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

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

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      onBioGenerated(text);
    } catch (err) {
      console.error(err);
      setError('Generation failed. Check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={generateBio}
        disabled={loading}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-500/15 hover:bg-violet-500/25 border border-violet-500/30 hover:border-violet-400/50 text-violet-300 hover:text-violet-200 text-xs font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform duration-200" />
        )}
        {loading ? 'Generating…' : 'AI Generate'}
      </button>

      {error && (
        <div className="flex items-start gap-2 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">
          <AlertCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-red-400 text-xs leading-relaxed">{error}</p>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { Terminal, Copy, ExternalLink, X, Rocket, ShieldAlert } from 'lucide-react';
import { deployToGithubPages } from '../utils/githubDeploy';
import { getHtmlString } from '../utils/exportPortfolio';

export default function DeployModal({ isOpen, onClose, data, currentTheme }) {
  const [repoName, setRepoName] = useState('my-portfolio');
  const [pat, setPat] = useState('');
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | deploying | success | error
  const [liveUrl, setLiveUrl] = useState('');

  if (!isOpen) return null;

  const logCallback = (msg) => {
    setLogs(prev => [...prev, `> ${msg}`]);
  };

  const handleDeploy = async () => {
    if (!pat.trim() || !repoName.trim()) {
      alert("Please enter both Repository Name and PAT.");
      return;
    }
    
    setLogs([]);
    setStatus('deploying');
    
    try {
      const htmlString = getHtmlString(data, currentTheme);
      const url = await deployToGithubPages(pat, repoName, htmlString, logCallback);
      setLiveUrl(url);
      setStatus('success');
    } catch (err) {
      logCallback(`[ERROR] ${err.message}`);
      setStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-slate-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-lg shadow-lg">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Deploy to GitHub Pages</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 flex flex-col md:flex-row gap-6">
          
          {/* Controls */}
          <div className="flex-1 space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-300">Repository Name</label>
                <input 
                  type="text" 
                  value={repoName}
                  onChange={(e) => setRepoName(e.target.value)}
                  disabled={status === 'deploying'}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 disabled:opacity-50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-300 flex justify-between">
                  <span>Personal Access Token (PAT)</span>
                  <a href="https://github.com/settings/tokens/new?scopes=repo,workflow&description=PortGen" target="_blank" rel="noreferrer" className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                    Get Token <ExternalLink className="w-3 h-3" />
                  </a>
                </label>
                <input 
                  type="password" 
                  value={pat}
                  onChange={(e) => setPat(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxx"
                  disabled={status === 'deploying'}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 disabled:opacity-50"
                />
                <div className="flex items-start gap-2 pt-1 text-xs text-slate-500">
                  <ShieldAlert className="w-3.5 h-3.5 mt-0.5 text-yellow-500 shrink-0" />
                  <p>Your token is used strictly in-memory (RAM) to deploy your portfolio and is never saved anywhere.</p>
                </div>
              </div>
            </div>

            {status !== 'success' && (
              <button
                onClick={handleDeploy}
                disabled={status === 'deploying' || !pat || !repoName}
                className="w-full py-3 px-4 bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-800 disabled:text-slate-400 text-white font-bold rounded-lg transition-all flex justify-center items-center gap-2"
              >
                {status === 'deploying' ? <Terminal className="w-5 h-5 animate-pulse" /> : <Rocket className="w-5 h-5" />}
                {status === 'deploying' ? 'Deploying Live...' : 'Deploy Portfolio'}
              </button>
            )}

            {status === 'success' && (
              <div className="p-4 bg-emerald-900/30 border border-emerald-800 rounded-xl space-y-3">
                <h3 className="font-bold text-emerald-400">Successfully Deployed!</h3>
                <p className="text-sm text-slate-300">Your portfolio was pushed to <span className="font-mono text-cyan-300">{repoName}</span>.</p>
                <p className="text-xs text-slate-400 italic">Note: GitHub Pages may take 1-3 minutes to become globally visible for the first time.</p>
                <a 
                  href={liveUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="mt-2 inline-flex items-center justify-center w-full gap-2 py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors"
                >
                  Visit Live Site <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>

          {/* Vercel-style Terminal Logs */}
          <div className="flex-1 bg-[#0d1117] border border-slate-800 rounded-xl p-4 font-mono text-xs md:text-sm text-slate-300 overflow-y-auto h-64 flex flex-col">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-800 text-slate-500">
              <Terminal className="w-4 h-4" /> <span>Deploy Logs</span>
            </div>
            <div className="flex-1 space-y-1 overflow-y-auto flex flex-col">
              {logs.length === 0 ? (
                <span className="text-slate-600">Waiting for deployment trigger...</span>
              ) : (
                logs.map((L, i) => (
                  <span key={i} className="animate-fade-in opacity-90">{L}</span>
                ))
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

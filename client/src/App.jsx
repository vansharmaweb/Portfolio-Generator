import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Generate from './pages/Generate';

const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-cyan-500/30 flex flex-col">
      {/* ── Navbar ── */}
      <nav className="w-full px-6 py-4 flex items-center justify-between border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3 flex-1">
          <img src="/logo.svg" alt="PortGen" className="h-8 md:h-10 w-auto object-contain drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
        </div>

        {/* Creator badge — centre */}
        <div className="hidden sm:flex items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/60 border border-slate-700/50 text-xs text-slate-400 font-medium whitespace-nowrap">
          <span>Made by</span>
          <a
            href="https://github.com/vansharmaweb"
            target="_blank"
            rel="noreferrer"
            className="text-cyan-400 hover:text-cyan-300 transition-colors font-semibold"
          >
            Vansh Sharma
          </a>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        </div>

        {/* GitHub link — right */}
        <div className="flex-1 flex justify-end">
          <a
            href="https://github.com/vansharmaweb/Portfolio-Generator"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white transition-all text-sm font-medium shadow-sm w-fit"
          >
            <GithubIcon />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </nav>

      {/* ── Page content ── */}
      <main className="flex-1 w-full flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/generate" element={<Generate />} />
        </Routes>
      </main>

      {/* ── Footer ── */}
      <footer className="w-full border-t border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Left: Branding */}
          <div className="md:flex-1 flex flex-col items-center md:items-start gap-1">
            <div className="flex items-center gap-2">
              <img src="/logo.svg" alt="PortGen" className="h-6 w-auto object-contain" />
            </div>
            <p className="text-slate-500 text-xs">
              Build stunning developer portfolios in seconds.
            </p>
          </div>

          {/* Centre: Made by */}
          <div className="md:flex-1 text-center">
            <p className="text-slate-500 text-xs mb-1">Designed &amp; built by</p>
            <p className="text-white font-bold text-sm tracking-wide">Vansh Sharma</p>
          </div>

          {/* Right: Social links */}
          <div className="md:flex-1 flex items-center justify-center md:justify-end gap-3">
            <a
              href="https://github.com/vansharmaweb/Portfolio-Generator"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all text-sm font-medium"
            >
              <GithubIcon /> GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/vansharmaweb"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-900/40 hover:bg-blue-900/60 border border-blue-800/50 text-blue-300 hover:text-blue-200 transition-all text-sm font-medium"
            >
              <LinkedinIcon /> LinkedIn
            </a>
            <a
              href="mailto:vansharmaweb@gmail.com"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all text-sm font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              Email
            </a>
          </div>
        </div>

        <p className="text-center text-slate-700 text-xs mt-6">
          © {new Date().getFullYear()} PortGen · vansharmaweb@gmail.com
        </p>
      </footer>
    </div>
  );
}

export default App;

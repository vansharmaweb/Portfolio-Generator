import { Mail, ExternalLink, Terminal as TerminalIcon, ChevronRight } from 'lucide-react';

const GithubIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4"/>
    <path d="M9 18c-4.51 2-5-2-7-2"/>
  </svg>
);

const LinkedinIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

function TermLine({ prefix = '$', color = 'text-green-400', children }) {
  return (
    <div className="flex items-start gap-2 font-mono text-sm leading-relaxed">
      <span className={`${color} shrink-0 select-none`}>{prefix}</span>
      <span className="text-gray-100">{children}</span>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="border border-green-900/60 rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2 bg-green-900/20 border-b border-green-900/60">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-green-500/70" />
        </div>
        <span className="font-mono text-xs text-green-500/80 ml-1">{title}</span>
      </div>
      <div className="p-5 space-y-3">
        {children}
      </div>
    </div>
  );
}

export default function TerminalTheme({ data }) {
  const { name, role, email, phone, about, skills, projects, github, linkedin } = data;

  return (
    <div className="min-h-full w-full bg-[#0d1117] text-green-300 font-mono p-6 md:p-10 lg:p-14 selection:bg-green-500/30">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Top bar */}
        <div className="flex items-center gap-2 border border-green-900/60 rounded-lg px-4 py-3 bg-green-900/10">
          <TerminalIcon className="w-4 h-4 text-green-500" />
          <span className="text-green-500/80 text-xs">portfolio.sh — bash</span>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-green-900 text-xs">~/portfolio</span>
            <span className="inline-block w-2 h-5 bg-green-400 opacity-80 animate-pulse" />
          </div>
        </div>

        {/* Identity */}
        <Section title="whoami.sh">
          <TermLine prefix="$" color="text-green-400">whoami</TermLine>
          <div className="ml-4 mt-2 space-y-1">
            <p className="text-2xl md:text-4xl font-bold text-white tracking-tight">{name || 'Your Name'}</p>
            <p className="text-green-400 text-sm"># {role || 'Your Role'}</p>
          </div>
          <TermLine prefix="$" color="text-green-400">cat about.txt</TermLine>
          <p className="ml-4 text-gray-400 text-sm leading-relaxed">
            {about || 'Write something about yourself here.'}
          </p>
          <TermLine prefix="$" color="text-green-400">contact --list</TermLine>
          <div className="ml-4 space-y-1.5">
            {email && (
              <a href={`mailto:${email}`} className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                <ChevronRight className="w-3 h-3" /> email: {email}
              </a>
            )}
            {phone && (
              <p className="flex items-center gap-2 text-sm text-gray-400">
                <ChevronRight className="w-3 h-3" /> phone: {phone}
              </p>
            )}
            {github && (
              <a href={github} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                <ChevronRight className="w-3 h-3" /> github: <GithubIcon className="w-3.5 h-3.5 inline" /> {github.replace('https://','').replace('http://','')}
              </a>
            )}
            {linkedin && (
              <a href={linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                <ChevronRight className="w-3 h-3" /> linkedin: <LinkedinIcon className="w-3.5 h-3.5 inline" /> {linkedin.replace('https://','').replace('http://','')}
              </a>
            )}
          </div>
        </Section>

        {/* Skills */}
        {skills && skills.length > 0 && skills.some(s => s.trim() !== '') && (
          <Section title="skills.json">
            <TermLine prefix="$" color="text-green-400">ls skills/</TermLine>
            <div className="ml-4 flex flex-wrap gap-2 mt-2">
              {skills.map((skill, i) => skill.trim() && (
                <span key={i} className="px-3 py-1 border border-green-800/80 rounded text-xs text-green-300 bg-green-900/20 font-mono">
                  {skill}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && projects.some(p => p.title || p.description) && (
          <Section title="projects/index.sh">
            <TermLine prefix="$" color="text-green-400">ls -la projects/</TermLine>
            <div className="ml-2 mt-3 space-y-5">
              {projects.map((project, i) => (
                (project.title || project.description) && (
                  <div key={project.id} className="border-l-2 border-green-800 pl-4 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-400 text-xs font-mono">drwxr-xr-x</span>
                      <span className="text-white font-semibold">{project.title || 'Untitled'}</span>
                      {project.link && (
                        <a href={project.link.startsWith('http') ? project.link : `https://${project.link}`} target="_blank" rel="noreferrer" className="ml-auto text-cyan-400 hover:text-cyan-300">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                    <p className="text-gray-500 text-xs leading-relaxed">// {project.description || 'No description.'}</p>
                  </div>
                )
              ))}
            </div>
          </Section>
        )}

        {/* Footer prompt */}
        <div className="flex items-center gap-2 text-xs font-mono text-green-900/80">
          <span>Built with</span>
          <span className="text-green-700 font-bold">PortGen</span>
          <span className="inline-block w-2 h-4 bg-green-900 opacity-60 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

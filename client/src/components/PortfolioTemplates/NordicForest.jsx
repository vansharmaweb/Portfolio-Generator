import { Mail, Phone, ExternalLink, FileText } from 'lucide-react';

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

export default function NordicForest({ data }) {
  if (!data) return null;

  return (
    <div className="min-h-full w-full bg-[#070f0e] text-[#d1dcd6] font-sans p-6 md:p-12 lg:p-16 relative overflow-hidden flex justify-center selection:bg-emerald-950 selection:text-emerald-300">
      
      {/* Styles for slow-moving aurora gradient mesh */}
      <style>{`
        @keyframes aurora-drift-1 {
          0% { transform: translate(0px, 0px) scale(1) rotate(0deg); }
          33% { transform: translate(30px, -50px) scale(1.1) rotate(120deg); }
          66% { transform: translate(-20px, 20px) scale(0.95) rotate(240deg); }
          100% { transform: translate(0px, 0px) scale(1) rotate(360deg); }
        }
        @keyframes aurora-drift-2 {
          0% { transform: translate(0px, 0px) scale(1) rotate(360deg); }
          50% { transform: translate(-40px, 40px) scale(1.05) rotate(180deg); }
          100% { transform: translate(0px, 0px) scale(1) rotate(0deg); }
        }
        .aurora-circle-1 {
          animation: aurora-drift-1 25s infinite ease-in-out;
        }
        .aurora-circle-2 {
          animation: aurora-drift-2 30s infinite ease-in-out;
        }
      `}</style>

      {/* Aurora mesh elements in background */}
      <div className="absolute top-[-20%] left-[-10%] w-[90%] h-[80%] rounded-full bg-gradient-to-tr from-emerald-950/20 via-[#064e3b]/15 to-transparent blur-[110px] pointer-events-none aurora-circle-1" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] rounded-full bg-gradient-to-bl from-[#115e59]/10 via-[#042f2e]/20 to-transparent blur-[120px] pointer-events-none aurora-circle-2" />

      <div className="max-w-4xl w-full space-y-16 relative z-10">
        
        {/* Header Section */}
        <header className="border-b border-[#1b302a] pb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-serif tracking-tight text-[#e6ede9]">
              {data.name || 'Your Name'}
            </h1>
            <div className="text-emerald-400 font-semibold tracking-wider uppercase text-sm font-mono">
              // {data.role || 'Your Role'}
            </div>
            <p className="text-[#a4b5ad] text-base md:text-lg leading-relaxed max-w-2xl font-light">
              {data.about || 'Write a brief about yourself here.'}
            </p>
          </div>

          {/* Socials & Contacts */}
          <div className="flex flex-col gap-3 min-w-[200px] w-full md:w-auto text-sm font-mono">
            {data.email && (
              <a href={`mailto:${data.email}`} className="flex items-center gap-2 text-[#a4b5ad] hover:text-emerald-400 transition-colors">
                <Mail className="w-4 h-4 text-emerald-600" /> {data.email}
              </a>
            )}
            {data.phone && (
              <a href={`tel:${data.phone}`} className="flex items-center gap-2 text-[#a4b5ad] hover:text-emerald-400 transition-colors">
                <Phone className="w-4 h-4 text-emerald-600" /> {data.phone}
              </a>
            )}
            {data.resume && (
              <a href={data.resume} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[#a4b5ad] hover:text-emerald-400 transition-colors">
                <FileText className="w-4 h-4 text-emerald-600" /> resume.pdf
              </a>
            )}
            <div className="flex items-center gap-4 mt-2">
              {data.github && (
                <a href={data.github} target="_blank" rel="noreferrer" className="text-[#a4b5ad] hover:text-emerald-400 transition-colors" title="GitHub">
                  <GithubIcon className="w-5 h-5" />
                </a>
              )}
              {data.linkedin && (
                <a href={data.linkedin} target="_blank" rel="noreferrer" className="text-[#a4b5ad] hover:text-emerald-400 transition-colors" title="LinkedIn">
                  <LinkedinIcon className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </header>

        {/* Skills Section */}
        {data.skills && data.skills.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-serif italic text-[#e6ede9] border-l-2 border-emerald-500 pl-3">
              Core Skills
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {data.skills.map((skill, idx) => skill.trim() && (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 bg-[#0f221e]/80 border border-[#1b302a] text-xs font-mono rounded-md text-[#a4b5ad] hover:text-emerald-300 hover:border-emerald-800 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {data.projects && data.projects.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-xl font-serif italic text-[#e6ede9] border-l-2 border-emerald-500 pl-3">
              Selected Work
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.projects.map((project, idx) => (
                (project.title || project.description) && (
                  <div
                    key={idx}
                    className="p-6 bg-[#0c1c18]/60 border border-[#142923] rounded-lg flex flex-col justify-between gap-6 hover:border-emerald-900/60 hover:bg-[#0c1c18]/80 transition-all duration-300 group"
                  >
                    <div className="space-y-3">
                      <h3 className="text-lg font-serif text-[#e6ede9] group-hover:text-emerald-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-[#889d93] text-sm leading-relaxed font-light">
                        {project.description}
                      </p>
                    </div>
                    {project.link && (
                      <a
                        href={project.link.startsWith('http') ? project.link : `https://${project.link}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 hover:text-emerald-300 hover:underline transition-colors mt-auto w-fit"
                      >
                        view source &rarr;
                      </a>
                    )}
                  </div>
                )
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="pt-12 border-t border-[#1b302a]/40 text-center text-[#597066] text-xs font-mono">
          <p>nordic design / generated by portgen</p>
        </footer>
      </div>
    </div>
  );
}

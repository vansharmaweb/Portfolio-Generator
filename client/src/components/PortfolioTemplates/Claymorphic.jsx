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

export default function Claymorphic({ data }) {
  if (!data) return null;

  const clayCardStyle = {
    background: 'rgba(255, 255, 255, 0.65)',
    backdropFilter: 'blur(20px)',
    border: '2px solid rgba(255, 255, 255, 0.7)',
    borderRadius: '2rem',
    boxShadow: '0 20px 40px -15px rgba(109, 40, 217, 0.12), inset 2px 2px 6px 0 rgba(255, 255, 255, 0.9), inset -4px -4px 14px 0 rgba(109, 40, 217, 0.08), inset 0 16px 28px 0 rgba(255, 255, 255, 0.6)',
  };

  const clayButtonStyle = {
    background: 'rgba(139, 92, 246, 0.85)',
    border: '2px solid rgba(255, 255, 255, 0.4)',
    borderRadius: '1.25rem',
    boxShadow: '0 10px 20px -8px rgba(139, 92, 246, 0.4), inset 1px 1px 3px 0 rgba(255, 255, 255, 0.8), inset -2px -2px 8px 0 rgba(0, 0, 0, 0.15)',
  };

  const bubbleStyle1 = {
    background: 'radial-gradient(circle at 30% 30%, #ec4899, #db2777)',
    boxShadow: 'inset 4px 4px 12px rgba(255,255,255,0.4), 0 15px 30px rgba(219,39,119,0.25)',
  };

  const bubbleStyle2 = {
    background: 'radial-gradient(circle at 30% 30%, #a855f7, #7c3aed)',
    boxShadow: 'inset 4px 4px 12px rgba(255,255,255,0.4), 0 15px 30px rgba(124,58,237,0.25)',
  };

  const bubbleStyle3 = {
    background: 'radial-gradient(circle at 30% 30%, #06b6d4, #0891b2)',
    boxShadow: 'inset 4px 4px 12px rgba(255,255,255,0.4), 0 15px 30px rgba(8,145,178,0.25)',
  };

  return (
    <div className="min-h-full w-full bg-gradient-to-tr from-indigo-100 via-purple-50 to-pink-100 text-slate-800 font-sans p-6 md:p-12 lg:p-16 relative overflow-hidden flex justify-center selection:bg-purple-200">
      {/* Background 3D Bubble accents */}
      <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full opacity-60 animate-pulse duration-10000" style={bubbleStyle2} />
      <div className="absolute top-1/2 -right-24 w-80 h-80 rounded-full opacity-50 animate-bounce duration-8000" style={bubbleStyle3} />
      <div className="absolute -bottom-20 left-1/4 w-72 h-72 rounded-full opacity-55 animate-pulse duration-7000" style={bubbleStyle1} />

      <div className="max-w-4xl w-full space-y-10 relative z-10">
        
        {/* Header Section */}
        <header className="p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 transition-transform duration-500 hover:scale-[1.01]" style={clayCardStyle}>
          <div className="space-y-4 flex-1">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600">
              {data.name || 'Your Name'}
            </h1>
            <div className="inline-block bg-white/90 border border-purple-100 px-4 py-1.5 rounded-full font-bold text-sm md:text-base text-purple-600 shadow-sm">
              ✨ {data.role || 'Your Role'}
            </div>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-lg">
              {data.about || 'Write a brief about yourself here.'}
            </p>
          </div>

          {/* Socials & Contacts */}
          <div className="flex flex-col gap-3 min-w-[200px] w-full md:w-auto">
            {data.email && (
              <a href={`mailto:${data.email}`} className="flex items-center justify-center md:justify-start gap-2.5 px-4 py-2.5 rounded-2xl bg-white/80 hover:bg-white border border-white hover:border-purple-200 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:scale-[1.03]">
                <Mail className="w-4 h-4 text-purple-500" /> Email Me
              </a>
            )}
            {data.phone && (
              <a href={`tel:${data.phone}`} className="flex items-center justify-center md:justify-start gap-2.5 px-4 py-2.5 rounded-2xl bg-white/80 hover:bg-white border border-white hover:border-purple-200 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:scale-[1.03]">
                <Phone className="w-4 h-4 text-pink-500" /> {data.phone}
              </a>
            )}
            {data.resume && (
              <a href={data.resume} target="_blank" rel="noreferrer" className="flex items-center justify-center md:justify-start gap-2.5 px-4 py-2.5 rounded-2xl bg-white/80 hover:bg-white border border-white hover:border-purple-200 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:scale-[1.03]">
                <FileText className="w-4 h-4 text-cyan-500" /> View Resume
              </a>
            )}
            <div className="flex items-center justify-center md:justify-start gap-3 mt-1.5">
              {data.github && (
                <a href={data.github} target="_blank" rel="noreferrer" className="p-2.5 rounded-full bg-white hover:bg-purple-50 text-slate-700 border border-white hover:border-purple-200 shadow-sm transition-all duration-300 hover:scale-110">
                  <GithubIcon className="w-5 h-5" />
                </a>
              )}
              {data.linkedin && (
                <a href={data.linkedin} target="_blank" rel="noreferrer" className="p-2.5 rounded-full bg-white hover:bg-purple-50 text-slate-700 border border-white hover:border-purple-200 shadow-sm transition-all duration-300 hover:scale-110">
                  <LinkedinIcon className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </header>

        {/* Skills Section */}
        {data.skills && data.skills.length > 0 && (
          <section className="p-8 md:p-10 space-y-6" style={clayCardStyle}>
            <h2 className="text-2xl font-black tracking-tight text-slate-800">
              🛠️ My Superpowers
            </h2>
            <div className="flex flex-wrap gap-3">
              {data.skills.map((skill, idx) => skill.trim() && (
                <span
                  key={idx}
                  className="px-4 py-2 bg-white/90 border border-white text-sm font-bold rounded-2xl text-slate-700 shadow-sm hover:bg-white hover:scale-105 hover:rotate-1 transition-all duration-200"
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
            <h2 className="text-2xl font-black tracking-tight text-slate-800 px-4">
              🚀 Featured Creations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.projects.map((project, idx) => (
                (project.title || project.description) && (
                  <div
                    key={idx}
                    className="p-6 flex flex-col justify-between gap-6 group hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 ease-out cursor-pointer"
                    style={clayCardStyle}
                  >
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold tracking-tight text-slate-800 group-hover:text-purple-600 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                    {project.link && (
                      <a
                        href={project.link.startsWith('http') ? project.link : `https://${project.link}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 px-4 py-2 text-white text-xs font-bold w-fit shadow-md transition-all hover:scale-105 hover:shadow-lg"
                        style={clayButtonStyle}
                      >
                        Launch Project <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                )
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="pt-8 text-center text-slate-400 text-xs font-bold tracking-wider">
          <p>BUBBLE GENERATED WITH <span className="text-purple-500">PORTGEN</span></p>
        </footer>
      </div>
    </div>
  );
}

import { Mail, ExternalLink, Phone } from 'lucide-react';

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

export default function Minimal({ data }) {
  const { name, role, email, phone, about, skills, projects, github, linkedin } = data;

  return (
    <div className="min-h-full w-full bg-white text-gray-900 font-sans selection:bg-gray-200">
      {/* Top accent bar */}
      <div className="h-1 w-full bg-black" />

      <div className="max-w-3xl mx-auto px-8 py-16 space-y-20">

        {/* Header */}
        <header className="space-y-6">
          <div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900 leading-none">
              {name || 'Your Name'}
            </h1>
            <p className="mt-3 text-lg font-medium text-gray-500 uppercase tracking-widest">
              {role || 'Your Role'}
            </p>
          </div>
          <p className="text-base text-gray-600 leading-relaxed max-w-xl border-l-2 border-gray-200 pl-4">
            {about || 'Write a short bio about yourself here.'}
          </p>
          <div className="flex flex-wrap gap-3">
            {email && (
              <a href={`mailto:${email}`} className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors border border-gray-200 hover:border-gray-400 px-4 py-2 rounded-lg">
                <Mail className="w-4 h-4" /> {email}
              </a>
            )}
            {phone && (
              <a href={`tel:${phone}`} className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors border border-gray-200 hover:border-gray-400 px-4 py-2 rounded-lg">
                <Phone className="w-4 h-4" /> {phone}
              </a>
            )}
            {github && (
              <a href={github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors border border-gray-200 hover:border-gray-400 px-4 py-2 rounded-lg">
                <GithubIcon className="w-4 h-4" /> GitHub
              </a>
            )}
            {linkedin && (
              <a href={linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors border border-gray-200 hover:border-gray-400 px-4 py-2 rounded-lg">
                <LinkedinIcon className="w-4 h-4" /> LinkedIn
              </a>
            )}
          </div>
        </header>

        {/* Skills */}
        {skills && skills.length > 0 && skills.some(s => s.trim() !== '') && (
          <section className="space-y-5">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Skills</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => skill.trim() && (
                <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-md">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && projects.some(p => p.title || p.description) && (
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Projects</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            {projects.map((project) => (
              (project.title || project.description) && (
                <div key={project.id} className="group py-6 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-gray-600 transition-colors">
                        {project.title || 'Untitled Project'}
                      </h3>
                      <p className="mt-2 text-base text-gray-500 leading-relaxed">
                        {project.description || 'No description provided.'}
                      </p>
                    </div>
                    {project.link && (
                      <a
                        href={project.link.startsWith('http') ? project.link : `https://${project.link}`}
                        target="_blank" rel="noreferrer"
                        className="shrink-0 p-2 border border-gray-200 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all"
                      >
                        <ExternalLink className="w-4 h-4 text-gray-500" />
                      </a>
                    )}
                  </div>
                </div>
              )
            ))}
          </section>
        )}

        {/* Footer */}
        <footer className="pt-4 text-xs text-gray-300 tracking-widest uppercase text-center">
          Built with PortGen
        </footer>
      </div>
    </div>
  );
}

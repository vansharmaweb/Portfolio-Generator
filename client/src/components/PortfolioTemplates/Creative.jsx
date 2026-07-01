import { Mail, ExternalLink, Phone, Sparkles } from 'lucide-react';

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

export default function Creative({ data }) {
  const { name, role, email, phone, about, skills, projects, github, linkedin } = data;

  const colors = [
    'from-pink-500 to-rose-500',
    'from-violet-500 to-purple-600',
    'from-blue-500 to-cyan-500',
    'from-emerald-500 to-teal-500',
    'from-amber-500 to-orange-500',
  ];

  return (
    <div className="min-h-full w-full bg-[#fafafa] text-gray-900 font-sans selection:bg-rose-200 overflow-x-hidden">

      {/* Hero section with bold diagonal design */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600 -z-0" />
        {/* Decorative shapes */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-pink-400/30 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-violet-400/30 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/5 border border-white/10" />

        <div className="relative z-10 px-8 md:px-16 py-16 md:py-24">
          <div className="max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/80 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              Portfolio
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white leading-none tracking-tighter mb-4">
              {name || 'Your Name'}
            </h1>
            <p className="text-xl md:text-3xl font-light text-white/70 mb-8 tracking-wide">
              {role || 'Your Role'}
            </p>
            <p className="text-base md:text-lg text-white/60 max-w-2xl leading-relaxed mb-10">
              {about || 'Write a short bio about yourself'}
            </p>

            {/* Contact pills */}
            <div className="flex flex-wrap gap-3">
              {email && (
                <a href={`mailto:${email}`} className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-purple-700 rounded-full text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all">
                  <Mail className="w-4 h-4" /> {email}
                </a>
              )}
              {phone && (
                <a href={`tel:${phone}`} className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white border border-white/20 rounded-full text-sm font-semibold hover:bg-white/20 transition-all">
                  <Phone className="w-4 h-4" /> {phone}
                </a>
              )}
              {github && (
                <a href={github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white border border-white/20 rounded-full text-sm font-semibold hover:bg-white/20 transition-all">
                  <GithubIcon className="w-4 h-4" /> GitHub
                </a>
              )}
              {linkedin && (
                <a href={linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white border border-white/20 rounded-full text-sm font-semibold hover:bg-white/20 transition-all">
                  <LinkedinIcon className="w-4 h-4" /> LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="relative z-10">
          <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" className="w-full -mb-1">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#fafafa"/>
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-8 md:px-16 py-16 space-y-20">

        {/* Skills as colorful pills grid */}
        {skills && skills.length > 0 && skills.some(s => s.trim() !== '') && (
          <section className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">My Skills</h2>
              <p className="text-gray-500">Technologies I love working with</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {skills.map((skill, i) => skill.trim() && (
                <span key={i} className={`px-5 py-2.5 bg-gradient-to-r ${colors[i % colors.length]} text-white rounded-full text-sm font-bold shadow-lg hover:scale-110 transition-transform cursor-default`}>
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects as large cards */}
        {projects && projects.length > 0 && projects.some(p => p.title || p.description) && (
          <section className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">Featured Work</h2>
              <p className="text-gray-500">Projects I'm proud of</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project, i) => (
                (project.title || project.description) && (
                  <div key={project.id} className="group relative overflow-hidden rounded-3xl border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 bg-white">
                    <div className={`h-2 w-full bg-gradient-to-r ${colors[i % colors.length]}`} />
                    <div className="p-8">
                      <h3 className="text-2xl font-black text-gray-900 mb-3">
                        {project.title || 'Untitled Project'}
                      </h3>
                      <p className="text-gray-500 leading-relaxed mb-6">
                        {project.description || 'No description provided.'}
                      </p>
                      {project.link && (
                        <a
                          href={project.link.startsWith('http') ? project.link : `https://${project.link}`}
                          target="_blank" rel="noreferrer"
                          className={`inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r ${colors[i % colors.length]} text-white rounded-full text-sm font-bold hover:opacity-90 transition-opacity`}
                        >
                          View Project <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                )
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="pt-8 border-t border-gray-100 text-center">
          <p className="text-gray-400 text-sm">Built with <span className="font-semibold text-purple-500">PortGen</span></p>
        </footer>
      </div>
    </div>
  );
}

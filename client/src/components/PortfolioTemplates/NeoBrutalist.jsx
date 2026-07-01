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

export default function NeoBrutalist({ data }) {
  if (!data) return null;

  return (
    <div className="min-h-full w-full bg-[#f4f4f0] text-black font-sans p-6 md:p-12 lg:p-16 flex justify-center selection:bg-black selection:text-white">
      <div className="max-w-5xl w-full space-y-16">
        
        {/* Header Section */}
        <header className="space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b-4 border-black pb-8">
            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tight text-black drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">
                {data.name || 'Your Name'}
              </h1>
              <div className="inline-block bg-yellow-400 border-4 border-black px-4 py-2 font-bold text-xl uppercase shadow-[4px_4px_0_rgba(0,0,0,1)]">
                {data.role || 'Your Role'}
              </div>
            </div>
            
            <div className="flex flex-col gap-3 font-bold uppercase text-sm">
              {data.email && (
                <a href={`mailto:${data.email}`} className="flex items-center gap-2 hover:underline decoration-4 underline-offset-4">
                  <Mail className="w-5 h-5" /> {data.email}
                </a>
              )}
              {data.phone && (
                <a href={`tel:${data.phone}`} className="flex items-center gap-2 hover:underline decoration-4 underline-offset-4">
                  <Phone className="w-5 h-5" /> {data.phone}
                </a>
              )}
              {data.resume && (
                <a href={data.resume} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:underline decoration-4 underline-offset-4">
                  <FileText className="w-5 h-5" /> Resume
                </a>
              )}
            </div>
          </div>

          <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0_rgba(0,0,0,1)] text-lg md:text-xl font-medium leading-relaxed">
            {data.about || 'Write a brief about yourself here.'}
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            {data.github && (
              <a
                href={data.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-[#ff90e8] border-4 border-black px-6 py-3 font-bold text-lg uppercase shadow-[4px_4px_0_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all"
              >
                <GithubIcon className="w-6 h-6" /> GitHub
              </a>
            )}
            {data.linkedin && (
              <a
                href={data.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-[#90f2ff] border-4 border-black px-6 py-3 font-bold text-lg uppercase shadow-[4px_4px_0_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all"
              >
                <LinkedinIcon className="w-6 h-6" /> LinkedIn
              </a>
            )}
            {(data.customContacts || []).map((contact, idx) => contact.name && contact.link && (
              <a
                key={idx}
                href={contact.link}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-[#ff90e8] border-4 border-black px-6 py-3 font-bold text-lg uppercase shadow-[4px_4px_0_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all"
              >
                {contact.name}
              </a>
            ))}
          </div>
        </header>

        {/* Skills Section */}
        {data.skills && data.skills.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-4xl font-black uppercase tracking-tight border-b-4 border-black pb-2 inline-block">
              Skills
            </h2>
            <div className="flex flex-wrap gap-4">
              {data.skills.map((skill, index) => skill.trim() && (
                <span
                  key={index}
                  className="bg-[#ffe500] border-4 border-black px-5 py-2.5 font-bold text-lg shadow-[4px_4px_0_rgba(0,0,0,1)]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {data.projects && data.projects.length > 0 && (
          <section className="space-y-8 pt-8">
            <h2 className="text-4xl font-black uppercase tracking-tight border-b-4 border-black pb-2 inline-block">
              Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.projects.map((project, index) => (project.title || project.description) && (
                <div
                  key={index}
                  className="bg-white border-4 border-black p-8 shadow-[8px_8px_0_rgba(0,0,0,1)] flex flex-col justify-between group hover:-translate-y-2 transition-transform duration-200"
                >
                  <div>
                    <h3 className="text-2xl font-black uppercase mb-4 group-hover:text-red-500 transition-colors">
                      {project.title}
                    </h3>
                    <p className="font-medium text-lg mb-8 leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                  {project.link && (
                    <a
                      href={project.link.startsWith('http') ? project.link : `https://${project.link}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 bg-[#c4ff4d] border-4 border-black px-6 py-3 font-bold uppercase shadow-[4px_4px_0_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all w-fit"
                    >
                      View <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="pt-16 pb-8 text-center font-bold uppercase tracking-widest border-t-4 border-black">
          <p>Generated with PortGen</p>
        </footer>
      </div>
    </div>
  );
}

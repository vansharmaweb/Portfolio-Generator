import { useEffect, useRef } from 'react';
import { Mail, ExternalLink, ScrollText } from 'lucide-react';

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

const Fireflies = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    
    const particles = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2 + 0.5,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
        opacity: Math.random()
      });
    }
    
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;
        
        if (p.x < 0 || p.x > width) p.dx *= -1;
        if (p.y < 0 || p.y > height) p.dy *= -1;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 184, 0, ${p.opacity})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#FFB800';
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(draw);
    };
    
    draw();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

export default function Modern({ data }) {
  const { name, role, email, phone, about, skills, projects, github, linkedin, resume, customContacts } = data;

  useEffect(() => {
    // Inject fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;700&family=Outfit:wght@500;700;900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  return (
    <div className="relative min-h-full w-full bg-[#050A15] text-slate-200 p-6 md:p-12 lg:p-16 flex justify-center selection:bg-[#FFB800]/30 overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Fireflies />
      
      {/* Background Radial Glows */}
      <div className="fixed top-0 left-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-screen"></div>
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none z-0 mix-blend-screen"></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#FF8236]/5 rounded-full blur-[150px] pointer-events-none z-0 mix-blend-screen"></div>

      <div className="max-w-4xl w-full space-y-24 z-10 relative">
        
        {/* Character Sheet (Header) */}
        <header className="space-y-8 pt-10">
          <div className="inline-block px-3 py-1 bg-[#FFB800]/10 border border-[#FFB800]/30 rounded-full mb-4">
            <span className="text-[#FFB800] text-xs font-bold uppercase tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Lv. 99 Player</span>
          </div>
          <div className="space-y-4 border-l-4 border-[#FFB800] pl-6">
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight drop-shadow-2xl" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {name || 'Unknown Hero'}
            </h1>
            <p className="text-xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-[#FFB800] to-[#FF8236] font-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {role || 'Class: Adventurer'}
            </p>
          </div>
          
          <div className="p-6 bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <p className="text-lg text-slate-300 leading-relaxed">
              {about || 'A traveler of the digital realms, ready for the next quest.'}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 pt-2">
            {[ 
              { cond: github, icon: <GithubIcon className="w-5 h-5" />, label: 'GitHub', href: github },
              { cond: linkedin, icon: <LinkedinIcon className="w-5 h-5" />, label: 'LinkedIn', href: linkedin },
              { cond: email, icon: <Mail className="w-5 h-5" />, label: email, href: `mailto:${email}` },
              { cond: phone, icon: <span className="font-bold">#</span>, label: phone, href: `tel:${phone}` },
              { cond: resume, icon: <ScrollText className="w-5 h-5" />, label: 'View Resume', href: resume }
            ].map((item, i) => item.cond && (
              <a key={i} href={item.href} target="_blank" rel="noreferrer" 
                 className="flex items-center gap-2 px-5 py-3 bg-white/[0.03] hover:bg-[#FFB800]/10 border border-white/10 hover:border-[#FFB800]/50 rounded-xl text-slate-300 hover:text-[#FFB800] transition-all hover:-translate-y-1 shadow-lg hover:shadow-[0_10px_20px_rgba(255,184,0,0.2)]">
                {item.icon} <span className="text-sm font-semibold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{item.label}</span>
              </a>
            ))}
            {customContacts && customContacts.map((contact, i) => contact.name && contact.link && (
              <a key={'custom'+i} href={contact.link.startsWith('http') ? contact.link : `https://${contact.link}`} target="_blank" rel="noreferrer" 
                 className="flex items-center gap-2 px-5 py-3 bg-white/[0.03] hover:bg-[#FFB800]/10 border border-white/10 hover:border-[#FFB800]/50 rounded-xl text-slate-300 hover:text-[#FFB800] transition-all hover:-translate-y-1 shadow-lg hover:shadow-[0_10px_20px_rgba(255,184,0,0.2)]">
                <ExternalLink className="w-4 h-4" /> <span className="text-sm font-semibold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{contact.name}</span>
              </a>
            ))}
          </div>
        </header>

        {/* Arsenal (Skills) */}
        {skills && skills.length > 0 && skills.some(s => s.trim() !== '') && (
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-bold text-white drop-shadow-md" style={{ fontFamily: "'Outfit', sans-serif" }}>Arsenal</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-[#FFB800]/50 to-transparent"></div>
            </div>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, i) => skill.trim() && (
                <span key={i} className="px-4 py-2 bg-[#050A15]/80 backdrop-blur-md border border-white/10 hover:border-[#FFB800]/40 rounded-lg text-sm font-bold text-[#FFB800] shadow-[0_4px_12px_rgba(0,0,0,0.5)] hover:shadow-[0_0_15px_rgba(255,184,0,0.3)] transition-all cursor-default" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Quest Log (Projects) */}
        {projects && projects.length > 0 && projects.some(p => p.title || p.description) && (
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-bold text-white drop-shadow-md" style={{ fontFamily: "'Outfit', sans-serif" }}>Quest Log</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-[#FFB800]/50 to-transparent"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project) => (
                (project.title || project.description) && (
                  <div key={project.id} className="group flex flex-col justify-between p-8 bg-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-[#FFB800]/50 rounded-2xl transition-all duration-300 hover:-translate-y-2 shadow-xl hover:shadow-[0_15px_30px_rgba(255,184,0,0.15)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFB800]/5 rounded-bl-full -z-10 group-hover:bg-[#FFB800]/20 transition-colors"></div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#FFB800] transition-colors" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        {project.title || 'Unknown Encounter'}
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed mb-6">
                        {project.description || 'Details obscured by fog of war.'}
                      </p>
                    </div>
                    {project.link && (
                      <a href={project.link.startsWith('http') ? project.link : `https://${project.link}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[#FFB800] text-sm font-bold group-hover:translate-x-2 transition-transform w-fit mt-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        Explore <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                )
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="pt-12 pb-8 border-t border-white/10 text-center text-slate-500 text-xs font-semibold uppercase tracking-widest flex flex-col items-center gap-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          <p>Epic Generated by PortGen.</p>
        </footer>
        
      </div>
    </div>
  );
}

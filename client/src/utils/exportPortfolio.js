import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// Helper to escape HTML to prevent basic issues
const escapeHTML = (str) => {
  if (!str) return '';
  return str.toString().replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
};

export function getHtmlString(data, theme) {
  if (theme === 'modern') return generateModernHtml(data);
  if (theme === 'neobrutalist') return generateNeoBrutalistHtml(data);
  return generateGlassHtml(data);
}

export async function exportPortfolio(data, theme) {
  const htmlString = getHtmlString(data, theme);
  const zip = new JSZip();
  zip.file('index.html', htmlString);
  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, `portfolio_${data.name.replace(/\s+/g, '_')}.zip`);
}

export function exportStandaloneHtml(data, theme) {
  const htmlString = getHtmlString(data, theme);
  const blob = new Blob([htmlString], { type: 'text/html;charset=utf-8' });
  saveAs(blob, `portfolio_${data.name.replace(/\s+/g, '_')}.html`);
}

export function exportAsPdf(data) {
  const e = (str) => {
    if (!str) return '';
    return str.toString().replace(/[&<>'"]/g,
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  };

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${e(data.name)} — Resume</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', system-ui, sans-serif; color: #1a202c; background: #fff; padding: 48px; max-width: 800px; margin: 0 auto; font-size: 14px; line-height: 1.6; }
    h1 { font-size: 2rem; font-weight: 800; color: #111; margin-bottom: 4px; }
    .role { font-size: 1rem; color: #7c3aed; font-weight: 600; margin-bottom: 12px; }
    .contact { display: flex; flex-wrap: wrap; gap: 16px; font-size: 0.8rem; color: #555; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid #e2e8f0; }
    .contact a { color: #7c3aed; text-decoration: none; }
    section { margin-top: 24px; }
    h2 { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #7c3aed; margin-bottom: 10px; padding-bottom: 4px; border-bottom: 1px solid #e2e8f0; }
    .about { color: #374151; line-height: 1.8; }
    .skills { display: flex; flex-wrap: wrap; gap: 8px; }
    .skill { padding: 3px 10px; background: #f3f0ff; border: 1px solid #ddd6fe; border-radius: 4px; font-size: 0.78rem; color: #5b21b6; font-weight: 500; }
    .project { margin-top: 14px; padding: 12px 14px; border-left: 3px solid #7c3aed; background: #faf9ff; border-radius: 0 6px 6px 0; }
    .project h3 { font-size: 0.95rem; font-weight: 700; color: #111; margin-bottom: 4px; }
    .project p { font-size: 0.82rem; color: #555; }
    .project a { font-size: 0.78rem; color: #7c3aed; }
    .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 0.7rem; color: #aaa; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <h1>${e(data.name)}</h1>
  <p class="role">${e(data.role)}</p>
  <div class="contact">
    ${data.email ? `<a href="mailto:${e(data.email)}">${e(data.email)}</a>` : ''}
    ${data.phone ? `<span>${e(data.phone)}</span>` : ''}
    ${data.github ? `<a href="${e(data.github)}" target="_blank">GitHub</a>` : ''}
    ${data.linkedin ? `<a href="${e(data.linkedin)}" target="_blank">LinkedIn</a>` : ''}
  </div>

  ${data.about ? `
  <section>
    <h2>About</h2>
    <p class="about">${e(data.about)}</p>
  </section>` : ''}

  ${data.skills?.filter(Boolean).length ? `
  <section>
    <h2>Skills</h2>
    <div class="skills">
      ${data.skills.filter(Boolean).map(s => `<span class="skill">${e(s)}</span>`).join('')}
    </div>
  </section>` : ''}

  ${data.projects?.filter(p => p.title || p.description).length ? `
  <section>
    <h2>Projects</h2>
    ${data.projects.filter(p => p.title || p.description).map(p => `
      <div class="project">
        <h3>${e(p.title)}</h3>
        <p>${e(p.description)}</p>
        ${p.link ? `<a href="${e(p.link)}" target="_blank">${e(p.link)}</a>` : ''}
      </div>
    `).join('')}
  </section>` : ''}

  <p class="footer">Generated with PortGen</p>
  <script>window.onload = () => window.print();<\/script>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
}

function getOGTags(data) {
  const siteUrl = data.github || 'https://portgen.example.com';
  return `
    <meta property="og:title" content="${escapeHTML(data.name)} - ${escapeHTML(data.role)}">
    <meta property="og:description" content="${escapeHTML(data.about).substring(0, 150)}...">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${escapeHTML(siteUrl)}">
    <meta property="og:image" content="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200&h=630">
    <meta name="twitter:card" content="summary_large_image">
  `;
}

function generateModernHtml(data) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHTML(data.name)} - ${escapeHTML(data.role)}</title>
    <meta name="description" content="${escapeHTML(data.about)}">
    ${getOGTags(data)}
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;700&family=Outfit:wght@500;700;900&display=swap" rel="stylesheet">
    <style>
      body { background-color: #050A15; color: #e2e8f0; font-family: 'Inter', sans-serif; }
      h1, h2, h3, .font-outfit { font-family: 'Outfit', sans-serif; }
      .font-mono { font-family: 'JetBrains Mono', monospace; }
    </style>
</head>
<body class="selection:bg-[#FFB800]/30 overflow-x-hidden">
    <canvas id="fireflies" class="fixed inset-0 pointer-events-none z-0"></canvas>
    
    <div class="fixed top-0 left-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-screen"></div>
    <div class="fixed bottom-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none z-0 mix-blend-screen"></div>
    <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#FF8236]/5 rounded-full blur-[150px] pointer-events-none z-0 mix-blend-screen"></div>

    <div class="min-h-full w-full p-6 md:p-12 lg:p-16 flex justify-center relative z-10">
      <div class="max-w-4xl w-full space-y-24">
        
        <header class="space-y-8 pt-10">
          <div class="inline-block px-3 py-1 bg-[#FFB800]/10 border border-[#FFB800]/30 rounded-full mb-4">
            <span class="text-[#FFB800] text-xs font-bold uppercase tracking-widest font-mono">Lv. 99 Player</span>
          </div>
          <div class="space-y-4 border-l-4 border-[#FFB800] pl-6">
            <h1 class="text-5xl md:text-7xl font-black text-white tracking-tight drop-shadow-2xl font-outfit">${escapeHTML(data.name || 'Unknown Hero')}</h1>
            <p class="text-xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FFB800] to-[#FF8236] w-max font-outfit">${escapeHTML(data.role || 'Class: Adventurer')}</p>
          </div>
          
          <div class="p-6 bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <p class="text-lg text-slate-300 leading-relaxed">${escapeHTML(data.about || '')}</p>
          </div>
          
          <div class="flex flex-wrap gap-4 pt-2">
            ${data.github ? `<a href="${data.github}" target="_blank" class="flex items-center gap-2 px-5 py-3 bg-white/[0.03] hover:bg-[#FFB800]/10 border border-white/10 hover:border-[#FFB800]/50 rounded-xl text-slate-300 hover:text-[#FFB800] transition-all hover:-translate-y-1 shadow-lg hover:shadow-[0_10px_20px_rgba(255,184,0,0.2)]">
              <span class="text-sm font-semibold font-mono">GitHub</span>
            </a>` : ''}
            ${data.linkedin ? `<a href="${data.linkedin}" target="_blank" class="flex items-center gap-2 px-5 py-3 bg-white/[0.03] hover:bg-[#FFB800]/10 border border-white/10 hover:border-[#FFB800]/50 rounded-xl text-slate-300 hover:text-[#FFB800] transition-all hover:-translate-y-1 shadow-lg hover:shadow-[0_10px_20px_rgba(255,184,0,0.2)]">
              <span class="text-sm font-semibold font-mono">LinkedIn</span>
            </a>` : ''}
            ${data.email ? `<a href="mailto:${data.email}" class="flex items-center gap-2 px-5 py-3 bg-white/[0.03] hover:bg-[#FFB800]/10 border border-white/10 hover:border-[#FFB800]/50 rounded-xl text-slate-300 hover:text-[#FFB800] transition-all hover:-translate-y-1 shadow-lg hover:shadow-[0_10px_20px_rgba(255,184,0,0.2)]">
              <span class="text-sm font-semibold font-mono">${escapeHTML(data.email)}</span>
            </a>` : ''}
            ${data.phone ? `<a href="tel:${data.phone}" class="flex items-center gap-2 px-5 py-3 bg-white/[0.03] hover:bg-[#FFB800]/10 border border-white/10 hover:border-[#FFB800]/50 rounded-xl text-slate-300 hover:text-[#FFB800] transition-all hover:-translate-y-1 shadow-lg hover:shadow-[0_10px_20px_rgba(255,184,0,0.2)]">
              <span class="text-sm font-semibold font-mono">${escapeHTML(data.phone)}</span>
            </a>` : ''}
            ${data.resume ? `<a href="${data.resume}" target="_blank" class="flex items-center gap-2 px-5 py-3 bg-white/[0.03] hover:bg-[#FFB800]/10 border border-white/10 hover:border-[#FFB800]/50 rounded-xl text-slate-300 hover:text-[#FFB800] transition-all hover:-translate-y-1 shadow-lg hover:shadow-[0_10px_20px_rgba(255,184,0,0.2)]">
              <span class="text-sm font-semibold font-mono">Resume</span>
            </a>` : ''}
            ${(data.customContacts || []).map(contact => contact.name && contact.link ? `<a href="${contact.link}" target="_blank" class="flex items-center gap-2 px-5 py-3 bg-white/[0.03] hover:bg-[#FFB800]/10 border border-white/10 hover:border-[#FFB800]/50 rounded-xl text-slate-300 hover:text-[#FFB800] transition-all hover:-translate-y-1 shadow-lg hover:shadow-[0_10px_20px_rgba(255,184,0,0.2)]">
              <span class="text-sm font-semibold font-mono">${escapeHTML(contact.name)}</span>
            </a>` : '').join('')}
          </div>
        </header>

        ${data.skills && data.skills.length > 0 ? `
        <section class="space-y-8">
            <div class="flex items-center gap-4">
              <h2 class="text-3xl font-bold text-white drop-shadow-md font-outfit">Arsenal</h2>
              <div class="flex-1 h-px bg-gradient-to-r from-[#FFB800]/50 to-transparent"></div>
            </div>
            <div class="flex flex-wrap gap-3">
              ${data.skills.map(s => s.trim() ? `<span class="px-4 py-2 bg-[#050A15]/80 backdrop-blur-md border border-white/10 hover:border-[#FFB800]/40 rounded-lg text-sm font-bold text-[#FFB800] shadow-[0_4px_12px_rgba(0,0,0,0.5)] hover:shadow-[0_0_15px_rgba(255,184,0,0.3)] transition-all cursor-default font-mono">${escapeHTML(s)}</span>` : '').join('')}
            </div>
        </section>
        ` : ''}

        ${data.projects && data.projects.length > 0 ? `
        <section class="space-y-8">
            <div class="flex items-center gap-4">
              <h2 class="text-3xl font-bold text-white drop-shadow-md font-outfit">Quest Log</h2>
              <div class="flex-1 h-px bg-gradient-to-r from-[#FFB800]/50 to-transparent"></div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              ${data.projects.map(p => (p.title || p.description) ? `
                  <div class="group flex flex-col justify-between p-8 bg-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-[#FFB800]/50 rounded-2xl transition-all duration-300 hover:-translate-y-2 shadow-xl hover:shadow-[0_15px_30px_rgba(255,184,0,0.15)] relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-24 h-24 bg-[#FFB800]/5 rounded-bl-full -z-10 group-hover:bg-[#FFB800]/20 transition-colors"></div>
                    <div>
                      <h3 class="text-2xl font-bold text-white mb-3 group-hover:text-[#FFB800] transition-colors font-outfit">${escapeHTML(p.title)}</h3>
                      <p class="text-slate-400 text-sm leading-relaxed mb-6">${escapeHTML(p.description)}</p>
                    </div>
                    ${p.link ? `<a href="${p.link.startsWith('http') ? p.link : `https://${p.link}`}" target="_blank" class="flex items-center gap-2 text-[#FFB800] text-sm font-bold group-hover:translate-x-2 transition-transform w-fit mt-2 font-mono">Explore &rarr;</a>` : ''}
                  </div>
              ` : '').join('')}
            </div>
        </section>
        ` : ''}

        <footer class="pt-12 pb-8 border-t border-white/10 text-center text-slate-500 text-xs font-semibold uppercase tracking-widest flex flex-col items-center gap-2 font-mono">
          <p>Epic Generated by PortGen.</p>
        </footer>
      </div>
    </div>

    <script>
      const canvas = document.getElementById('fireflies');
      const ctx = canvas.getContext('2d');
      let width, height;
      const particles = [];
      
      function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }
      window.addEventListener('resize', resize);
      resize();
      
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
      
      function draw() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
          p.x += p.dx;
          p.y += p.dy;
          
          if (p.x < 0 || p.x > width) p.dx *= -1;
          if (p.y < 0 || p.y > height) p.dy *= -1;
          
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = \`rgba(255, 184, 0, \${p.opacity})\`;
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#FFB800';
          ctx.fill();
        });
        requestAnimationFrame(draw);
      }
      draw();
    </script>
</body>
</html>`;
}

function generateGlassHtml(data) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHTML(data.name)} - ${escapeHTML(data.role)}</title>
    <meta name="description" content="${escapeHTML(data.about)}">
    ${getOGTags(data)}
    <script src="https://cdn.tailwindcss.com"></script>
    <style>body { background-color: #0f172a; }</style>
</head>
<body class="selection:bg-pink-500/30">
    <div class="min-h-full w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white font-sans p-6 md:p-12 lg:p-16 flex justify-center relative overflow-hidden z-0">
      
      <div class="absolute top-0 left-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply blur-[128px] opacity-40 -z-10"></div>
      <div class="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply blur-[128px] opacity-40 -z-10"></div>
      <div class="absolute -bottom-32 left-32 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply blur-[128px] opacity-40 -z-10"></div>

      <div class="max-w-5xl w-full space-y-12">
        <header class="bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-2xl flex flex-col items-center text-center space-y-6">
          <h1 class="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">${escapeHTML(data.name || 'Your Name')}</h1>
          <p class="text-xl md:text-2xl text-pink-300 font-medium tracking-wide uppercase">${escapeHTML(data.role || 'Your Role')}</p>
          <p class="text-lg text-white/80 max-w-3xl leading-relaxed">${escapeHTML(data.about || '')}</p>
          
          <div class="flex flex-wrap items-center justify-center gap-4 pt-4">
            ${data.email ? `<a href="mailto:${data.email}" class="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors backdrop-blur-sm">${escapeHTML(data.email)}</a>` : ''}
            ${data.phone ? `<a href="tel:${data.phone}" class="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors backdrop-blur-sm">${escapeHTML(data.phone)}</a>` : ''}
            ${data.github ? `<a href="${data.github}" target="_blank" class="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors backdrop-blur-sm">GitHub</a>` : ''}
            ${data.linkedin ? `<a href="${data.linkedin}" target="_blank" class="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors backdrop-blur-sm">LinkedIn</a>` : ''}
          </div>
        </header>

        ${data.skills && data.skills.length > 0 ? `
        <section class="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-xl space-y-6">
            <h2 class="text-2xl font-bold text-white/90 uppercase tracking-widest text-center">Expertise</h2>
            <div class="flex flex-wrap justify-center gap-3">
              ${data.skills.map(s => s.trim() ? `<span class="px-5 py-2.5 bg-black/20 border border-white/5 rounded-2xl text-sm font-semibold tracking-wide text-white/90">${escapeHTML(s)}</span>` : '').join('')}
            </div>
        </section>
        ` : ''}

        ${data.projects && data.projects.length > 0 ? `
        <section class="space-y-6">
            <h2 class="text-2xl font-bold text-white/90 uppercase tracking-widest text-center mb-8">Selected Works</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              ${data.projects.map(p => (p.title || p.description) ? `
                  <div class="flex flex-col justify-between p-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-xl">
                    <div>
                      <h3 class="text-2xl font-bold text-white mb-4 transition-colors">${escapeHTML(p.title)}</h3>
                      <p class="text-white/70 text-base leading-relaxed mb-6">${escapeHTML(p.description)}</p>
                    </div>
                    ${p.link ? `<a href="${p.link.startsWith('http') ? p.link : `https://${p.link}`}" target="_blank" class="inline-flex items-center gap-2 text-cyan-300 hover:underline font-semibold mt-2">View Project &rarr;</a>` : ''}
                  </div>
              ` : '').join('')}
            </div>
        </section>
        ` : ''}
        
        <footer class="pt-12 pb-8 border-t border-white/10 text-center text-white/40 text-sm">
          <p>Designed with PortGen.</p>
        </footer>
      </div>
    </div>
</body>
</html>`;
}

function generateNeoBrutalistHtml(data) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHTML(data.name)} - ${escapeHTML(data.role)}</title>
    <meta name="description" content="${escapeHTML(data.about)}">
    ${getOGTags(data)}
    <script src="https://cdn.tailwindcss.com"></script>
    <style>body { background-color: #f4f4f0; }</style>
</head>
<body class="selection:bg-black selection:text-white">
    <div class="min-h-full w-full bg-[#f4f4f0] text-black font-sans p-6 md:p-12 lg:p-16 flex justify-center">
      <div class="max-w-5xl w-full space-y-16">
        
        <header class="space-y-8">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b-4 border-black pb-8">
            <div class="space-y-4">
              <h1 class="text-6xl md:text-8xl font-black uppercase tracking-tight text-black drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">${escapeHTML(data.name || 'Your Name')}</h1>
              <div class="inline-block bg-yellow-400 border-4 border-black px-4 py-2 font-bold text-xl uppercase shadow-[4px_4px_0_rgba(0,0,0,1)]">${escapeHTML(data.role || 'Your Role')}</div>
            </div>
            
            <div class="flex flex-col gap-3 font-bold uppercase text-sm">
              ${data.email ? `<a href="mailto:${data.email}" class="flex items-center gap-2 hover:underline decoration-4 underline-offset-4">Email: ${escapeHTML(data.email)}</a>` : ''}
              ${data.phone ? `<a href="tel:${data.phone}" class="flex items-center gap-2 hover:underline decoration-4 underline-offset-4">Phone: ${escapeHTML(data.phone)}</a>` : ''}
              ${data.resume ? `<a href="${data.resume}" target="_blank" class="flex items-center gap-2 hover:underline decoration-4 underline-offset-4">Resume</a>` : ''}
            </div>
          </div>

          <div class="bg-white border-4 border-black p-8 shadow-[8px_8px_0_rgba(0,0,0,1)] text-lg md:text-xl font-medium leading-relaxed">
            ${escapeHTML(data.about || '')}
          </div>

          <div class="flex flex-wrap gap-4 pt-4">
            ${data.github ? `<a href="${data.github}" target="_blank" class="flex items-center gap-2 bg-[#ff90e8] border-4 border-black px-6 py-3 font-bold text-lg uppercase shadow-[4px_4px_0_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all">GitHub</a>` : ''}
            ${data.linkedin ? `<a href="${data.linkedin}" target="_blank" class="flex items-center gap-2 bg-[#90f2ff] border-4 border-black px-6 py-3 font-bold text-lg uppercase shadow-[4px_4px_0_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all">LinkedIn</a>` : ''}
            ${(data.customContacts || []).map(contact => contact.name && contact.link ? `<a href="${contact.link}" target="_blank" class="flex items-center gap-2 bg-[#ff90e8] border-4 border-black px-6 py-3 font-bold text-lg uppercase shadow-[4px_4px_0_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all">${escapeHTML(contact.name)}</a>` : '').join('')}
          </div>
        </header>

        ${data.skills && data.skills.length > 0 ? `
        <section class="space-y-6">
            <h2 class="text-4xl font-black uppercase tracking-tight border-b-4 border-black pb-2 inline-block">Skills</h2>
            <div class="flex flex-wrap gap-4">
              ${data.skills.map(s => s.trim() ? `<span class="bg-[#ffe500] border-4 border-black px-5 py-2.5 font-bold text-lg shadow-[4px_4px_0_rgba(0,0,0,1)]">${escapeHTML(s)}</span>` : '').join('')}
            </div>
        </section>
        ` : ''}

        ${data.projects && data.projects.length > 0 ? `
        <section class="space-y-8 pt-8">
            <h2 class="text-4xl font-black uppercase tracking-tight border-b-4 border-black pb-2 inline-block">Projects</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              ${data.projects.map(p => (p.title || p.description) ? `
                  <div class="bg-white border-4 border-black p-8 shadow-[8px_8px_0_rgba(0,0,0,1)] flex flex-col justify-between hover:-translate-y-2 transition-transform duration-200">
                    <div>
                      <h3 class="text-2xl font-black uppercase mb-4 hover:text-red-500 transition-colors">${escapeHTML(p.title)}</h3>
                      <p class="font-medium text-lg mb-8 leading-relaxed">${escapeHTML(p.description)}</p>
                    </div>
                    ${p.link ? `<a href="${p.link.startsWith('http') ? p.link : `https://${p.link}`}" target="_blank" class="inline-flex items-center gap-2 bg-[#c4ff4d] border-4 border-black px-6 py-3 font-bold uppercase shadow-[4px_4px_0_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all w-fit">View &rarr;</a>` : ''}
                  </div>
              ` : '').join('')}
            </div>
        </section>
        ` : ''}
        
        <footer class="pt-16 pb-8 text-center font-bold uppercase tracking-widest border-t-4 border-black">
          <p>Generated with PortGen</p>
        </footer>
      </div>
    </div>
</body>
</html>`;
}

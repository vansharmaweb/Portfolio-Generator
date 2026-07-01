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
  if (theme === 'claymorphic') return generateClaymorphicHtml(data);
  if (theme === 'nordicforest') return generateNordicForestHtml(data);
  if (theme === 'minimal') return generateMinimalHtml(data);
  if (theme === 'terminal') return generateTerminalHtml(data);
  if (theme === 'creative') return generateCreativeHtml(data);
  return generateGlassHtml(data); // fallback to glass
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
            <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
              ${escapeHTML(data.name)}
            </h1>
            <p class="text-xl md:text-2xl font-semibold text-slate-400 font-outfit">
              ${escapeHTML(data.role)}
            </p>
          </div>
          
          <p class="text-slate-400 text-lg leading-relaxed max-w-2xl">
            ${escapeHTML(data.about)}
          </p>

          <div class="flex flex-wrap gap-4 text-xs font-semibold text-slate-300">
            ${data.email ? `<a href="mailto:${data.email}" class="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 transition-colors">Email</a>` : ''}
            ${data.phone ? `<span class="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/80 border border-slate-700/50">${escapeHTML(data.phone)}</span>` : ''}
            ${data.resume ? `<a href="${data.resume}" target="_blank" class="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 transition-colors">Resume</a>` : ''}
            ${data.github ? `<a href="${data.github}" target="_blank" class="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 transition-colors">GitHub</a>` : ''}
            ${data.linkedin ? `<a href="${data.linkedin}" target="_blank" class="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 transition-colors">LinkedIn</a>` : ''}
          </div>
        </header>

        ${data.skills && data.skills.length > 0 ? `
        <section class="space-y-6">
            <h2 class="text-xs uppercase tracking-widest text-[#FFB800] font-bold font-mono">// Core Stack</h2>
            <div class="flex flex-wrap gap-3">
              ${data.skills.map(s => s.trim() ? `<span class="px-4 py-2 bg-slate-900/90 border border-slate-800 text-sm font-semibold rounded-lg text-slate-300 hover:text-white hover:border-[#FFB800]/50 transition-colors">${escapeHTML(s)}</span>` : '').join('')}
            </div>
        </section>
        ` : ''}

        ${data.projects && data.projects.length > 0 ? `
        <section class="space-y-6">
            <h2 class="text-xs uppercase tracking-widest text-[#FFB800] font-bold font-mono">// Quests Completed</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              ${data.projects.map(p => (p.title || p.description) ? `
                  <div class="p-6 bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-xl flex flex-col justify-between transition-colors group">
                    <div class="space-y-3">
                      <h3 class="text-lg font-bold text-white group-hover:text-[#FFB800] transition-colors">${escapeHTML(p.title)}</h3>
                      <p class="text-slate-400 text-sm leading-relaxed">${escapeHTML(p.description)}</p>
                    </div>
                    ${p.link ? `<a href="${p.link.startsWith('http') ? p.link : `https://${p.link}`}" target="_blank" class="inline-flex items-center gap-1.5 text-xs text-[#FFB800] hover:text-[#FFB800]/80 mt-4 font-mono font-bold">View Quest &rarr;</a>` : ''}
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

      class Particle {
        constructor() {
          this.x = Math.random() * width;
          this.y = Math.random() * height;
          this.size = Math.random() * 1.5 + 0.5;
          this.speedX = Math.random() * 0.4 - 0.2;
          this.speedY = Math.random() * 0.4 - 0.2;
          this.alpha = Math.random() * 0.5 + 0.1;
        }
        update() {
          this.x += this.speedX;
          this.y += this.speedY;
          if (this.x < 0 || this.x > width) this.speedX *= -1;
          if (this.y < 0 || this.y > height) this.speedY *= -1;
        }
        draw() {
          ctx.save();
          ctx.globalAlpha = this.alpha;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fillStyle = '#FFB800';
          ctx.fill();
          ctx.restore();
        }
      }

      for (let i = 0; i < 40; i++) {
        particles.push(new Particle());
      }

      function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
          p.update();
          p.draw();
        });
        requestAnimationFrame(animate);
      }
      animate();
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
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
      body { background-color: #0b0f19; color: #f3f4f6; font-family: 'Inter', sans-serif; }
      .glass {
        background: rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.08);
      }
    </style>
</head>
<body class="selection:bg-violet-500/30 overflow-x-hidden">
    <!-- Animated background aura circles -->
    <div class="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
    <div class="fixed bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

    <div class="min-h-full w-full p-6 md:p-12 lg:p-16 flex justify-center relative z-10">
      <div class="max-w-4xl w-full space-y-16">
        
        <header class="p-8 md:p-12 rounded-3xl glass space-y-6">
          <div class="space-y-3">
            <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">${escapeHTML(data.name)}</h1>
            <p class="text-lg md:text-xl font-medium text-indigo-400">${escapeHTML(data.role)}</p>
          </div>
          <p class="text-slate-300 text-base md:text-lg leading-relaxed max-w-2xl font-light">${escapeHTML(data.about)}</p>

          <div class="flex flex-wrap gap-3 text-xs font-medium">
            ${data.email ? `<a href="mailto:${data.email}" class="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors">Email</a>` : ''}
            ${data.phone ? `<span class="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">${escapeHTML(data.phone)}</span>` : ''}
            ${data.resume ? `<a href="${data.resume}" target="_blank" class="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors">Resume</a>` : ''}
            ${data.github ? `<a href="${data.github}" target="_blank" class="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors">GitHub</a>` : ''}
            ${data.linkedin ? `<a href="${data.linkedin}" target="_blank" class="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors">LinkedIn</a>` : ''}
          </div>
        </header>

        ${data.skills && data.skills.length > 0 ? `
        <section class="p-8 rounded-3xl glass space-y-6">
            <h2 class="text-sm font-semibold tracking-wider uppercase text-indigo-400">Core Stack</h2>
            <div class="flex flex-wrap gap-2.5">
              ${data.skills.map(s => s.trim() ? `<span class="px-4 py-2 bg-white/5 border border-white/10 text-xs rounded-lg text-slate-200">${escapeHTML(s)}</span>` : '').join('')}
            </div>
        </section>
        ` : ''}

        ${data.projects && data.projects.length > 0 ? `
        <section class="space-y-6">
            <h2 class="text-sm font-semibold tracking-wider uppercase text-indigo-400 px-4">Completed Quests</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              ${data.projects.map(p => (p.title || p.description) ? `
                  <div class="p-6 rounded-3xl glass flex flex-col justify-between gap-6 group hover:border-white/20 transition-all duration-300">
                    <div class="space-y-3">
                      <h3 class="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">${escapeHTML(p.title)}</h3>
                      <p class="text-slate-350 text-sm leading-relaxed">${escapeHTML(p.description)}</p>
                    </div>
                    ${p.link ? `<a href="${p.link.startsWith('http') ? p.link : `https://${p.link}`}" target="_blank" class="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 mt-4 font-semibold">Explore Project &rarr;</a>` : ''}
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
    <link href="https://fonts.googleapis.com/css2?family=Lexend+Mega:wght@800&family=Public+Sans:wght@400;600;800&display=swap" rel="stylesheet">
    <style>
      body { background-color: #f4f4f0; color: #000; font-family: 'Public Sans', sans-serif; }
      h1, h2, h3, .font-brutal { font-family: 'Lexend Mega', sans-serif; font-weight: 900; }
    </style>
</head>
<body class="selection:bg-black selection:text-white p-6 md:p-12 lg:p-16">
    <div class="max-w-4xl mx-auto space-y-16">
        <header class="space-y-8 pb-8 border-b-4 border-black">
          <div class="space-y-4">
            <h1 class="text-4xl md:text-7xl font-brutal uppercase text-black leading-none">${escapeHTML(data.name)}</h1>
            <div class="inline-block bg-[#fff500] border-4 border-black px-4 py-2 font-bold text-lg md:text-xl uppercase shadow-[4px_4px_0_rgba(0,0,0,1)]">${escapeHTML(data.role)}</div>
          </div>
          
          <div class="bg-white border-4 border-black p-8 shadow-[8px_8px_0_rgba(0,0,0,1)] text-lg font-medium leading-relaxed">
            ${escapeHTML(data.about)}
          </div>

          <div class="flex flex-wrap gap-4 pt-4">
            ${data.github ? `<a href="${data.github}" target="_blank" class="flex items-center gap-2 bg-[#ff90e8] border-4 border-black px-6 py-3 font-bold text-lg uppercase shadow-[4px_4px_0_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all">GitHub</a>` : ''}
            ${data.linkedin ? `<a href="${data.linkedin}" target="_blank" class="flex items-center gap-2 bg-[#90f2ff] border-4 border-black px-6 py-3 font-bold text-lg uppercase shadow-[4px_4px_0_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all">LinkedIn</a>` : ''}
            ${(data.customContacts || []).map(contact => contact.name && contact.link ? `<a href="${contact.link}" target="_blank" class="flex items-center gap-2 bg-[#ff90e8] border-4 border-black px-6 py-3 font-bold text-lg uppercase shadow-[4px_4px_0_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all">${escapeHTML(contact.name)}</a>` : '').join('')}
          </div>
        </header>

        ${data.skills && data.skills.length > 0 ? `
        <section class="space-y-6">
            <h2 class="text-2xl font-black uppercase border-b-4 border-black pb-2 inline-block">Skills</h2>
            <div class="flex flex-wrap gap-4">
              ${data.skills.map(s => s.trim() ? `<span class="bg-[#ffe500] border-4 border-black px-5 py-2.5 font-bold text-lg shadow-[4px_4px_0_rgba(0,0,0,1)]">${escapeHTML(s)}</span>` : '').join('')}
            </div>
        </section>
        ` : ''}

        ${data.projects && data.projects.length > 0 ? `
        <section class="space-y-8 pt-8">
            <h2 class="text-2xl font-black uppercase border-b-4 border-black pb-2 inline-block">Projects</h2>
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

function generateClaymorphicHtml(data) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHTML(data.name)} - ${escapeHTML(data.role)}</title>
    <meta name="description" content="${escapeHTML(data.about)}">
    ${getOGTags(data)}
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800;900&display=swap" rel="stylesheet">
    <style>
      body {
        background: linear-gradient(135deg, #e0e7ff 0%, #f5f3ff 50%, #fce7f3 100%);
        color: #1e293b;
        font-family: 'Outfit', sans-serif;
      }
      .clay-card {
        background: rgba(255, 255, 255, 0.65);
        backdrop-filter: blur(20px);
        border: 2px solid rgba(255, 255, 255, 0.7);
        border-radius: 2rem;
        box-shadow: 0 20px 40px -15px rgba(109, 40, 217, 0.12), inset 2px 2px 6px 0 rgba(255, 255, 255, 0.9), inset -4px -4px 14px 0 rgba(109, 40, 217, 0.08), inset 0 16px 28px 0 rgba(255, 255, 255, 0.6);
      }
      .clay-btn {
        background: rgba(139, 92, 246, 0.85);
        border: 2px solid rgba(255, 255, 255, 0.4);
        border-radius: 1.25rem;
        box-shadow: 0 10px 20px -8px rgba(139, 92, 246, 0.4), inset 1px 1px 3px 0 rgba(255, 255, 255, 0.8), inset -2px -2px 8px 0 rgba(0, 0, 0, 0.15);
      }
    </style>
</head>
<body class="overflow-x-hidden min-h-screen relative p-6 md:p-12 lg:p-16 flex justify-center">
    <div class="absolute -top-16 -left-16 w-64 h-64 rounded-full opacity-60 pointer-events-none" style="background: radial-gradient(circle at 30% 30%, #a855f7, #7c3aed); box-shadow: inset 4px 4px 12px rgba(255,255,255,0.4), 0 15px 30px rgba(124,58,237,0.25);"></div>
    <div class="absolute top-1/2 -right-24 w-80 h-80 rounded-full opacity-50 pointer-events-none" style="background: radial-gradient(circle at 30% 30%, #06b6d4, #0891b2); box-shadow: inset 4px 4px 12px rgba(255,255,255,0.4), 0 15px 30px rgba(8,145,178,0.25);"></div>
    <div class="absolute -bottom-20 left-1/4 w-72 h-72 rounded-full opacity-55 pointer-events-none" style="background: radial-gradient(circle at 30% 30%, #ec4899, #db2777); box-shadow: inset 4px 4px 12px rgba(255,255,255,0.4), 0 15px 30px rgba(219,39,119,0.25);"></div>

    <div class="max-w-4xl w-full space-y-10 relative z-10">
        <header class="p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 hover:scale-[1.01] transition-transform duration-300 clay-card">
          <div class="space-y-4 flex-1">
            <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600">
              ${escapeHTML(data.name)}
            </h1>
            <div class="inline-block bg-white/90 border border-purple-100 px-4 py-1.5 rounded-full font-bold text-sm md:text-base text-purple-600 shadow-sm">
              ✨ ${escapeHTML(data.role)}
            </div>
            <p class="text-slate-600 text-sm md:text-base leading-relaxed max-w-lg">
              ${escapeHTML(data.about)}
            </p>
          </div>

          <div class="flex flex-col gap-3 min-w-[200px] w-full md:w-auto text-sm font-semibold">
            ${data.email ? `<a href="mailto:${data.email}" class="flex items-center justify-center md:justify-start gap-2.5 px-4 py-2.5 rounded-2xl bg-white/80 hover:bg-white border border-white hover:border-purple-200 text-slate-700 shadow-sm transition-all hover:scale-[1.03]">Email Me</a>` : ''}
            ${data.phone ? `<a href="tel:${data.phone}" class="flex items-center justify-center md:justify-start gap-2.5 px-4 py-2.5 rounded-2xl bg-white/80 hover:bg-white border border-white hover:border-purple-200 text-slate-700 shadow-sm transition-all hover:scale-[1.03]">${escapeHTML(data.phone)}</a>` : ''}
            ${data.resume ? `<a href="${data.resume}" target="_blank" class="flex items-center justify-center md:justify-start gap-2.5 px-4 py-2.5 rounded-2xl bg-white/80 hover:bg-white border border-white hover:border-purple-200 text-slate-700 shadow-sm transition-all hover:scale-[1.03]">View Resume</a>` : ''}
            <div class="flex items-center justify-center md:justify-start gap-4 mt-2">
              ${data.github ? `<a href="${data.github}" target="_blank" class="px-3 py-1.5 bg-white rounded-xl border border-white text-slate-700 shadow-sm transition-all hover:scale-110">GitHub</a>` : ''}
              ${data.linkedin ? `<a href="${data.linkedin}" target="_blank" class="px-3 py-1.5 bg-white rounded-xl border border-white text-slate-700 shadow-sm transition-all hover:scale-110">LinkedIn</a>` : ''}
            </div>
          </div>
        </header>

        ${data.skills && data.skills.length > 0 ? `
        <section class="p-8 md:p-10 space-y-6 clay-card">
            <h2 class="text-2xl font-black tracking-tight">🛠️ My Superpowers</h2>
            <div class="flex flex-wrap gap-3">
              ${data.skills.map(s => s.trim() ? `<span class="px-4 py-2 bg-white/90 border border-white text-sm font-bold rounded-2xl text-slate-700 shadow-sm hover:scale-105 hover:rotate-1 transition-all inline-block">${escapeHTML(s)}</span>` : '').join('')}
            </div>
        </section>
        ` : ''}

        ${data.projects && data.projects.length > 0 ? `
        <section class="space-y-6">
            <h2 class="text-2xl font-black tracking-tight px-4">🚀 Featured Creations</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              ${data.projects.map(p => (p.title || p.description) ? `
                  <div class="p-6 flex flex-col justify-between gap-6 hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 clay-card">
                    <div class="space-y-3">
                      <h3 class="text-xl font-bold tracking-tight">${escapeHTML(p.title)}</h3>
                      <p class="text-slate-600 text-sm leading-relaxed">${escapeHTML(p.description)}</p>
                    </div>
                    ${p.link ? `<a href="${p.link.startsWith('http') ? p.link : `https://${p.link}`}" target="_blank" class="flex items-center gap-1.5 px-4 py-2 text-white text-xs font-bold w-fit shadow-md transition-all hover:scale-105 hover:shadow-lg clay-btn">Launch Project &rarr;</a>` : ''}
                  </div>
              ` : '').join('')}
            </div>
        </section>
        ` : ''}

        <footer class="pt-8 text-center text-slate-400 text-xs font-bold tracking-wider">
          <p>BUBBLE GENERATED WITH PORTGEN</p>
        </footer>
    </div>
</body>
</html>`;
}

function generateNordicForestHtml(data) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHTML(data.name)} - ${escapeHTML(data.role)}</title>
    <meta name="description" content="${escapeHTML(data.about)}">
    ${getOGTags(data)}
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,800;1,400&family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
    <style>
      body {
        background-color: #070f0e;
        color: #d1dcd6;
        font-family: 'Inter', sans-serif;
      }
      h1, h2, h3, .font-serif {
        font-family: 'Playfair Display', Georgia, serif;
      }
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
    </style>
</head>
<body class="overflow-x-hidden min-h-screen relative p-6 md:p-12 lg:p-16 flex justify-center">
    <div class="absolute top-[-20%] left-[-10%] w-[90%] h-[80%] rounded-full bg-gradient-to-tr from-emerald-950/20 via-[#064e3b]/15 to-transparent blur-[110px] pointer-events-none aurora-circle-1"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] rounded-full bg-gradient-to-bl from-[#115e59]/10 via-[#042f2e]/20 to-transparent blur-[120px] pointer-events-none aurora-circle-2"></div>

    <div class="max-w-4xl w-full space-y-16 relative z-10">
        <header class="border-b border-[#1b302a] pb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div class="space-y-4">
            <h1 class="text-5xl md:text-7xl font-serif tracking-tight text-[#e6ede9]">
              ${escapeHTML(data.name)}
            </h1>
            <div class="text-emerald-400 font-semibold tracking-wider uppercase text-sm font-mono">
              // ${escapeHTML(data.role)}
            </div>
            <p class="text-[#a4b5ad] text-base md:text-lg leading-relaxed max-w-2xl font-light">
              ${escapeHTML(data.about)}
            </p>
          </div>

          <div class="flex flex-col gap-3 min-w-[200px] w-full md:w-auto text-sm font-mono">
            ${data.email ? `<a href="mailto:${data.email}" class="flex items-center gap-2 text-[#a4b5ad] hover:text-emerald-400 transition-colors">${escapeHTML(data.email)}</a>` : ''}
            ${data.phone ? `<a href="tel:${data.phone}" class="flex items-center gap-2 text-[#a4b5ad] hover:text-emerald-400 transition-colors">${escapeHTML(data.phone)}</a>` : ''}
            ${data.resume ? `<a href="${data.resume}" target="_blank" class="flex items-center gap-2 text-[#a4b5ad] hover:text-emerald-400 transition-colors">view resume</a>` : ''}
            <div class="flex items-center gap-4 mt-2">
              ${data.github ? `<a href="${data.github}" target="_blank" class="text-[#a4b5ad] hover:text-emerald-400 transition-colors font-semibold">GitHub</a>` : ''}
              ${data.linkedin ? `<a href="${data.linkedin}" target="_blank" class="text-[#a4b5ad] hover:text-emerald-400 transition-colors font-semibold">LinkedIn</a>` : ''}
            </div>
          </div>
        </header>

        ${data.skills && data.skills.length > 0 ? `
        <section class="space-y-4">
            <h2 class="text-xl font-serif italic text-[#e6ede9] border-l-2 border-emerald-500 pl-3">Core Skills</h2>
            <div class="flex flex-wrap gap-2.5">
              ${data.skills.map(s => s.trim() ? `<span class="px-3.5 py-1.5 bg-[#0f221e]/80 border border-[#1b302a] text-xs font-mono rounded-md text-[#a4b5ad] hover:text-emerald-300 hover:border-emerald-800 transition-colors inline-block">${escapeHTML(s)}</span>` : '').join('')}
            </div>
        </section>
        ` : ''}

        ${data.projects && data.projects.length > 0 ? `
        <section class="space-y-6">
            <h2 class="text-xl font-serif italic text-[#e6ede9] border-l-2 border-emerald-500 pl-3">Selected Work</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              ${data.projects.map(p => (p.title || p.description) ? `
                  <div class="p-6 bg-[#0c1c18]/60 border border-[#142923] rounded-lg flex flex-col justify-between gap-6 hover:border-emerald-900/60 hover:bg-[#0c1c18]/80 transition-all duration-300 group">
                    <div class="space-y-3">
                      <h3 class="text-lg font-serif text-[#e6ede9] group-hover:text-emerald-400 transition-colors">${escapeHTML(p.title)}</h3>
                      <p class="text-[#889d93] text-sm leading-relaxed font-light">${escapeHTML(p.description)}</p>
                    </div>
                    ${p.link ? `<a href="${p.link.startsWith('http') ? p.link : `https://${p.link}`}" target="_blank" class="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 hover:text-emerald-300 hover:underline transition-colors mt-auto w-fit">view source &rarr;</a>` : ''}
                  </div>
              ` : '').join('')}
            </div>
        </section>
        ` : ''}

        <footer class="pt-12 border-t border-[#1b302a]/40 text-center text-[#597066] text-xs font-mono">
          <p>nordic design / generated by portgen</p>
        </footer>
    </div>
</body>
</html>`;
}

function generateMinimalHtml(data) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHTML(data.name)} - ${escapeHTML(data.role)}</title>
    <meta name="description" content="${escapeHTML(data.about)}">
    ${getOGTags(data)}
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
      body { background-color: #ffffff; color: #1a202c; font-family: 'Inter', sans-serif; }
      h1, h2, h3, .font-serif { font-family: 'Playfair Display', serif; }
    </style>
</head>
<body class="selection:bg-slate-200">
    <div class="max-w-3xl mx-auto px-6 py-20 space-y-16">
        <header class="space-y-6">
            <h1 class="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">${escapeHTML(data.name)}</h1>
            <p class="text-lg font-medium text-slate-500 font-serif italic">${escapeHTML(data.role)}</p>
            <p class="text-[#4a5568] text-base leading-relaxed max-w-xl font-light">${escapeHTML(data.about)}</p>
            <div class="flex flex-wrap gap-4 text-xs font-medium text-gray-500">
              ${data.email ? `<a href="mailto:${data.email}" class="hover:text-black hover:underline">Email</a>` : ''}
              ${data.phone ? `<span>${escapeHTML(data.phone)}</span>` : ''}
              ${data.resume ? `<a href="${data.resume}" target="_blank" class="hover:text-black hover:underline">Resume</a>` : ''}
              ${data.github ? `<a href="${data.github}" target="_blank" class="hover:text-black hover:underline">GitHub</a>` : ''}
              ${data.linkedin ? `<a href="${data.linkedin}" target="_blank" class="hover:text-black hover:underline">LinkedIn</a>` : ''}
            </div>
        </header>

        ${data.skills && data.skills.length > 0 ? `
        <section class="space-y-4">
            <h2 class="text-xs uppercase tracking-widest text-slate-400 font-bold">Skills</h2>
            <div class="flex flex-wrap gap-2">
              ${data.skills.map(s => s.trim() ? `<span class="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded border border-gray-200">${escapeHTML(s)}</span>` : '').join('')}
            </div>
        </section>
        ` : ''}

        ${data.projects && data.projects.length > 0 ? `
        <section class="space-y-6">
            <h2 class="text-xs uppercase tracking-widest text-slate-400 font-bold">Projects</h2>
            <div class="space-y-8">
              ${data.projects.map(p => (p.title || p.description) ? `
                  <div class="group border-b border-gray-100 pb-8 last:border-0 last:pb-0">
                    <h3 class="text-lg font-semibold text-gray-900 group-hover:text-slate-600 transition-colors">${escapeHTML(p.title)}</h3>
                    <p class="text-slate-600 text-sm mt-2 max-w-xl leading-relaxed">${escapeHTML(p.description)}</p>
                    ${p.link ? `<a href="${p.link.startsWith('http') ? p.link : `https://${p.link}`}" target="_blank" class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-black hover:underline mt-3">View Project &rarr;</a>` : ''}
                  </div>
              ` : '').join('')}
            </div>
        </section>
        ` : ''}

        <footer class="pt-12 text-center text-xs text-gray-400 tracking-widest uppercase border-t border-gray-100">
          Built with PortGen
        </footer>
    </div>
</body>
</html>`;
}

function generateTerminalHtml(data) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHTML(data.name)} - ${escapeHTML(data.role)}</title>
    <meta name="description" content="${escapeHTML(data.about)}">
    ${getOGTags(data)}
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;700&display=swap" rel="stylesheet">
    <style>
      body { background-color: #0d1117; color: #58a6ff; font-family: 'Fira Code', monospace; }
      .terminal-green { color: #39ff14; }
      .terminal-dark { color: #8b949e; }
    </style>
</head>
<body class="selection:bg-green-500/20 p-6 md:p-12">
    <div class="max-w-3xl mx-auto space-y-12">
        <header class="space-y-4">
            <div>
              <span class="terminal-dark">$ whoami</span>
              <h1 class="text-3xl font-bold terminal-green mt-1">${escapeHTML(data.name)}</h1>
              <p class="text-sm text-cyan-400 mt-1">&gt; ${escapeHTML(data.role)}</p>
            </div>
            
            <div class="text-[#c9d1d9] text-sm leading-relaxed max-w-2xl">
              <span class="terminal-dark">$ cat about.txt</span>
              <p class="mt-1">${escapeHTML(data.about)}</p>
            </div>

            <div class="text-xs space-y-1 terminal-dark pt-2">
              <p>$ list contacts</p>
              ${data.email ? `<p class="terminal-green">  - email: <a href="mailto:${data.email}" class="hover:underline">${escapeHTML(data.email)}</a></p>` : ''}
              ${data.phone ? `<p class="terminal-green">  - phone: <span>${escapeHTML(data.phone)}</span></p>` : ''}
              ${data.resume ? `<p class="terminal-green">  - resume: <a href="${data.resume}" target="_blank" class="hover:underline">resume.pdf</a></p>` : ''}
              ${data.github ? `<p class="terminal-green">  - github: <a href="${data.github}" target="_blank" class="hover:underline">${escapeHTML(data.github)}</a></p>` : ''}
              ${data.linkedin ? `<p class="terminal-green">  - linkedin: <a href="${data.linkedin}" target="_blank" class="hover:underline">${escapeHTML(data.linkedin)}</a></p>` : ''}
            </div>
        </header>

        ${data.skills && data.skills.length > 0 ? `
        <section class="space-y-3">
            <p class="terminal-dark">$ cat skills.json</p>
            <div class="flex flex-wrap gap-2 text-xs border border-green-500/30 p-4 rounded-lg bg-black/40">
              ${data.skills.map(s => s.trim() ? `<span class="terminal-green font-bold">[ ${escapeHTML(s)} ]</span>` : '').join('')}
            </div>
        </section>
        ` : ''}

        ${data.projects && data.projects.length > 0 ? `
        <section class="space-y-4">
            <p class="terminal-dark">$ list projects</p>
            <div class="space-y-6">
              ${data.projects.map(p => (p.title || p.description) ? `
                  <div class="border border-green-500/20 p-5 rounded-lg bg-black/20 hover:border-green-500/40 transition-colors">
                    <h3 class="text-base font-bold text-cyan-400">&gt; ${escapeHTML(p.title)}</h3>
                    <p class="text-slate-300 text-xs mt-2 leading-relaxed">${escapeHTML(p.description)}</p>
                    ${p.link ? `<a href="${p.link.startsWith('http') ? p.link : `https://${p.link}`}" target="_blank" class="inline-block text-xs text-green-400 hover:text-green-300 hover:underline mt-3">run_project.sh &rarr;</a>` : ''}
                  </div>
              ` : '').join('')}
            </div>
        </section>
        ` : ''}

        <footer class="pt-8 border-t border-green-500/10 text-xs terminal-dark flex items-center gap-2">
          <span>Built with</span>
          <span class="terminal-green font-bold">PortGen</span>
          <span class="w-1.5 h-3.5 bg-green-500 animate-pulse inline-block"></span>
        </footer>
    </div>
</body>
</html>`;
}

function generateCreativeHtml(data) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHTML(data.name)} - ${escapeHTML(data.role)}</title>
    <meta name="description" content="${escapeHTML(data.about)}">
    ${getOGTags(data)}
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@800;900&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
      body { background-color: #fafaf9; color: #1c1917; font-family: 'Inter', sans-serif; }
      h1, h2, h3, .font-display { font-family: 'Cabinet Grotesk', 'Inter', sans-serif; font-weight: 900; }
    </style>
</head>
<body class="selection:bg-pink-500 selection:text-white p-6 md:p-12 lg:p-16">
    <div class="max-w-4xl mx-auto space-y-20">
        <header class="flex flex-col md:flex-row justify-between items-start gap-12 border-b-2 border-slate-900 pb-12">
            <div class="space-y-6 flex-1">
              <h1 class="text-5xl md:text-7xl font-display uppercase tracking-tight leading-none text-slate-900">${escapeHTML(data.name)}</h1>
              <div class="inline-block bg-pink-500 text-white font-display uppercase tracking-widest text-xs px-4 py-2 rounded-full">${escapeHTML(data.role)}</div>
              <p class="text-slate-700 text-base md:text-lg leading-relaxed max-w-xl font-light">${escapeHTML(data.about)}</p>
            </div>
            
            <div class="flex flex-col gap-3 min-w-[200px] text-sm font-semibold">
              ${data.email ? `<a href="mailto:${data.email}" class="hover:text-pink-500 transition-colors">→ ${escapeHTML(data.email)}</a>` : ''}
              ${data.phone ? `<span>→ ${escapeHTML(data.phone)}</span>` : ''}
              ${data.resume ? `<a href="${data.resume}" target="_blank" class="hover:text-pink-500 transition-colors">→ view resume</a>` : ''}
              <div class="flex items-center gap-4 mt-2">
                ${data.github ? `<a href="${data.github}" target="_blank" class="text-slate-600 hover:text-black font-bold">GitHub</a>` : ''}
                ${data.linkedin ? `<a href="${data.linkedin}" target="_blank" class="text-slate-600 hover:text-black font-bold">LinkedIn</a>` : ''}
              </div>
            </div>
        </header>

        ${data.skills && data.skills.length > 0 ? `
        <section class="space-y-6">
            <h2 class="text-xl font-display uppercase tracking-wider border-b-2 border-slate-900 pb-2 inline-block">My Arsenal</h2>
            <div class="flex flex-wrap gap-2.5">
              ${data.skills.map(s => s.trim() ? `<span class="bg-violet-100 hover:bg-violet-200 border-2 border-slate-900 text-slate-900 text-xs font-bold px-4 py-2 rounded-lg transition-colors inline-block">${escapeHTML(s)}</span>` : '').join('')}
            </div>
        </section>
        ` : ''}

        ${data.projects && data.projects.length > 0 ? `
        <section class="space-y-8">
            <h2 class="text-xl font-display uppercase tracking-wider border-b-2 border-slate-900 pb-2 inline-block">Selected Projects</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              ${data.projects.map(p => (p.title || p.description) ? `
                  <div class="border-2 border-slate-900 p-6 rounded-2xl bg-white shadow-[6px_6px_0_rgba(15,23,42,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex flex-col justify-between gap-6">
                    <div class="space-y-3">
                      <h3 class="text-xl font-display uppercase text-slate-900">${escapeHTML(p.title)}</h3>
                      <p class="text-slate-600 text-sm leading-relaxed">${escapeHTML(p.description)}</p>
                    </div>
                    ${p.link ? `<a href="${p.link.startsWith('http') ? p.link : `https://${p.link}`}" target="_blank" class="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-pink-500 hover:scale-105 transition-all w-fit">Explore Work &rarr;</a>` : ''}
                  </div>
              ` : '').join('')}
            </div>
        </section>
        ` : ''}

        <footer class="pt-12 text-center text-xs font-bold tracking-widest uppercase border-t-2 border-slate-900">
          Built with <span class="text-pink-500">PortGen</span>
        </footer>
    </div>
</body>
</html>`;
}

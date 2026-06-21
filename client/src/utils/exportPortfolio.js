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

  <p class="footer">Generated with PortfolioGen</p>
  <script>window.onload = () => window.print();<\/script>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
}

function getOGTags(data) {
  const siteUrl = data.github || 'https://portfoliogen.example.com';
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
    <style>
      body { background-color: #0a0f1d; color: #e2e8f0; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif; }
    </style>
</head>
<body class="selection:bg-purple-500/30">
    <div class="min-h-full w-full p-6 md:p-12 lg:p-16 flex justify-center">
      <div class="max-w-4xl w-full space-y-24">
        
        <header class="space-y-8 animate-fade-in-up">
          <div class="space-y-4 border-l-4 border-cyan-500 pl-6">
            <h1 class="text-4xl md:text-6xl font-black text-white tracking-tight">${escapeHTML(data.name || 'Your Name')}</h1>
            <p class="text-xl md:text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 w-max">${escapeHTML(data.role || 'Your Role')}</p>
          </div>
          <p class="text-lg text-slate-400 max-w-2xl leading-relaxed">${escapeHTML(data.about || '')}</p>
          
          <div class="flex flex-wrap gap-4 pt-2">
            ${data.github ? `<a href="${data.github}" target="_blank" class="p-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl text-slate-300 hover:text-white ring-1 ring-white/5 transition-all">GitHub</a>` : ''}
            ${data.linkedin ? `<a href="${data.linkedin}" target="_blank" class="p-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl text-slate-300 hover:text-white ring-1 ring-white/5 transition-all">LinkedIn</a>` : ''}
            ${data.email ? `<a href="mailto:${data.email}" class="p-3 bg-cyan-500/10 hover:bg-cyan-500/20 rounded-xl text-cyan-400 hover:text-cyan-300 ring-1 ring-cyan-500/20 transition-all font-medium text-sm flex items-center shadow-sm px-4">${escapeHTML(data.email)}</a>` : ''}
            ${data.phone ? `<a href="tel:${data.phone}" class="p-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl text-slate-300 hover:text-white ring-1 ring-white/5 transition-all flex items-center font-medium text-sm shadow-sm px-4">${escapeHTML(data.phone)}</a>` : ''}
          </div>
        </header>

        ${data.skills && data.skills.length > 0 ? `
        <section class="space-y-8">
            <div class="flex items-center gap-4">
              <h2 class="text-2xl font-bold text-white">Core Technologies</h2>
              <div class="flex-1 h-px bg-gradient-to-r from-slate-800 to-transparent"></div>
            </div>
            <div class="flex flex-wrap gap-3">
              ${data.skills.map(s => s.trim() ? `<span class="px-4 py-2 bg-slate-800/40 border border-slate-700/50 rounded-lg text-sm font-medium text-slate-300 shadow-sm backdrop-blur-sm">${escapeHTML(s)}</span>` : '').join('')}
            </div>
        </section>
        ` : ''}

        ${data.projects && data.projects.length > 0 ? `
        <section class="space-y-8">
            <div class="flex items-center gap-4">
              <h2 class="text-2xl font-bold text-white">Featured Work</h2>
              <div class="flex-1 h-px bg-gradient-to-r from-slate-800 to-transparent"></div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              ${data.projects.map(p => (p.title || p.description) ? `
                  <div class="group flex flex-col justify-between p-8 bg-slate-800/20 border border-slate-800 rounded-2xl">
                    <div>
                      <h3 class="text-xl font-bold text-white mb-3">${escapeHTML(p.title)}</h3>
                      <p class="text-slate-400 text-sm leading-relaxed mb-6">${escapeHTML(p.description)}</p>
                    </div>
                    ${p.link ? `<a href="${p.link.startsWith('http') ? p.link : `https://${p.link}`}" target="_blank" class="text-cyan-400 text-sm font-medium mt-2 hover:underline">View Details &rarr;</a>` : ''}
                  </div>
              ` : '').join('')}
            </div>
        </section>
        ` : ''}

        <footer class="pt-12 pb-8 border-t border-slate-800/50 text-center text-slate-500 text-sm">
          <p>Designed with PortfolioGen.</p>
        </footer>
      </div>
    </div>
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
          <p>Designed with PortfolioGen.</p>
        </footer>
      </div>
    </div>
</body>
</html>`;
}

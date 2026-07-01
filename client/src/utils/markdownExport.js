export function exportReadme(data) {
  const md = [];

  md.push(`# Hi there, I'm ${data.name || 'a Developer'} 👋`);
  if (data.role) md.push(`### ${data.role}`);
  md.push('');

  if (data.about) {
    md.push(data.about);
    md.push('');
  }

  const links = [];
  if (data.email) links.push(`[Email](mailto:${data.email})`);
  if (data.linkedin) links.push(`[LinkedIn](${data.linkedin})`);
  if (data.github) links.push(`[GitHub](${data.github})`);
  
  if (links.length > 0) {
    md.push('📫 How to reach me: ' + links.join(' | '));
    md.push('');
  }

  if (data.skills && data.skills.length > 0) {
    md.push('## 🛠 Skills');
    const skillsList = data.skills.filter(s => s.trim()).join(' • ');
    md.push(skillsList);
    md.push('');
  }

  const validProjects = (data.projects || []).filter(p => p.title || p.description);
  if (validProjects.length > 0) {
    md.push('## 🚀 Featured Projects');
    validProjects.forEach(p => {
      let projectStr = `- **${p.title || 'Untitled'}**`;
      if (p.description) projectStr += `: ${p.description}`;
      if (p.link) projectStr += ` [🔗](${p.link.startsWith('http') ? p.link : 'https://' + p.link})`;
      md.push(projectStr);
    });
    md.push('');
  }

  md.push('---');
  md.push('*Generated with [PortGen](#)*');

  const mdString = md.join('\n');
  
  navigator.clipboard.writeText(mdString).then(() => {
    alert("Profile README copied to clipboard! You can paste it into your GitHub profile repo.");
  }).catch(err => {
    console.error("Failed to copy:", err);
    alert("Failed to copy Markdown to clipboard.");
  });
}

import { Plus, Trash2 } from 'lucide-react';
import GithubImporter from './GithubImporter';
import AiBioGenerator from './AiBioGenerator';

export default function Form({ data, setData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillAdd = () => {
    setData((prev) => ({ ...prev, skills: [...prev.skills, ''] }));
  };

  const handleSkillChange = (index, value) => {
    const newSkills = [...data.skills];
    newSkills[index] = value;
    setData((prev) => ({ ...prev, skills: newSkills }));
  };

  const handleSkillRemove = (index) => {
    const newSkills = data.skills.filter((_, i) => i !== index);
    setData((prev) => ({ ...prev, skills: newSkills }));
  };

  const handleProjectAdd = () => {
    const newProject = { id: Date.now().toString(), title: '', description: '', link: '' };
    setData((prev) => ({ ...prev, projects: [...prev.projects, newProject] }));
  };

  const handleProjectChange = (id, field, value) => {
    const newProjects = data.projects.map((p) =>
      p.id === id ? { ...p, [field]: value } : p
    );
    setData((prev) => ({ ...prev, projects: newProjects }));
  };

  const handleProjectRemove = (id) => {
    const newProjects = data.projects.filter((p) => p.id !== id);
    setData((prev) => ({ ...prev, projects: newProjects }));
  };

  const handleContactAdd = () => {
    setData((prev) => ({ ...prev, customContacts: [...(prev.customContacts || []), { name: '', link: '' }] }));
  };

  const handleContactChange = (index, field, value) => {
    const newContacts = [...(data.customContacts || [])];
    newContacts[index] = { ...newContacts[index], [field]: value };
    setData((prev) => ({ ...prev, customContacts: newContacts }));
  };

  const handleContactRemove = (index) => {
    const newContacts = (data.customContacts || []).filter((_, i) => i !== index);
    setData((prev) => ({ ...prev, customContacts: newContacts }));
  };

  return (
    <div className="p-6 lg:p-10 max-w-2xl mx-auto w-full space-y-12">
      <Section title="Personal Information">
        <Input label="Full Name" name="name" value={data.name} onChange={handleChange} placeholder="John Doe" />
        <Input label="Role / Title" name="role" value={data.role} onChange={handleChange} placeholder="Full Stack Developer" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Email Address" type="email" name="email" value={data.email} onChange={handleChange} placeholder="hello@example.com" />
          <Input label="Phone Number" type="tel" name="phone" value={data.phone} onChange={handleChange} placeholder="+1 234 567 890" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <label className="text-sm font-medium text-slate-300">About Me</label>
            <AiBioGenerator
              data={data}
              onBioGenerated={(bio) => setData(prev => ({ ...prev, about: bio }))}
            />
          </div>
          <textarea
            name="about"
            value={data.about}
            onChange={handleChange}
            placeholder="Tell us about yourself, or click ✦ AI Generate above…"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors h-32 resize-none"
          />
        </div>
      </Section>

      <Section title="Social & Resume Links">
        <Input label="Resume URL (PDF/Drive)" name="resume" value={data.resume || ''} onChange={handleChange} placeholder="https://..." />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="GitHub URL" name="github" value={data.github} onChange={handleChange} placeholder="https://github.com/..." />
          <Input label="LinkedIn URL" name="linkedin" value={data.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/..." />
        </div>
        
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h3 className="text-sm font-medium text-slate-300">Custom Contact Options</h3>
          {(data.customContacts || []).map((contact, index) => (
            <div key={index} className="flex items-start gap-3 relative group">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={contact.name}
                  onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="Platform Name (e.g., Twitter)"
                />
                <input
                  type="text"
                  value={contact.link}
                  onChange={(e) => handleContactChange(index, 'link', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="https://..."
                />
              </div>
              <button
                onClick={() => handleContactRemove(index)}
                className="p-2.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                title="Remove contact"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          <button
            onClick={handleContactAdd}
            className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 font-medium py-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Contact Option
          </button>
        </div>
      </Section>

      <Section title="Skills">
        <div className="space-y-3">
          {data.skills.map((skill, index) => (
            <div key={index} className="flex items-center gap-3">
              <input
                type="text"
                value={skill}
                onChange={(e) => handleSkillChange(index, e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                placeholder="e.g. React"
              />
              <button
                onClick={() => handleSkillRemove(index)}
                className="p-2.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                title="Remove skill"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          <button
            onClick={handleSkillAdd}
            className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 font-medium py-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Skill
          </button>
        </div>
      </Section>

      <Section title="Projects">
        <GithubImporter data={data} setData={setData} />

        <div className="space-y-6 mt-6">
          {data.projects.map((project, index) => (
            <div key={project.id} className="p-5 border border-slate-700 bg-slate-800/20 rounded-xl space-y-4 relative group">
              <button
                onClick={() => handleProjectRemove(project.id)}
                className="absolute top-3 right-3 p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-700 rounded-md transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                title="Remove project"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Project Title</label>
                  <input
                    type="text"
                    value={project.title}
                    onChange={(e) => handleProjectChange(project.id, 'title', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="Awesome Project"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Project Link (Optional)</label>
                  <input
                    type="text"
                    value={project.link || ''}
                    onChange={(e) => handleProjectChange(project.id, 'link', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Description</label>
                <textarea
                  value={project.description}
                  onChange={(e) => handleProjectChange(project.id, 'description', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500 transition-colors h-24 resize-none"
                  placeholder="What did you build?"
                />
              </div>
            </div>
          ))}
          <button
            onClick={handleProjectAdd}
            className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 font-medium py-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Custom Project
          </button>
        </div>
      </Section>
      
      <div className="pb-10"></div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white border-b border-slate-800 pb-2">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div className="space-y-2 flex-1">
      <label className="text-sm font-medium text-slate-300">{label}</label>
      <input
        {...props}
        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
      />
    </div>
  );
}

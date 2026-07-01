import { useState } from 'react';
import ModernTemplate from './PortfolioTemplates/Modern';
import GlassTemplate from './PortfolioTemplates/Glass';
import MinimalTemplate from './PortfolioTemplates/Minimal';
import TerminalTemplate from './PortfolioTemplates/TerminalTheme';
import CreativeTemplate from './PortfolioTemplates/Creative';
import NeoBrutalistTemplate from './PortfolioTemplates/NeoBrutalist';
import ClaymorphicTemplate from './PortfolioTemplates/Claymorphic';
import NordicForestTemplate from './PortfolioTemplates/NordicForest';
import TemplateSelector from './TemplateSelector';
import DeployModal from './DeployModal';
import { Download, Rocket, FileCode2, Code, FileText } from 'lucide-react';
import { exportPortfolio, exportStandaloneHtml, exportAsPdf } from '../utils/exportPortfolio';
import { exportReadme } from '../utils/markdownExport';

export default function Preview({ data, currentTheme, setCurrentTheme }) {
  const [isExporting, setIsExporting] = useState(false);
  const [showDeploy, setShowDeploy] = useState(false);

  const handleExportZip = async () => {
    setIsExporting(true);
    try {
      await exportPortfolio(data, currentTheme);
    } catch(err) {
      console.error(err);
      alert('Failed to export. Check console.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportHtml = () => exportStandaloneHtml(data, currentTheme);
  const handleExportReadme = () => exportReadme(data);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">

      {/* ── Unified Preview Toolbar ── */}
      <div className="flex-shrink-0 flex items-center justify-between gap-3 px-3 py-2 bg-slate-900/95 backdrop-blur-xl border-b border-white/[0.06] shadow-xl">

        {/* Template Selector */}
        <TemplateSelector currentTheme={currentTheme} setCurrentTheme={setCurrentTheme} />

        {/* Right Actions */}
        <div className="flex items-center gap-2">

          {/* Export icon group */}
          <div className="flex items-center bg-white/5 border border-white/10 rounded-lg overflow-hidden">
            <button
              onClick={handleExportHtml}
              title="Download Standalone HTML"
              className="group flex items-center gap-1.5 px-3 py-1.5 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-150 border-r border-white/10"
            >
              <Code className="w-3.5 h-3.5" />
              <span className="text-xs font-medium hidden sm:inline">HTML</span>
            </button>
            <button
              onClick={handleExportReadme}
              title="Download GitHub README"
              className="group flex items-center gap-1.5 px-3 py-1.5 text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 transition-all duration-150 border-r border-white/10"
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span className="text-xs font-medium hidden sm:inline">README</span>
            </button>
            <button
              onClick={() => exportAsPdf(data)}
              title="Export as PDF Resume"
              className="group flex items-center gap-1.5 px-3 py-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-150 border-r border-white/10"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="text-xs font-medium hidden sm:inline">PDF</span>
            </button>
            <button
              onClick={handleExportZip}
              title="Download Source ZIP"
              disabled={isExporting}
              className="group flex items-center gap-1.5 px-3 py-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all duration-150 disabled:opacity-40"
            >
              <Download className={`w-3.5 h-3.5 ${isExporting ? 'animate-bounce' : ''}`} />
              <span className="text-xs font-medium hidden sm:inline">ZIP</span>
            </button>
          </div>

          {/* Deploy CTA */}
          <button
            onClick={() => setShowDeploy(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white pl-3 pr-4 py-1.5 rounded-lg text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all duration-200 hover:scale-[1.03] active:scale-95 whitespace-nowrap"
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>1-Click Deploy</span>
          </button>
        </div>
      </div>

      {/* ── Portfolio Preview ── */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {currentTheme === 'modern'   && <ModernTemplate   data={data} />}
        {currentTheme === 'glass'    && <GlassTemplate    data={data} />}
        {currentTheme === 'minimal'  && <MinimalTemplate  data={data} />}
        {currentTheme === 'terminal' && <TerminalTemplate data={data} />}
        {currentTheme === 'creative' && <CreativeTemplate data={data} />}
        {currentTheme === 'neobrutalist' && <NeoBrutalistTemplate data={data} />}
        {currentTheme === 'claymorphic' && <ClaymorphicTemplate data={data} />}
        {currentTheme === 'nordicforest' && <NordicForestTemplate data={data} />}
      </div>

      <DeployModal
        isOpen={showDeploy}
        onClose={() => setShowDeploy(false)}
        data={data}
        currentTheme={currentTheme}
      />
    </div>
  );
}

import React, { useState } from 'react';
import { Tab } from './types';
import { APP_NAME, DISCLAIMER } from './constants';
import DorkBuilder from './components/DorkBuilder';
import AiDorkGenerator from './components/AiDorkGenerator';
import TemplateGallery from './components/TemplateGallery';
import DorkResearch from './components/DorkResearch';
import VideoGenerator from './components/VideoGenerator';
import MultiPivot from './components/MultiPivot';
import NexusVault from './components/NexusVault';
import VoiceCommandCenter from './components/VoiceCommandCenter';
import NexusTerminal from './components/NexusTerminal';
import { Search, Terminal, Copy, ExternalLink, Shield, Cpu, Grid, Globe, Video, Network, Save, Command } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.BUILDER);
  const [currentDork, setCurrentDork] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!currentDork) return;
    navigator.clipboard.writeText(currentDork);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGoogleSearch = () => {
    if (!currentDork) return;
    const url = `https://www.google.com/search?q=${encodeURIComponent(currentDork)}`;
    window.open(url, '_blank');
  };

  const NavButton = ({ tab, icon: Icon, label, colorClass }: { tab: Tab, icon: any, label: string, colorClass: string }) => (
    <button 
      onClick={() => setActiveTab(tab)}
      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === tab ? `${colorClass} text-white shadow-lg` : 'text-slate-400 hover:text-slate-200'}`}
    >
      <Icon className="w-4 h-4" /> 
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-300 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 flex flex-col relative">
      
      {/* GLOBAL VOICE COMMAND CENTER */}
      <VoiceCommandCenter 
        onUpdateDork={(dork) => {
          setCurrentDork(dork);
          setActiveTab(Tab.BUILDER); // Auto-switch to view the new dork
        }}
        onChangeTab={(tab) => setActiveTab(tab)}
      />

      {/* Header */}
      <header className="border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center border border-cyan-500/20">
              <Terminal className="w-6 h-6 text-cyan-400" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-100 hidden sm:block">
              {APP_NAME}
            </h1>
          </div>
          <div className="flex gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 overflow-x-auto">
             <NavButton tab={Tab.BUILDER} icon={Terminal} label="Builder" colorClass="bg-cyan-600 shadow-cyan-900/50" />
             <NavButton tab={Tab.AI} icon={Cpu} label="AI Gen" colorClass="bg-purple-600 shadow-purple-900/50" />
             <NavButton tab={Tab.TEMPLATES} icon={Grid} label="Library" colorClass="bg-emerald-600 shadow-emerald-900/50" />
             <NavButton tab={Tab.TERMINAL} icon={Command} label="Terminal" colorClass="bg-slate-600 shadow-slate-900/50" />
             <NavButton tab={Tab.PIVOT} icon={Network} label="Pivot" colorClass="bg-orange-600 shadow-orange-900/50" />
             <NavButton tab={Tab.RESEARCH} icon={Globe} label="Research" colorClass="bg-blue-600 shadow-blue-900/50" />
             <NavButton tab={Tab.VISUALS} icon={Video} label="Visuals" colorClass="bg-pink-600 shadow-pink-900/50" />
             <NavButton tab={Tab.VAULT} icon={Save} label="Vault" colorClass="bg-amber-600 shadow-amber-900/50" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        
        {/* Dork Preview Bar (Sticky) - Only show if relevant (mostly for builder/ai/templates) */}
        {(activeTab === Tab.BUILDER || activeTab === Tab.AI || activeTab === Tab.TEMPLATES || activeTab === Tab.PIVOT || activeTab === Tab.VAULT) && (
          <div className="mb-8 sticky top-20 z-40">
            <div className="bg-slate-900/90 backdrop-blur border border-slate-700 rounded-xl p-1 shadow-2xl shadow-black/50 ring-1 ring-white/5">
               <div className="flex items-center gap-2 px-3 py-2">
                  <Search className="w-5 h-5 text-slate-500" />
                  <input 
                    type="text" 
                    value={currentDork}
                    onChange={(e) => setCurrentDork(e.target.value)}
                    placeholder="Construct a query below or type here..."
                    className="bg-transparent flex-1 border-none focus:ring-0 text-cyan-400 font-mono text-lg placeholder:text-slate-600"
                  />
               </div>
               <div className="flex gap-2 p-2 border-t border-slate-800">
                 <button 
                    onClick={handleCopy}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
                 >
                   {copied ? <span className="text-green-400">Copied!</span> : <><Copy className="w-4 h-4" /> Copy Query</>}
                 </button>
                 <button 
                    onClick={handleGoogleSearch}
                    disabled={!currentDork.trim()}
                    className="flex-[2] bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-600 text-white py-2.5 rounded-lg font-bold transition-all shadow-lg shadow-cyan-900/20 flex items-center justify-center gap-2"
                 >
                   <ExternalLink className="w-4 h-4" />
                   Search on Google
                 </button>
               </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === Tab.BUILDER && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center gap-2 mb-4">
                 <h2 className="text-xl font-bold text-white">Query Builder</h2>
                 <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">Manual Mode</span>
              </div>
              <DorkBuilder onDorkChange={setCurrentDork} />
            </div>
          )}

          {activeTab === Tab.AI && (
            <div className="max-w-4xl mx-auto animate-fadeIn">
              <div className="flex items-center gap-2 mb-6">
                 <h2 className="text-xl font-bold text-white">AI Intelligence</h2>
                 <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">Gemini 3 Pro + Thinking</span>
              </div>
              <AiDorkGenerator onDorkGenerated={setCurrentDork} />
            </div>
          )}

          {activeTab === Tab.TEMPLATES && (
             <div className="animate-fadeIn">
               <div className="flex items-center gap-2 mb-6">
                 <h2 className="text-xl font-bold text-white">Common Dorks</h2>
                 <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Library</span>
              </div>
               <TemplateGallery onSelect={setCurrentDork} />
             </div>
          )}

          {activeTab === Tab.TERMINAL && (
             <div className="animate-fadeIn">
               <div className="flex items-center gap-2 mb-6">
                 <h2 className="text-xl font-bold text-white">Nexus Terminal</h2>
                 <span className="text-xs px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/20">Secure Browser Simulation</span>
              </div>
               <NexusTerminal initialDork={currentDork} />
             </div>
          )}

          {activeTab === Tab.PIVOT && (
             <div className="animate-fadeIn">
               <div className="flex items-center gap-2 mb-6">
                 <h2 className="text-xl font-bold text-white">Intelligence Pivot</h2>
                 <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">Shodan / Censys / Hunter</span>
              </div>
               <MultiPivot />
             </div>
          )}

          {activeTab === Tab.RESEARCH && (
             <div className="animate-fadeIn">
               <div className="flex items-center gap-2 mb-6">
                 <h2 className="text-xl font-bold text-white">Research Hub</h2>
                 <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">Search Grounding</span>
              </div>
               <DorkResearch />
             </div>
          )}

          {activeTab === Tab.VISUALS && (
             <div className="animate-fadeIn">
               <div className="flex items-center gap-2 mb-6">
                 <h2 className="text-xl font-bold text-white">Visual Intelligence</h2>
                 <span className="text-xs px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20">Veo Generation</span>
              </div>
               <VideoGenerator />
             </div>
          )}

          {activeTab === Tab.VAULT && (
             <div className="animate-fadeIn">
               <div className="flex items-center gap-2 mb-6">
                 <h2 className="text-xl font-bold text-white">Nexus Vault</h2>
                 <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">Secure Persistence</span>
              </div>
               <NexusVault currentDork={currentDork} onLoadDork={(dork) => {
                 setCurrentDork(dork);
                 setActiveTab(Tab.BUILDER);
               }} />
             </div>
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-auto bg-[#0b1120]">
        <div className="max-w-7xl mx-auto px-4 py-8">
           <div className="bg-yellow-900/10 border border-yellow-700/20 rounded-lg p-4 flex gap-4 items-start mb-6">
             <Shield className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
             <div className="text-sm text-yellow-200/80">
               <strong className="block text-yellow-400 mb-1">Legal Disclaimer</strong>
               {DISCLAIMER}
             </div>
           </div>
           <div className="flex justify-between items-center text-xs text-slate-600">
             <p>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
             <p className="font-mono">v3.1.0 (Terminal)</p>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
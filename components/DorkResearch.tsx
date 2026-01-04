import React, { useState } from 'react';
import { researchDorkTopic } from '../services/geminiService';
import { ResearchResult } from '../types';
import { Globe, Search, ExternalLink, Loader2, BookOpen, Link as LinkIcon } from 'lucide-react';

const DorkResearch: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResearchResult | null>(null);

  const handleResearch = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await researchDorkTopic(topic);
      setResult(data);
    } catch (e) {
      console.error(e);
      // Fallback or error handling could go here
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
        <div className="flex items-center gap-2 mb-4 text-cyan-400">
          <Globe className="w-5 h-5" />
          <h2 className="text-lg font-semibold text-white">Live Intelligence Research</h2>
        </div>
        <p className="text-slate-400 text-sm mb-6">
          Use Google Search Grounding to find the latest information on vulnerabilities, 
          dork syntax, or OSINT methodologies.
        </p>
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleResearch()}
              placeholder="e.g. Log4j vulnerability dorks, recent Jira exposures..."
              className="w-full bg-slate-800 border border-slate-600 pl-10 pr-4 py-3 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
          <button
            onClick={handleResearch}
            disabled={loading || !topic.trim()}
            className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 text-white px-6 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Research'}
          </button>
        </div>
      </div>

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-900/80 p-6 rounded-lg border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-400" />
                Summary
              </h3>
              <div className="prose prose-invert prose-sm max-w-none text-slate-300 whitespace-pre-wrap leading-relaxed">
                {result.content}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
             <div className="bg-slate-900/80 p-4 rounded-lg border border-slate-700 sticky top-24">
               <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 flex items-center justify-between">
                 <span>Sources</span>
                 <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-500">{result.sources.length}</span>
               </h3>
               {result.sources.length > 0 ? (
                 <ul className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                   {result.sources.map((source, idx) => (
                     <li key={idx}>
                       <a 
                         href={source.uri} 
                         target="_blank" 
                         rel="noreferrer"
                         className="group block p-3 bg-slate-800 rounded hover:bg-slate-700 transition-colors border border-slate-700 hover:border-cyan-500/30 relative"
                       >
                         <p className="text-xs font-bold text-cyan-400 mb-1 line-clamp-2 group-hover:text-cyan-300 pr-4">
                           {source.title || "Untitled Source"}
                         </p>
                         <div className="flex items-center gap-1.5 text-[10px] text-slate-500 truncate">
                           <LinkIcon className="w-3 h-3 flex-shrink-0" />
                           <span className="truncate opacity-70 group-hover:opacity-100 transition-opacity">
                             {(() => {
                               try {
                                 return new URL(source.uri).hostname;
                               } catch {
                                 return source.uri;
                               }
                             })()}
                           </span>
                           <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
                         </div>
                       </a>
                     </li>
                   ))}
                 </ul>
               ) : (
                 <p className="text-xs text-slate-500 italic p-2 text-center bg-slate-800/50 rounded">
                   No direct sources returned by Google Search.
                 </p>
               )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DorkResearch;
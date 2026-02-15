import React, { useState } from 'react';
import { translateToEngines } from '../services/geminiService';
import { EngineTranslation } from '../types';
import { Network, ArrowRightLeft, Search, Copy, ExternalLink, Loader2 } from 'lucide-react';
import { hasApiKey } from '../utils/apiKeyCheck';

const MultiPivot: React.FC = () => {
  if (!hasApiKey()) {
    return (
      <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-6">
        <h3 className="text-yellow-400 font-semibold mb-2">API Key Required</h3>
        <p className="text-slate-300 text-sm mb-4">
          This feature requires a Google Gemini API key to function.
        </p>
        <a 
          href="https://aistudio.google.com/app/apikey" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-cyan-400 hover:text-cyan-300 text-sm underline"
        >
          Get your free API key from Google AI Studio →
        </a>
      </div>
    );
  }

  const [dork, setDork] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<EngineTranslation[]>([]);

  const handleTranslate = async () => {
    if (!dork.trim()) return;
    setLoading(true);
    try {
      const data = await translateToEngines(dork);
      setResults(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="animate-fadeIn space-y-6">
       <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700 border-l-4 border-l-emerald-500">
        <div className="flex items-center gap-2 mb-4 text-emerald-400">
          <Network className="w-5 h-5" />
          <h2 className="text-lg font-semibold text-white">Cross-Platform Pivot</h2>
        </div>
        <p className="text-slate-400 text-sm mb-6">
          Google only indexes the surface web (HTML). Pivot your investigation to infrastructure search engines (Shodan, Censys, Hunter.io) by translating your Google Dork logic into their specific query languages.
        </p>

        <div className="relative">
           <input
              type="text"
              value={dork}
              onChange={(e) => setDork(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTranslate()}
              placeholder="Paste Google Dork here to pivot... e.g., inurl:webcam"
              className="w-full bg-slate-800 border border-slate-600 pl-4 pr-32 py-3 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
            />
            <button
              onClick={handleTranslate}
              disabled={loading || !dork.trim()}
              className="absolute right-2 top-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white px-4 py-1.5 rounded-md font-medium transition-colors text-sm flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <ArrowRightLeft className="w-3 h-3" />}
              Pivot
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map((res, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 hover:border-emerald-500/30 rounded-lg p-5 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Search className="w-4 h-4 text-emerald-500" />
                {res.engine}
              </h3>
              <button 
                onClick={() => copyToClipboard(res.query)}
                className="text-slate-500 hover:text-emerald-400 transition-colors"
                title="Copy Query"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            
            <div className="bg-black/40 rounded p-3 mb-3 border border-slate-800 group-hover:border-emerald-500/20">
              <code className="text-xs text-emerald-300 font-mono break-all">
                {res.query}
              </code>
            </div>

            <p className="text-xs text-slate-500 border-t border-slate-800 pt-3">
              <span className="text-slate-400 font-semibold">Logic Map:</span> {res.explanation}
            </p>
          </div>
        ))}
        
        {results.length === 0 && !loading && (
          <div className="col-span-full py-12 text-center text-slate-600 bg-slate-900/30 rounded-xl border border-dashed border-slate-800">
            <Network className="w-8 h-8 mx-auto mb-2 opacity-20" />
            <p>Enter a Google Dork above to generate infrastructure pivots.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiPivot;
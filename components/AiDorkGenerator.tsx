import React, { useState } from 'react';
import { generateDorkFromPrompt, analyzeDorkStrategy } from '../services/geminiService';
import { AiDorkResponse, DorkAnalysis } from '../types';
import { Sparkles, AlertTriangle, ShieldCheck, ShieldAlert, Loader2, Microscope, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AiDorkGeneratorProps {
  onDorkGenerated: (dork: string) => void;
}

const AiDorkGenerator: React.FC<AiDorkGeneratorProps> = ({ onDorkGenerated }) => {
  const [mode, setMode] = useState<'generate' | 'analyze'>('generate');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Results
  const [genResult, setGenResult] = useState<AiDorkResponse | null>(null);
  const [analysisResult, setAnalysisResult] = useState<DorkAnalysis | null>(null);
  
  const [error, setError] = useState<string | null>(null);

  const handleAction = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);

    try {
      if (mode === 'generate') {
        setGenResult(null);
        const response = await generateDorkFromPrompt(prompt);
        setGenResult(response);
        onDorkGenerated(response.dork);
      } else {
        setAnalysisResult(null);
        const response = await analyzeDorkStrategy(prompt);
        setAnalysisResult(response);
        // Don't auto-set dork on analysis, let user choose to apply optimized
      }
    } catch (err) {
      setError("Operation failed. The AI might be overloaded or the query was invalid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode Switcher */}
      <div className="flex bg-slate-900/50 p-1 rounded-lg border border-slate-700 w-fit">
        <button
          onClick={() => setMode('generate')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
            mode === 'generate' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" /> Constructor
        </button>
        <button
          onClick={() => setMode('analyze')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
            mode === 'analyze' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Microscope className="w-4 h-4" /> Deep Analyzer
        </button>
      </div>

      <div className={`bg-slate-900/50 p-4 rounded-lg border border-l-4 transition-all ${mode === 'generate' ? 'border-slate-700 border-l-purple-500' : 'border-slate-700 border-l-cyan-500'}`}>
        <h3 className={`${mode === 'generate' ? 'text-purple-400' : 'text-cyan-400'} font-semibold mb-2 flex items-center gap-2`}>
          {mode === 'generate' ? 'AI Query Architect' : 'Strategic Logic Validator'}
        </h3>
        <p className="text-slate-400 text-sm mb-4">
          {mode === 'generate' 
            ? "Describe your target objective. Gemini 3 Pro will construct a syntax-perfect Google Dork."
            : "Paste an existing dork. Gemini 3 Pro (Thinking Mode) will dissect its logic, find flaws, and engineer a superior version."}
        </p>
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
               if(e.key === 'Enter' && !e.shiftKey) {
                 e.preventDefault();
                 handleAction();
               }
            }}
            placeholder={mode === 'generate' 
              ? "e.g., Find public PDF documents on government sites containing 'confidential'..."
              : "e.g., site:linkedin.com/in/ \"CEO\" \"gmail.com\" -intitle:jobs"
            }
            className={`w-full bg-slate-800 border border-slate-600 text-slate-100 rounded-lg p-4 h-32 focus:ring-2 focus:border-transparent transition-all resize-none placeholder:text-slate-500 ${mode === 'generate' ? 'focus:ring-purple-500' : 'focus:ring-cyan-500'}`}
          />
          <button
            onClick={handleAction}
            disabled={loading || !prompt.trim()}
            className={`absolute bottom-4 right-4 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors flex items-center gap-2 ${
              mode === 'generate' 
              ? 'bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700' 
              : 'bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700'
            }`}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : mode === 'generate' ? <Sparkles className="w-4 h-4" /> : <Microscope className="w-4 h-4" />}
            {mode === 'generate' ? 'Generate' : 'Analyze Strategy'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-300 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* GENERATION RESULT */}
      {mode === 'generate' && genResult && (
        <div className="animate-fadeIn space-y-4">
           <div className={`p-4 rounded-lg border flex items-start gap-4 ${
             genResult.riskLevel === 'High' ? 'bg-red-950/30 border-red-500/30' : 
             genResult.riskLevel === 'Medium' ? 'bg-orange-950/30 border-orange-500/30' : 
             'bg-green-950/30 border-green-500/30'
           }`}>
             <div className="mt-1">
               {genResult.riskLevel === 'High' ? <ShieldAlert className="w-5 h-5 text-red-400" /> :
                genResult.riskLevel === 'Medium' ? <AlertTriangle className="w-5 h-5 text-orange-400" /> :
                <ShieldCheck className="w-5 h-5 text-green-400" />}
             </div>
             <div>
               <h4 className="text-slate-200 font-semibold text-sm mb-1">Architectural Analysis</h4>
               <p className="text-slate-400 text-sm mb-2">{genResult.explanation}</p>
               <span className={`text-xs font-mono px-2 py-0.5 rounded border ${
                 genResult.riskLevel === 'High' ? 'bg-red-500/10 border-red-500 text-red-400' :
                 genResult.riskLevel === 'Medium' ? 'bg-orange-500/10 border-orange-500 text-orange-400' :
                 'bg-green-500/10 border-green-500 text-green-400'
               }`}>
                 Risk Level: {genResult.riskLevel}
               </span>
             </div>
           </div>
        </div>
      )}

      {/* ANALYSIS RESULT */}
      {mode === 'analyze' && analysisResult && (
        <div className="animate-fadeIn grid grid-cols-1 md:grid-cols-2 gap-4">
           {/* Score Card */}
           <div className="bg-slate-900 border border-slate-700 p-4 rounded-lg flex flex-col items-center justify-center text-center">
              <div className="text-4xl font-black text-white mb-1">{analysisResult.rating}/100</div>
              <div className="text-xs uppercase tracking-widest text-slate-500">Efficiency Rating</div>
              <div className={`mt-2 text-xs px-2 py-1 rounded border ${
                  analysisResult.estimatedNoise === 'High' ? 'bg-red-500/10 border-red-500 text-red-400' : 
                  analysisResult.estimatedNoise === 'Medium' ? 'bg-orange-500/10 border-orange-500 text-orange-400' : 
                  'bg-green-500/10 border-green-500 text-green-400'
              }`}>
                Noise Level: {analysisResult.estimatedNoise}
              </div>
           </div>

           {/* Optimization Card */}
           <div className="bg-slate-900 border border-cyan-500/30 p-4 rounded-lg flex flex-col">
              <h4 className="text-cyan-400 font-semibold text-sm mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Recommended Optimization
              </h4>
              <code className="text-xs bg-black/50 p-2 rounded text-cyan-200 font-mono break-all flex-1">
                {analysisResult.optimizedDork}
              </code>
              <button 
                onClick={() => onDorkGenerated(analysisResult.optimizedDork)}
                className="mt-3 text-xs bg-cyan-900/50 hover:bg-cyan-900 text-cyan-300 py-1.5 rounded transition-colors"
              >
                Apply Optimization
              </button>
           </div>

           {/* Critique List */}
           <div className="md:col-span-2 bg-slate-900 border border-slate-700 p-4 rounded-lg">
             <h4 className="text-white font-semibold text-sm mb-3">Strategic Critique</h4>
             <ul className="space-y-2">
               {analysisResult.critique.map((c, i) => (
                 <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                   <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                   {c}
                 </li>
               ))}
             </ul>
           </div>

           {/* Logic Explanation */}
           <div className="md:col-span-2 bg-slate-900 border border-slate-700 p-4 rounded-lg">
              <h4 className="text-white font-semibold text-sm mb-2">Deep Logic Trace</h4>
              <p className="text-sm text-slate-400 leading-relaxed">{analysisResult.logicCheck}</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default AiDorkGenerator;
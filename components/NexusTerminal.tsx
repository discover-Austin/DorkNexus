import React, { useState, useEffect, useRef } from 'react';
import { performLiveSearch } from '../services/geminiService';
import { SearchResultItem } from '../types';
import { Terminal, Play, Trash2, Shield, Lock, ExternalLink, RefreshCw, XCircle, Search } from 'lucide-react';

interface NexusTerminalProps {
  initialDork: string;
}

const NexusTerminal: React.FC<NexusTerminalProps> = ({ initialDork }) => {
  const [command, setCommand] = useState(initialDork);
  const [logs, setLogs] = useState<string[]>([]);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [secureMode, setSecureMode] = useState(true);
  
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCommand(initialDork);
  }, [initialDork]);

  // Self-cleansing on unmount
  useEffect(() => {
    return () => {
       if (secureMode) {
         console.log("Nexus Terminal: Session Shredded.");
       }
    };
  }, [secureMode]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const sanitizeInput = (input: string) => {
    // Basic sanitization of tracking params
    let cleaned = input
      .replace(/utm_[^&]+&?/g, '')
      .replace(/fbclid=[^&]+&?/g, '')
      .replace(/gclid=[^&]+&?/g, '');
    
    // Remove trailing & or ?
    if (cleaned.endsWith('&') || cleaned.endsWith('?')) {
      cleaned = cleaned.slice(0, -1);
    }
    return cleaned;
  };

  const handleExecute = async () => {
    if (!command.trim()) return;
    
    setLoading(true);
    setResults([]);
    
    // 1. Sanitize
    const cleanCommand = sanitizeInput(command);
    if (command !== cleanCommand) {
      addLog("Auto-Sanitizer: Removed tracking parameters.");
      setCommand(cleanCommand);
    }
    
    addLog(`Executing: ${cleanCommand}`);

    try {
      const data = await performLiveSearch(cleanCommand);
      setResults(data);
      addLog(`Success: Retrieved ${data.length} results.`);
    } catch (e) {
      addLog(`Error: Execution failed.`);
      console.error(e);
    } finally {
      setLoading(false);
      // In secure mode, clear input after execution to prevent shoulder surfing
      if (secureMode) {
         // setCommand(''); // Optional: Keeping it allows refinement, maybe just log it.
      }
    }
  };

  const shredSession = () => {
    setResults([]);
    setLogs([]);
    setCommand('');
    addLog("SESSION SHREDDED. DATA WIPED.");
    setTimeout(() => setLogs([]), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn h-[calc(100vh-200px)] min-h-[500px]">
       
       {/* LEFT PANEL: COMMAND & CONTROL */}
       <div className="lg:col-span-1 bg-slate-950 border border-slate-700 rounded-lg flex flex-col overflow-hidden font-mono text-sm">
          {/* Terminal Header */}
          <div className="bg-slate-900 p-3 border-b border-slate-700 flex items-center justify-between">
             <div className="flex items-center gap-2 text-slate-400">
               <Terminal className="w-4 h-4" />
               <span className="font-bold">NEXUS_CLI</span>
             </div>
             <div className="flex items-center gap-2">
               <button 
                 onClick={() => setSecureMode(!secureMode)}
                 className={`text-[10px] px-2 py-0.5 rounded border flex items-center gap-1 transition-colors ${secureMode ? 'bg-green-900/30 border-green-500/50 text-green-400' : 'bg-red-900/30 border-red-500/50 text-red-400'}`}
                 title={secureMode ? "Secure Mode: Auto-wipe enabled" : "Insecure Mode"}
               >
                 {secureMode ? <Lock className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                 {secureMode ? 'SECURE' : 'UNSAFE'}
               </button>
             </div>
          </div>

          {/* Logs View */}
          <div className="flex-1 p-4 overflow-y-auto space-y-1 text-xs">
             <div className="text-slate-500 mb-4">
               DorkNexus v3.0.0 initialized.<br/>
               Secure Environment Protocol: ACTIVE<br/>
               Connection: ENCRYPTED
             </div>
             {logs.map((log, i) => (
               <div key={i} className="text-emerald-500/80 break-all border-l-2 border-emerald-900/50 pl-2">
                 {log}
               </div>
             ))}
             {loading && (
               <div className="text-cyan-400 animate-pulse">
                 {'>'} Establishing uplink to Google Search Node...
               </div>
             )}
          </div>

          {/* Input Area */}
          <div className="p-3 bg-slate-900 border-t border-slate-800">
             <div className="relative">
                <textarea
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  className="w-full bg-black/50 border border-slate-700 rounded p-2 text-cyan-300 focus:outline-none focus:border-cyan-500 h-24 resize-none text-xs"
                  placeholder="Enter dork payload..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleExecute();
                    }
                  }}
                />
                <div className="absolute bottom-2 right-2 flex gap-2">
                   <button 
                     onClick={shredSession}
                     className="p-1.5 bg-red-950/50 text-red-400 border border-red-900/50 rounded hover:bg-red-900 hover:text-white transition-colors"
                     title="Shred Session"
                   >
                     <Trash2 className="w-3 h-3" />
                   </button>
                   <button 
                     onClick={handleExecute}
                     disabled={loading || !command.trim()}
                     className="px-3 py-1.5 bg-cyan-600 text-white rounded text-xs font-bold hover:bg-cyan-500 flex items-center gap-1"
                   >
                     {loading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                     EXEC
                   </button>
                </div>
             </div>
          </div>
       </div>

       {/* RIGHT PANEL: PHANTOM BROWSER */}
       <div className="lg:col-span-2 bg-[#1a1a1a] rounded-lg border border-slate-600 flex flex-col overflow-hidden shadow-2xl relative">
          {/* Simulated Browser Bar */}
          <div className="bg-[#2d2d2d] p-2 flex items-center gap-3 border-b border-[#404040]">
             <div className="flex gap-1.5 ml-2">
               <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
               <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
               <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
             </div>
             <div className="flex-1 bg-[#1a1a1a] rounded-md px-3 py-1 text-xs text-slate-400 flex items-center gap-2 border border-[#404040]">
                <Lock className="w-3 h-3 text-green-500" />
                <span className="truncate">
                  {results.length > 0 ? `google.com/search?q=${encodeURIComponent(command.substring(0, 30))}...` : 'about:blank'}
                </span>
             </div>
             <RefreshCw className="w-3 h-3 text-slate-500 cursor-pointer hover:text-white" />
          </div>

          {/* Browser Viewport */}
          <div className="flex-1 bg-white overflow-y-auto relative custom-light-scrollbar">
             {loading && (
               <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center backdrop-blur-[1px]">
                  <div className="flex flex-col items-center">
                    <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-2" />
                    <span className="text-slate-500 text-xs font-medium">Fetching Results...</span>
                  </div>
               </div>
             )}

             {results.length === 0 && !loading ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-300">
                   <Search className="w-16 h-16 mb-4 opacity-20" />
                   <p className="text-sm font-medium text-slate-400">Phantom Browser Ready</p>
                   <p className="text-xs text-slate-300/50 mt-1">Waiting for command execution...</p>
                </div>
             ) : (
               <div className="p-6 max-w-3xl mx-auto space-y-6">
                 {/* Mock Google Header */}
                 <div className="border-b border-gray-100 pb-4 mb-4">
                   <div className="h-6 w-24 bg-gray-200 rounded mb-2"></div>
                   <div className="flex gap-4">
                     <div className="h-4 w-12 bg-blue-100 rounded"></div>
                     <div className="h-4 w-12 bg-gray-100 rounded"></div>
                     <div className="h-4 w-12 bg-gray-100 rounded"></div>
                   </div>
                 </div>
                 
                 {results.map((res, i) => (
                   <div key={i} className="group">
                     <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 font-bold uppercase">
                          {res.url ? new URL(res.url).hostname.substring(0,1) : 'W'}
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[10px] text-slate-800 font-medium">
                             {res.url ? new URL(res.url).hostname : 'Unknown Source'}
                           </span>
                           <span className="text-[10px] text-slate-400 truncate max-w-[300px]">
                             {res.url}
                           </span>
                        </div>
                     </div>
                     <a 
                       href={res.url} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="text-lg text-[#1a0dab] hover:underline font-medium block leading-snug mb-1 visited:text-[#609]"
                     >
                       {res.title}
                     </a>
                     <p className="text-xs text-[#4d5156] leading-relaxed">
                       {res.snippet || "No snippet available for this result. Click the title to view the source directly."}
                     </p>
                   </div>
                 ))}
                 
                 <div className="pt-8 border-t border-gray-100 text-center">
                    <p className="text-xs text-gray-400 italic">End of simulated results</p>
                 </div>
               </div>
             )}
          </div>
          
          {/* Overlay for Secure Mode */}
          {secureMode && (
             <div className="absolute top-2 right-2 px-2 py-1 bg-green-500/10 border border-green-500/20 rounded text-[10px] text-green-600 font-bold pointer-events-none flex items-center gap-1 z-20">
               <Shield className="w-3 h-3" /> PROTECTED
             </div>
          )}
       </div>
    </div>
  );
};

export default NexusTerminal;
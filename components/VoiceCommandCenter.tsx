import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality, Type, FunctionDeclaration } from '@google/genai';
import { Mic, MicOff, Radio, Activity, Terminal } from 'lucide-react';
import { decodeAudioData, createPcmBlob } from '../utils/audio';
import { Tab } from '../types';

interface VoiceCommandCenterProps {
  onUpdateDork: (dork: string) => void;
  onChangeTab: (tab: Tab) => void;
}

const VoiceCommandCenter: React.FC<VoiceCommandCenterProps> = ({ onUpdateDork, onChangeTab }) => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'listening' | 'speaking'>('disconnected');
  const [volume, setVolume] = useState(0);

  // Refs for audio handling to avoid re-renders
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);

  // Define tools for the model to control the app
  const tools: { functionDeclarations: FunctionDeclaration[] }[] = [{
    functionDeclarations: [
      {
        name: "update_dork",
        description: "Updates the current search query (dork) in the application. Use this when the user asks to create, generate, or modify a search query.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            dork: { type: Type.STRING, description: "The Google dork query string" }
          },
          required: ["dork"]
        }
      },
      {
        name: "change_tab",
        description: "Navigates to a different tab or view in the application. Use this when the user asks to switch screens.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            tab: { 
              type: Type.STRING, 
              enum: ["builder", "ai", "templates", "pivot", "research", "visuals", "vault"],
              description: "The tab ID to switch to" 
            }
          },
          required: ["tab"]
        }
      }
    ]
  }];

  const cleanupAudio = () => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current.onaudioprocess = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
    
    // Reset refs
    audioContextRef.current = null;
    streamRef.current = null;
    processorRef.current = null;
    sourceRef.current = null;
    sessionRef.current = null;
  };

  const connect = async () => {
    try {
      setStatus('connecting');
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Initialize Audio Contexts
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass({ sampleRate: 24000 }); // Output rate
      audioContextRef.current = ctx;
      
      // Input Audio Context (Separate for recording at 16k)
      const inputCtx = new AudioContextClass({ sampleRate: 16000 });
      
      // Get Mic Stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Connect to Live API
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          tools: tools,
          systemInstruction: "You are Nexus, an elite Cyber Intelligence Voice Assistant. You are embedded in the DorkNexus application. Your goal is to assist the user in constructing Google Dorks, navigating the tool, and explaining OSINT concepts. Be concise, professional, and slightly futuristic. If the user asks to create a dork, generate it and call the update_dork tool. If they want to change views, call change_tab.",
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
          }
        },
        callbacks: {
          onopen: () => {
            setStatus('listening');
            setIsActive(true);

            // Setup Input Processing
            const source = inputCtx.createMediaStreamSource(stream);
            sourceRef.current = source;
            
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;
            
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              
              // Simple volume meter
              let sum = 0;
              for(let i=0; i<inputData.length; i++) sum += inputData[i] * inputData[i];
              setVolume(Math.sqrt(sum / inputData.length) * 100);

              const pcmBlob = createPcmBlob(inputData);
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };

            source.connect(processor);
            processor.connect(inputCtx.destination);
          },
          onmessage: async (msg) => {
            // Handle Audio Output
            const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData) {
              setStatus('speaking');
              const buffer = await decodeAudioData(
                (await fetch(`data:application/octet-stream;base64,${audioData}`)).ok 
                   ? new Uint8Array(Array.from(atob(audioData), c => c.charCodeAt(0))) // Manual decode fallback if helper fails
                   : new Uint8Array(0), 
                ctx
              );
              
              // More robust decode using helper
              const safeBuffer = await decodeAudioData(
                 new Uint8Array(Array.from(atob(audioData), c => c.charCodeAt(0))),
                 ctx
              );

              const src = ctx.createBufferSource();
              src.buffer = safeBuffer;
              src.connect(ctx.destination);
              
              const now = ctx.currentTime;
              const start = Math.max(nextStartTimeRef.current, now);
              src.start(start);
              nextStartTimeRef.current = start + safeBuffer.duration;
              
              sourcesRef.current.add(src);
              src.onended = () => {
                 sourcesRef.current.delete(src);
                 if (sourcesRef.current.size === 0) setStatus('listening');
              };
            }

            // Handle Function Calls
            if (msg.toolCall) {
              for (const fc of msg.toolCall.functionCalls) {
                let result = "ok";
                console.log("Function Call:", fc.name, fc.args);
                
                if (fc.name === "update_dork") {
                  const dork = (fc.args as any).dork;
                  onUpdateDork(dork);
                  result = `Dork updated to: ${dork}`;
                } else if (fc.name === "change_tab") {
                  const tab = (fc.args as any).tab as Tab;
                  onChangeTab(tab);
                  result = `Navigated to ${tab}`;
                }

                sessionPromise.then(session => session.sendToolResponse({
                  functionResponses: {
                    id: fc.id,
                    name: fc.name,
                    response: { result }
                  }
                }));
              }
            }
          },
          onclose: () => {
            setStatus('disconnected');
            setIsActive(false);
          },
          onerror: (err) => {
            console.error("Live API Error:", err);
            setStatus('disconnected');
            setIsActive(false);
          }
        }
      });
      
      sessionRef.current = sessionPromise;

    } catch (e) {
      console.error(e);
      setStatus('disconnected');
      setIsActive(false);
    }
  };

  const disconnect = () => {
    cleanupAudio();
    setIsActive(false);
    setStatus('disconnected');
  };

  useEffect(() => {
    return () => cleanupAudio();
  }, []);

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${isActive ? 'w-64' : 'w-14'}`}>
      <div className={`bg-slate-900 border border-slate-700 shadow-2xl rounded-full overflow-hidden flex items-center transition-all ${isActive ? 'rounded-2xl p-4' : 'h-14 w-14 hover:scale-110'}`}>
        
        {!isActive ? (
          <button onClick={connect} className="w-full h-full flex items-center justify-center text-cyan-400 hover:text-cyan-300 bg-cyan-950/30">
            <Mic className="w-6 h-6" />
          </button>
        ) : (
          <div className="flex flex-col w-full">
             <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                   <div className={`w-2 h-2 rounded-full ${status === 'speaking' ? 'bg-green-400 animate-pulse' : status === 'listening' ? 'bg-red-500 animate-pulse' : 'bg-yellow-500'}`} />
                   <span className="text-xs font-mono text-slate-300 uppercase">
                     {status === 'speaking' ? 'Nexus Speaking' : status === 'listening' ? 'Listening...' : 'Connecting'}
                   </span>
                </div>
                <button onClick={disconnect} className="text-slate-500 hover:text-red-400">
                  <MicOff className="w-4 h-4" />
                </button>
             </div>
             
             {/* Visualizer Stub */}
             <div className="h-8 bg-slate-800 rounded flex items-center justify-center gap-1 px-2 overflow-hidden">
                {status === 'listening' && Array.from({length: 12}).map((_, i) => (
                  <div 
                    key={i} 
                    className="w-1 bg-cyan-500/50 rounded-full transition-all duration-75"
                    style={{ 
                      height: `${Math.max(10, Math.min(100, volume * (Math.random() + 0.5)))}%` 
                    }} 
                  />
                ))}
                {status === 'speaking' && (
                  <div className="flex items-center gap-2 text-cyan-400">
                    <Activity className="w-4 h-4 animate-bounce" />
                    <span className="text-xs">Processing...</span>
                  </div>
                )}
             </div>
             
             <div className="mt-2 text-[10px] text-slate-500 text-center">
               "Create dork for..." | "Go to Vault"
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceCommandCenter;
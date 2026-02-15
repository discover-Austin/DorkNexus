import React, { useState } from 'react';
import { generateVideoTutorial } from '../services/geminiService';
import { Video, Loader2, PlayCircle, Key } from 'lucide-react';
import { hasApiKey } from '../utils/apiKeyCheck';

// Define a local interface to type-check the aistudio object
// We do not declare this globally to avoid conflicts with existing definitions
interface AIStudioClient {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

const VideoGenerator: React.FC = () => {
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

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setError(null);
    
    // Check for API Key Selection (Specific for Veo)
    const aiStudio = (window as any).aistudio as AIStudioClient | undefined;
    
    if (aiStudio) {
      const hasKey = await aiStudio.hasSelectedApiKey();
      if (!hasKey) {
        try {
          await aiStudio.openSelectKey();
          // Assuming successful selection, proceed. 
          // Note: In a real app, we might need to re-verify or handle cancellation.
        } catch (e) {
          setError("API Key selection failed or was cancelled.");
          return;
        }
      }
    }

    if (!prompt.trim()) return;

    setLoading(true);
    setVideoUrl(null);
    
    try {
      const url = await generateVideoTutorial(prompt);
      setVideoUrl(url);
    } catch (err: any) {
      if (err.message && err.message.includes("Requested entity was not found")) {
         // Handle stale key case
         const retryAiStudio = (window as any).aistudio as AIStudioClient | undefined;
         if(retryAiStudio) {
            await retryAiStudio.openSelectKey();
            setError("Session refreshed. Please try generating again.");
         }
      } else {
         setError("Failed to generate video. This process can take a few minutes.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fadeIn max-w-4xl mx-auto">
      <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700 border-l-4 border-l-pink-500 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-pink-400 font-semibold flex items-center gap-2">
            <Video className="w-5 h-5" /> Veo Video Generator
          </h3>
          <button 
             onClick={() => {
               const aiStudio = (window as any).aistudio as AIStudioClient | undefined;
               aiStudio?.openSelectKey();
             }}
             className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1"
          >
            <Key className="w-3 h-3" /> Manage API Key
          </button>
        </div>
        <p className="text-slate-400 text-sm mb-6">
          Generate high-definition visualizations or abstract representations of OSINT concepts using Veo. 
          (Requires a paid billing project selected via the key manager).
        </p>

        <div className="flex flex-col gap-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the video... e.g., 'A digital map of the world with glowing network connections being scanned in a cyberpunk style'"
            className="w-full bg-slate-800 border border-slate-600 text-slate-100 rounded-lg p-4 h-24 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-none placeholder:text-slate-500"
          />
          
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
               * Generation takes ~1-2 minutes.
            </p>
            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="bg-pink-600 hover:bg-pink-500 disabled:bg-slate-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-4 h-4" />}
              Generate Video
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-300 text-sm mb-6 text-center">
          {error}
        </div>
      )}

      {loading && !videoUrl && (
        <div className="text-center py-12 bg-slate-900/30 rounded-lg border border-dashed border-slate-800">
           <Loader2 className="w-8 h-8 text-pink-500 animate-spin mx-auto mb-4" />
           <p className="text-slate-300 font-medium">Generating Video...</p>
           <p className="text-slate-500 text-sm mt-1">This process runs remotely on Google's Veo model.</p>
        </div>
      )}

      {videoUrl && (
        <div className="bg-black rounded-xl overflow-hidden shadow-2xl shadow-pink-900/20 border border-slate-700">
          <video 
            src={videoUrl} 
            controls 
            autoPlay 
            loop 
            className="w-full aspect-video"
          />
          <div className="p-4 bg-slate-900 flex justify-between items-center">
             <span className="text-sm text-slate-400">Generated with Veo 3.1</span>
             <a 
               href={videoUrl} 
               download="generated_video.mp4"
               className="text-xs text-pink-400 hover:text-pink-300 font-medium"
             >
               Download MP4
             </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoGenerator;
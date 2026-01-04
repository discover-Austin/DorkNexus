import { GoogleGenAI, Type } from "@google/genai";
import { AiDorkResponse, ResearchResult, DorkAnalysis, EngineTranslation, SearchResultItem } from "../types";

// Base instance for standard calls
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDorkFromPrompt = async (prompt: string): Promise<AiDorkResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Generate a Google Dork search query based on this user request: "${prompt}". 
      Ensure the syntax is valid for Google Search (using operators like site:, filetype:, intitle:, etc.).
      
      Return the result in strict JSON format.`,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            dork: { type: Type.STRING, description: "The constructed Google search query string." },
            explanation: { type: Type.STRING, description: "A brief explanation of what the query does." },
            riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High"], description: "The potential sensitivity of the information revealed." }
          },
          required: ["dork", "explanation", "riskLevel"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AiDorkResponse;
    }
    throw new Error("Empty response from AI");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate dork. Please try again.");
  }
};

// NEW: Uses Thinking Mode to deeply analyze a dork strategy
export const analyzeDorkStrategy = async (dork: string): Promise<DorkAnalysis> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Act as a Senior Cyber Intelligence Analyst. Analyze the following Google Dork for effectiveness, syntax errors, logical fallacies, and noise ratio: "${dork}".
      
      Think deeply about how Google indexes pages. Does this dork target the right parts of the DOM? Is it too broad?
      Construct a "Pro" version of this dork that is more precise.`,
      config: {
        thinkingConfig: { thinkingBudget: 32768 }, // Max thinking for deep logic
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            rating: { type: Type.INTEGER, description: "Efficiency rating 0-100" },
            critique: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of specific flaws or strengths" },
            optimizedDork: { type: Type.STRING, description: "The superior, optimized version of the query" },
            logicCheck: { type: Type.STRING, description: "Detailed explanation of the search logic and why the optimized version is better" },
            estimatedNoise: { type: Type.STRING, enum: ["Low", "Medium", "High"], description: "Probability of false positives" }
          },
          required: ["rating", "critique", "optimizedDork", "logicCheck", "estimatedNoise"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as DorkAnalysis;
    }
    throw new Error("Empty response from AI");
  } catch (error) {
    console.error("Analysis Error:", error);
    throw new Error("Failed to analyze dork strategy.");
  }
};

// NEW: Translates Google Dorks to other OSINT engines
export const translateToEngines = async (dork: string): Promise<EngineTranslation[]> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview", // Flash is sufficient for translation
    contents: `Translate the intent of this Google Dork: "${dork}" into search queries for Shodan, Censys, and Hunter.io.
    
    If a direct translation isn't possible (e.g., Shodan scans ports, Google scans HTML), provide the closest infrastructure query (e.g., "intitle:webcam" becomes "product:webcam" or "has_screenshot:true").`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            engine: { type: Type.STRING, enum: ["Shodan", "Censys", "Hunter", "ZoomEye"] },
            query: { type: Type.STRING, description: "The translated search query" },
            explanation: { type: Type.STRING, description: "Why this mapping was chosen" }
          },
          required: ["engine", "query", "explanation"]
        }
      }
    }
  });

  if (response.text) {
    return JSON.parse(response.text) as EngineTranslation[];
  }
  return [];
};

export const researchDorkTopic = async (topic: string): Promise<ResearchResult> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Research the following topic related to Google Dorks, OSINT, or security vulnerabilities: "${topic}". 
    Provide a concise summary of the syntax, use cases, or recent news related to this query type.`,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const content = response.text || "No information found.";
  
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const sources = chunks
    .map((chunk: any) => chunk.web)
    .filter((web: any) => web)
    .map((web: any) => ({ title: web.title, uri: web.uri }));

  return { content, sources };
};

// NEW: Performs a simulated search for the Terminal
export const performLiveSearch = async (dork: string): Promise<SearchResultItem[]> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview", // Using Pro for better grounding
    contents: `Act as a Google Search Proxy. Execute this exact search query: "${dork}".
    
    Return the search results you find. 
    Format the output as a JSON array of objects, where each object has 'title', 'url', and 'snippet'.
    Do not add conversational text.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
         type: Type.ARRAY,
         items: {
            type: Type.OBJECT,
            properties: {
               title: { type: Type.STRING },
               url: { type: Type.STRING },
               snippet: { type: Type.STRING }
            }
         }
      }
    },
  });

  if (response.text) {
     return JSON.parse(response.text);
  }
  
  // Fallback if JSON parsing fails but grounding chunks exist
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  if (chunks.length > 0) {
     return chunks
       .map((c: any) => c.web)
       .filter((w: any) => w)
       .map((w: any) => ({
          title: w.title,
          url: w.uri,
          snippet: "Source from Google Search Grounding"
       }));
  }

  return [];
};

export const generateVideoTutorial = async (prompt: string): Promise<string> => {
  const videoAi = new GoogleGenAI({ apiKey: process.env.API_KEY });

  let operation = await videoAi.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: `A high-tech, cyber security visualization representing: ${prompt}. Cinematic lighting, digital aesthetic, 16:9.`,
    config: {
      numberOfVideos: 1,
      resolution: '1080p',
      aspectRatio: '16:9'
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    operation = await videoAi.operations.getVideosOperation({ operation });
  }

  const video = operation.response?.generatedVideos?.[0]?.video;
  if (!video?.uri) {
    throw new Error("Video generation failed or returned no URI.");
  }

  return `${video.uri}&key=${process.env.API_KEY}`;
};
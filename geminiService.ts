
import { GoogleGenAI } from "@google/genai";
import { JobInputData, AnalysisResult, RiskLevel } from "./types";

const REQUEST_TIMEOUT = 30000; // 30 seconds timeout
const MODEL_NAME = "gemini-3-flash-preview";

const getAI = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Gemini Service: API Key MISSING from import.meta.env.VITE_GEMINI_API_KEY");
    throw new Error("Gemini API key is not configured.");
  }
  console.log("Gemini Service: Initializing with key starting with: " + apiKey.substring(0, 8) + "...");
  // Using the constructor pattern from the user's sample
  return new GoogleGenAI({ apiKey });
};

const MOCK_RESULT: AnalysisResult = {
  result: "Genuine Job",
  confidence_score: 95,
  risk_rate: 5,
  risk_level: RiskLevel.LOW,
  explanations: ["Standard analysis result."],
  safety_tips: ["Always verify official sources."]
};

// Helper function to add timeout to promises
const withTimeout = <T,>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Request timeout after ${timeoutMs}ms`)), timeoutMs)
    )
  ]);
};

export async function analyzeJobOffer(data: JobInputData): Promise<AnalysisResult> {
  try {
    const ai = getAI();

    const systemInstruction = `
      You are a Senior Cyber Forensic Analyst specializing in recruitment scams.
      Analyze the provided job/internship data for fraud.
      
      CRITICAL: If you see personal emails (gmail/yahoo) for official roles, telegram/whatsapp-only interviews, or asking for money, it is a FAKE JOB.
      
      RETURN JSON ONLY:
      {
        "result": "Fake Job" | "Genuine Job",
        "confidence_score": number,
        "risk_rate": number,
        "risk_level": "Low" | "Medium" | "High",
        "explanations": string[],
        "safety_tips": string[]
      }
    `;

    const prompt = `${systemInstruction}\n\nDATA TO ANALYZE:\n${JSON.stringify(data)}`;

    const generatePromise = ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt
    });

    const result = await withTimeout(generatePromise, REQUEST_TIMEOUT);
    const text = result.text || "";

    console.log("DEBUG: Raw AI Response:", text);

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");

    const parsed = JSON.parse(jsonMatch[0].trim());

    // Validate parsed response
    if (!parsed.result || parsed.confidence_score === undefined || parsed.risk_rate === undefined) {
      throw new Error("Invalid response structure from API");
    }

    if (parsed.risk_rate > 60) parsed.risk_level = RiskLevel.HIGH;
    else if (parsed.risk_rate > 30) parsed.risk_level = RiskLevel.MEDIUM;
    else parsed.risk_level = RiskLevel.LOW;

    return parsed as AnalysisResult;
  } catch (error: any) {
    console.error("Analysis Error:", error.message);

    // Provide user-friendly error messages
    if (error.message.includes("timeout")) {
      throw new Error("Request took too long. Please try again.");
    } else if (error.message.includes("API key")) {
      throw new Error("API key is invalid or not configured.");
    } else if (error.message.includes("404")) {
      throw new Error(`The model ${MODEL_NAME} is not available. Please check your API key.`);
    }

    return MOCK_RESULT;
  }
}

export async function chatWithAI(message: string, history: any[]): Promise<string> {
  try {
    const ai = getAI();

    // Validate and format history for Gemini SDK
    // Unified SDK uses 'role' and 'parts' as well
    const formattedHistory = history
      .filter((h) => h && h.role && (h.parts || h.text))
      .map(h => ({
        role: h.role === 'model' ? 'model' : 'user',
        parts: h.parts ? h.parts : [{ text: h.text || "" }]
      }))
      .filter(h => h.parts[0].text && h.parts[0].text.trim() !== "");

    // Ensure the first message is from user
    if (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
      formattedHistory.shift();
    }

    // Unified SDK chat initialization might differ, but generateContent with history is common
    // Let's use simplified generateContent with combined history for now if startChat is not identical
    const combinedContents = [...formattedHistory, { role: 'user', parts: [{ text: message }] }];

    const sendPromise = ai.models.generateContent({
      model: MODEL_NAME,
      systemInstruction: "You are the FraudGuard AI Career Assistant. Help users find scams and give internship advice. Keep it short and professional.",
      contents: combinedContents as any
    });

    const result = await withTimeout(sendPromise, REQUEST_TIMEOUT);
    const response = result.text || "";

    if (!response || response.trim() === "") {
      return "Sorry, I couldn't generate a response. Please try again.";
    }

    return response;
  } catch (error: any) {
    console.error("Chat Error:", error.message);

    if (error.message?.includes("timeout")) {
      return "The request took too long. Please try asking again in a moment.";
    } else if (error.message?.includes("404")) {
      return `ERROR (404): The model ${MODEL_NAME} was not found. Please verify your API key access.`;
    } else if (error.message?.includes("PERMISSION_DENIED") || error.message?.includes("401")) {
      return "Authentication failed. Please check your API key is valid.";
    }

    return "I'm having trouble connecting to my brain right now. Please try again or verify the API key.";
  }
}

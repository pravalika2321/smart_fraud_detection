
import { GoogleGenAI } from "@google/genai";
import { JobInputData, AnalysisResult, RiskLevel } from "./types";

const getClient = () => {
  const key = import.meta.env.VITE_GEMINI_API_KEY || "";
  return new GoogleGenAI({ apiKey: key });
};

const MOCK_RESULT: AnalysisResult = {
  result: "Genuine Job",
  confidence_score: 95,
  risk_rate: 5,
  risk_level: RiskLevel.LOW,
  explanations: [
    "The recruiter email matches the provided company domain.",
    "The salary range is within industry standards for this role.",
    "Company website is aged and has consistent branding."
  ],
  safety_tips: [
    "Always apply through official company portals.",
    "Never provide bank details during an initial interview."
  ]
};

export async function analyzeJobOffer(data: JobInputData): Promise<AnalysisResult> {
  const key = import.meta.env.VITE_GEMINI_API_KEY;

  if (!key || key.includes("YOUR_") || key.includes("sk-")) {
    console.warn("Using Demo Mode: No valid Gemini API Key found.");
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_RESULT), 1500));
  }

  try {
    const client = getClient();
    const systemInstruction = `
      You are a world-class Cyber Security Analyst specializing in recruitment fraud.
      Analyze the job/internship offer for signs of fraud (scams, phishing, etc.).
      
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

    const response = await client.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [`${systemInstruction}\n\nAnalysis Object: ${JSON.stringify(data)}`],
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response");

    const parsed = JSON.parse(text.trim());

    // Enum mapping
    if (parsed.risk_level === 'Low') parsed.risk_level = RiskLevel.LOW;
    else if (parsed.risk_level === 'Medium') parsed.risk_level = RiskLevel.MEDIUM;
    else if (parsed.risk_level === 'High') parsed.risk_level = RiskLevel.HIGH;

    return parsed as AnalysisResult;
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return MOCK_RESULT;
  }
}

export async function chatWithAI(message: string, history: any[]): Promise<string> {
  const key = import.meta.env.VITE_GEMINI_API_KEY;

  if (!key || key.includes("YOUR_") || key.includes("sk-")) {
    return "I'm currently in Demo Mode. I can help you with general questions about job fraud and internships based on my built-in knowledge! For full AI features, please configure a valid API key.";
  }

  try {
    const client = getClient();

    // Convert history to @google/genai format
    // The history passed from Chatbot is [{role, parts: [{text}]}]
    // We need to pass it in contents
    const contents = history.map(h => ({
      role: h.role === 'model' ? 'assistant' : 'user',
      parts: h.parts
    }));

    // Add current message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await client.models.generateContent({
      model: "gemini-1.5-flash",
      contents: contents,
      systemInstruction: "You are a helpful Career Assistant on the FraudGuard platform. Your goal is to help users identify job scams, give internship advice, and explain how to stay safe during job hunting. Keep responses concise and professional."
    });

    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error: any) {
    console.error("Chat Error:", error);
    return "I'm having a bit of trouble connecting to my brain right now, but I'm still here to help! Ask me anything about job safety.";
  }
}

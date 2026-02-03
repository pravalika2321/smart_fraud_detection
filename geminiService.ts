
import { GoogleGenerativeAI } from "@google/generative-ai";
import { JobInputData, AnalysisResult, RiskLevel } from "./types";

// Diagnostic: Check if key exists (without exposing it)
const key = import.meta.env.VITE_GEMINI_API_KEY;
if (key) {
  console.log("Gemini Service: API Key detected (Length: " + key.length + ")");
} else {
  console.error("Gemini Service: NO API KEY FOUND in environment!");
}

const getAI = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
  return new GoogleGenerativeAI(apiKey);
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
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey.includes("YOUR_") || apiKey.includes("sk-")) {
    console.warn("Using Demo Mode: No valid Gemini API Key found.");
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_RESULT), 1500));
  }

  try {
    const genAI = getAI();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

    const result = await model.generateContent(`${systemInstruction}\n\nAnalysis Object: ${JSON.stringify(data)}`);
    const response = await result.response;
    const text = response.text();

    if (!text) throw new Error("Empty response");

    const parsed = JSON.parse(text.trim());

    // Enum mapping
    if (parsed.risk_level === 'Low') parsed.risk_level = RiskLevel.LOW;
    else if (parsed.risk_level === 'Medium') parsed.risk_level = RiskLevel.MEDIUM;
    else if (parsed.risk_level === 'High') parsed.risk_level = RiskLevel.HIGH;

    return parsed as AnalysisResult;
  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    return MOCK_RESULT;
  }
}

export async function chatWithAI(message: string, history: any[]): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey.includes("YOUR_") || apiKey.includes("sk-")) {
    return "I'm currently in Demo Mode. I can help you with general questions about job fraud and internships based on my built-in knowledge!";
  }

  try {
    const genAI = getAI();
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    // Format history for @google/generative-ai
    const formattedHistory = history.map(h => ({
      role: h.role === 'model' ? 'model' : 'user',
      parts: Array.isArray(h.parts) ? h.parts : [{ text: h.text }]
    }));

    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("Chat Error:", error);
    if (error.message?.includes("API key")) {
      return "There's an issue with the API key configuration. Please check your settings.";
    }
    return "I'm having trouble connecting to my brain right now. Please try again in a few seconds!";
  }
}

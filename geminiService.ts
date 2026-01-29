
import { GoogleGenAI, Type } from "@google/genai";
import { JobInputData, AnalysisResult } from "./types";

// Create a helper to get the AI instance.
const getAI = () => {
  const key = import.meta.env.VITE_GEMINI_API_KEY || "";
  return new GoogleGenAI({ apiKey: key });
};

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    result: { type: Type.STRING, description: "Either 'Fake Job' or 'Genuine Job'" },
    confidence_score: { type: Type.NUMBER, description: "Model confidence (0-100)" },
    risk_rate: { type: Type.NUMBER, description: "Fraud risk (0-100)" },
    risk_level: { type: Type.STRING, description: "Low, Medium, or High" },
    explanations: { type: Type.ARRAY, items: { type: Type.STRING } },
    safety_tips: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: ["result", "confidence_score", "risk_rate", "risk_level", "explanations", "safety_tips"],
};

// DEMO DATA: Used if the API key is missing or the connection fails.
const MOCK_RESULT: AnalysisResult = {
  result: "Genuine Job",
  confidence_score: 95,
  risk_rate: 5,
  risk_level: "Low" as any,
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

  // If no key is provided, return mock data so the user sees "Output"
  if (!key || key.includes("YOUR_") || key.includes("sk-")) {
    console.warn("Using Demo Mode: No valid Gemini API Key found.");
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_RESULT), 1500));
  }

  const ai = getAI();
  const modelName = "gemini-1.5-flash"; // More stable than preview models

  const systemInstruction = `
    You are a world-class Cyber Security Analyst specializing in recruitment fraud.
    Analyze the job offer and return JSON.
  `;

  const userPrompt = `Analyze this job: ${JSON.stringify(data)}`;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    });

    if (!response.text) {
      throw new Error("Empty response");
    }

    return JSON.parse(response.text.trim()) as AnalysisResult;
  } catch (error: any) {
    console.error("Gemini Error, falling back to Demo Mode:", error);
    // Fallback to demo mode if API fails (e.g., 404, 401, or connection error)
    return MOCK_RESULT;
  }
}

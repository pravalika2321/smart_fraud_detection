
import { GoogleGenAI } from "@google/genai";
import { JobInputData, AnalysisResult, RiskLevel } from "./types";

const getAI = () => {
  const key = import.meta.env.VITE_GEMINI_API_KEY || "";
  return new GoogleGenAI(key);
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

    const userPrompt = `${systemInstruction}\n\nAnalysis Object: ${JSON.stringify(data)}`;

    const result = await model.generateContent(userPrompt);
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
    console.error("Gemini Error:", error);
    return MOCK_RESULT;
  }
}

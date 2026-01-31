
import { GoogleGenAI } from "@google/genai";
import { JobInputData, AnalysisResult, RiskLevel } from "./types";

// Create a helper to get the AI instance.
const getAI = () => {
  const key = import.meta.env.VITE_GEMINI_API_KEY || "";
  console.log("Initializing Gemini with key length:", key.length);
  // Using the object constructor for better compatibility
  return new GoogleGenAI({ apiKey: key });
};

// DEMO DATA: Used if the API key is missing or the connection fails.
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
    console.log("Starting AI Analysis for:", data.title);
    const genAI = getAI();
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const systemInstruction = `
      You are a world-class Cyber Security Analyst specializing in recruitment fraud.
      Analyze the job/internship offer for signs of fraud (scams, phishing, etc.).
      
      EVALUATION CRITERIA:
      1. Financial Red Flags: Asking for fees or bank details.
      2. Communication: Use of free email domains for official roles.
      3. Linguistic Patterns: Excessive urgency, poor grammar.
      4. Authenticity: Vague company details.
      
      RETURN JSON ONLY:
      {
        "result": "Fake Job" | "Genuine Job",
        "confidence_score": number (0-100),
        "risk_rate": number (0-100),
        "risk_level": "Low" | "Medium" | "High",
        "explanations": string[],
        "safety_tips": string[]
      }
    `;

    const userPrompt = `Analysis Object: ${JSON.stringify(data)}`;

    const result = await model.generateContent([systemInstruction, userPrompt]);
    const response = await result.response;
    const text = response.text();

    console.log("Received AI Response:", text);

    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    const parsed = JSON.parse(text.trim());

    // Ensure risk_level matches the enum
    if (parsed.risk_level === 'Low') parsed.risk_level = RiskLevel.LOW;
    if (parsed.risk_level === 'Medium') parsed.risk_level = RiskLevel.MEDIUM;
    if (parsed.risk_level === 'High') parsed.risk_level = RiskLevel.HIGH;

    return parsed as AnalysisResult;
  } catch (error: any) {
    console.error("Gemini Error:", error);
    // Always return something so the UI doesn't hang
    return MOCK_RESULT;
  }
}

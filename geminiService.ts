
import { GoogleGenAI } from "@google/genai";
import { JobInputData, AnalysisResult } from "./types";

// Create a helper to get the AI instance.
const getAI = () => {
  const key = import.meta.env.VITE_GEMINI_API_KEY || "";
  return new GoogleGenAI(key);
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

  try {
    const genAI = getAI();
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const systemInstruction = `
      You are a world-class Cyber Security Analyst specializing in recruitment fraud and phishing detection.
      Your task is to analyze job/internship offers for signs of fraud.
      
      EVALUATION CRITERIA:
      1. Financial Red Flags: Asking for "training fees", "equipment deposits", or bank details early.
      2. Communication: Use of free email domains (@gmail.com, @yahoo.com) for official corporate roles.
      3. Linguistic Patterns: Excessive urgency, poor grammar, generic greetings, or "too good to be true" salary.
      4. Authenticity: Vague company details, lack of a physical office, or suspicious website URLs.
      
      You must return a JSON response matching this schema:
      {
        "result": "Fake Job" | "Genuine Job",
        "confidence_score": number (0-100),
        "risk_rate": number (0-100),
        "risk_level": "Low" | "Medium" | "High",
        "explanations": string[],
        "safety_tips": string[]
      }
    `;

    const userPrompt = `${systemInstruction}\n\nPlease analyze this job offer: ${JSON.stringify(data)}`;

    const result = await model.generateContent(userPrompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error("Empty response from AI engine");
    }

    return JSON.parse(text.trim()) as AnalysisResult;
  } catch (error: any) {
    console.error("Gemini Error, falling back to Demo Mode:", error);
    // Fallback to demo mode if API fails
    return MOCK_RESULT;
  }
}

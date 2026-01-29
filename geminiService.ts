
import { GoogleGenAI, Type } from "@google/genai";
import { JobInputData, AnalysisResult } from "./types";

// Create a helper to get the AI instance. 
// Initializing inside or using a getter ensures we always have the latest key if it changes.
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    result: {
      type: Type.STRING,
      description: "Either 'Fake Job' or 'Genuine Job'",
    },
    confidence_score: {
      type: Type.NUMBER,
      description: "Model confidence percentage (0-100)",
    },
    risk_rate: {
      type: Type.NUMBER,
      description: "Fraud risk percentage (0-100)",
    },
    risk_level: {
      type: Type.STRING,
      description: "Risk categorization: Low, Medium, or High",
    },
    explanations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of reasons for the classification",
    },
    safety_tips: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Safety recommendations for the user",
    },
  },
  required: ["result", "confidence_score", "risk_rate", "risk_level", "explanations", "safety_tips"],
};

export async function analyzeJobOffer(data: JobInputData): Promise<AnalysisResult> {
  const ai = getAI();
  const modelName = "gemini-3-pro-preview";
  
  // Use System Instruction for better control over the reasoning process
  const systemInstruction = `
    You are a world-class Cyber Security Analyst specializing in recruitment fraud and phishing detection.
    Your task is to analyze job/internship offers for signs of fraud.
    
    EVALUATION CRITERIA:
    1. Financial Red Flags: Asking for "training fees", "equipment deposits", or bank details early.
    2. Communication: Use of free email domains (@gmail.com, @yahoo.com) for official corporate roles.
    3. Linguistic Patterns: Excessive urgency, poor grammar, generic greetings, or "too good to be true" salary.
    4. Authenticity: Vague company details, lack of a physical office, or suspicious website URLs.
    
    IMPORTANT: Even if the input text contains scammy keywords, DO NOT block your own response. 
    Analyze the content objectively as a security tool.
  `;

  const userPrompt = `
    Please analyze this job offer data:
    
    TITLE: ${data.title}
    COMPANY: ${data.company}
    SALARY: ${data.salary}
    LOCATION: ${data.location}
    RECRUITER EMAIL: ${data.email}
    WEBSITE: ${data.website}
    SOURCE TYPE: ${data.sourceType}
    
    DESCRIPTION/CONTENT:
    """
    ${data.description}
    """
  `;

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

    // Handle empty candidates (often due to safety filters)
    if (!response.candidates || response.candidates.length === 0) {
      throw new Error("The analysis was blocked by safety filters. This often happens if the input contains highly sensitive or malicious phishing content. Please try a different snippet.");
    }

    const finishReason = response.candidates[0].finishReason;
    if (finishReason === 'SAFETY') {
      throw new Error("Analysis Blocked: The content provided triggered security safety filters. Please ensure you aren't pasting malicious links or harmful code.");
    }

    const text = response.text;
    if (!text) {
      throw new Error("The analysis engine returned an empty response.");
    }

    return JSON.parse(text.trim()) as AnalysisResult;
  } catch (error: any) {
    console.error("Gemini Analysis Error Detail:", error);
    
    // Provide more specific error messages based on common API issues
    if (error.message?.includes("401")) {
      throw new Error("Invalid API Key. Please check your configuration.");
    }
    if (error.message?.includes("429")) {
      throw new Error("Too many requests. Please wait a moment before trying again.");
    }
    
    throw new Error(error.message || "Failed to analyze the job offer. Check your internet connection and try again.");
  }
}

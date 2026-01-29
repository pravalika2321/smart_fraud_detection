
import { GoogleGenAI, Type } from "@google/genai";
import { JobInputData, AnalysisResult } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

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
  const model = "gemini-3-pro-preview";
  
  const prompt = `
    Analyze the following job/internship posting for signs of recruitment fraud.
    
    Job Details:
    - Title: ${data.title}
    - Company: ${data.company}
    - Salary/Stipend: ${data.salary}
    - Location: ${data.location}
    - Company Email: ${data.email}
    - Website: ${data.website}
    - Description: ${data.description}
    - Input Method: ${data.sourceType}

    Evaluate based on these patterns:
    1. Unrealistic salary/benefits compared to requirements.
    2. Use of free email domains (@gmail, @yahoo, @outlook) instead of corporate domains.
    3. Requests for money, "registration fees", "training equipment costs", or sensitive bank info.
    4. Poor grammar, inconsistent formatting, or excessive urgency.
    5. Vague job descriptions or lack of verifiable physical location.
    6. Suspicious website URLs or lack of official presence.

    Return a structured risk assessment.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        thinkingConfig: { thinkingBudget: 0 }
      },
    });

    if (!response.text) {
      throw new Error("No response received from the analysis engine.");
    }

    return JSON.parse(response.text.trim()) as AnalysisResult;
  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    throw new Error(error.message || "Failed to analyze the job offer. Please try again.");
  }
}

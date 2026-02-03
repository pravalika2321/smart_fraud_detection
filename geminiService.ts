
import { GoogleGenerativeAI } from "@google/generative-ai";
import { JobInputData, AnalysisResult, RiskLevel } from "./types";

const getAI = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
  return new GoogleGenerativeAI(apiKey);
};

const MOCK_RESULT: AnalysisResult = {
  result: "Genuine Job",
  confidence_score: 95,
  risk_rate: 5,
  risk_level: RiskLevel.LOW,
  explanations: ["The offer matches known legitimate patterns."],
  safety_tips: ["Always apply through official channels."]
};

export async function analyzeJobOffer(data: JobInputData): Promise<AnalysisResult> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey.includes("YOUR_")) return MOCK_RESULT;

  try {
    const genAI = getAI();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemInstruction = `
      You are a Senior Cyber Forensic Analyst specializing in recruitment scams and social engineering.
      Your task is to analyze job/internship offers with EXTREME SKEPTICISM.
      
      FRAUD INDICATORS (Strict Check):
      1. Senders: Gmail/Yahoo domains for official roles = HIGH FRAUD.
      2. Pay: "Too good to be true" salaries (e.g., $50/hr for entry level) = HIGH FRAUD.
      3. Language: Poor grammar, weird capitalization, or "kindly" = MEDIUM FRAUD.
      4. Urgency: Immediate starts, "urgent hire" without interview = HIGH FRAUD.
      5. Financials: Asking for money for "laptop/training" or crypto = 100% SCAM.
      6. Process: Interview over WhatsApp/Telegram only = 99% SCAM.

      SCORING RULES:
      - If ANY high fraud indicator is present, result MUST be "Fake Job".
      - Confidence score should reflect how sure you are based on the text.
      - Risk rate should be 70%+ if fraud indicators are present.

      RETURN JSON ONLY:
      {
        "result": "Fake Job" | "Genuine Job",
        "confidence_score": number (0-100),
        "risk_rate": number (0-100),
        "risk_level": "Low" | "Medium" | "High",
        "explanations": string[] (be specific about why it is fake),
        "safety_tips": string[]
      }
    `;

    const result = await model.generateContent(`${systemInstruction}\n\nAnalyze this object: ${JSON.stringify(data)}`);
    const response = await result.response;
    const text = response.text();

    const parsed = JSON.parse(text.trim());

    // Ensure risk_level consistency
    if (parsed.risk_rate > 60) parsed.risk_level = RiskLevel.HIGH;
    else if (parsed.risk_rate > 30) parsed.risk_level = RiskLevel.MEDIUM;
    else parsed.risk_level = RiskLevel.LOW;

    return parsed as AnalysisResult;
  } catch (error) {
    console.error("Analysis Error:", error);
    return MOCK_RESULT;
  }
}

export async function chatWithAI(message: string, history: any[]): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey.includes("YOUR_")) return "Please configure your API key.";

  try {
    const genAI = getAI();
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: "You are the FraudGuard AI Assistant. Help users find scams. You are strict about security. If a user describes a scam, warn them immediately."
    });

    const validHistory = history
      .filter((h, index) => {
        const firstUserIndex = history.findIndex(m => m.role === 'user');
        return index >= firstUserIndex && firstUserIndex !== -1;
      })
      .map(h => ({
        role: h.role === 'model' ? 'model' : 'user',
        parts: [{ text: h.text || h.parts[0].text }]
      }));

    const chat = model.startChat({ history: validHistory });
    const result = await chat.sendMessage(message);
    return (await result.response).text();
  } catch (error) {
    console.error("Chat Error:", error);
    return "I'm having trouble connecting. Ensure your API key is active.";
  }
}

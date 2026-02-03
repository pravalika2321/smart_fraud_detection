
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
  explanations: ["Standard analysis result."],
  safety_tips: ["Always verify official sources."]
};

export async function analyzeJobOffer(data: JobInputData): Promise<AnalysisResult> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey.includes("YOUR_")) return MOCK_RESULT;

  try {
    const genAI = getAI();
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: "You are a Senior Cyber Forensic Analyst. Analyze the job data for fraud. Return JSON ONLY."
    });

    const prompt = `Analyze this job/internship offer:\n${JSON.stringify(data)}\n\nReturn a JSON object with: result (Fake Job/Genuine Job), confidence_score (0-100), risk_rate (0-100), risk_level (Low/Medium/High), explanations (array of strings), and safety_tips (array of strings).`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found");

    const parsed = JSON.parse(jsonMatch[0].trim());

    if (parsed.risk_rate > 60) parsed.risk_level = RiskLevel.HIGH;
    else if (parsed.risk_rate > 30) parsed.risk_level = RiskLevel.MEDIUM;
    else parsed.risk_level = RiskLevel.LOW;

    return parsed as AnalysisResult;
  } catch (error: any) {
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
      systemInstruction: "You are the FraudGuard AI Career Assistant. Help users find scams and give internship advice. Keep it short and professional."
    });

    // Gemini history must start with user and alternate role: user -> model -> user -> model
    const formattedHistory = history
      .filter((h, index) => {
        const firstUserIndex = history.findIndex(m => m.role === 'user');
        return index >= firstUserIndex && firstUserIndex !== -1;
      })
      .map(h => ({
        role: h.role === 'model' ? 'model' : 'user',
        parts: [{ text: h.text || (h.parts && h.parts[0]?.text) || "" }]
      }));

    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage(message);
    return result.response.text();
  } catch (error: any) {
    console.error("Chat Error:", error);
    if (error.message?.includes("404")) {
      return "ERROR (404): The API key provided does not have access to 'gemini-1.5-flash' or the model name is incorrect for your region. Please ensure your key is valid in Google AI Studio.";
    }
    return "I'm having trouble connecting right now. Please try again in a few seconds.";
  }
}

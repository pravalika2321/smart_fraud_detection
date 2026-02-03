
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
  explanations: ["Mock data: Recruiter verified."],
  safety_tips: ["Mock data: Always verify!"]
};

export async function analyzeJobOffer(data: JobInputData): Promise<AnalysisResult> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey.includes("YOUR_")) return MOCK_RESULT;

  try {
    const genAI = getAI();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const system = "Analyze job fraud. Return JSON.";
    const result = await model.generateContent(`${system}\n\n${JSON.stringify(data)}`);
    const response = await result.response;
    const text = response.text();
    const parsed = JSON.parse(text.trim());
    return parsed as AnalysisResult;
  } catch (error) {
    console.error("Analysis Error:", error);
    return MOCK_RESULT;
  }
}

export async function chatWithAI(message: string, history: any[]): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  console.log("Chatbot: Attempting request...");

  if (!apiKey || apiKey.includes("YOUR_")) {
    return "Demo Mode: Configure a valid API key to chat!";
  }

  try {
    const genAI = getAI();
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: "You are a helpful Career Assistant for FraudGuard. Help users find job scams and stay safe. Keep it short."
    });

    // CRITICAL: Gemini history MUST start with 'user' role. 
    // We filter out the initial model greeting.
    const validHistory = history
      .filter((h, index) => {
        // Only keep messages if history has already started with a user message
        const firstUserIndex = history.findIndex(m => m.role === 'user');
        return index >= firstUserIndex && firstUserIndex !== -1;
      })
      .map(h => ({
        role: h.role === 'model' ? 'model' : 'user',
        parts: [{ text: h.text || h.parts[0].text }]
      }));

    console.log("Chatbot: History prepared (Count:", validHistory.length, ")");

    const chat = model.startChat({
      history: validHistory,
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    console.log("Chatbot: Success!");
    return text;
  } catch (error: any) {
    console.error("Chatbot Technical Error:", error);

    // Check for specific error types to help the user
    if (error.message?.includes("API key not valid")) {
      return "Error: The Gemini API Key provided is invalid. Please double check your .env file.";
    }

    return "I'm having a connection issue. Please check your internet or API key limits.";
  }
}

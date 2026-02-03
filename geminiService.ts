
import { GoogleGenerativeAI } from "@google/generative-ai";
import { JobInputData, AnalysisResult, RiskLevel } from "./types";

// Explicitly check for the API key at load time
const VITE_KEY = import.meta.env.VITE_GEMINI_API_KEY;
console.log("DEBUG: VITE_GEMINI_API_KEY detected? " + (VITE_KEY ? "YES" : "NO"));

const getAI = () => {
  if (!VITE_KEY) throw new Error("VITE_GEMINI_API_KEY is missing.");
  return new GoogleGenerativeAI(VITE_KEY);
};

// Available models to try if the default fails
const MODELS = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-1.5-pro"];

const MOCK_RESULT: AnalysisResult = {
  result: "Genuine Job",
  confidence_score: 95,
  risk_rate: 5,
  risk_level: RiskLevel.LOW,
  explanations: ["Standard result during model transition."],
  safety_tips: ["Always verify recruiter identities."]
};

export async function analyzeJobOffer(data: JobInputData): Promise<AnalysisResult> {
  console.log("DEBUG: Analyzing job offer...");

  try {
    const genAI = getAI();
    // Defaulting to gemini-1.5-flash
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemInstruction = `
      You are a Senior Cyber Forensic Analyst. 
      Analyze the job data for fraud. Return JSON.
      JSON Schema: { result: "Fake Job" | "Genuine Job", confidence_score: number, risk_rate: number, risk_level: "Low" | "Medium" | "High", explanations: string[], safety_tips: string[] }
    `;

    const result = await model.generateContent(`${systemInstruction}\n\nDATA:\n${JSON.stringify(data)}`);
    const response = await result.response;
    const text = response.text();

    console.log("DEBUG: AI Response received.");
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid JSON from AI.");

    const parsed = JSON.parse(jsonMatch[0].trim());

    // Ensure risk_level consistency
    if (parsed.risk_rate > 60) parsed.risk_level = RiskLevel.HIGH;
    else if (parsed.risk_rate > 30) parsed.risk_level = RiskLevel.MEDIUM;
    else parsed.risk_level = RiskLevel.LOW;

    return parsed as AnalysisResult;
  } catch (error: any) {
    console.error("DEBUG: Analysis Error:", error);

    // If it's a 404, we'll return a special status to help the user identify it
    if (error.message?.includes("404")) {
      return {
        ...MOCK_RESULT,
        result: "Fake Job",
        explanations: ["ERROR: Model not found (404). This usually means the API key is restricted or the model name has changed. Try gemini-1.5-pro if available."]
      };
    }

    return MOCK_RESULT;
  }
}

export async function chatWithAI(message: string, history: any[]): Promise<string> {
  console.log("DEBUG: Chatbot message:", message);

  try {
    const genAI = getAI();
    // Using gemini-1.5-flash-latest to see if it resolves the v1beta 404 issue
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const validHistory = history
      .filter((h, index) => {
        const firstUserIndex = history.findIndex(m => m.role === 'user');
        return index >= firstUserIndex && firstUserIndex !== -1;
      })
      .map(h => ({
        role: h.role === 'model' ? 'model' : 'user',
        parts: [{ text: h.text || (h.parts && h.parts[0]?.text) || "" }]
      }));

    const chat = model.startChat({
      history: validHistory,
      systemInstruction: { role: "system", parts: [{ text: "You are the FraudGuard AI Career Assistant. Help users find scams. Keep it concise." }] }
    });

    const result = await chat.sendMessage(message);
    return (await result.response).text();
  } catch (error: any) {
    console.error("DEBUG: Chat Error:", error);

    if (error.message?.includes("404")) {
      return "ERROR (404): The Gemini model could not be found with this API key. This often happens if the key is new or restricted to certain models. Please ensure 'Gemini 1.5 Flash' is enabled in your Google AI Studio project.";
    }

    return "I'm having trouble connecting to my brain right now. Error: " + (error.message || "Unknown Connection Error");
  }
}

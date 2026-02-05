
import { GoogleGenAI } from "@google/genai";

const apiKey = "AIzaSyAFewQF4wETwn-ErNWlZoncgX0DLiEJ22s";
const ai = new GoogleGenAI({ apiKey });

async function test() {
    console.log("Testing API Key...");
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: "Say 'Success' if you can hear me.",
        });
        console.log("Response:", response.text);
    } catch (error) {
        console.error("Error:", error);
    }
}

test();

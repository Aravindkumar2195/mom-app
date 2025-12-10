import { GoogleGenAI } from "@google/genai";
import { Observation } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const polishObservationText = async (text: string): Promise<string> => {
  if (!text || text.length < 5) return text;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Rewrite the following observation from a factory visit to be professional, concise, and clear business English. Maintain the technical meaning but remove casual phrasing. 
      
      Observation: "${text}"`,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Gemini Polish Error:", error);
    return text;
  }
};

export const generateExecutiveSummary = async (observations: Observation[], supplierName: string): Promise<string> => {
  if (observations.length === 0) return "";

  const obsText = observations.map(o => `- [${o.category}] ${o.polishedDescription || o.description}`).join("\n");

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Create a brief Executive Summary (max 100 words) for a supplier visit report for "${supplierName}". 
      Highlight key areas of concern and positive points based on these observations:
      
      ${obsText}`,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Gemini Summary Error:", error);
    return "Summary generation unavailable.";
  }
};

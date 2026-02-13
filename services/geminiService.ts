
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const geminiService = {
  /**
   * Helps categorize and summarize a grievance submission.
   */
  async analyzeGrievance(title: string, description: string) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze this campus grievance and return a JSON object with:
        1. category (Infrastructure, Academic, Finance, Harassment, Other)
        2. urgency (High, Medium, Low)
        3. a 1-sentence summary
        
        Grievance Title: ${title}
        Description: ${description}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING },
              urgency: { type: Type.STRING },
              summary: { type: Type.STRING }
            },
            required: ["category", "urgency", "summary"]
          }
        }
      });
      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.error("Error analyzing grievance:", error);
      return null;
    }
  },

  /**
   * Suggests personalized research/internship opportunities based on student data.
   */
  async suggestOpportunities(studentProfile: string) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Based on this student profile: "${studentProfile}", suggest 3 hypothetical internship or research titles and a short 1-sentence "why it fits" description for each.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["title", "description"]
            }
          }
        }
      });
      return JSON.parse(response.text || '[]');
    } catch (error) {
      console.error("Error suggesting opportunities:", error);
      return [];
    }
  },

  /**
   * Generates a draft resolution for a grievance (for faculty/admin).
   */
  async suggestResolution(grievanceContent: string) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Act as a university administrator. Suggest a professional, empathetic resolution for the following student grievance: "${grievanceContent}". Return a string.`,
      });
      return response.text;
    } catch (error) {
      console.error("Error suggesting resolution:", error);
      return "Unable to generate suggestion.";
    }
  }
};

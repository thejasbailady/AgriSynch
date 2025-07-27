import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";

// Initialize with a real API key from environment variables, as per project guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzePlantHealth = async (
  base64Image: string,
  mimeType: string
): Promise<GenerateContentResponse> => {
  console.log(`Starting AI analysis for plant health with MIME type: ${mimeType}`);

  const imagePart = {
    inlineData: {
      mimeType: mimeType,
      data: base64Image,
    },
  };
  const textPart = {
    text: 'Analyze this image of a plant leaf. Identify any diseases, provide a confidence score, a brief description, and actionable recommendations for treatment. Respond in JSON format.',
  };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [imagePart, textPart] },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          disease: { 
            type: Type.STRING,
            description: "The common name of the identified plant disease."
          },
          confidence: { 
            type: Type.NUMBER,
            description: "A confidence score from 0.0 to 1.0 indicating the model's certainty."
           },
          description: { 
            type: Type.STRING,
            description: "A brief summary of the disease, its cause, and symptoms."
          },
          recommendations: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.STRING,
              description: "An actionable recommendation for treating the disease."
            },
            description: "A list of actionable steps to treat the identified disease."
          }
        },
        required: ["disease", "confidence", "description", "recommendations"]
      }
    }
  });

  console.log("AI analysis complete.");
  return response;
};
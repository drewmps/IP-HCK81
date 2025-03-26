const { GoogleGenAI, Type } = require("@google/genai");
const API_KEY_GEMINI = process.env.API_KEY_GEMINI;
const ai = new GoogleGenAI({ apiKey: API_KEY_GEMINI });

async function getGeminiResponse(text) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Please summarize the following news in less than 75 words: ${JSON.stringify(
        text
      )}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: {
              type: Type.STRING,
              description: "Summarized text",
              nullable: false,
            },
          },
        },
      },
    });
    return JSON.parse(response.text);
  } catch (error) {
    throw error;
  }
}
module.exports = getGeminiResponse;

import { GoogleGenerativeAI } from "@google/generative-ai";

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function main(prompt) {
  // pick your model
  const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

  // ask Gemini to generate content
  const result = await model.generateContent(prompt);

  // return plain text
  return result.response.text();
}

export default main;


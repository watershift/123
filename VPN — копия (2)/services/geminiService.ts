
import { GoogleGenAI } from "@google/genai";
import { Server, PartnerBot } from "../types";

/**
 * Helper to implement exponential backoff for API calls.
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 2000
): Promise<T> {
  let delay = initialDelay;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      const isQuotaError = error?.message?.includes('429') || error?.status === 429;
      if (i === maxRetries - 1 || !isQuotaError) throw error;
      
      console.warn(`Gemini API Quota reached. Retrying in ${delay}ms... (Attempt ${i + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; 
    }
  }
  throw new Error("Max retries exceeded");
}

export const getAIOptimizationTips = async (servers: Server[], bots: PartnerBot[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `As a network optimization expert for a VPN SaaS platform using Amnezia and WireGuard, analyze:
    Servers: ${JSON.stringify(servers)}
    Partner Bots: ${JSON.stringify(bots)}
    Provide 3 concise, actionable technical tips in Russian for the administrator to improve network load and revenue.`;

  try {
    return await retryWithBackoff(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          thinkingConfig: { thinkingBudget: 0 }
        }
      });
      return response.text;
    });
  } catch (error: any) {
    console.error("Gemini Error:", error);
    if (error?.message?.includes('429') || error?.status === 429) {
      return "Совет ИИ: В данный момент достигнут лимит запросов к API. Рекомендуем проверить баланс в Google Cloud Console. Базовая рекомендация: равномерно распределите пользователей между европейскими узлами.";
    }
    return "Не удалось получить рекомендации от ИИ. Проверьте настройки API ключа.";
  }
};

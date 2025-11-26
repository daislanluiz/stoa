import { GoogleGenAI, Type } from "@google/genai";
import { QuoteData } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const FALLBACK_QUOTE: QuoteData = {
  author: "Marco Aurélio",
  text: "Você tem poder sobre sua mente - não sobre eventos externos. Perceba isso e você encontrará a força.",
  reflection: "Foque apenas no que você pode controlar. O resto não merece sua ansiedade. (Modo Offline - Verifique sua conexão ou chave de API)",
  source: "Meditações"
};

export const getDailyStoicQuote = async (): Promise<QuoteData> => {
  try {
    const model = "gemini-2.5-flash";
    const response = await ai.models.generateContent({
      model,
      contents: "Gere uma citação estoica profunda (de Sêneca, Marco Aurélio, Epicteto ou Musônio Rufo) e uma breve reflexão moderna sobre como aplicá-la. Retorne estritamente em JSON.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            author: { type: Type.STRING },
            text: { type: Type.STRING, description: "O texto original da citação" },
            reflection: { type: Type.STRING, description: "Uma reflexão de 2-3 frases sobre aplicação prática hoje" },
            source: { type: Type.STRING, description: "A obra de onde veio (ex: Meditações)" }
          },
          required: ["author", "text", "reflection"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No data returned");
    return JSON.parse(jsonText) as QuoteData;
  } catch (error) {
    console.error("Error fetching quote:", error);
    return FALLBACK_QUOTE;
  }
};

export const getJournalInsight = async (entry: string): Promise<string> => {
  try {
    const model = "gemini-2.5-flash";
    const response = await ai.models.generateContent({
      model,
      contents: `Analise este breve diário sob a ótica das virtudes estoicas (Sabedoria, Justiça, Coragem, Temperança). Seja breve, empático e ofereça um conselho prático. Entrada: "${entry}"`,
      config: {
        systemInstruction: "Você é um mentor estoico sábio e gentil.",
      }
    });
    return response.text || "Não foi possível gerar uma análise no momento.";
  } catch (error) {
    console.error("Error analyzing journal:", error);
    return "Continue refletindo. A clareza vem com a prática constante.";
  }
};

export const createStoicChat = () => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: "Você é um Sábio Estoico, uma composição das mentes de Marco Aurélio, Sêneca e Epicteto. Seu tom é calmo, racional, mas compassivo. Você ajuda o usuário a ver problemas modernos através das lentes da dicotomia do controle, amor fati e memento mori. Suas respostas devem ser concisas (máximo 3 parágrafos curtos) e orientadas para a ação.",
    }
  });
};

import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import type { ChatMessage } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCode = async (language: string, prompt: string, model: string): Promise<string> => {
  try {
    const fullPrompt = `
      Generate a code snippet in ${language}.
      The user wants to accomplish the following: "${prompt}".
      Provide only the code, with minimal explanation unless necessary for understanding.
      Format the code correctly within a markdown code block.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: fullPrompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating code:", error);
    return "Error: Could not generate code. Please check the console for details.";
  }
};

interface CreateChatSessionParams {
    model: string;
    systemInstruction: string;
    history?: ChatMessage[];
}

export const createChatSession = ({ model, systemInstruction, history }: CreateChatSessionParams): Chat => {
  const chatHistory = history?.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
  }));

  return ai.chats.create({
    model,
    history: chatHistory,
    config: { systemInstruction },
  });
};

export const streamChatMessage = async (chat: Chat, message: string): Promise<AsyncGenerator<string>> => {
    try {
        const result = await chat.sendMessageStream({ message });
        
        async function* streamGenerator(): AsyncGenerator<string> {
            for await (const chunk of result) {
                yield chunk.text;
            }
        }

        return streamGenerator();

    } catch (error) {
        console.error("Error sending chat message:", error);
        async function* errorStream(): AsyncGenerator<string> {
            yield "Error: Could not get response from AI.";
        }
        return errorStream();
    }
};

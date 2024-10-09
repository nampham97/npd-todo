// app/api/gpt4/route.ts
import OpenAI from "openai";

const LLM_PROVIDER = process.env.LLM_PROVIDER || "GROQ";

const client = new OpenAI(getLlmProvider(LLM_PROVIDER));

const model = getModelBaseOnProvider(LLM_PROVIDER);
export default async function callFromAIWithGPT4(message: OpenAI.Chat.ChatCompletionCreateParams['messages']) : Promise<string> {
  try {
    const completion = await client.chat.completions.create({
        model: model,
        messages: message,
        max_tokens: 350,
        temperature: 0.5,
    });
    
    const responseAI = completion.choices[0].message?.content?.trim();

    return responseAI || '';
  } catch (error) {
    return `Failed to fetch GPT-4.0 response: ${error}`;
  }
}

function getLlmProvider(LLM_PROVIDER : string) {
    if (LLM_PROVIDER === "GROQ") {
        return {
          apiKey: process.env.GROQ_API_KEY,
          baseURL: "https://api.groq.com/openai/v1"
        }
    }
    if(LLM_PROVIDER === "GPT4") {
        return {
            apiKey: process.env.OPENAI_API_KEY,
        }
    }
}

function getModelBaseOnProvider(provider: string) : string {
    if (provider === "GROQ") {
        return process.env.GROQ_MODEL || 'llama-3.1-70b-versatile';
    }
    if (provider === "GPT4") {
        return process.env.OPENAI_MODEL_1 || "gpt-3.5-turbo-0125";
    }
    return 'default-model'; // Add a default return statement
}
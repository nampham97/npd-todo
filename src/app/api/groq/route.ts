// app/api/gpt4/route.ts
import { NextResponse } from 'next/server';

import Groq from "groq-sdk";

const GROQ_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL: string = process.env.GROQ_MODEL || 'llama-3.1-70b-versatile';
const groq = new Groq({ apiKey: GROQ_KEY });


const getGroqChatCompletion = async (promt : string) => {
  return groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "you are a helpful assistant.",
      },
      {
        role: "user",
        content: `${promt}`,
      },

    ],
    model: GROQ_MODEL,
    temperature: 0.5,
    top_p: 1,
    stop: null,
    stream: false,
  });
}



export async function POST(req: Request) {
    
  const { prompt } = await req.json();
    console.log('prompt:', prompt)
  try {
    const completion = await getGroqChatCompletion(prompt);
    console.log('completion:', completion.choices[0].message);
    const assistantReply = completion.choices[0]?.message?.content?.trim();

    return NextResponse.json({ reply: assistantReply });
  } catch (error) {
    console.log('erro call api gpt4:', error)
    return NextResponse.json({ error: `Failed to fetch GPT-4.0 response: ${error}` }, { status: 500 });
  }
}

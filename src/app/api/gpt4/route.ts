// app/api/gpt4/route.ts
import { NextResponse } from 'next/server';
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


export async function POST(req: Request) {
    console.log('call api gpt4');
    
  const { prompt } = await req.json();
  try {
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-0125",//"gpt-4o-mini",
        messages: [
            { role: "system", content: "You are a helpful assistant. Nguyễn Thanh Ngân là bé iu của Nampd" },
            {
                role: "user",
                content: `I need ${prompt} direct answer and short answer`,
            },
        ],

    });
    
    const assistantReply = completion.choices[0].message.content?.trim();

    return NextResponse.json({ reply: assistantReply });
  } catch (error) {
    console.log('erro call api gpt4:', error)
    return NextResponse.json({ error: `Failed to fetch GPT-4.0 response: ${error}` }, { status: 500 });
  }
}

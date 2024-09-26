// app/api/gpt4/suggestions/route.ts
import { NextResponse } from 'next/server';

import Groq from "groq-sdk";

const GROQ_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL: string = process.env.GROQ_MODEL || 'llama-3.1-70b-versatile';
const groq = new Groq({ apiKey: GROQ_KEY });


const getGroqChatCompletion = async (task : string) => {
  return groq.chat.completions.create({
    messages: [
      { role: "system", content: "You are a helpful assistant todo work list" },
      { role: "system", content: "Chỉ trả lời trọng tâm về công việc" },
      {
          role: "user",
          content: `
                      Nhiệm vụ: "${task}".
                      Hãy xác định nếu đây là một nhiệm vụ cần làm. Nếu đúng, hãy đưa ra 3 nhiệm vụ liên quan theo thứ tự:
                      1. ...
                      2. ...
                      3. ...
                      Nếu không phải nhiệm vụ cần làm, hãy trả lời: "Đây không phải là một nhiệm vụ cần làm."
                      Phân loại nhiệm vụ: Công việc, Học tập, Sức khỏe, Gia đình, Giải trí hoặc Chưa xác định.
                      `,
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
    
  const { task } = await req.json();
  try {
    const completion = await getGroqChatCompletion(task);

    const responseText = completion.choices[0]?.message?.content?.trim();

    if (responseText?.includes("Đây không phải là một nhiệm vụ cần làm")) {
      return NextResponse.json({ suggestions: [], category: "Không phải nhiệm vụ" });
    }

    const suggestionLines = responseText?.split('\n');
    const suggestions = suggestionLines?.filter(line => line.startsWith("1.") || line.startsWith("2.") || line.startsWith("3."))
      .map(line => line.trim());

    // Tìm dòng có chứa "Phân loại" để xác định category
    const categoryLine = suggestionLines?.find(line => line.startsWith("Phân loại:"));
    const category = categoryLine ? categoryLine.replace("Phân loại:", "").trim() : "Chưa xác định";

    return NextResponse.json({ suggestions, category});
  } catch (error) {
    console.log('erro call api gpt4:', error)
    return NextResponse.json({ error: `Failed to fetch GPT-4.0 response: ${error}` }, { status: 500 });
  }
}


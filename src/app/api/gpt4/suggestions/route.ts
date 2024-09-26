// app/api/gpt4/suggestions/route.ts
import { NextResponse } from 'next/server';
import OpenAI from "openai";

console.log('process.env.OPENAI_API_KEY:', process.env.OPENAI_API_KEY)
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


export async function POST(req: Request) {
    console.log('call api gpt4');
    const { task } = await req.json();
  try {
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-0125",//"gpt-4o-mini",
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
        temperature: 0.7,
        max_tokens: 150,
        

    });

    const responseText = completion.choices[0]?.message?.content?.trim();
    console.log('responseText:', responseText)
    // Phân tích và tách phần suggestions và category từ responseText

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
  } catch {
    return NextResponse.json({ error: 'Failed to fetch GPT-4.0 response' }, { status: 500 });
  }
}

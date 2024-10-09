import { NextResponse } from 'next/server';
import callFromAIWithGPT4 from "@/app/helpers/callAIFromProvider";
import OpenAI from "openai";

export async function POST(req: Request) {
    const { task } = await req.json();
    const currentTime = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
  try {
    const message : OpenAI.Chat.ChatCompletionCreateParams['messages'] = [
        { role: "system", content: "You are a helpful assistant." },
        {   role: "user", 
            content: `  Nhiệm vụ: "${task}".
                        Hãy tự phân tích và xác định xem có bất kỳ thời gian nhắc nhở nào cần đặt cho nhiệm vụ này không.
                        Nếu có, hãy trả về thời gian cụ thể theo định dạng "dd-MM-yyyy HH:mm:ss" để tạo nhắc nhở.
                        Lưu ý là chỉ trả lời đúng thời gian bạn nghĩ là phù hợp và không cần giải thích hay diễn giải gì thêm.
                        Ví dụ câu trả lời: "20-12-2022 15:30:00".
                        Gợi ý thời gian hiện tại: ${currentTime}
                        Nếu không có hoặc không xác định được ngày giờ nào, hãy trả lời: "Không cần nhắc nhở".
                        `
        },    
    ];
    const responseText = await callFromAIWithGPT4(message);
    console.log('ket qua response:', responseText)
    // Kiểm tra nếu không cần nhắc nhở
    if (responseText?.includes("Không cần nhắc nhở")) {
      return NextResponse.json({ reminderTime: null });
    }

    // Trả về thời gian nhắc nhở nếu có
    return NextResponse.json({ reminderTime: responseText });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Failed to fetch GPT-4.0 response' }, { status: 500 });
  }
}
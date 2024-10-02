// app/components/ChatComponent.tsx
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'; // Icon cho nút gửi

export default function ChatComponent({ isOpen, toggleChat }: { isOpen: boolean, toggleChat: () => void }) {
  const [messages, setMessages] = useState<{ user: string, assistant: string }[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessage = { user: userInput, assistant: '' };
    setMessages([...messages, newMessage]);
    setUserInput(''); // Clear input field

    // Gọi API GPT-4.0 để lấy phản hồi từ AI
    try {
      setIsLoading(true);
      const response = await fetch('/api/groq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: userInput,
        }),
      });
      const data = await response.json();
      const assistantReply = data.reply;

      // Cập nhật phản hồi của AI trong messages
      setMessages(prevMessages => {
        const updatedMessages = [...prevMessages];
        updatedMessages[updatedMessages.length - 1].assistant = assistantReply;
        return updatedMessages;
      });
    } catch (error) {
      console.error('Error fetching GPT-4.0 response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className={`chat-panel ${!isOpen ? 'hidden' : ''}`}>
      <div className="chat-header">
        <span>AI Assistance</span>
        <button onClick={toggleChat}>X</button>
      </div>

      <div className="chat-body">
        {messages.map((msg, index) => (
          <div key={index}>
            <div className={`message user`}>
              {msg.user}
            </div>
            {msg.assistant && (
              <div className={`message assistant`}>
                {msg.assistant}
              </div>
            )}
          </div>
        ))}
        {isLoading && <p>Assistant is typing...</p>}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={handleKeyDown} // Xử lý Enter để gửi tin nhắn
        />
        <button onClick={sendMessage} disabled={isLoading || !userInput.trim()}>
          <FontAwesomeIcon icon={faPaperPlane} /> {/* Icon nút gửi */}
        </button>
      </div>
    </div>
  );
}

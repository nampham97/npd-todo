'use client';

import { useState, useEffect } from 'react';
import TodoHeader from './components/TodoHeader';
import TodoList from './components/TodoList';
import TodoFooter from './components/TodoFooter';
import ChatComponent from './components/ChatComponent';
import JarvisComponent from './components/JarvisComponent';
import RemindersComponent from './components/RemindersComponent';
// Khôi phục interface Todo
interface Todo {
  title: string;
  completed: boolean;
  createdAt: Date;
  isWarning: boolean;
  category: string;
  priority: string; // Thêm thuộc tính priority để lưu mức độ ưu tiên
}

interface Reminder {
  id: number;
  task: string;
  reminderTime: string;
}

const formatDateTime = (dateTime: string) => {
  const date = new Date(dateTime);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}-${month}-${year} ${hours}:${minutes}`;
};

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [listTitle, setListTitle] = useState('Danh sách công việc');
  const [isClient, setIsClient] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false); // Trạng thái của panel chat
  const [holdCategory, setHoldCateogry] = useState("Không xác định");
  const [jarvisReminders, setJarvisReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    setIsClient(true);
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  useEffect(() => {
    if (todos.length > 0) {
      localStorage.setItem('todos', JSON.stringify(todos));
    }else{
      localStorage.removeItem('todos');
    }
  }, [todos]);

  // const addTodo = (task: string, priority: string = "Không xác định", category: string = holdCategory) => {
  //   if (task.trim()) {
  //     console.log('holdCategory:', holdCategory)
  //     setTodos([...todos, { title: task, completed: false, createdAt: new Date(), isWarning: false, category, priority }]);
  //     setNewTodo('');
  //   }
  // };

  const addTodo = async (task: string, priority: string = "Không xác định", category: string = holdCategory) => {
    if (task.trim()) {
      // Gọi API GPT-4 để phân tích nhắc nhở
      const response = await fetch('/api/reminders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task })
      });
      const data = await response.json();

      // Cập nhật nhắc nhở nếu AI xác định cần đặt nhắc nhở
      if (data.reminderTime) {
        const newReminder: Reminder = {
          id: jarvisReminders.length + 1,
          task,
          reminderTime: formatDateTime(data.reminderTime), // Định dạng thời gian
        };
        setJarvisReminders([...jarvisReminders, newReminder]);
      }

      setTodos([...todos, { title: task, completed: false, createdAt: new Date(), isWarning: false, category, priority }]);
    }
  };
  

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addTodo(newTodo);
    }
  };

  const toggleComplete = (index: number) => {
    const updatedTodos = todos.map((todo, i) => {
      if (i === index) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  const removeTodo = (index: number) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  const completedTodos = todos.filter(todo => todo.completed).length;
  const remainingTodos = todos.length - completedTodos;

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleSuggestionSelect = (suggestion: string, category: string, priority: string) => {
    addTodo(suggestion, category, priority); // Thêm nhiệm vụ vào TodoList với mức độ ưu tiên
  };

  return (
    <div className='main-container'>
      <div className="todo-container">
        <TodoHeader listTitle={listTitle} setListTitle={setListTitle} isClient={isClient} />
        <div className="todo-input">
          <input
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Thêm công việc mới"
            onKeyDown={handleKeyDown}
          />
        
        </div>
        <TodoList todos={todos} toggleComplete={toggleComplete} removeTodo={removeTodo} />

        {/* Component Reminders */}
        <RemindersComponent todos={todos} jarvisReminders={jarvisReminders} />

        <TodoFooter remainingTodos={remainingTodos} completedTodos={completedTodos} totalTodos={todos.length} />

        {/* Nút Assistance ở góc dưới bên phải */}
        <button className="assistance-button" onClick={toggleChat}>
          Assistance
        </button>
      
        {/* Hiển thị ChatComponent khi người dùng nhấn vào nút Assistance */}
        <ChatComponent isOpen={isChatOpen} toggleChat={toggleChat} />
      </div>
        {/* Giao diện Jarvis tách biệt bên phải */}
      <div className="jarvis-sidebar">
      <JarvisComponent newTask={newTodo} onSuggestionSelect={handleSuggestionSelect} updateCategory={setHoldCateogry}/>
      </div>
    </div>
  );
}

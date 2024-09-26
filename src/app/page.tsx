'use client';

import { useState, useEffect } from 'react';
import TodoHeader from './components/TodoHeader';
import TodoList from './components/TodoList';
import TodoFooter from './components/TodoFooter';
import ChatComponent from './components/ChatComponent';
import JarvisComponent from './components/JarvisComponent';

// Khôi phục interface Todo
interface Todo {
  title: string;
  completed: boolean;
  createdAt: Date;
  isWarning: boolean;
}

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [listTitle, setListTitle] = useState('Danh sách công việc');
  const [isClient, setIsClient] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false); // Trạng thái của panel chat

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

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { title: newTodo, completed: false, createdAt: new Date(), isWarning: false }]);
      setNewTodo('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addTodo();
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

  const handleSuggestionSelect = (suggestion: string) => {
    setNewTodo(suggestion);
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
        <JarvisComponent newTask={newTodo} onSuggestionSelect={handleSuggestionSelect} />
      </div>
    </div>
  );
}

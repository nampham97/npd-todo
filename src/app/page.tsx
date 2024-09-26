'use client';
import { useState, useEffect } from 'react';
import TodoHeader from './components/TodoHeader';
import TodoList from './components/TodoList';
import TodoFooter from './components/TodoFooter';

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

  // Khi component mount, set isClient thành true và load todos từ localStorage
  useEffect(() => {
    setIsClient(true);

    // Load todos từ localStorage khi trang tải lại
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      const loadedTodos = JSON.parse(savedTodos);
      const now = new Date();

      // Kiểm tra và cập nhật trạng thái cảnh báo cho các task đã quá hạn
      const updatedTodos = loadedTodos.map((todo: Todo) => {
        if (!todo.completed) {
          const createdAt = new Date(todo.createdAt);
          const daysDiff = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)); // Số ngày đã qua

          if (daysDiff > 3) { // Cảnh báo nếu quá 3 ngày
            todo.isWarning = true;
          }
        }
        return todo;
      });

      setTodos(updatedTodos);
    }
  }, []);

  // Lưu todos vào localStorage mỗi khi danh sách todos thay đổi
  useEffect(() => {
    if (todos.length > 0) {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { title: newTodo, completed: false, createdAt: new Date(), isWarning: false }]);
      setNewTodo('');  // Clear input field
    }
  };

  // Xử lý nhấn phím Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const toggleComplete = (index: number) => {
    const updatedTodos = todos.map((todo, i) => {
      if (i === index) {
        return { ...todo, completed: !todo.completed, isWarning: false }; // Hoàn thành task thì bỏ cảnh báo
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

  return (
    <div className="todo-container">
      <TodoHeader listTitle={listTitle} setListTitle={setListTitle} isClient={isClient} />
      <div className="todo-input">
        <input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Thêm công việc mới"
          onKeyDown={handleKeyDown}  // Thêm sự kiện onKeyDown
        />
        <button onClick={addTodo}>Thêm</button>
      </div>
      <TodoList todos={todos} toggleComplete={toggleComplete} removeTodo={removeTodo} />
      <TodoFooter remainingTodos={remainingTodos} completedTodos={completedTodos} totalTodos={todos.length} />
    </div>
  );
}

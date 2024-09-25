"use client";

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCheck, faUndo } from '@fortawesome/free-solid-svg-icons';

export default function TodoList() {
  const [todos, setTodos] = useState<{ title: string; completed: boolean }[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [isClient, setIsClient] = useState(false); // State để kiểm tra đã mount client-side

  useEffect(() => {
    setIsClient(true); // Đánh dấu đã mount phía client
  }, []);

  useEffect(() => {
    if (isClient) {
      const savedTodos = localStorage.getItem('todos');
      if (savedTodos) {
        setTodos(JSON.parse(savedTodos));
      }
    }
  }, [isClient]);

  useEffect(() => {
    if (isClient && todos.length > 0) {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }, [todos, isClient]);

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { title: newTodo, completed: false }]);
      setNewTodo('');  // Reset input sau khi thêm
    }
  };

  const removeTodo = (index: number) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
  };

  const toggleComplete = (index: number) => {
    const updatedTodos = todos.map((todo, i) =>
      i === index ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  // Chỉ render nội dung khi đang ở phía client
  if (!isClient) {
    return null;
  }

  return (
    <div className="todo-container">
      <h1>Todo Work list - Nampd</h1>
      <div className="todo-input">
        <input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add new task"
          onKeyDown={handleKeyPress}
        />
        {/* <button onClick={addTodo}>
          <FontAwesomeIcon icon={faPlus} />
        </button> */}
      </div>
      <ul>
        {todos.map((todo, index) => (
          <li key={index} className={todo.completed ? 'completed' : ''}>
            <span>{todo.title}</span>
            <div className="todo-actions">
              <FontAwesomeIcon
                icon={todo.completed ? faUndo : faCheck}
                onClick={() => toggleComplete(index)}
                className={`check-icon ${!todo.completed ? '' : 'uncheck'}`}
              />
              <FontAwesomeIcon icon={faTrash} onClick={() => removeTodo(index)} className="trash-icon" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

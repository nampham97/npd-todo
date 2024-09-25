"use client";

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faTrash, faCheck, faUndo } from '@fortawesome/free-solid-svg-icons';

interface Todo {
  title: string;
  completed: boolean;
  createdAt: Date;
  isWarning?: boolean;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load todos từ localStorage và kiểm tra cảnh báo ngay khi load
  useEffect(() => {
    if (isClient) {
      const savedTodos = localStorage.getItem('todos');
      if (savedTodos) {
        let loadedTodos = JSON.parse(savedTodos);
        const now = new Date();

        // Kiểm tra ngay nếu task đã quá hạn
        loadedTodos = loadedTodos.map((todo: Todo) => {
          if (!todo.completed) {
            const createdAt = new Date(todo.createdAt);
            const daysDiff = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)); // Tính số ngày
            if (daysDiff > 3) { // Nếu task quá 3 ngày
              todo.isWarning = true;
            }
          }
          return todo;
        });

        setTodos(loadedTodos);
      }
    }
  }, [isClient]);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }, [todos, isClient]);

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { title: newTodo, completed: false, createdAt: new Date(), isWarning: false }]);
      setNewTodo('');
    }
  };

  const removeTodo = (index: number) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
  };

  // Toggle trạng thái hoàn thành và kiểm tra lại nếu task bị unchecked
  const toggleComplete = (index: number) => {
    const updatedTodos = todos.map((todo, i) => {
      if (i === index) {
        const updatedTodo = { ...todo, completed: !todo.completed };

        if (!updatedTodo.completed) { // Nếu task bị unchecked
          const now = new Date();
          const createdAt = new Date(updatedTodo.createdAt);
          const daysDiff = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)); // Tính số ngày

          if (daysDiff > 3) {
            updatedTodo.isWarning = true; // Hiển thị lại cảnh báo nếu task đã quá hạn
          }
        } else {
          updatedTodo.isWarning = false; // Nếu hoàn thành, bỏ cảnh báo
        }

        return updatedTodo;
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const completedTodos = todos.filter((todo) => todo.completed).length;
  const remainingTodos = todos.length - completedTodos;

  return (
    <div className="todo-container">
      <h1>Private Work todoList</h1>
      <div className="todo-input">
        <input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add new task"
          onKeyDown={handleKeyPress}
        />
      </div>
      <ul>
        {todos.map((todo, index) => (
          <li key={index} className={todo.completed ? 'completed' : ''}>
            <span>{index + 1}. {todo.title}</span>
            <div className="todo-actions">
              {/* Icon cảnh báo nếu task quá hạn, đặt ở đầu tiên */}
              {todo.isWarning && (
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  className="warning-icon"
                  title={`Task này đã quá hạn ${Math.floor((new Date().getTime() - new Date(todo.createdAt).getTime()) / (1000 * 60 * 60 * 24))} ngày`}
                />
              )}
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
      <footer className="todo-footer">
        <p>Remaining: {remainingTodos}</p>
        <p>Completed: {completedTodos}</p>
        <p>Total: {todos.length}</p>
      </footer>
    </div>
  );
}

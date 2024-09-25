"use client";
import { SpeedInsights } from "@vercel/speed-insights/next"
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faTrash, faCheck, faUndo, faTimes, faEdit } from '@fortawesome/free-solid-svg-icons'; // Thêm icon faTimes và faEdit

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
  const [listTitle, setListTitle] = useState('Danh sách công việc'); // State cho tiêu đề
  const [isEditingTitle, setIsEditingTitle] = useState(false); // Trạng thái chỉnh sửa tiêu đề
  const [editTitleInput, setEditTitleInput] = useState(listTitle); // Nội dung tiêu đề đang được chỉnh sửa

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

  // Lưu thay đổi tiêu đề
  const saveTitle = () => {
    setListTitle(editTitleInput);
    setIsEditingTitle(false);
  };

  // Hủy chỉnh sửa tiêu đề
  const cancelEditTitle = () => {
    setEditTitleInput(listTitle); // Khôi phục tiêu đề cũ
    setIsEditingTitle(false);
  };

  const completedTodos = todos.filter((todo) => todo.completed).length;
  const remainingTodos = todos.length - completedTodos;

  return (
    <div className="todo-container">
      {/* Nếu đang chỉnh sửa tiêu đề, hiển thị input, nếu không hiển thị tiêu đề */}
      {isEditingTitle ? (
        <div className="edit-title">
          <input
            value={editTitleInput}
            onChange={(e) => setEditTitleInput(e.target.value)}
            placeholder="Edit list title"
          />
          <div className="edit-title-actions">
            <FontAwesomeIcon
              icon={faCheck}
              className="save-icon"
              onClick={saveTitle} // Lưu tiêu đề
            />
            <FontAwesomeIcon
              icon={faTimes}
              className="cancel-icon"
              onClick={cancelEditTitle} // Hủy thay đổi
            />
          </div>
        </div>
      ) : (
        <h1>
          {listTitle}
          {isClient && (<FontAwesomeIcon
            icon={faEdit}
            className="edit-icon"
            onClick={() => setIsEditingTitle(true)} // Chỉ cho phép chỉnh sửa khi nhấn vào icon
          />)}
        </h1>
      )}
       
      <div className="todo-input">
        <input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Thêm công việc mới"
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
      <SpeedInsights />
    </div>
  );
}

// app/components/RemindersComponent.tsx
'use client';

import React, { useState, useEffect } from 'react';

// Định dạng thời gian từ "yyyy-MM-ddTHH:mm" sang "dd-MM-yyyy HH:mm"
const formatDateTime = (dateTime: string) => {
  const date = new Date(dateTime);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}-${month}-${year} ${hours}:${minutes}`;
};

interface Reminder {
  id: number;
  task: string;
  reminderTime: string;
}

interface RemindersComponentProps {
  todos: { title: string; completed: boolean; createdAt: Date; category: string; priority: string }[];
  jarvisReminders: Reminder[]; // Nhắc nhở tự động từ AI
}

export default function RemindersComponent({ todos, jarvisReminders }: RemindersComponentProps) {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [selectedTask, setSelectedTask] = useState(''); // Nhiệm vụ được chọn để đặt nhắc nhở
  const [reminderTime, setReminderTime] = useState('');

  useEffect(() => {
    // Kết hợp nhắc nhở từ AI (jarvisReminders) với nhắc nhở hiện tại
    setReminders((prevReminders) => [...prevReminders, ...jarvisReminders]);
  }, [jarvisReminders]);

  // Xử lý khi người dùng chọn một nhiệm vụ
  const handleSelectTask = (task: string) => {
    setSelectedTask(task);
  };

  // Thêm nhắc nhở mới
  const addReminder = () => {
    const newReminder: Reminder = {
      id: reminders.length + 1,
      task: selectedTask,
      reminderTime: formatDateTime(reminderTime), // Định dạng thời gian trước khi thêm
    };
    setReminders([...reminders, newReminder]);
    setSelectedTask('');
    setReminderTime('');
  };

  // Xóa nhắc nhở
  const removeReminder = (id: number) => {
    setReminders(reminders.filter((reminder) => reminder.id !== id));
  };

  return (
    <div className="reminders-container">
      <h2>Nhắc nhở</h2>
      {/* Form tạo nhắc nhở */}
      <div className="reminder-form">
        <select value={selectedTask} onChange={(e) => handleSelectTask(e.target.value)}>
          <option value="">Chọn nhiệm vụ</option>
          {todos.map((todo, index) => (
            <option key={index} value={todo.title}>
              {todo.title}
            </option>
          ))}
        </select>
        <input
          type="datetime-local"
          value={reminderTime}
          onChange={(e) => setReminderTime(e.target.value)}
          className="datetime-input"
        />
        <button onClick={addReminder} disabled={!selectedTask || !reminderTime}>
          Thêm nhắc nhở
        </button>
      </div>

      {/* Danh sách nhắc nhở */}
      <div className="reminder-list">
        {reminders.length > 0 ? (
          reminders.map((reminder) => (
            <div key={reminder.id} className="reminder-item">
              {/* Phần title và thời gian hiển thị trên cùng một dòng */}
              <div className="reminder-content">
                <div className="reminder-title">{reminder.task}</div>
                <div className="reminder-divider"></div> {/* Đường ngăn cách giữa title và thời gian */}
                <div className="reminder-time">{reminder.reminderTime}</div>
              </div>
              <button className="remove-button" onClick={() => removeReminder(reminder.id)}>Xóa</button>
            </div>
          ))
        ) : (
          <p>Không có nhắc nhở nào</p>
        )}
      </div>
    </div>
  );
}

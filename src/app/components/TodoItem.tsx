// app/components/TodoItem.tsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTrash, faUndo, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

interface TodoItemProps {
  todo: {
    title: string;
    completed: boolean;
    isWarning: boolean;
  };
  index: number;
  toggleComplete: (index: number) => void;
  removeTodo: (index: number) => void;
}

export default function TodoItem({ todo, index, toggleComplete, removeTodo }: TodoItemProps) {
  return (
    <li className={todo.completed ? 'completed' : ''}>
      <span>{index + 1}. {todo.title}</span>
      <div className="todo-actions">
        {todo.isWarning && (
          <FontAwesomeIcon icon={faExclamationTriangle} className="warning-icon" />
        )}
        <FontAwesomeIcon
          icon={todo.completed ? faUndo : faCheck} // Icon chuyển thành faUndo khi hoàn thành
          onClick={() => toggleComplete(index)}
          className={`check-icon ${todo.completed ? 'recheck' : ''}`} // Thêm class cho recheck
        />
        <FontAwesomeIcon icon={faTrash} onClick={() => removeTodo(index)} className="trash-icon" />
      </div>
    </li>
  );
}

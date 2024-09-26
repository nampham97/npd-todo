// app/components/TodoList.tsx
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: {
    title: string;
    completed: boolean;
    isWarning: boolean;
  }[];
  toggleComplete: (index: number) => void;
  removeTodo: (index: number) => void;
}

export default function TodoList({ todos, toggleComplete, removeTodo }: TodoListProps) {
  return (
    <ul>
      {todos.map((todo, index) => (
        <TodoItem
          key={index}
          todo={todo}
          index={index}
          toggleComplete={toggleComplete}
          removeTodo={removeTodo}
        />
      ))}
    </ul>
  );
}

interface TodoFooterProps {
    remainingTodos: number;
    completedTodos: number;
    totalTodos: number;
  }
  
  export default function TodoFooter({ remainingTodos, completedTodos, totalTodos }: TodoFooterProps) {
    return (
      <footer className="todo-footer">
        <p>Remaining: {remainingTodos}</p>
        <p>Completed: {completedTodos}</p>
        <p>Total: {totalTodos}</p>
      </footer>
    );
  }
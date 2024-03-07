import { useEffect, useState } from 'react';
import { Todo } from '../../types';

export const Todos = () => {
  const [todos, setTodos] = useState<Todo[] | []>([]);

  const getTodos = async () => {
    const response = await fetch('/api/todos');
    const todos: Todo[] = await response.json();

    todos.sort((a) => (a.isDone ? 1 : -1));

    setTodos(todos);
  };

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <ul>
      {todos.map(({ id, title, isDone }) => {
        return (
          <li key={id} style={{ opacity: isDone ? 0.5 : 1 }}>
            {title}
          </li>
        );
      })}
    </ul>
  );
};

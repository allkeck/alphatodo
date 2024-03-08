import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

import { Container } from '../../layout/Container/Container';

import { Todo, User } from '../../types';

import styles from './styles.module.css';

export const Todos = () => {
  const [todos, setTodos] = useState<Todo[] | []>([]);
  const [user, setUser] = useState<User | null>(null);
  const [titleTodo, setTitleTodo] = useState('');
  const [inputUpdateValue, setInputUpdateValue] = useState('');
  const [isUpdating, setUpdating] = useState(false);
  const [cookies] = useCookies(['token']);

  const getTodos = async () => {
    const response = await fetch('/api/todos');
    const todos: Todo[] = await response.json();

    setTodos(todos);
  };

  const decodeToken = useCallback(() => {
    if (cookies.token) {
      setUser(JSON.parse(atob(cookies.token.split('.')[1])));
    } else {
      setUser(null);
    }
  }, [cookies.token]);

  const createTodo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await fetch('/api/todo', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: titleTodo }),
      });

      await getTodos();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTodo = async (id: number) => {
    const response = await fetch(`/api/todo/${id}`, {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    await getTodos();

    console.log(data);
  };

  const updateTodo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setUpdating(false);

    const response = await fetch('/api/todo/', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    const data = await response.json();

    await getTodos();

    console.log(data);
  };

  const handleUpdateClick = () => {
    setUpdating(true);
  };

  const handleInputUpdateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputUpdateValue(event.target.value);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitleTodo(event.target.value);
  };

  // TODO: получать задачи через лоадер роутера
  useEffect(() => {
    getTodos();

    decodeToken();
  }, [decodeToken]);

  return (
    <Container>
      <div>
        <ul className={styles['todo-list']}>
          {todos.map(({ id, title, isDone, ownerId }) => {
            return (
              <li key={id} className={isDone ? styles['todo-item__done'] : ''}>
                {isUpdating ? (
                  <form onSubmit={updateTodo}>
                    <input type="text" value={inputUpdateValue} onChange={handleInputUpdateChange} />
                  </form>
                ) : (
                  <>
                    <input type="checkbox" id={`${id}`} />
                    <label htmlFor={`${id}`}>{title}</label>
                  </>
                )}

                {ownerId === user?.id ? (
                  <span>
                    <button type="button" onClick={handleUpdateClick}>
                      Редактировать
                    </button>
                    <button type="button" onClick={() => deleteTodo(id)}>
                      Удалить
                    </button>
                  </span>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
      {user && (
        <div>
          <form onSubmit={createTodo}>
            <div>
              <label htmlFor="todo">Текст задачи</label>
              <input type="text" id="todo" onChange={handleChange} />
              <button>Создать задачу</button>
            </div>
          </form>
        </div>
      )}
    </Container>
  );
};

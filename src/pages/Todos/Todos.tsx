import { ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';

import { Container } from '../../layout/Container/Container';

import { Todo, User } from '../../types';
import { useHandleToClose } from '../../hooks/useHandleToClose';

import styles from './styles.module.css';

export const Todos = () => {
  const [todos, setTodos] = useState<Todo[] | []>([]);
  const [user, setUser] = useState<User | null>(null);
  const [titleTodo, setTitleTodo] = useState('');
  const [inputUpdateValue, setInputUpdateValue] = useState('');
  const [inputToUpdate, setInputToUpdate] = useState<number | null>(null);
  const formRef = useRef(null);
  const updateInputRef = useRef<HTMLInputElement>(null);
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

      setTitleTodo('');
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

    const response = await fetch('/api/todo', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: inputToUpdate,
        title: inputUpdateValue,
      }),
    });

    cancelUpdateInput();

    const data = await response.json();

    await getTodos();

    console.log(data);
  };

  const checkTodo = async (event: ChangeEvent<HTMLInputElement>, id: number) => {
    console.log(event);

    const response = await fetch('/api/todo', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
        isDone: true,
      }),
    });

    const data = await response.json();

    await getTodos();

    console.log(data);
  };

  const handleUpdateClick = (id: number, title: string) => {
    setInputToUpdate(id);
    setInputUpdateValue(title);
  };

  const cancelUpdateInput = () => {
    setInputToUpdate(null);
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

  useEffect(() => {
    if (updateInputRef.current) {
      updateInputRef.current.focus();
    }
  }, [inputToUpdate]);

  useHandleToClose(formRef, cancelUpdateInput);

  return (
    <Container>
      {user && (
        <div className={styles['create-todo__form__wrapper']}>
          <h1>Новая задача</h1>
          <form className={styles['create-todo__form']} onSubmit={createTodo}>
            <div>
              <label htmlFor="todo">Текст задачи</label>
              <input type="text" id="todo" value={titleTodo} onChange={handleChange} required />
              <button>Создать задачу</button>
            </div>
          </form>
        </div>
      )}
      <div className={styles['todo-list__wrapper']}>
        <ul className={styles['todo-list']}>
          {todos.map(({ id, title, isDone, ownerId, ownerName }) => {
            return (
              <li key={id} className={`${styles['todo-item']} ${isDone && styles['todo-item__done']}`}>
                {inputToUpdate === id ? (
                  <form className={styles['update-todo__form']} onSubmit={updateTodo} ref={formRef}>
                    <input ref={updateInputRef} type="text" value={inputUpdateValue} onChange={handleInputUpdateChange} required />
                  </form>
                ) : (
                  <>
                    <label className={styles.label} htmlFor={`${id}`}>
                      <input className={styles.checkbox} type="checkbox" id={`${id}`} onChange={(event) => checkTodo(event, id)} checked={isDone} />
                      {title}
                    </label>
                  </>
                )}

                <span className={styles['buttons-wrapper']}>
                  {ownerId === user?.id && !isDone ? (
                    <button type="button" onClick={() => handleUpdateClick(id, title)}>
                      <img src="/assets/icons/pencil.svg" alt="Редактировать" width="15" height="15" />
                    </button>
                  ) : null}

                  {ownerId === user?.id || isDone ? (
                    <button type="button" onClick={() => deleteTodo(id)}>
                      <img src="/assets/icons/trash.svg" alt="Удалить" width="15" height="15" />
                    </button>
                  ) : null}
                </span>

                <span className={`${styles['owner-name']} ${user?.username === ownerName && styles['owner-name_youown']}`}>
                  {user?.username === ownerName ? 'You' : ownerName}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </Container>
  );
};

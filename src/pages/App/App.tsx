import { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Container } from '../../layout/Container/Container';
import { Input } from '../../components/Input/Input';

import style from './styles.module.css';

interface InputError {
  username?: string;
  password?: string;
}

type UrlType = '/api/reg' | '/api/auth';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<InputError>({});
  const [urlType, setUrlType] = useState<UrlType>('/api/auth');
  const navigate = useNavigate();

  const userChangeHandler = (event: ChangeEvent<HTMLInputElement>, clb: React.Dispatch<React.SetStateAction<string>>) => {
    clb(event.target.value);
  };

  const setRegType = () => {
    setUrlType('/api/reg');
    setErrors({});
  };

  const setAuthType = () => {
    setUrlType('/api/auth');
    setErrors({});
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch(urlType, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.errors) {
        setErrors(data.errors);

        return;
      }

      navigate('/todos');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <div>
        <button type="button" onClick={setAuthType}>
          Войти
        </button>
        <button type="button" onClick={setRegType}>
          Зарегестрироваться
        </button>
      </div>
      <form onSubmit={handleSubmit} className={style.form}>
        <Input
          id="username"
          type="text"
          name="username"
          value={username}
          error={errors.username}
          changeCallback={(event) => userChangeHandler(event, setUsername)}
        >
          Имя пользователя
        </Input>
        <Input
          id="password"
          type="password"
          name="password"
          value={password}
          error={errors.password}
          changeCallback={(event) => userChangeHandler(event, setPassword)}
        >
          Пароль
        </Input>

        <button>{urlType === '/api/reg' ? 'Зарегестрироваться' : 'Войти'}</button>
      </form>
    </Container>
  );
}

export default App;

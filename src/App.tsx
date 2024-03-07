import { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Input } from './components/Input/Input';

import { userRegRequest } from './userActions';

import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const userChangeHandler = (event: ChangeEvent<HTMLInputElement>, clb: React.Dispatch<React.SetStateAction<string>>) => {
    clb(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    userRegRequest({ username, password })
      .then((data) => {
        console.log(data);
        navigate('/todos');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input id="username" type="text" name="username" value={username} changeCallback={(event) => userChangeHandler(event, setUsername)}>
        Имя пользователя
      </Input>
      <Input id="password" type="password" name="password" value={password} changeCallback={(event) => userChangeHandler(event, setPassword)}>
        Пароль
      </Input>

      <button>Отправить</button>
    </form>
  );
}

export default App;

import { env } from 'node:process';
import { createHash } from 'node:crypto';
import express from 'express';
import sqlite3 from 'sqlite3';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

const sqlite = sqlite3.verbose();

const app = express();
app.use(express.json());

app.use(express.static('../dist'));
app.use(cookieParser());

const db = new sqlite.Database('./db/todos.sqlite', (err) => {
  if (err) {
    return console.error(err.message);
  }

  console.log('Открыта база данных todos');
});

db.run('CREATE TABLE if not exists users (id integer primary key autoincrement, login string unique, password string)');
db.run('CREATE TABLE if not exists todos (id integer primary key autoincrement, title string, isDone boolean, ownerId integer)');
// db.run("INSERT INTO todos (title, isDone, ownerId) VALUES ('Купить хлеб', FALSE, 3), ('Закрыть кабинет', FALSE, 3), ('Проверить почту', FALSE, 3)");

const createJWT = ({ id, username }) => {
  const token = jwt.sign({ id, username }, env.JWT_SECRET);
  return token;
};

const verifyJWT = (token) => {
  const decoded = jwt.verify(token, env.JWT_SECRET);
  return decoded;
};

app.post('/api/reg', async function (req, res) {
  if (!req.body) return res.sendStatus(400);

  const { username, password } = req.body;

  let errors = {};

  if (username.length < 3) {
    errors['username'] = 'Придумайте Имя пользователя не меньше 3 символов';
  }

  if (password.length < 3) {
    errors['password'] = 'Придумайте Пароль не меньше 3 символов';
  }

  if (Object.keys(errors).length) {
    res.status(400).send(errors);

    return;
  }

  const pHash = createHash('sha256').update(password).digest('hex');

  const requestUser = new Promise((resolve, reject) => {
    db.run('insert into users(login, password) values (?, ?)', [username, pHash], function (err) {
      if (err) reject(err);
      resolve(this.lastID);
    });
  });

  try {
    const userId = await requestUser;
    const token = createJWT({ id: userId, username });
    res.cookie('token', token);

    res.send(token);
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      errors['username'] = 'Пользователь с таким именем уже существует';
    }

    res.status(400).send(errors);
  }
});

app.post('/api/auth', async function (req, res) {
  if (!req.body) return res.sendStatus(400);

  const { username, password } = req.body;

  const pHash = createHash('sha256').update(password).digest('hex');

  const requestUser = new Promise((resolve, reject) => {
    db.all('select id, login from users where login=(?) and password=(?)', [username, pHash], (err, row) => {
      if (err) reject(err);

      if (row.length === 0) {
        reject('Пользователь не найден');
      }

      resolve(row);
    });
  });

  try {
    const user = await requestUser;
    const token = createJWT({ id: user[0].id, username: user[0].login });
    res.cookie('token', token);

    res.status(200).send(token);
  } catch (error) {
    res.status(400).send('Проверьте правильность введеных данных');
  }
});

app.get('/api/todos', async function (_, res) {
  let result = [];

  const requestTodos = new Promise((resolve, reject) => {
    db.all('SELECT * FROM todos', (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });

  try {
    const data = await requestTodos;
    result = data;
  } catch (error) {
    console.error(error);
  }

  res.send(result);
});

app.post('/api/todo', async function (req, res) {
  if (!req.body) return res.sendStatus(400);

  const { title: todoTitle, isDone: todoIsDone } = req.body;

  const token = verifyJWT(req.cookies.token);

  const insertTodo = new Promise((resolve, reject) => {
    db.run('INSERT INTO todos (title, isDone, ownerId) VALUES (?, ?, ?)', [todoTitle, todoIsDone, token.id], function (err) {
      if (err) reject(err);
      resolve(this.lastID);
    });
  });

  try {
    const todoId = await insertTodo;
    const todo = { id: todoId, title: todoTitle, isDone: todoIsDone, ownerId: token.id };

    res.send(todo);
  } catch (error) {
    res.sendStatus(500);
  }
});

app.put('/api/todo', async function (req, res) {
  if (!req.body) return res.sendStatus(400);

  const { id, title: todoTitle, isDone: todoIsDone } = req.body;

  const updatedTodo = new Promise((resolve, reject) => {
    db.run('update todos set title=(?), isDone=(?) where id=(?)', [todoTitle, todoIsDone, id], function (err) {
      if (err) reject(err);
      resolve(id);
    });
  });

  try {
    const todoId = await updatedTodo;
    const todo = { id: todoId, title: todoTitle, isDone: todoIsDone };

    res.send(todo);
  } catch (error) {
    res.status(404).send('User not found');
  }
});

app.delete('/api/todo/:id', async function (req, res) {
  const id = req.params.id;

  let todo;

  const requestTodo = new Promise((resolve, reject) => {
    db.get('select id, title, isDone from todos where id=?', [id], (err, row) => {
      if (err) reject(err);
      if (!row) reject('Задача не найдена');
      resolve(row);
    });
  });

  try {
    todo = await requestTodo;
  } catch (error) {
    res.status(404).send(error);
  }

  const deletedTodo = new Promise((resolve, reject) => {
    db.run('delete from todos where id=(?)', id, function (err) {
      if (err) reject(err);
      resolve(id);
    });
  });

  try {
    await deletedTodo;

    res.send(todo);
  } catch (error) {
    res.status(404).send(error);
  }
});

app.listen(3000, function () {
  console.log('Сервер ожидает подключения...');
});

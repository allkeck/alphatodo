## Проект общих задач

### Реализован функционал:

- Отображение списка задач с их описанием и статусами;
- Возможность создания, удаления и редактирования задач;
- Авторизация;
- Любой пользователь может посмотреть смотреть список открытых задач;
- Авторизованный пользователь может создавать и смотреть все задачи;
- Редактировать можно только свои задачи;

Авторизация с использованием JWT.

### Установка зависимостей и сборка проекта

```bash
npm install
npm run build
```

### Запуск

```bash
# Перед запуском проекта установить перменную окружения
export JWT_SECRET=<secret string>

node app.js
```

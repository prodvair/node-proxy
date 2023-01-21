# Node-Proxy

Для работы с сайтами находящие на разных доменах. Для авторизации через Cookies и отправок запросов.

## 1. Установка компонентов:
```
npm i
```

## 2. Настройка файла `config.json`:
```
{
  "port": 3001, // Порт запуска сервера
  "base_url": "http://127.0.0.1:8000" // Сайт для запроса
}
```
## 3. Запуск сервера:
```
node index.js
```
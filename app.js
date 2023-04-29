const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// создаем приложение методом express
const app = express();

const { PORT = 3000 } = process.env;

const routerUsers = require('./routes/users');
const routerCard = require('./routes/cards');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

// app.use(express.json());
app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

// Роутинг

app.use((req, res, next) => {
  // Она добавляет в каждый запрос объект user
  req.user = {
    _id: '643e7485e698bd7339e8d503', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});
app.use(routerUsers);
app.use(routerCard);
app.use('*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

// принимаем сообщения с PORT
app.listen(PORT, () => {
  console.log(`App listening port ${PORT}`);
});

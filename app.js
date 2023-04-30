const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// создаем приложение методом express
const app = express();

const { PORT, DB_ADDRESS } = require('./config');

const routerUsers = require('./routes/users');
const routerCard = require('./routes/cards');
const {
  createUser,
  login,
} = require('./controllers/userController');
const auth = require('./middlewares/auth');

mongoose.connect(DB_ADDRESS, {
  useNewUrlParser: true,
});

// Парсинг входящих данных со стороны клиента
// app.use(express.json());
app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса
// Парсинг кук
app.use(cookieParser());

// Роутинг

// app.use((req, res, next) => {
//   // Она добавляет в каждый запрос объект user
//   req.user = {
//     _id: '643e7485e698bd7339e8d503',
//   };

//   next();
// });

// Роутинг без авторизации
app.post('/signin', login);
app.post('/signup', createUser);

// Проверка на авторизацию
app.use(auth);

// Роутинг с авторизацией
app.use(routerUsers);
app.use(routerCard);

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

// принимаем сообщения с PORT
app.listen(PORT, () => {
  console.log(`App listening port ${PORT}`);
});

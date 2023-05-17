require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express(); // создаем приложение методом express
const { celebrate, Joi, errors } = require('celebrate');
const { PORT, DB_ADDRESS } = require('./config');

const routerUsers = require('./routes/users');
const routerCard = require('./routes/cards');
const {
  createUser,
  login,
} = require('./controllers/userController');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/NotFound');
const { REGEX_URL } = require('./constants/regex');
const { requestLogger, errorLogger } = require('./middlewares/logger');

mongoose.connect(DB_ADDRESS, {
  useNewUrlParser: true,
});

app.use(cors({
  // http://localhost:3001/ https://mesto.zlnva.nomoredomains.monster
  origin: '*',
  methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
  allowedHeaders: ['Content-Type'],
  credentials: true,
  preflightContinue: false,
}));

// Парсинг входящих данных со стороны клиента
// app.use(express.json());
app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса
// Парсинг кук
app.use(cookieParser());

app.use(requestLogger); // подключаем логгер запросов до всех обработчиков роутов

// Не забудьте удалить этот код после успешного прохождения ревью.
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// Роутинг без авторизации
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(REGEX_URL),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

// Проверка на авторизацию
app.use(auth);

// Роутинг с авторизацией
app.use(routerUsers);
app.use(routerCard);

app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errorLogger); // подключаем логгер ошибок после обработчиков роутов и до обработчиков ошибок

// обработчик ошибок celebrate
app.use(errors());

// обработчик ошибки
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
});

// принимаем сообщения с PORT
app.listen(PORT, () => {
  console.log(`App listening port ${PORT}`);
});

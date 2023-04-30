const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');
const { JWT_SECRET } = require('../config');

const {
  ERROR_CODE_BAD_REG,
  ERROR_CODE_NOT_FOUND,
  ERROR_CODE_SERV_ERR,
} = require('../constants/errors');

const getUsers = (req, res) => {
  console.log('Пришел запрос на get users');
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(() => {
      res.status(ERROR_CODE_SERV_ERR).send({ message: 'Что-то пошло не так' });
    });
};

const getCurrentUser = (req, res) => {
  console.log(req.user);
  console.log('Пришел запрос на получение текущего юзера');
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      if (!user) {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь не найден' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_BAD_REG).send({ message: 'Переданы некорректные данные' });
        return;
      }
      res.status(ERROR_CODE_SERV_ERR).send({ message: 'Что-то пошло не так' });
    });
};

const getUser = (req, res) => {
  console.log('Пришел запрос на получение юзера по id');
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь не найден' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_BAD_REG).send({ message: 'Переданы некорректные данные' });
        return;
      }
      res.status(ERROR_CODE_SERV_ERR).send({ message: 'Что-то пошло не так' });
    });
};
// регистрация пользователя
const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  // хешируем пароль перед добавлением в БД
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      const { _id } = user;
      res.status(201).send({ data: { _id, email } });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_BAD_REG).send({ message: 'Переданы некорректные данные при создании пользователя' });
        return;
      }
      res.status(ERROR_CODE_SERV_ERR).send({ message: 'Что-то пошло не так' });
    });
};
// обновляет профиль
const updateUser = (req, res) => {
  console.log('Пришел запрос на update user profike');
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
    upsert: false, // если пользователь не найден, он будет создан
  })
    .then((user) => {
      if (!user) {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь не найден' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_BAD_REG).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
        return;
      }
      res.status(ERROR_CODE_SERV_ERR).send({ message: 'Что-то пошло не так' });
    });
};
// обновляет аватар
const updateAvatar = (req, res) => {
  console.log('Пришел запрос на update avatar');
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  })
    .then((user) => {
      if (!user) {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь не найден' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_BAD_REG).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
        return;
      }
      res.status(ERROR_CODE_SERV_ERR).send({ message: 'Что-то пошло не так' });
    });
};

const login = (req, res) => {
  console.log('запрос на авторизацию пришел');
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => { // аутентификация успешна!
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      // вернём токен
      res.send({ token });
      // res.cookie('jwt', token, {
      //   maxAge: 3600000 * 24 * 7,
      //   httpOnly: true, // ограничим доступ из JS
      //   sameSite: true,
      // })
      // .send({ _id: user._id });
    })
    .catch(() => {
      // возвращаем ошибку аутентификации
      res.status(401).send({ message: 'Неправильные почта или пароль' });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getCurrentUser,
};

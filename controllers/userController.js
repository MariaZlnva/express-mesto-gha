const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/userSchema');
const { JWT_SECRET } = require('../config');

const BadRequestError = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFound');
const ConflictReqError = require('../errors/ConflictReq');

const getUsers = (req, res, next) => {
  console.log('Пришел запрос на get users');
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  console.log('Пришел запрос на получение текущего юзера');
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      next(err);
    });
};

const getUser = (req, res, next) => {
  console.log('Пришел запрос на получение юзера по id');
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      next(err);
    });
};
// регистрация пользователя
const createUser = (req, res, next) => {
  console.log('создаем юзера');
  const {
    name, about, avatar, email, password,
  } = req.body;
  // хешируем пароль перед добавлением в БД
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      if (err.code === 11000) {
        next(
          new ConflictReqError(
            'Пользователь с таким электронным адресом уже зарегистрирован',
          ),
        );
      }
      next(err);
    });
};
// обновляет профиль
const updateUser = (req, res, next) => {
  console.log('Пришел запрос на update user profile');
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      upsert: false, // если пользователь не найден, он будет создан
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      next(err);
    });
};
// обновляет аватар
const updateAvatar = (req, res, next) => {
  console.log('Пришел запрос на update avatar');
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            'Переданы некорректные данные при обновлении аватара',
          ),
        );
      }
      next(err);
    });
};

const login = (req, res, next) => {
  console.log('запрос на авторизацию пришел');
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      // email и пароль проверены
      // создадим токен
      const token = jsonwebtoken.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: '7d',
      });
      // вернём токен
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true, // ограничим доступ из JS
        sameSite: true,
      })
        .send({ _id: user._id });
    })
    .catch((err) => next(err));
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

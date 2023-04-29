const bcrypt = require('bcryptjs');
const User = require('../models/userSchema');

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

const getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь не найден' });// не существ. id
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_BAD_REG).send({ message: 'Переданы некорректные данные для постановки лайка' });
        return;
      }
      res.status(ERROR_CODE_SERV_ERR).send({ message: 'Что-то пошло не так' });
    });
};

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
      res.send({ data: user });
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

// const login = (req, res) => {
//   const { email, password } = req.body;
//   User.findOne({ email })
//     .then((user) => {
//       if (!user) {
//         return Promise.reject(new Error('Неправильные почта или пароль'));
//       }
//       // создавать JWT сроком на неделю. В пейлоуд токена следует записывать только свойство _id

//     })
//     .catch((err) => {
//       // возвращаем ошибку аутентификации
//       res
//         .status(401)
//         .send({ message: err.message });
//     });
// };

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
  // login,
};

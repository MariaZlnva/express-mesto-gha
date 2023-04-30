const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// Опишем схему
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто', // присвоим стандартные значения, если поле пустое
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    // index: true,
    unique: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Некорректный адрес почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: 8,
  },
});
// доб.собств.метод в св-во statics
// проверяет почту и пароль на соотв.в БД
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password') // this — это модель User
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) { // хеши не совпали — отклоняем промис
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          return user; // теперь user доступен
        });
    });
};

//  создаём модель(на вход передаем имя модели и схему, которая
// описывает будущие документы) и экспортируем её
module.exports = mongoose.model('user', userSchema);

const mongoose = require('mongoose');
const validator = require('validator');

// Опишем схему
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто', // присвоим стандартные значения, если поле пустое
  },
  about: {
    type: String,
    // required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    // required: true,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true, // У каждого пользователя email должен быть уникальным и валидироваться
    // на соответствие схеме электронной почты.
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Некорректный адрес почты',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
});

//  создаём модель(на вход передаем имя модели и схему, которая
// описывает будущие документы) и экспортируем её
module.exports = mongoose.model('user', userSchema);

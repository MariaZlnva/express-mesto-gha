const mongoose = require('mongoose');

// Опишем схему
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
  },
});

//  создаём модель(на вход передаем имя модели и схему, которая
// описывает будущие документы) и экспортируем её
module.exports = mongoose.model('user', userSchema);
